import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  try {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    if (!process.env.NOTION_TOKEN) return res.status(500).json({ error: "Env NOTION_TOKEN manquant" });
    const databaseId = (req.query.db || process.env.NOTION_DATABASE_ID || "").trim();
    if (!databaseId) return res.status(400).json({ error: "Database ID manquant" });

    const query = await notion.databases.query({
      database_id: databaseId,
      sorts: [{ property: "Date de publication", direction: "ascending" }]
    });

    const items = query.results.map(page => {
      const props = page.properties || {};
      const fileProp = props["Fichier final"] || props["Couverture"] || props["Cover"] || null;
      let coverUrl = "";
      if (fileProp && fileProp.type === "files" && fileProp.files && fileProp.files.length > 0) {
        const f = fileProp.files[0];
        coverUrl = f.type === "external" ? f.external.url : f.file.url;
      }
      return { id: page.id, cover: coverUrl };
    });

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}
