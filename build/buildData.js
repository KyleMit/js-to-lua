const { promises: fs } = require("fs");
const nunjucks = require("nunjucks");
const md = require("markdown-it")();

// save in dev dependencies

main();

async function main() {
  // grab readme text
  let text = await fs.readFile("./index.md", "utf8");

  // split on hrs (---)
  let sectionsRaw = text.split(/^---+/gm);

  let sections = sectionsRaw.map((txt) => {
    // parse header
    // https://regexr.com/5j86u
    let titleMatch = /^##(.*)/m.exec(txt);
    let title = titleMatch ? titleMatch[1].trim() : "";

    // parse text
    // https://regexr.com/5j877
    let contentMatch = /^##.*$([\S\s]*?)(?=^```|$(?![\r\n]))/m.exec(txt);
    let content = contentMatch ? contentMatch[1].trim() : "";

    // parse codeblocks
    // https://regexr.com/5j874
    let codeJsMatch = /^```js([\S\s]*?)```/m.exec(txt);
    let codeLuaMatch = /^```lua([\S\s]*?)```/m.exec(txt);
    let codeLua = codeLuaMatch ? codeLuaMatch[1].trim() : "";
    let codeJs = codeJsMatch ? codeJsMatch[1].trim() : "";

    // some sections won't have code - just return title / slug / content

    return {
      title,
      slug: slugify(title),
      content,
      codeJs,
      codeLua,
    };
  });

  let contentSections = sections.filter((sect) => sect.title);

  let output = JSON.stringify(contentSections, null, 2);
  await fs.writeFile("./build/data.json", output, "utf8");

  // convert markdown content (after data debug)
  sections.forEach((sect) => {
    sect.contentHtml = md.render(sect.content);
  });

  let html = nunjucks.render("./build/index.njk", {
    sections: contentSections,
  });

  // pass to index.njk
  await fs.writeFile("./src/index.html", html, "utf8");
}

function slugify(s) {
  // strip special chars
  let newStr = s
    .replace(/[^a-z\- ]/gi, "")
    .toLowerCase()
    .trim();
  // take first 4 words and separate with "-""
  newStr = newStr.split(" ").slice(0, 4).join("-");
  return newStr;
}
