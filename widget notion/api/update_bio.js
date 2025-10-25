import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST uniquement" });
  try {
    const { bio } = req.body || {};
    if (typeof bio !== "string") return res.status(400).json({ error: "bio manquante" });
    if (bio.length > 150) return res.status(400).json({ error: "Bio > 150 caractères" });

    const bioPageId = (process.env.NOTION_BIO_PAGE_ID || "").trim();
    if (!bioPageId) return res.status(400).json({ error: "NOTION_BIO_PAGE_ID manquant" });
    if (!process.env.NOTION_TOKEN) return res.status(500).json({ error: "Env NOTION_TOKEN manquant" });

    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    await notion.pages.update({
      page_id: bioPageId,
      properties: {
        "Bio": { "rich_text": [{ "type": "text", "text": { "content": bio } }] }
      }
    });
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}
