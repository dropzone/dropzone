---
layout: demos
title: Dropzone.js
---

<section markdown="1">
  <p>
    This page demonstrates a full page dropzone.<br />
    You can drag'n'drop a file anywhere on this page or use this button to select files:
  </p>

  <div id="previews" class="dropzone-previews"></div>

  <button id="clickable">Click me to select files</button>

</section>

<script>
  new Dropzone(document.body, {
    url: "http://www.torrentplease.com/dropzone.php",
    previewsContainer: "#previews",
    clickable: "#clickable"
  });
</script>

