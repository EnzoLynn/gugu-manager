 Ext.define('Ext.ux.form.field.Html5FileUpload', {
     extend: 'Ext.form.field.File',
     alias: 'widget.Html5FileUpload',
     accept: '*/*',
     style: '',
     progressContainerEl:'',
     progressEl: '',
     countEl:'',
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

         var dropzone = me.fileInputEl.dom;
         dropzone.ondragover = dropzone.ondragenter = function(event) {
             event.stopPropagation();
             event.preventDefault();
         }

         dropzone.ondrop = function(event) {
             event.stopPropagation();
             event.preventDefault();

             var filesArray = event.dataTransfer.files;
             for (var i = 0; i < filesArray.length; i++) {
                 sendFile(filesArray[i]);
             }
         }

         me.progressContainerEl = me.triggerWrap.up('#' + me.id).createChild({
             name: me.getName(),
             width: me.getWidth(), 
             id: me.id + '-fileInputProgressContainerEl',
             cls: Ext.baseCSSPrefix + 'form-file-input-progressContainer',
             tag: 'div'
         }); 
         me.progressEl = me.progressContainerEl.createChild({
             name: me.getName(),
             width: me.getWidth(),
             value: 0,
             id: me.id + '-fileInputProgressEl',
             cls: Ext.baseCSSPrefix + 'form-file-input-progress',
             tag: 'progress'
         }); 
         me.countEl = me.progressContainerEl.createChild({
             name: me.getName(),
             width: me.getWidth(), 
             id: me.id + '-fileInputCountEl',
             cls: Ext.baseCSSPrefix + 'form-file-input-count',
             tag: 'label'
         }); 
         me.countEl.dom.innerHTML="0";
     }
 });
