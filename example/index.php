<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8" />
  <style type="text/css">
    .dropzone {
      display: block;
      background: #ffa;
      padding: 30px 30px;
      border: 1px solid #aa8;
      font-size: 2em;
      text-align: left;
    }
    .dropzone .message {
      text-align: center;
    }
    .dropzone.drag-hover {
      border: 1px dashed #aa8;
    }
    .dropzone .preview {
      display: inline-block;
      margin: 19px;
      vertical-align: top;
      position: relative;
      opacity: 0.5;
    }
    .dropzone .preview:hover.file-preview .details span {
      z-index: 1000;
      background: rgba(255,255,170,0.8);
    }
    .dropzone .preview.processing,
    .dropzone .preview.finished {
      opacity: 1;
    }
    .dropzone .preview .details {
      padding: none;
      height: 120px;
      width: 120px;
    /*background: rgba(255, 255, 255, 0.8)*/
      text-align: center;
    /*border: 1px solid #eee*/
    }
    .dropzone .preview.file-preview .details {
      font-size: 18px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .dropzone .preview.file-preview .details span {
      padding-top: 30px;
      display: inline-block;
      position: relative;
    }
    .dropzone .preview.file-preview .details:hover {
      overflow: visible;
    }
    .dropzone .preview.image-preview .details {
      line-height: 120px;
    }
    .dropzone .preview.image-preview .details img {
      vertical-align: middle;
      max-width: 120px;
      max-height: 120px;
    }
    .dropzone .preview.done,
    .dropzone .preview .progress {
      width: 118px;
      height: 7px;
      display: block;
      position: relative;
      margin-top: 3px;
      background: rgba(255,255,255,0.6);
      border-radius: 2px;
      border: 1px solid rgba(120,186,51,0.3);
    }
    .dropzone .preview.done span,
    .dropzone .preview .progress span {
      border-radius: 2px;
      display: block;
      background: #78ba33;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
    /* border-radius: 2px */
      width: 0%;
      -webkit-transition: width 0.3s ease-in-out;
    }
    .dropzone .preview.done span.load,
    .dropzone .preview .progress span.load {
      background-color: #ddd;
      background-image: -webkit-linear-gradient(top, #ccc,#ddd 50%,#eee 50%,#eee);
      background-image: -moz-linear-gradient(top, #ccc,#ddd 50%,#eee 50%,#eee);
      background-image: -ms-linear-gradient(top, #ccc,#ddd 50%,#eee 50%,#eee);
      background-image: -o-linear-gradient(top, #ccc,#ddd 50%,#eee 50%,#eee);
      background-image: linear-gradient(top, #ccc,#ddd 50%,#eee 50%,#eee);
    }
    .dropzone .preview.done span.upload,
    .dropzone .preview .progress span.upload {
      background-color: #78ba33;
      background-image: -webkit-linear-gradient(top, #589a13,#78ba33 50%,#88ca43 50%,#88ca43);
      background-image: -moz-linear-gradient(top, #589a13,#78ba33 50%,#88ca43 50%,#88ca43);
      background-image: -ms-linear-gradient(top, #589a13,#78ba33 50%,#88ca43 50%,#88ca43);
      background-image: -o-linear-gradient(top, #589a13,#78ba33 50%,#88ca43 50%,#88ca43);
      background-image: linear-gradient(top, #589a13,#78ba33 50%,#88ca43 50%,#88ca43);
    }
    .dropzone .preview .finished-success,
    .dropzone .preview .finished-error {
      display: none;
      font-size: 40px;
      line-height: 50px;
      height: 50px;
      width: 50px;
      text-align: center;
      color: #fff;
      border-radius: 25px;
      position: absolute;
      top: 35px;
      left: 50%;
      margin-left: -25px;
    }
    .dropzone .preview .finished-success {
      background: rgba(120,186,51,0.8);
    }
    .dropzone .preview .finished-error {
      background: rgba(252,32,13,0.8);
    }
    .dropzone .preview.finished .finished-success {
      display: block;
    }
    .dropzone .preview.process-error .finished-error {
      display: block;
    }
    .dropzone .preview .error-message {
      display: none;
      font-size: 12px;
      width: 120px;
    }
    .dropzone .preview:hover .error-message {
      display: block;
    }
  </style>

  <script src="./ender.js" type="text/javascript"></script>

  <script type="text/javascript">
    $.domReady(function() {
      var bean = require("bean"),
          dropzone = $('.dropzone').data("dropzone");

      bean.add(dropzone, "finished", function(file, response) { console.log(response); });
    });
  </script>

</head>
<body>


  <h1>New file</h1>
  <div class="content">
    <form action="./test.php" class="dropzone">
      <input type="text" name="hi" />
      <input type="checkbox" name="checky" value="checkval" />
      <select name="sel">
        <option value=""></option>
        <option value="val1">VAL1</option>
      </select>
    </form>
  </div>

</body>