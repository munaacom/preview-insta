import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST uniquement" });
  try {
    const { url } = req.body || {};
    if (!url || typeof url !== "string") return res.status(400).json({ error: "url manquante" });

    const bioPageId = (process.env.NOTION_BIO_PAGE_ID || "").trim();
    if (!bioPageId) return res.status(400).json({ error: "NOTION_BIO_PAGE_ID manquant" });
    if (!process.env.NOTION_TOKEN) return res.status(500).json({ error: "Env NOTION_TOKEN manquant" });

    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    await notion.pages.update({
      page_id: bioPageId,
      properties: {
        "Avatar": { "url": url }
      }
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}
