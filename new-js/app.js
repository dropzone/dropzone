
function init() {

  var allSections = [],
      sections = [],
      navElement = document.querySelector('main > nav'),
      mainElement = document.querySelector('main'),
      headerElement = document.querySelector('body > header'),
      windowHeight = getWindowHeight();

  function getWindowHeight() { return document.body.getBoundingClientRect().height; }

  function Section(element) {
    this.element = element;
    this.navElement = null;
    this.parent = null;
    this.subSections = [];
    this.name = element.innerHTML;
    this.id = element.id;
    this.level = parseInt(element.tagName.substr(1)) - 1;
    this.updatePosition();
  }
  Section.prototype.addSubSection = function(subSection) {
    this.subSections.push(subSection);
    subSection.parent = this;
  }
  Section.prototype.updatePosition = function() {
    var top = 0,
        obj = this.element;

    do {
      top += obj.offsetTop;
    } while (obj = obj.offsetParent);
    this.top = top;
  }
  Section.prototype.getHtml = function() {
    var element = document.createElement('div');
    element.classList.add('level-' + this.level);

    var link = document.createElement('a');
    link.href = '#' + this.id;
    link.innerHTML = this.name;

    element.appendChild(link);

    if (this.subSections.length > 0) {
      var subSectionsElement = document.createElement('div');
      subSectionsElement.classList.add('sub-sections');

      for (var i = 0; i < this.subSections.length; i++) {
        subSectionsElement.appendChild(this.subSections[i].getHtml());
      }

      element.appendChild(subSectionsElement);
    }

    this.navElement = element;
    return element;
  }
  Section.prototype.highlight = function(dontUnset) {
    if (!dontUnset) {
      for (var i = 0; i < allSections.length; i ++) {
        if (allSections[i] !== this) {
          allSections[i].downlight();
        }
      }
    }
    this.navElement.classList.add('visible');
    if (this.parent) this.parent.highlight(true);
  }
  // He he, funny name
  Section.prototype.downlight = function() {
    this.navElement.classList.remove('visible');
  }



  function parseSections() {
    var headlines = document.querySelectorAll('main > section > h1, main > section > h2');
    var lastSection;

    for (var i = 0; i < headlines.length; i++) {
      var headline = headlines[i];
      var section = new Section(headline);
      if (section.level == 0) {
        lastSection = section;
        sections.push(section);
      }
      else {
        lastSection.addSubSection(section);
      }

      allSections.push(section);
    }
  }

  function updateSectionPositions() {
    for (var i = 0; i < sections.length; i++) {
      sections[i].updatePosition();
    }
  }


  parseSections();

  for (var i = 0; i < sections.length; i++) {
    navElement.appendChild(sections[i].getHtml());
  }

  function setHeaderSize() {
    // headerElement.style.height = mainElement.style.marginTop = windowHeight + 'px';
  }
  window.addEventListener('resize', function() {
    windowHeight = getWindowHeight();
    // setHeaderSize();
    handleScroll();
    updateSectionPositions();
  });
  // setHeaderSize();


  var fixed = false;
  window.addEventListener('scroll', handleScroll);

  function handleScroll() {
    updateSectionPositions();
    if (window.pageYOffset > 0) {
      headerElement.classList.add('disappear');
    }
    else {
      headerElement.classList.remove('disappear');
    }
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

    highlightCurrentSection();
  }

  function highlightCurrentSection() {
    var scrollTop = window.pageYOffset,
        scrollMiddle = scrollTop + windowHeight / 2;

    var highlightedSection = allSections[0];

    console.log(scrollMiddle);
    for (var i = 0; i < allSections.length; i++) {
      var section = allSections[i];
      console.log('section', section.top);
      if (section.top < scrollMiddle) {
        highlightedSection = section;
      }
      else {
        break;
      }
    }

    highlightedSection.highlight();
  }


}




document.addEventListener("DOMContentLoaded", init);
