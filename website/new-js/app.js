
function init() {
  FastClick.attach(document.body);

  var allSections = [],
      sections = [],
      navElement = document.querySelector('main > nav'),
      mainElement = document.querySelector('main'),
      headerElement = document.querySelector('body > header'),
      windowHeight = getWindowHeight();


  // Makes sure a function isn't called too often.
  function buffer(callBack) {
    var timeoutId, lastCall = 0, bufferSpan = 200;

    var bufferedFunction = function() {
      // Already buffered
      if (timeoutId) return;

      // Last call has been long ago enough
      if (Date.now() - lastCall > bufferSpan) {
        callBack();
        lastCall = Date.now();
      }
      else {
        timeoutId = setTimeout(function() {
          timeoutId = null;
          callBack();
          lastCall = Date.now();
        }, bufferSpan);        
      }

    }

    return bufferedFunction;
  }


  function getWindowHeight() { return document.body.getBoundingClientRect().height; }

  function Section(element) {
    this.element = element;
    this.isCurrent = false;
    this.navElement = null;
    this.parent = null;
    this.subSections = [];
    this.name = element.innerHTML;
    this.id = element.id;
    this.level = parseInt(element.tagName.substr(1)) - 1;
    this.updatePosition();
  }
  Section.prototype.getSubSectionsHeight = function() {
    var height = 0;
    for (var i = 0; i < this.subSections.length; i++) {
      height += this.subSections[i].navElement.getBoundingClientRect().height;
    }
    return height;
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
      this.subSectionsElement = subSectionsElement;
    }

    this.navElement = element;
    this.linkElement = link;
    return element;
  }
  Section.prototype.highlight = function(notCurrentSection) {
    if (!notCurrentSection) {
      if (this.isCurrent) return;
      this.isCurrent = true;
      for (var i = 0; i < allSections.length; i ++) {
        if (allSections[i] !== this) {
          allSections[i].downlight();
        }
      }
      this.linkElement.classList.add('current');
    }
    this.navElement.classList.add('visible');
    if (this.parent) this.parent.highlight(true);

    if (this.level == 0 && this.subSectionsElement) {
      var height = this.getSubSectionsHeight();
      this.subSectionsElement.style.height = height + 'px';
    }
  }
  // He he, funny name
  Section.prototype.downlight = function() {
    this.isCurrent = false;
    this.navElement.classList.remove('visible');
    this.linkElement.classList.remove('current');

    if (this.level == 0 && this.subSectionsElement) {
      this.subSectionsElement.style.height = '0px';
    }

  }


  function parseSections() {
    var headlines = document.querySelectorAll('main > section > h1, main > section > h2');
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
    for (var i = 0; i < allSections.length; i++) {
      allSections[i].updatePosition();
    }
  }


  parseSections();

  for (var i = 0; i < sections.length; i++) {
    navElement.appendChild(sections[i].getHtml());
  }


  function setHeaderSize() {
    // headerElement.style.height = mainElement.style.marginTop = windowHeight + 'px';
  }
  window.addEventListener('resize', buffer(handleResize));
  
  function handleResize() {
    windowHeight = getWindowHeight();
    handleScroll();
    updateSectionPositions();
  }


  var fixed = false;
  window.addEventListener('scroll', buffer(handleScroll));
  window.addEventListener('scroll', function() {

    if (disableScrollEvents) return true;

    // Parallax header... can't be buffered
    var translate = 'translateY(' + Math.round(window.pageYOffset / 2) + 'px)';
    headerElement.style.WebkitTransform = translate;
    headerElement.style.transform = translate;

    headerElement.style.opacity = Math.max(0, windowHeight - window.pageYOffset) / windowHeight;



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



  var disableScrollEvents = false;

  function handleScroll() {
    if (disableScrollEvents) return true;
    updateSectionPositions();
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





  // Smoothscroll


  // based on http://en.wikipedia.org/wiki/Smoothstep
  var smoothStep = function(start, end, point) {
      if(point <= start) { return 0; }
      if(point >= end) { return 1; }
      var x = (point - start) / (end - start); // interpolation
      return x*x*(3 - 2*x);
  }

  // Mostly taken from: https://coderwall.com/p/hujlhg/smooth-scrolling-without-jquery
  var smoothScrollToStart = function() {

    var target = windowHeight;
    var duration = 600;

    var start_time = Date.now();
    var end_time = start_time + duration;

    var start_top = window.pageYOffset;
    var distance = target - start_top;

    // This is to keep track of where the scrollTop is
    // supposed to be, based on what we're doing
    var previous_top = window.pageYOffset;

    var done = function() {
      // Setting the menu to fixed right away
      fixed = true;
      navElement.classList.add('fixed');

      disableScrollEvents = false;

    }

    // This is like a think function from a game loop
    var scroll_frame = function() {
      // if (window.pageYOffset != previous_top) {
      //   disableScrollEvents = false;
      //   return;
      // }

      // set the scrollTop for this frame
      var now = Date.now();
      var point = smoothStep(start_time, end_time, now);
      var frameTop = Math.round(start_top + (distance * point));
      window.scrollTo(0, frameTop);

      // check if we're done!
      if(now >= end_time) {
        done();
        return;
      }

      // If we were supposed to scroll but didn't, then we
      // probably hit the limit, so consider it done; not
      // interrupted.
      if(window.pageYOffset === previous_top
        && window.pageYOffset !== frameTop) {
        done();
        return;
      }
      previous_top = window.pageYOffset;

      // schedule next frame for execution
      setTimeout(scroll_frame, 0);
    }

    // Making sure it goes smoothly
    disableScrollEvents = true;
    // boostrap the animation process
    setTimeout(scroll_frame, 0);
  }

  document.querySelector('.scroll-invitation a').addEventListener('click', function(e) {
    e.preventDefault();
    smoothScrollToStart();
  });












  // Dropzone


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


  // Now fake the file upload, since GitHub does not handle file uploads
  // and returns a 404

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

}




document.addEventListener("DOMContentLoaded", init);
