/**
 * This file builds the content of the website from the README.md
 */

const fs = require('fs');

const readmePath = 'README.md';
const indexTemplatePath = 'website/_includes/index.template.md';
const indexPath = 'website/index.md';

const readmeData = fs.readFileSync(readmePath, "utf8");
let indexData = fs.readFileSync(indexTemplatePath, "utf8");

const sections = ['Installation', 'Usage', 'Configuration', 'Events', 'Tips', 'Compatibility'];

const codeBlockRegExp = /^```(\w+)$([^]*?)```/gm;

let generatedContent = '';

// Add all relevant sections from the README
for (let section of sections) {
  let sectionRegExp = new RegExp(`(^# ${section}$[^]*?)^# `, 'gm');
  let sectionContent = sectionRegExp.exec(readmeData)[1];
  sectionContent = sectionContent.replace(codeBlockRegExp, '{% highlight $1 %}$2{% endhighlight %}');
  generatedContent += `<section markdown="1">\n${sectionContent}\n</section>\n\n`;
}

generatedContent = generatedContent
    .replace('[List of configuration options](http://www.dropzonejs.com/#configuration-options)', '{% include configuration-options.html %}')
    .replace('[List of events](http://www.dropzonejs.com/#event-list)', '{% include event-list.html %}');


fs.writeFileSync(indexPath, indexData.replace('{{ generated_readme_content }}', generatedContent));

console.log("Successfully built index.md for website.");