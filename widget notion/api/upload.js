import { put } from "@vercel/blob";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST uniquement" });
  try {
    const { filename, contentType, base64 } = req.body || {};
    if (!filename || !contentType || !base64) {
      return res.status(400).json({ error: "payload incomplet" });
    }
    const allowed = ["image/png","image/jpeg"];
    if (!allowed.includes(contentType)) return res.status(400).json({ error: "format non autorisé" });

    const buffer = Buffer.from(base64, "base64");
    if (buffer.length > 2 * 1024 * 1024) return res.status(400).json({ error: "fichier > 2 Mo" });

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) return res.status(500).json({ error: "BLOB_READ_WRITE_TOKEN manquant" });

    const key = `avatars/${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g,'_')}`;
    const { url } = await put(key, buffer, { access: "public", contentType, token });
    return res.status(200).json({ url });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}
