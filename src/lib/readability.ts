import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";
import fs from "fs";

export async function extractContent(url) {
  const pageResponse = await fetch(url, {
    headers: {
      "Accept-Charset": "utf-8",
    },
  });

  if (!pageResponse.ok) {
    const errorText = await pageResponse.text();
    const responseStatus = pageResponse.status;
    throw new Error(`Error ${responseStatus} ${errorText}`);
  }

  const pageHtml = await pageResponse.text();
  fs.writeFileSync("tmp/page.html", pageHtml);

  const dom = new JSDOM(pageHtml, {
    url,
  });

  const reader = new Readability(dom.window.document, {
    debug: true,
  });

  const article = reader.parse();

  const content = article.content;
  fs.writeFileSync("tmp/content.html", content);

  return article;
}
