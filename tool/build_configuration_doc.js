/**
 * This file builds the configuration documentation for the website, from the actual source file
 */

const fs = require('fs');
const marked = require('marked');

const srcFile = 'website/_includes/configuration-options.template.html';
const dstFile = 'website/_includes/configuration-options.html';

let fileData = fs.readFileSync(srcFile, "utf8");
const data = fs.readFileSync('src/dropzone.js', "utf8");
const dataLines = data.split("\n");

// Get the content between `defaultOptions:` and `# END OPTIONS`
const configBlockRegExp = /this\.prototype\.defaultOptions \= \{([^]*?)\/\/ END OPTIONS/g;
const configBlock = configBlockRegExp.exec(data)[1];

const singleConfigRegExp = /\/\*\*\n((^\s*\*.*$\n)+)^\s*\*\/\n^\s*(\w+)\s*(.*)/gm;

const docLineRegExp = /^\s*\*(.*)$/gm;
const functionRegExp = /(\(.*\))\s*(\{.*)$/;
const defaultValueRegExp = /\s*(: )?(.*?),?$/;

let htmlDoc = '';

let configCount = 0;

// Used to add a separator line
let firstDict = true;
let firstFunction = true;

while ((matchResult = singleConfigRegExp.exec(configBlock)) !== null) {
  let rawDoc = '';
  let varName = matchResult[3];
  let defaultValue = null;

  // Get each line of doc
  while ((docMatchResult = docLineRegExp.exec(matchResult[1])) !== null) {
    let docLine = docMatchResult[1];
    // Strip the first space of each docline
    if (docLine.charAt(0) === ' ') docLine = docLine.substr(1);
    rawDoc += docLine + '\n';
  }

  if (varName.indexOf('dict') === 0) {
    if (firstDict) {
      htmlDoc += `<tr>
        <td class="separator" colspan="2">to translate dropzone, you can provide these options:</td>
      </tr>`;
      firstDict = false;
    }
    rawDoc = `\`${defaultValue}\`<br>${rawDoc}`;
    defaultValue = 'see description';
  } else if ((funcMatchResult = functionRegExp.exec(matchResult[4])) !== null) {
    if (firstFunction) {
      htmlDoc += `<tr>
        <td class="separator" colspan="2">functions you can override to change or extend default behavior:</td>
      </tr>`;
      firstFunction = false;
    }
    defaultValue = funcMatchResult[2] === '{},' ? 'empty function' : 'function';
  } else if (varName === 'previewTemplate') {
    defaultValue = 'HTML template';
  }

  if (defaultValue === null) {
    defaultValue = defaultValueRegExp.exec(matchResult[4])[2];
  }
  console.log(defaultValue);

  let doc = marked(rawDoc);

  doc = doc
      .replace(/{{/g, '{% raw %}{{{% endraw %}')
      .replace(/}}/g, '{% raw %}}}{% endraw %}');

  htmlDoc += `
    <tr id="config-${varName}">
      <td class="label">
        <a href="#config-${varName}"><code>${varName}</code></a>
        <a title="See source code"
           target="_blank"
           href="https://gitlab.com/meno/dropzone/blob/master/src/dropzone.coffee#L${getLine(varName)}"
           class="default-value"><code>default: ${defaultValue}</code></a>
      </td>
      <td class="value">
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
    if (new RegExp(`^\\s*${config}(\\:|\\()`).test(dataLines[i])) {
      return i + 1;
    }
  }
  console.log("Warning: line not found");
}