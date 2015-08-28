 Ext.define('Ext.ux.form.field.Html5FileUpload', {
     extend: 'Ext.form.field.File',
     alias: 'widget.Html5FileUpload',
     accept: '*/*',
     supType: ['xls', 'xlsx'],
     style: '',
     uploadUrl: '',
     progressContainerEl: '',
     progressEl: '',
     countEl: '',
     currentFile: 0,
     totalFile: 0,
     fileNameLabelEl: '',
     multipleDataObj: {},
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
     sendFile: function(file, scope) {
         var me = this;
         // var xhr = new XMLHttpRequest();
         // var fd = new FormData();

         // scope.updatePropress(xhr, scope);
         // xhr.open("POST", me.uploadUrl, true);
         // xhr.onreadystatechange = function() {
         //     if (xhr.readyState == 4 && xhr.status == 200) {
         //         // Handle response.
         //         //console.log(xhr.responseText); // handle response.
         //     }
         // };

         // fd.append('fileUpload', file);
         // // Initiate a multipart/form-data upload
         // xhr.send(fd);
         me.FileUpload(file, scope);
     },
     FileUpload: function(file, scope) {

         //var reader = new FileReader();
         var xhr = new XMLHttpRequest();
         var fd = new FormData();

         var xhr = new XMLHttpRequest();


         scope.updatePropress(xhr, scope);

         xhr.open("POST", scope.uploadUrl, true);
         //xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
         // reader.onload = function(evt) {
         //     xhr.send(evt.target.result);
         // };
         // reader.readAsBinaryString(file);
         xhr.onreadystatechange = function() {
             if (xhr.readyState == 4 && xhr.status == 200) {
                 // Handle response. 
                 var data = Ext.JSON.decode(xhr.responseText);

                 scope.multipleDataObj[file.name] = data.data;

                 if (scope.currentFile == scope.totalFile) {
                     scope.currentFile = 0;
                     scope.totalFile = 0;

                     if (scope.multipleDataObj != {}) {
                         ActionManager.showUpLoadExcelError(scope.multipleDataObj);
                     };

                     scope.multipleDataObj = {};

                 };
                 // handle response.
             }
         };

         fd.append('fileUpload', file);
         // Initiate a multipart/form-data upload
         xhr.send(fd);

     },

     sendFiles: function(files) {
         var me = this;
         me.progressEl.dom.value = 0;
         me.countEl.dom.innerHTML = "文件: 1" + '/' + files.length;
         me.totalFile = Ext.clone(files.length);
         var str = "";
         for (var i = 0; i < files.length; i++) {
             str += files[i].name + ";";
         };
         me.fileNameLabelEl.dom.innerHTML = str;
         for (var i = 0; i < files.length; i++) {

             new me.FileUpload(files[i], me);
         }
     },

     updatePropress: function(xhr, scope) {
         this.xhr = xhr;
         this.xhr.upload.addEventListener("progress", function(e) {

             if (e.lengthComputable) {
                 var percentage = Math.round((e.loaded * 100) / e.total);
                 //console.log(percentage);
                 scope.progressEl.dom.value = percentage;
             }
         }, false);

         xhr.upload.addEventListener("load", function(e) {
             //console.log(100 + '--' + scope.currentFile + '--' + scope.totalFile);

             scope.progressEl.dom.value = 100;
             scope.currentFile++;
             scope.countEl.dom.innerHTML = "文件: " + scope.currentFile + '/' + scope.totalFile;

         }, false);
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
             if (Ext.isIE) {
                 Ext.Msg.alert('消息', '您的浏览器不支持Html5上传,请更换浏览器或升级版本。');
                 return;
             }

             var supType = me.supType;

             var returnFlag = true;



             var files = event.dataTransfer.files;

             var str = "";
             for (var i = 0; i < files.length; i++) {
                 str += files[i].name + ";";
                 var fNmae = files[i].name;
                 var fType = fNmae.substring(
                     fNmae.lastIndexOf('.') + 1,
                     fNmae.length).toLowerCase();
                 Ext.Array.each(me.supType, function(rec) {
                     if (rec == fType) {
                         returnFlag = false;
                         return false;
                     }
                 });
             };
             if (returnFlag) {
                 Ext.Msg.alert('添加文件', '不支持的文件格式！');
                 return;
             }

             me.progressEl.dom.value = 0;
             me.countEl.dom.innerHTML = "文件: 1" + '/' + files.length;
             me.totalFile = Ext.clone(files.length);
             me.fileNameLabelEl.dom.innerHTML = str;
             for (var i = 0; i < files.length; i++) {
                 me.sendFile(files[i], me);
             }
         }
         me.fileNameLabelEl = me.triggerWrap.up('#' + me.id).createChild({
             name: me.getName(),
             style: "width:" + me.getWidth() + "px;padding:5px 5px 5px 5px;",
             id: me.id + '-fileInputFileNameLabelEl',
             cls: Ext.baseCSSPrefix + 'form-file-input-fileNameLabel',
             tag: 'div'
         });
         me.progressContainerEl = me.triggerWrap.up('#' + me.id).createChild({
             name: me.getName(),
             style: "width:" + me.getWidth() + "px;padding:5px 5px 5px 5px;",
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
         me.countEl.dom.innerHTML = "文件: 0/0";
     }
 });
