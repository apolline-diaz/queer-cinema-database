import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";
import remarkGfm from "remark-gfm";

export async function getMarkdownContent(filename: string) {
  try {
    const filePath = path.join(process.cwd(), "public", filename);
    const fileContent = fs.readFileSync(filePath, "utf8");

    const processedContent = await remark()
      .use(remarkGfm)
      .use(html)
      .process(fileContent);

    return processedContent.toString();
  } catch (error) {
    console.error(`Error loading ${filename}:`, error);
    return null;
  }
}
