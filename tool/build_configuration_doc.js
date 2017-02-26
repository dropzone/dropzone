/**
 * This file builds the configuration documentation for the website, from the actual source file
 */

const fs = require('fs');
const marked = require('marked');

const srcFile = 'website/_includes/configuration-options.template.html';
const dstFile = 'website/_includes/configuration-options.html';

let fileData = fs.readFileSync(srcFile, "utf8");
const data = fs.readFileSync('src/dropzone.coffee', "utf8");
const dataLines = data.split("\n");

// Get the content between `defaultOptions:` and `# END OPTIONS`
const configBlockRegExp = /defaultOptions:([^]*?)# END OPTIONS/g;
const configBlock = configBlockRegExp.exec(data)[1];

const singleConfigRegExp = /((^\s*#.*$\n)+)^\s*(\w+)\s*:\s*(.*)/gm;

const docLineRegExp = /^\s*#(.*)$/gm;
const functionRegExp = /(\(.*\))?\s*-\>/;

let htmlDoc = '';

let configCount = 0;

while ((matchResult = singleConfigRegExp.exec(configBlock)) !== null) {
  let rawDoc = '';
  // Get each line of doc
  while ((docMatchResult = docLineRegExp.exec(matchResult[1])) !== null) {
    let docLine = docMatchResult[1];
    // Strip the first space of each docline
    if (docLine.charAt(0) === ' ') docLine = docLine.substr(1);
    rawDoc += docLine + '\n';
  }

  let varName = matchResult[3];
  let defaultValue = matchResult[4];

  if (varName.indexOf('dict') === 0) {
    rawDoc = `\`${defaultValue}\`<br>${rawDoc}`;
    defaultValue = 'Translation';
  } else if (functionRegExp.test(defaultValue)) {
    defaultValue = 'Function';
  } else if (defaultValue === '"""') {
    defaultValue = 'HTML template';
  }

  let doc = marked(rawDoc);

  htmlDoc += `
    <tr id="config-${varName}">
      <td>
        <a href="#config-${varName}"><code>${varName}</code></a>
        <a title="See source code"
           target="_blank"
           href="https://gitlab.com/meno/dropzone/blob/master/src/dropzone.coffee#L${getLine(varName)}"
           class="default-value"><code>default: ${defaultValue}</code></a>
      </td>
      <td>
        ${doc}
      </td>
    </tr>`;

  configCount++;
}

fs.writeFileSync(dstFile, fileData.replace('<!-- options -->', htmlDoc));

console.log(`Success! Created config for ${configCount} options and wrote to "${dstFile}"`);


/**
 * Returns the line for given config
 */
function getLine(config) {
  for (let i = 0; i < dataLines.length; i++) {
    if (new RegExp(`^\\s*${config}\\:`).test(dataLines[i])) {
      return i + 1;
    }
  }
  console.log("Warning: line not found");
}