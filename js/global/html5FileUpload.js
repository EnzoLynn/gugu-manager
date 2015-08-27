 Ext.define('Ext.ux.form.field.Html5FileUpload', {
     extend: 'Ext.form.field.File',
     alias: 'widget.Html5FileUpload',
     accept: '*/*',
     style: '',
     uploadUrl: '',
     progressContainerEl: '',
     progressEl: '',
     countEl: '',
     onRender: function() {
         var me = this,
             inputEl;

         me.callParent(arguments);

         inputEl = me.inputEl;
         inputEl.dom.name = ''; //name goes on the fileInput, not the text input
         me.createFileInput();

         if (me.buttonOnly) {
             me.inputCell.setDisplayed(false);
         }

         // Ensure the trigger cell is sized correctly upon render
         me.browseButtonWrap.dom.style.width = (me.browseButtonWrap.dom.lastChild.offsetWidth + me.buttonEl.getMargin('lr')) + 'px';
         if (Ext.isIE) {
             me.buttonEl.repaint();
         }
     },
     sendFile: function(file,scope) {
         var me = this;
         var xhr = new XMLHttpRequest();
         var fd = new FormData();
         this.xhr = xhr;

         var self = this;
         this.xhr.upload.addEventListener("progress", function(e) {

             if (e.lengthComputable) {
                 var percentage = Math.round((e.loaded * 100) / e.total);
                 console.log(percentage);
                 scope.progressEl.dom.value = percentage;
             }
         }, false);

         xhr.upload.addEventListener("load", function(e) {
             console.log(100);
             scope.progressEl.dom.value = 100;

         }, false);
         xhr.open("POST", me.uploadUrl, true);
         xhr.onreadystatechange = function() {
             if (xhr.readyState == 4 && xhr.status == 200) {
                 // Handle response.
                 console.log(xhr.responseText); // handle response.
             }
         };

         fd.append('myFile', file);
         // Initiate a multipart/form-data upload
         xhr.send(fd);
     },
     FileUpload: function(file, scope) {

         var reader = new FileReader();

         var xhr = new XMLHttpRequest();
         this.xhr = xhr;

         var self = this;
         this.xhr.upload.addEventListener("progress", function(e) {

             if (e.lengthComputable) {
                 var percentage = Math.round((e.loaded * 100) / e.total);
                 console.log(percentage);
                 scope.progressEl.dom.value = percentage;
             }
         }, false);

         xhr.upload.addEventListener("load", function(e) {
             console.log(100);
             scope.progressEl.dom.value = 100;

         }, false);
         xhr.open("POST", scope.uploadUrl);
         xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
         reader.onload = function(evt) {
             xhr.send(evt.target.result);
         };
         reader.readAsBinaryString(file);


     },

     sendFiles: function(files) {
         var me = this;
         for (var i = 0; i < files.length; i++) {
             new me.FileUpload(files[i], me);
         }
     },
     createFileInput: function() {
         var me = this;

         me.fileInputEl = me.buttonEl.createChild({
             name: me.getName(),
             id: me.id + '-fileInputEl',
             cls: Ext.baseCSSPrefix + 'form-file-input',
             tag: 'input',
             type: 'file',
             size: 1,
             accept: me.accept,
             multiple: 'multiple',
             style: ''
         });
         me.fileInputEl.on({
             scope: me,
             change: me.onFileChange
         });

         var dropzone = me.el.dom;
         dropzone.ondragover = dropzone.ondragenter = function(event) {
             event.stopPropagation();
             event.preventDefault();
         }

         dropzone.ondrop = function(event) {
             event.stopPropagation();
             event.preventDefault();

             var filesArray = event.dataTransfer.files;
             for (var i = 0; i < filesArray.length; i++) {
                 me.sendFile(filesArray[i],me);
             }
         }

         me.progressContainerEl = me.triggerWrap.up('#' + me.id).createChild({
             name: me.getName(),
             style: "width:" + me.getWidth() + "px;",
             id: me.id + '-fileInputProgressContainerEl',
             cls: Ext.baseCSSPrefix + 'form-file-input-progressContainer',
             tag: 'div'
         });
         me.progressEl = me.progressContainerEl.createChild({
             name: me.getName(),
             style: "width:" + (me.getWidth() - 120) + "px;",
             value: 0,
             max: 100,
             id: me.id + '-fileInputProgressEl',
             cls: Ext.baseCSSPrefix + 'form-file-input-progress',
             tag: 'progress'
         });
         me.countEl = me.progressContainerEl.createChild({
             name: me.getName(),
             style: "width:100px;margin-left:5px;",
             id: me.id + '-fileInputCountEl',
             cls: Ext.baseCSSPrefix + 'form-file-input-count',
             tag: 'label'
         });
         me.countEl.dom.innerHTML = "文件:0/0";
     }
 });
