Ext.define("chl.Action.AttachFileGridAction",{extend:"WS.action.Base",category:"AttachFileGridAction"}),Ext.create("chl.Action.AttachFileGridAction",{itemId:"searchAttachFile",iconCls:"search",tooltip:"查询",text:"查询",handler:function(){var target=this.getTargetView();ActionManager.searchAttachFile(target)},updateStatus:function(selection){}}),Ext.create("chl.Action.AttachFileGridAction",{itemId:"uploadAttachFile",iconCls:"upload",tooltip:"上传文件",text:"上传",handler:function(){var target=this.getTargetView(),win=Ext.create("Ext.window.Window",{height:200,width:800,modal:!0,resizable:!1,iconCls:"upload",title:"上传文件",bodyPadding:5,defaults:{margin:"0 0 20 0"},items:[{xtype:"form",itemId:"h5formId",layout:"vbox",bodyPadding:5,items:[{xtype:"container",style:{border:"1px dotted  green"},items:[{xtype:"Html5FileUpload",name:"fileUpload",labelAlign:"right",fieldLabel:"请选择导入的文件<br/>(可拖拽文件到此处)",width:700,height:100,buttonOnly:!0,labelWidth:150,msgTarget:"side",itemId:"fileupId",buttonConfig:{iconCls:"fileupload",width:300},uploadUrl:GlobalConfig.Controllers.AttachFileGrid.uploadExcel+"?req=call&callname=uploadExcel&sessiontoken="+GlobalFun.getSeesionToken(),accept:".xls*",buttonText:"添加文件",listeners:{change:function(com){var me=com;if(Ext.isIE)return void Ext.Msg.alert("消息","您的浏览器不支持Html5上传,请更换浏览器或升级版本。");var supType=new Array("xls","xlsx"),fNmae=me.getValue(),fType=fNmae.substring(fNmae.lastIndexOf(".")+1,fNmae.length).toLowerCase(),returnFlag=!0;return Ext.Array.each(supType,function(rec){return rec==fType?(returnFlag=!1,!1):void 0}),returnFlag?void Ext.Msg.alert("添加文件","不支持的文件格式！"):(me.sendFiles(me.fileInputEl.dom.files,target,win),void(me.fileInputEl.dom.value=""))}}}]}]}],buttons:[{text:"下载导入模版",iconCls:"downloadTpl",width:120,handler:function(){var param={downType:"importAttachFile",sessiontoken:GlobalFun.getSeesionToken()};WsCall.downloadFile(GlobalConfig.Controllers.AttachFileGrid.downloadTemplate,"download",param)}},{text:"关闭",handler:function(){win.close()}}]});win.show()},updateStatus:function(selection){}}),Ext.create("chl.Action.AttachFileGridAction",{itemId:"validateAttachFile",iconCls:"translate",tooltip:"验证数据",text:"验证",handler:function(com){var target=this.getTargetView(),sm=target.getSelectionModel(),records=sm.getSelection();if(records[0]){var param={sessiontoken:GlobalFun.getSeesionToken(),file_id:records[0].data.file_id};Ext.create("Ext.window.Window",{title:"验证进度",width:400,Height:100,modal:!0,collapsible:!1,closable:!1,resizable:!1,bodyPadding:20,layout:"fit",items:[{xtype:"progressbar",file_id:records[0].data.file_id,text:"初始化..."}]});WsCall.pcall(GlobalConfig.Controllers.AttachFileGrid.validate,"validate",param,function(response,opts){},function(response,opts){},!0)}},updateStatus:function(selection){this.setDisabled(1!=selection.length||0!=selection[0].data.validate_status)}}),Ext.create("chl.Action.AttachFileGridAction",{itemId:"importAttachFile",iconCls:"import",tooltip:"导入数据到票据管理",text:"导入到票据",handler:function(){var target=this.getTargetView(),sm=target.getSelectionModel(),records=sm.getSelection();if(records[0]){var param={sessiontoken:GlobalFun.getSeesionToken(),file_id:records[0].data.file_id};WsCall.pcall(GlobalConfig.Controllers.AttachFileGrid.importAttachFile,"translateExpress",param,function(response,opts){target.loadGrid(!1,!0)},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg),target.loadGrid(!1,!0)},!0)}},updateStatus:function(selection){this.setDisabled(1!=selection.length||1==selection[0].data.import_status||1!=selection[0].data.validate_status)}}),Ext.create("chl.Action.AttachFileGridAction",{itemId:"refreshAttachFile",iconCls:"refresh",tooltip:"刷新",text:"刷新",handler:function(){var target=this.getTargetView();ActionManager.refreshAttachFile(target)},updateStatus:function(selection){}}),Ext.create("chl.Action.AttachFileGridAction",{itemId:"dlErrorReportAttachFile",iconCls:"download",tooltip:"下载错误报告",text:"下载错误报告",handler:function(){var target=this.getTargetView(),sm=(target.getStore(),target.getSelectionModel()),records=sm.getSelection();if(records[0]){var param={downType:"ErrorReport",file_id:records[0].data.file_id,sessiontoken:GlobalFun.getSeesionToken()},url=GlobalConfig.Controllers.AttachFileGrid.dlErrorReportAttachFile;WsCall.downloadFile(url,"dlErrorReportAttachFile",param)}},updateStatus:function(selection){this.setDisabled(1!=selection.length||2!=selection[0].data.validate_status)}}),Ext.create("chl.Action.AttachFileGridAction",{itemId:"removeAttachFile",iconCls:"remove_base",tooltip:"删除",text:"删除",handler:function(){var target=this.getTargetView();ActionManager.delAttachFile(target)},updateStatus:function(selection){this.setDisabled(1!=selection.length)}}),ActionManager.refreshAttachFile=function(traget){traget.loadGrid()},ActionManager.showUpLoadExcelError=function(obj,isCustomer_number){var items=[];for(key in obj){var textItems=[];Ext.Array.each(obj[key],function(item,index){return textItems.push({xtype:"label",text:item.msg}),index>=200?!1:void 0}),items.push({xtype:"fieldset",title:key,layout:"vbox",collapsible:!0,items:textItems})}Ext.create("Ext.window.Window",{title:"数据格式错误",modal:!0,width:700,height:600,bodyPadding:15,layout:{type:"table",columns:2},items:[{xtype:"container",cls:"x-message-box-error ",height:34,width:34},{xtype:"label",text:"数据格式错误，请修改下列数据后重新上传"},{xtype:"container",margin:"15 0 0 0",colspan:2,autoScroll:!0,height:470,width:660,items:items}],buttons:[{text:"确定",handler:function(com){com.up("window").close()}}]}).show()},ActionManager.delAttachFile=function(target,opts){var store=target.getStore(),sm=target.getSelectionModel(),records=sm.getSelection();if(records[0]){var ids=[];Ext.Array.each(records,function(rec){ids.push(rec.data.file_id)});var defConfig={title:"提示",msg:"您确定要删除选定的文件吗？",buttons:Ext.MessageBox.YESNO,closable:!1,fn:function(btn){if("yes"==btn){var param={sessiontoken:GlobalFun.getSeesionToken(),file_ids:ids.join()};WsCall.pcall(GlobalConfig.Controllers.AttachFileGrid.destroy,"AttachFileGrid",param,function(response,opts){new Ext.util.DelayedTask(function(){store.load()}).delay(500)},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!0)}},icon:Ext.MessageBox.QUESTION},mesConfig=Ext.Object.merge(defConfig,opts);GlobalConfig.newMessageBox.show(mesConfig)}},ActionManager.searchAttachFile=function(traget){WindowManager.AttachFileWin&&""!=WindowManager.AttachFileWin?WindowManager.AttachFileWin.show():(WindowManager.AttachFileWin=Ext.create("Ext.window.Window",{modal:!0,resizable:!1,closeAction:"hide",title:"查询",defaultFocus:"file_name",iconCls:"search",record:!1,formVals:"",height:200,width:500,layout:"vbox",items:[{xtype:"form",itemId:"formId",autoScroll:!0,height:290,width:500,border:!1,bodyPadding:15,defaultType:"textfield",layout:{type:"table",columns:1},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100,enableKeyEvents:!0,listeners:{keydown:function(field,e,opts){var me=this;if(e.getKey()==e.ENTER){var win=me.up("window");win.down("#submit").fireHandler(e)}}}},items:[{fieldLabel:"原文件名",itemId:"file_name",maxLength:64},{fieldLabel:"服务器文件名",itemId:"file_save_name",maxLength:64}]}],listeners:{show:function(win){var form=win.down("#formId").getForm();""!=win.formVals&&form.setValues(win.formVals)}},buttons:[{text:"重置",handler:function(){var me=this,w=me.up("window"),f=w.down("#formId");f.getForm().reset()}},{text:"确定",itemId:"submit",handler:function(){var me=this,win=me.up("window"),searchFlag=!1,store=traget.getStore(),form=(store.getProxy().extraParams,win.down("#formId").getForm());if(form.isValid()){win.formVals=form.getValues();var file_name=win.down("#file_name").getValue();""!=file_name?(GlobalFun.GridSearchInitFun("file_name",!1,store,file_name),searchFlag=!0):GlobalFun.GridSearchInitFun("file_name",!0,store,!1);var file_save_name=win.down("#file_save_name").getValue();""!=file_save_name?(GlobalFun.GridSearchInitFun("file_save_name",!1,store,file_save_name),searchFlag=!0):GlobalFun.GridSearchInitFun("file_save_name",!0,store,!1),searchFlag?(win.close(),traget.loadGrid(!0)):(win.close(),traget.loadGrid())}}},{text:"取消",handler:function(){var me=this;me.up("window").close()}}]}),WindowManager.AttachFileWin.show())};
//# sourceMappingURL=AttachFileGridAction.js.map