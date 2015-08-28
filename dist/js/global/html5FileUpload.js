Ext.define("Ext.ux.form.field.Html5FileUpload",{extend:"Ext.form.field.File",alias:"widget.Html5FileUpload",accept:"*/*",supType:["xls","xlsx"],style:"",uploadUrl:"",progressContainerEl:"",progressEl:"",countEl:"",currentFile:0,totalFile:0,fileNameLabelEl:"",multipleDataObj:{},onRender:function(){var inputEl,me=this;me.callParent(arguments),inputEl=me.inputEl,inputEl.dom.name="",me.createFileInput(),me.buttonOnly&&me.inputCell.setDisplayed(!1),me.browseButtonWrap.dom.style.width=me.browseButtonWrap.dom.lastChild.offsetWidth+me.buttonEl.getMargin("lr")+"px",Ext.isIE&&me.buttonEl.repaint()},sendFile:function(file,scope){var me=this;me.FileUpload(file,scope)},FileUpload:function(file,scope){var xhr=new XMLHttpRequest,fd=new FormData,xhr=new XMLHttpRequest;scope.updatePropress(xhr,scope),xhr.open("POST",scope.uploadUrl,!0),xhr.onreadystatechange=function(){if(4==xhr.readyState&&200==xhr.status){var data=Ext.JSON.decode(xhr.responseText);scope.multipleDataObj[file.name]=data.data,scope.currentFile==scope.totalFile&&(scope.currentFile=0,scope.totalFile=0,GlobalFun.isEmptyObject(scope.multipleDataObj)||ActionManager.showUpLoadExcelError(scope.multipleDataObj),scope.multipleDataObj={})}},fd.append("fileUpload",file),xhr.send(fd)},sendFiles:function(files){var me=this;me.progressEl.dom.value=0,me.countEl.dom.innerHTML="文件: 1/"+files.length,me.totalFile=Ext.clone(files.length);for(var str="",i=0;i<files.length;i++)str+=files[i].name+";";me.fileNameLabelEl.dom.innerHTML=str;for(var i=0;i<files.length;i++)new me.FileUpload(files[i],me)},updatePropress:function(xhr,scope){this.xhr=xhr,this.xhr.upload.addEventListener("progress",function(e){if(e.lengthComputable){var percentage=Math.round(100*e.loaded/e.total);scope.progressEl.dom.value=percentage}},!1),xhr.upload.addEventListener("load",function(e){scope.progressEl.dom.value=100,scope.currentFile++,scope.countEl.dom.innerHTML="文件: "+scope.currentFile+"/"+scope.totalFile},!1)},createFileInput:function(){var me=this;me.fileInputEl=me.buttonEl.createChild({name:me.getName(),id:me.id+"-fileInputEl",cls:Ext.baseCSSPrefix+"form-file-input",tag:"input",type:"file",size:1,accept:me.accept,multiple:"multiple",style:""}),me.fileInputEl.on({scope:me,change:me.onFileChange});var dropzone=me.el.dom;dropzone.ondragover=dropzone.ondragenter=function(event){event.stopPropagation(),event.preventDefault()},dropzone.ondrop=function(event){if(event.stopPropagation(),event.preventDefault(),Ext.isIE)return void Ext.Msg.alert("消息","您的浏览器不支持Html5上传,请更换浏览器或升级版本。");for(var returnFlag=(me.supType,!0),files=event.dataTransfer.files,str="",i=0;i<files.length;i++){str+=files[i].name+";";var fNmae=files[i].name,fType=fNmae.substring(fNmae.lastIndexOf(".")+1,fNmae.length).toLowerCase();Ext.Array.each(me.supType,function(rec){return rec==fType?(returnFlag=!1,!1):void 0})}if(returnFlag)return void Ext.Msg.alert("添加文件","不支持的文件格式！");me.progressEl.dom.value=0,me.countEl.dom.innerHTML="文件: 1/"+files.length,me.totalFile=Ext.clone(files.length),me.fileNameLabelEl.dom.innerHTML=str;for(var i=0;i<files.length;i++)me.sendFile(files[i],me)},me.fileNameLabelEl=me.triggerWrap.up("#"+me.id).createChild({name:me.getName(),style:"width:"+me.getWidth()+"px;padding:5px 5px 5px 5px;",id:me.id+"-fileInputFileNameLabelEl",cls:Ext.baseCSSPrefix+"form-file-input-fileNameLabel",tag:"div"}),me.progressContainerEl=me.triggerWrap.up("#"+me.id).createChild({name:me.getName(),style:"width:"+me.getWidth()+"px;padding:5px 5px 5px 5px;",id:me.id+"-fileInputProgressContainerEl",cls:Ext.baseCSSPrefix+"form-file-input-progressContainer",tag:"div"}),me.progressEl=me.progressContainerEl.createChild({name:me.getName(),style:"width:"+(me.getWidth()-120)+"px;",value:0,max:100,id:me.id+"-fileInputProgressEl",cls:Ext.baseCSSPrefix+"form-file-input-progress",tag:"progress"}),me.countEl=me.progressContainerEl.createChild({name:me.getName(),style:"width:100px;margin-left:5px;",id:me.id+"-fileInputCountEl",cls:Ext.baseCSSPrefix+"form-file-input-count",tag:"label"}),me.countEl.dom.innerHTML="文件: 0/0"}});
//# sourceMappingURL=html5FileUpload.js.map