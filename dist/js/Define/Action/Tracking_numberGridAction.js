Ext.define("chl.Action.Tracking_numberGridAction",{extend:"WS.action.Base",category:"Tracking_numberGridAction"}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"searchTracking_number",iconCls:"search",tooltip:"查询",text:"查询",handler:function(){var target=this.getTargetView();ActionManager.searchTracking_number(target)},updateStatus:function(selection){}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"importTracking_number",iconCls:"import",tooltip:"导入",text:"导入",handler:function(){var target=this.getTargetView(),win=Ext.create("Ext.window.Window",{height:360,width:800,modal:!0,resizabled:!1,iconCls:"import",title:"上传文件",bodyPadding:15,defaults:{margin:"0 0 20 0"},items:[{xtype:"form",itemId:"formId",bodyPadding:15,items:[{xtype:"filefield",name:"importAddr",fieldLabel:"请选择导入的文件",width:600,labelWidth:150,blankText:"请选择导入的文件",msgTarget:"side",itemId:"fileupId",buttonConfig:{iconCls:"import",width:100},buttonText:"...",listeners:{change:function(com){var me=com,supType=new Array("xls","xlsx"),fNmae=me.getValue(),fType=fNmae.substring(fNmae.lastIndexOf(".")+1,fNmae.length).toLowerCase(),returnFlag=!0;if(Ext.Array.each(supType,function(rec){return rec==fType?(returnFlag=!1,!1):void 0}),returnFlag)return void Ext.Msg.alert("添加文件","不支持的文件格式！");var f=me.up("form"),form=(me.up("window"),f.getForm()),urlStr=GlobalConfig.Controllers.Tracking_numberGrid.uploadExcel+"?req=call&callname=importcustomerUp&sessiontoken="+GlobalFun.getSeesionToken();form.submit({timeout:600,url:urlStr,waitMsg:"正在上传...",waitTitle:"等待文件上传,请稍候...",success:function(fp,o){action.result.data;action.result.success&&target.loadGrid()},failure:function(fp,o){GlobalFun.errorProcess(o.result.code)||Ext.Msg.alert("登录失败",response.msg)}})}}}]},{xtype:"form",itemId:"h5formId",layout:"vbox",bodyPadding:15,items:[{xtype:"label",text:"如果您使用的是高级的支持Html5的浏览器，请使用的这里的上传"},{xtype:"label",text:"多文件批量，更快捷，可拖拽文件，可视化的真实上传进度显示"},{xtype:"Html5FileUpload",name:"importAddr",fieldLabel:"请选择导入的文件",width:600,labelWidth:150,msgTarget:"side",itemId:"fileupId",buttonConfig:{iconCls:"import",width:100},accept:"*.*",buttonText:"...",listeners:{change:function(com){return void console.log("upload")}}}]}],buttons:[{text:"关闭",handler:function(){win.close()}}]});win.show()},updateStatus:function(selection){}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"exportTracking_number",iconCls:"export",tooltip:"导出",text:"导出",handler:function(){var target=this.getTargetView(),store=target.getStore(),extraParams=store.getProxy().extraParams,param={downType:"Tracking_number",dir:"ASC",sort:"tracking_number",filter:extraParams.filter,sessiontoken:GlobalFun.getSeesionToken()};WsCall.downloadFile(GlobalConfig.Controllers.Tracking_numberGrid.outPutExcel,"download",param)},updateStatus:function(selection){}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"refreshTracking_number",iconCls:"refresh",tooltip:"刷新",text:"刷新",handler:function(){var target=this.getTargetView();ActionManager.refreshTracking_number(target)},updateStatus:function(selection){}}),ActionManager.refreshTracking_number=function(traget){traget.loadGrid()},ActionManager.searchTracking_number=function(traget){WindowManager.Tracking_numberWin&&""!=WindowManager.Tracking_numberWin?WindowManager.Tracking_numberWin.show():WindowManager.Tracking_numberWin=Ext.create("Ext.window.Window",{modal:!0,resizable:!1,closeAction:"hide",title:"查询",defaultFocus:"tracking_number",iconCls:"search",record:!1,height:300,width:500,layout:"vbox",items:[{xtype:"form",itemId:"formId",autoScroll:!0,height:290,width:500,border:!1,bodyPadding:15,defaultType:"textfield",layout:{type:"table",columns:1},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100},items:[{fieldLabel:"票据号",itemId:"tracking_number",maxLength:64},{fieldLabel:"网点",itemId:"arrive_express_point",maxLength:64},{fieldLabel:"网点代码",itemId:"arrive_express_point_code",maxLength:16},{xtype:"fieldcontainer",colspan:2,width:490,fieldLabel:"收货时间",defaultType:"datetimefield",layout:{type:"hbox"},defaults:{labelAlign:"right",width:100},items:[{xtype:"datefield",format:"Y-m-d",itemId:"dateStar",vtype:"daterange",endDateField:"dateEnd",editable:!1},{xtype:"label",margin:"0 0 0 5",width:20,text:"至"},{xtype:"datefield",format:"Y-m-d",itemId:"dateEnd",vtype:"daterange",startDateField:"dateStar",editable:!1}]}]}],buttons:[{text:"重置",handler:function(){var me=this,w=me.up("window"),f=w.down("#formId");f.getForm().reset()}},{text:"确定",itemId:"submit",handler:function(){var me=this,win=me.up("window"),searchFlag=!1,store=traget.getStore(),extraParams=store.getProxy().extraParams,dateStarField=win.down("#dateStar"),dateEndField=win.down("#dateEnd"),dateStar=dateStarField.getValue(),dateEnd=dateEndField.getValue();GlobalFun.ValidDateStartEnd(dateStarField,dateEndField);var form=win.down("#formId").getForm();if(form.isValid()){var tracking_number=win.down("#tracking_number").getValue();""!=tracking_number?(GlobalFun.GridSearchInitFun("tracking_number",!1,store,tracking_number),searchFlag=!0):GlobalFun.GridSearchInitFun("customer_name",!0,store,!1);var arrive_express_point=win.down("#arrive_express_point").getValue();""!=arrive_express_point?(GlobalFun.GridSearchInitFun("arrive_express_point",!1,store,arrive_express_point),searchFlag=!0):GlobalFun.GridSearchInitFun("arrive_express_point",!0,store,!1),dateStar&&dateEnd?(extraParams.DateFilter=!0,extraParams.arrive_time=Ext.Date.format(dateStar,"Y-m-d")+","+Ext.Date.format(dateEnd,"Y-m-d"),searchFlag=!0):(extraParams.DateFilter=!1,extraParams.arrive_time=""),searchFlag?(win.close(),traget.loadGrid(!0)):(win.close(),traget.loadGrid())}}},{text:"取消",handler:function(){var me=this;me.up("window").close()}}]}).show()};
//# sourceMappingURL=Tracking_numberGridAction.js.map