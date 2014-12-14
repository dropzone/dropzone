
function init() {

  var sections = [],
      navElement = document.querySelector('main > nav'),
      headerElement = document.querySelector('body > header'),
      windowHeight = getWindowHeight();

  function getWindowHeight() { return document.body.getBoundingClientRect().height; }

  function Section(element) {
    this.element = element;
    this.name = element.innerHTML;
    this.id = element.id;
    this.level = parseInt(element.tagName.substr(1)) - 1;
    this.updatePosition();
  }
  Section.prototype.updatePosition = function() {
    this.top = this.element.offsetTop;
  }

  function parseSections() {
    var headlines = document.querySelectorAll('main > section > h1, main > section > h2');

    for (var i = 0; i < headlines.length; i++) {
      var headline = headlines[i];
      sections.push(new Section(headline));
    }
  }

  function getSectionHtml(section) {
    var element = document.createElement('a');
    element.href = '#' + section.id;
    element.innerHTML = section.name;
    element.classList.add('level-' + section.level);
    return element;
  }

  function updateSectionPositions() {
    for (var i = 0; i < sections.length; i++) {
      sections[i].updatePosition();
    }
  }


  parseSections();

  for (var i = 0; i < sections.length; i++) {
    navElement.appendChild(getSectionHtml(sections[i]));
  }

  function setHeaderSize() {
    headerElement.style.height = windowHeight + 'px';
  }
  window.addEventListener('resize', function() {
    windowHeight = getWindowHeight();
    setHeaderSize();
  });
  setHeaderSize();


  var fixed = false;
  window.addEventListener('scroll', function(evt) {
    if (window.pageYOffset >= windowHeight) {
      if (!fixed) {
        fixed = true;
        navElement.classList.add('fixed');
      }
    }
    else {
      if (fixed) {
        fixed = false;
        navElement.classList.remove('fixed');
      }
    }
  });


}




document.addEventListener("DOMContentLoaded", init);
