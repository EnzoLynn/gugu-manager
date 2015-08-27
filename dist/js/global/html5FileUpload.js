Ext.define("Ext.ux.form.field.Html5FileUpload",{extend:"Ext.form.field.File",alias:"widget.Html5FileUpload",accept:"*/*",style:"",uploadUrl:"",progressContainerEl:"",progressEl:"",countEl:"",onRender:function(){var inputEl,me=this;me.callParent(arguments),inputEl=me.inputEl,inputEl.dom.name="",me.createFileInput(),me.buttonOnly&&me.inputCell.setDisplayed(!1),me.browseButtonWrap.dom.style.width=me.browseButtonWrap.dom.lastChild.offsetWidth+me.buttonEl.getMargin("lr")+"px",Ext.isIE&&me.buttonEl.repaint()},sendFile:function(file,scope){var me=this,xhr=new XMLHttpRequest,fd=new FormData;this.xhr=xhr;this.xhr.upload.addEventListener("progress",function(e){if(e.lengthComputable){var percentage=Math.round(100*e.loaded/e.total);console.log(percentage),scope.progressEl.dom.value=percentage}},!1),xhr.upload.addEventListener("load",function(e){console.log(100),scope.progressEl.dom.value=100},!1),xhr.open("POST",me.uploadUrl,!0),xhr.onreadystatechange=function(){4==xhr.readyState&&200==xhr.status&&console.log(xhr.responseText)},fd.append("myFile",file),xhr.send(fd)},FileUpload:function(file,scope){var reader=new FileReader,xhr=new XMLHttpRequest;this.xhr=xhr;this.xhr.upload.addEventListener("progress",function(e){if(e.lengthComputable){var percentage=Math.round(100*e.loaded/e.total);console.log(percentage),scope.progressEl.dom.value=percentage}},!1),xhr.upload.addEventListener("load",function(e){console.log(100),scope.progressEl.dom.value=100},!1),xhr.open("POST",scope.uploadUrl),xhr.overrideMimeType("text/plain; charset=x-user-defined-binary"),reader.onload=function(evt){xhr.send(evt.target.result)},reader.readAsBinaryString(file)},sendFiles:function(files){for(var me=this,i=0;i<files.length;i++)new me.FileUpload(files[i],me)},createFileInput:function(){var me=this;me.fileInputEl=me.buttonEl.createChild({name:me.getName(),id:me.id+"-fileInputEl",cls:Ext.baseCSSPrefix+"form-file-input",tag:"input",type:"file",size:1,accept:me.accept,multiple:"multiple",style:""}),me.fileInputEl.on({scope:me,change:me.onFileChange});var dropzone=me.el.dom;dropzone.ondragover=dropzone.ondragenter=function(event){event.stopPropagation(),event.preventDefault()},dropzone.ondrop=function(event){event.stopPropagation(),event.preventDefault();for(var filesArray=event.dataTransfer.files,i=0;i<filesArray.length;i++)me.sendFile(filesArray[i],me)},me.progressContainerEl=me.triggerWrap.up("#"+me.id).createChild({name:me.getName(),style:"width:"+me.getWidth()+"px;",id:me.id+"-fileInputProgressContainerEl",cls:Ext.baseCSSPrefix+"form-file-input-progressContainer",tag:"div"}),me.progressEl=me.progressContainerEl.createChild({name:me.getName(),style:"width:"+(me.getWidth()-120)+"px;",value:0,max:100,id:me.id+"-fileInputProgressEl",cls:Ext.baseCSSPrefix+"form-file-input-progress",tag:"progress"}),me.countEl=me.progressContainerEl.createChild({name:me.getName(),style:"width:100px;margin-left:5px;",id:me.id+"-fileInputCountEl",cls:Ext.baseCSSPrefix+"form-file-input-count",tag:"label"}),me.countEl.dom.innerHTML="文件:0/0"}});
//# sourceMappingURL=html5FileUpload.js.map