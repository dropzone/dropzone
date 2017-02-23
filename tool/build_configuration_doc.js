/**
 * This file builds the configuration documentation for the website, from the actual source file
 */

const fs = require('fs');
const marked = require('marked');

const srcFile = 'website/_includes/configuration-options.template.html';
const dstFile = 'website/_includes/configuration-options.html';

let fileData = fs.readFileSync(srcFile, "utf8");
const data = fs.readFileSync('src/dropzone.coffee', "utf8");

// Get the content between `defaultOptions:` and `# END OPTIONS`
const configBlockRegExp = /defaultOptions:([^]*?)# END OPTIONS/g;
const configBlock = configBlockRegExp.exec(data)[1];

const singleConfigRegExp = /((^\s*# .*$\n)+)^\s*(\w+)\s*:\s*(.*)/gm;

const docRegExp = /^\s*# (.*)/gm;

let htmlDoc = '';

while ((matchResult = singleConfigRegExp.exec(configBlock)) !== null) {
  let doc = marked(matchResult[1].replace(docRegExp, '$1'));
  let varName = matchResult[3];
  let defaultValue = matchResult[4];

  htmlDoc += `
    <tr id="config-${varName}">
      <td><a href="#config-${varName}"><code>${varName}</code></a> <span class="default-value"><code>default: ${defaultValue}</code></span></td>
      <td>
        ${doc}
      </td>
    </tr>`;

}

fs.writeFileSync(dstFile, fileData.replace('<!-- options -->', htmlDoc));

console.log(`Wrote config to ${dstFile}`);
