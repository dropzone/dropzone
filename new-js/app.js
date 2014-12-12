
function init() {

  var sections = [],
      navElement = document.querySelector('body > nav');

  function Section(name, id, level) {
    this.name = name;
    this.id = id;
    this.level = level;
  }

  function parseSections() {
    var headlines = document.querySelectorAll('main > section > h1, main > section > h2');

    for (var i = 0; i < headlines.length; i++) {
      var headline = headlines[i];
      sections.push(new Section(headline.innerHTML, headline.id, parseInt(headline.tagName.substr(1)) - 1));
    }
  }

  function getSectionHtml(section) {
    var element = document.createElement('a');
    element.href = '#' + section.id;
    element.innerHTML = section.name;
    element.classList.add('level-' + section.level);
    return element;
  }


  parseSections();

  for (var i = 0; i < sections.length; i++) {
    navElement.appendChild(getSectionHtml(sections[i]));
  }


}




document.addEventListener("DOMContentLoaded", init);
