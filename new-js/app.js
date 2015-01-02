
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
    this.level = element.tagName == 'DIV' ? '1' : parseInt(element.tagName.substr(1)) - 1;
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
    this.linkElement = link;
    return element;
  }
  Section.prototype.highlight = function(notCurrentSection) {
    if (!notCurrentSection) {
      for (var i = 0; i < allSections.length; i ++) {
        if (allSections[i] !== this) {
          allSections[i].downlight();
        }
      }
      this.linkElement.classList.add('current');
    }
    this.navElement.classList.add('visible');
    if (this.parent) this.parent.highlight(true);
  }
  // He he, funny name
  Section.prototype.downlight = function() {
    this.navElement.classList.remove('visible');
    this.linkElement.classList.remove('current');
  }



  function parseSections() {
    var headlines = document.querySelectorAll('main > section > h1, main > section > h2, .title > .header');
    var lastSection;

    for (var i = 0; i < headlines.length; i++) {
      var headline = headlines[i];
      var section = new Section(headline);
      if (section.id == 'try-it-out' || section.id == 'news') continue;
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
        scrollBottom = scrollTop + windowHeight,
        scrollMiddle = scrollTop + windowHeight / 3;

    var highlightedSection = allSections[0];

    if (highlightedSection.top > scrollMiddle) {
      // The page is scrolled to the top, so the first section is not visible
      for (var i = 0; i < allSections.length; i++) {
        allSections[i].downlight();
      }
      
    }
    else {
      for (var i = 0; i < allSections.length; i++) {
        var section = allSections[i];
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



  var dropzone = new Dropzone('#demo-upload', {
    previewTemplate: document.querySelector('#preview-template').innerHTML,
    parallelUploads: 2,
    thumbnailHeight: 120,
    thumbnailWidth: 120,
    maxFilesize: 3,
    filesizeBase: 1000,
    thumbnail: function(file, dataUrl) {
      if (file.previewElement) {
        file.previewElement.classList.remove("dz-file-preview");
        var images = file.previewElement.querySelectorAll("[data-dz-thumbnail]");
        for (var i = 0; i < images.length; i++) {
          var thumbnailElement = images[i];
          thumbnailElement.alt = file.name;
          thumbnailElement.src = dataUrl;
        }
        setTimeout(function() { file.previewElement.classList.add("dz-image-preview"); }, 1);
      }
    }

  });
  var minSteps = 6,
      maxSteps = 60,
      timeBetweenSteps = 100,
      bytesPerStep = 100000;

  dropzone.uploadFiles = function(files) {
    var self = this;

    for (var i = 0; i < files.length; i++) {

      var file = files[i];
          totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

      for (var step = 0; step < totalSteps; step++) {
        var duration = timeBetweenSteps * (step + 1);
        setTimeout(function(file, totalSteps, step) {
          return function() {
            file.upload = {
              progress: 100 * (step + 1) / totalSteps,
              total: file.size,
              bytesSent: (step + 1) * file.size / totalSteps
            };

            self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
            if (file.upload.progress == 100) {
              file.status = Dropzone.SUCCESS;
              self.emit("success", file, 'success', null);
              self.emit("complete", file);
              self.processQueue();
            }
          };
        }(file, totalSteps, step), duration);
      }
    }
  }


  Dropzone.prototype.filesize = function(size) {
    var units = [ 'TB', 'GB', 'MB', 'KB', 'b' ],
        selectedSize, selectedUnit;

    for (var i = 0; i < units.length; i++) {
      var unit = units[i],
          cutoff = Math.pow(this.options.filesizeBase, 4 - i) / 10;

      if (size >= cutoff) {
        selectedSize = size / Math.pow(this.options.filesizeBase, 4 - i);
        selectedUnit = unit;
        break;
      }
    }

    selectedSize = Math.round(10 * selectedSize) / 10;

    return '<strong>' + selectedSize + '</strong> ' + selectedUnit;

  }
  // filesize: (size) ->
  //   if      size >= 1024 * 1024 * 1024 * 1024 / 10
  //     size = size / (1024 * 1024 * 1024 * 1024 / 10)
  //     string = "TiB"
  //   else if size >= 1024 * 1024 * 1024 / 10
  //     size = size / (1024 * 1024 * 1024 / 10)
  //     string = "GiB"
  //   else if size >= 1024 * 1024 / 10
  //     size = size / (1024 * 1024 / 10)
  //     string = "MiB"
  //   else if size >= 1024 / 10
  //     size = size / (1024 / 10)
  //     string = "KiB"
  //   else
  //     size = size * 10
  //     string = "b"
  //   "<strong>#{Math.round(size)/10}</strong> #{string}"

  dropzone.on('complete', function(file) {
    file.previewElement.classList.add('dz-complete');
  });

}




document.addEventListener("DOMContentLoaded", init);
