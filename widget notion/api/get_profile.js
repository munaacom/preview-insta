import { Client } from "@notionhq/client";

export default async function handler(req, res) {
  try {
    const name = process.env.PROFILE_NAME || "Mon profil Instagram";
    const initials = name.split(" ").map(s => s[0]).filter(Boolean).slice(0,2).join("").toUpperCase();
    const followers = Number(process.env.PROFILE_FOLLOWERS || 0);
    const following = Number(process.env.PROFILE_FOLLOWING || 0);
    let bio = "";
    let avatarUrl = "";

    const bioPageId = (process.env.NOTION_BIO_PAGE_ID || "").trim();
    if (bioPageId && process.env.NOTION_TOKEN) {
      try {
        const notion = new Client({ auth: process.env.NOTION_TOKEN });
        const page = await notion.pages.retrieve({ page_id: bioPageId });
        const propBio = page.properties?.["Bio"];
        if (propBio && propBio.type === "rich_text") {
          bio = (propBio.rich_text || []).map(r => r.plain_text).join("");
        }
        const propAvatar = page.properties?.["Avatar"];
        if (propAvatar && propAvatar.type === "url") {
          avatarUrl = propAvatar.url || "";
        }
      } catch {}
    }

    return res.status(200).json({ name, initials, followers, following, bio, avatarUrl });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: String(err.message || err) });
  }
}
