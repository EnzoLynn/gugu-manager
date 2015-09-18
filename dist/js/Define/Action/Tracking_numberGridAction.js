Ext.define("chl.Action.Tracking_numberGridAction",{extend:"WS.action.Base",category:"Tracking_numberGridAction"}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"searchTracking_number",iconCls:"search",tooltip:"查询",text:"查询",handler:function(){var target=this.getTargetView();ActionManager.searchTracking_number(target)},updateStatus:function(selection){}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"importTracking_number",iconCls:"import",tooltip:"导入",text:"导入",handler:function(){var target=this.getTargetView(),win=Ext.create("Ext.window.Window",{height:360,width:800,modal:!0,resizable:!1,iconCls:"import",title:"上传文件",bodyPadding:15,defaults:{margin:"0 0 20 0"},items:[{xtype:"form",itemId:"formId",bodyPadding:15,items:[{xtype:"filefield",name:"fileUpload",fieldLabel:"请选择导入的文件",width:600,labelWidth:150,labelAlign:"right",blankText:"请选择导入的文件",msgTarget:"side",itemId:"fileupId",buttonConfig:{iconCls:"import",width:100},buttonText:"添加文件",listeners:{change:function(com){var me=com,supType=new Array("xls","xlsx"),fNmae=me.getValue(),fType=fNmae.substring(fNmae.lastIndexOf(".")+1,fNmae.length).toLowerCase(),returnFlag=!0;if(Ext.Array.each(supType,function(rec){return rec==fType?(returnFlag=!1,!1):void 0}),returnFlag)return void Ext.Msg.alert("添加文件","不支持的文件格式！");var f=me.up("form"),outWin=me.up("window"),form=f.getForm(),urlStr=GlobalConfig.Controllers.Tracking_numberGrid.uploadExcel+"?req=call&callname=uploadExcel&sessiontoken="+GlobalFun.getSeesionToken();form.submit({timeout:600,url:urlStr,waitMsg:"正在上传...",waitTitle:"等待文件上传,请稍候...",success:function(fp,action){action.result.data;target.loadGrid(),outWin.close()},failure:function(fp,action){if(!GlobalFun.errorProcess(action.result.code)){var obj={};obj[fNmae]=action.result.data,ActionManager.showUpLoadExcelError(obj)}}})}}}]},{xtype:"form",itemId:"h5formId",layout:"vbox",bodyPadding:15,items:[{xtype:"label",style:{"font-weight":"bold"},text:"如果您使用的是高级的支持Html5的浏览器，请使用的这里的上传"},{xtype:"label",style:{color:"red","font-weight":"bold"},text:"多文件批量，更快捷，可拖拽文件，可视化的真实上传进度显示,更大的文件"},{xtype:"container",style:{border:"1px dotted  green"},items:[{xtype:"Html5FileUpload",name:"fileUpload",labelAlign:"right",fieldLabel:"请选择导入的文件<br/>(可拖拽文件到此处)",width:600,height:100,buttonOnly:!0,labelWidth:150,msgTarget:"side",itemId:"fileupId",buttonConfig:{iconCls:"import",width:300},uploadUrl:GlobalConfig.Controllers.Tracking_numberGrid.uploadExcel+"?req=call&callname=uploadExcel&sessiontoken="+GlobalFun.getSeesionToken(),accept:".xls*",buttonText:"添加文件",listeners:{change:function(com){var me=com;if(Ext.isIE)return void Ext.Msg.alert("消息","您的浏览器不支持Html5上传,请更换浏览器或升级版本。");var supType=new Array("xls","xlsx"),fNmae=me.getValue(),fType=fNmae.substring(fNmae.lastIndexOf(".")+1,fNmae.length).toLowerCase(),returnFlag=!0;return Ext.Array.each(supType,function(rec){return rec==fType?(returnFlag=!1,!1):void 0}),returnFlag?void Ext.Msg.alert("添加文件","不支持的文件格式！"):void me.sendFiles(me.fileInputEl.dom.files)}}}]}]}],buttons:[{text:"下载导入模版",iconCls:"downloadTpl",width:120,handler:function(){var param={downType:"importTracking_number",sessiontoken:GlobalFun.getSeesionToken()};WsCall.downloadFile(GlobalConfig.Controllers.Tracking_numberGrid.downloadTemplate,"download",param)}},{text:"关闭",handler:function(){win.close()}}]});win.show()},updateStatus:function(selection){}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"exportTracking_number",iconCls:"export",tooltip:"导出",text:"导出",handler:function(){var target=this.getTargetView(),store=target.getStore(),extraParams=store.getProxy().extraParams,param={downType:"Tracking_number",arrive_time_start:extraParams.arrive_time_start,arrive_time_end:extraParams.arrive_time_end,dir:"ASC",sort:"tracking_number",filter:extraParams.filter,sessiontoken:GlobalFun.getSeesionToken()};WsCall.downloadFile(GlobalConfig.Controllers.Tracking_numberGrid.outPutExcel,"download",param)},updateStatus:function(selection){}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"removeTracking_number",iconCls:"remove_base",tooltip:"删除",text:"删除",handler:function(){var target=this.getTargetView();ActionManager.delTracking_number(target)},updateStatus:function(selection){this.setDisabled(selection.length<1)}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"refreshTracking_number",iconCls:"refresh",tooltip:"刷新",text:"刷新",handler:function(){var target=this.getTargetView();ActionManager.refreshTracking_number(target)},updateStatus:function(selection){}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"translateExpressTracking_number",iconCls:"translate",tooltip:"计算收入",text:"计算收入",handler:function(){var target=this.getTargetView(),param={sessiontoken:GlobalFun.getSeesionToken(),type:"income"};WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.translateExpress,"translateExpress",param,function(response,opts){target.loadGrid()},function(response,opts){GlobalFun.errorProcess(response.code)||ActionManager.translateError(response),target.loadGrid()},!0)},updateStatus:function(selection){}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"translateCostTracking_number",iconCls:"translate",tooltip:"计算成本",text:"计算成本",handler:function(){var target=this.getTargetView(),param={sessiontoken:GlobalFun.getSeesionToken(),type:"cost"};WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.translateExpress,"translateExpress",param,function(response,opts){target.loadGrid()},function(response,opts){GlobalFun.errorProcess(response.code)||ActionManager.translateError(response),target.loadGrid()},!0)},updateStatus:function(selection){}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"retranslateExpressTracking_number",iconCls:"retranslate",tooltip:"重新计算收入",text:"重新计算收入",handler:function(){var target=this.getTargetView(),sm=target.getSelectionModel(),records=sm.getSelection();if(records[0]){var ids=[];Ext.Array.each(records,function(rec){ids.push(rec.data.tracking_number_id)});var param={sessiontoken:GlobalFun.getSeesionToken(),type:"income",tracking_number_ids:ids.join()};WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.retranslateExpress,"translateExpress",param,function(response,opts){target.loadGrid(!1,!0)},function(response,opts){GlobalFun.errorProcess(response.code)||ActionManager.translateError(response),target.loadGrid(!1,!0)},!0)}},updateStatus:function(selection){this.setDisabled(selection.length<1)}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"retranslateCostTracking_number",iconCls:"retranslate",tooltip:"重新计算成本",text:"重新计算成本",handler:function(){var target=this.getTargetView(),sm=target.getSelectionModel(),records=sm.getSelection();if(records[0]){var ids=[];Ext.Array.each(records,function(rec){ids.push(rec.data.tracking_number_id)});var param={sessiontoken:GlobalFun.getSeesionToken(),type:"cost",tracking_number_ids:ids.join()};WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.retranslateExpress,"translateExpress",param,function(response,opts){target.loadGrid(!1,!0)},function(response,opts){GlobalFun.errorProcess(response.code)||ActionManager.translateError(response),target.loadGrid(!1,!0)},!0)}},updateStatus:function(selection){this.setDisabled(selection.length<1)}}),Ext.create("chl.Action.Tracking_numberGridAction",{itemId:"account_statusTracking_number",iconCls:"status-suc",tooltip:"设置结算状态",text:"设置结算状态",handler:function(){var target=this.getTargetView();ActionManager.account_statusTracking_number(target)},updateStatus:function(selection){}}),ActionManager.refreshTracking_number=function(traget){traget.loadGrid()},ActionManager.showUpLoadExcelError=function(obj){var items=[];for(key in obj){var textItems=[];Ext.Array.each(obj[key],function(item,index){textItems.push({xtype:"label",text:item.msg})}),items.push({xtype:"fieldset",title:key,layout:"vbox",collapsible:!0,items:textItems})}Ext.create("Ext.window.Window",{title:"数据格式错误",modal:!0,width:700,height:600,bodyPadding:15,layout:{type:"table",columns:2},items:[{xtype:"container",cls:"x-message-box-error ",height:34,width:34},{xtype:"label",text:"数据格式错误，请修改下列数据后重新上传"},{xtype:"container",margin:"15 0 0 0",colspan:2,autoScroll:!0,height:470,width:660,items:items}],buttons:[{text:"确定",handler:function(com){com.up("window").close()}}]}).show()},ActionManager.searchTracking_number=function(traget){WindowManager.Tracking_numberWin&&""!=WindowManager.Tracking_numberWin?WindowManager.Tracking_numberWin.show():(WindowManager.Tracking_numberWin=Ext.create("Ext.window.Window",{modal:!0,resizable:!1,closeAction:"hide",title:"查询",defaultFocus:"tracking_number",iconCls:"search",record:!1,formVals:"",height:300,width:500,layout:"vbox",items:[{xtype:"form",itemId:"formId",autoScroll:!0,height:290,width:500,border:!1,bodyPadding:15,defaultType:"textfield",layout:{type:"table",columns:1},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100,enableKeyEvents:!0,listeners:{keydown:function(field,e,opts){var me=this;if(e.getKey()==e.ENTER){var win=me.up("window");win.down("#submit").fireHandler(e)}}}},items:[{fieldLabel:"票据号",itemId:"tracking_number",maxLength:64},{fieldLabel:"网点",itemId:"arrive_express_point_name",maxLength:64},{fieldLabel:"网点代码",itemId:"arrive_express_point_code",maxLength:16},{xtype:"fieldcontainer",colspan:2,width:490,fieldLabel:"收货时间",defaultType:"datetimefield",layout:{type:"hbox"},defaults:{labelAlign:"right",width:100},items:[{xtype:"datefield",format:"Y-m-d",itemId:"dateStar",vtype:"daterange",endDateField:"dateEnd"},{xtype:"label",margin:"0 0 0 5",width:20,text:"至"},{xtype:"datefield",format:"Y-m-d",itemId:"dateEnd",vtype:"daterange",startDateField:"dateStar"}]},{fieldLabel:"客户名称",itemId:"customer_name",maxLength:64}]}],listeners:{show:function(win){var form=win.down("#formId").getForm();""!=win.formVals&&form.setValues(win.formVals)}},buttons:[{text:"重置",handler:function(){var me=this,w=me.up("window"),f=w.down("#formId");f.getForm().reset()}},{text:"确定",itemId:"submit",handler:function(){var me=this,win=me.up("window"),searchFlag=!1,store=traget.getStore(),extraParams=store.getProxy().extraParams,form=win.down("#formId").getForm();if(form.isValid()){win.formVals=form.getValues();var tracking_number=win.down("#tracking_number").getValue();""!=tracking_number?(GlobalFun.GridSearchInitFun("tracking_number",!1,store,tracking_number),searchFlag=!0):GlobalFun.GridSearchInitFun("tracking_number",!0,store,!1);var arrive_express_point_name=win.down("#arrive_express_point_name").getValue();""!=arrive_express_point_name?(GlobalFun.GridSearchInitFun("arrive_express_point_name",!1,store,arrive_express_point_name),searchFlag=!0):GlobalFun.GridSearchInitFun("arrive_express_point_name",!0,store,!1);var arrive_express_point_code=win.down("#arrive_express_point_code").getValue();""!=arrive_express_point_code?(GlobalFun.GridSearchInitFun("arrive_express_point_code",!1,store,arrive_express_point_code),searchFlag=!0):GlobalFun.GridSearchInitFun("arrive_express_point_code",!0,store,!1);var dateStarField=win.down("#dateStar"),dateEndField=win.down("#dateEnd"),dateStar=dateStarField.getValue(),dateEnd=dateEndField.getValue();dateStar||dateEnd?(extraParams.DateFilter=!0,extraParams.arrive_time_start=Ext.Date.format(dateStar,"Y-m-d"),extraParams.arrive_time_end=Ext.Date.format(dateEnd,"Y-m-d"),searchFlag=!0):(extraParams.DateFilter=!1,extraParams.arrive_time_start="",extraParams.arrive_time_end="");var customer_name=win.down("#customer_name").getValue();""!=customer_name?(GlobalFun.GridSearchInitFun("customer_name",!1,store,customer_name),searchFlag=!0):GlobalFun.GridSearchInitFun("customer_name",!0,store,!1),searchFlag?(win.close(),traget.loadGrid(!0)):(win.close(),traget.loadGrid())}}},{text:"取消",handler:function(){var me=this;me.up("window").close()}}]}),WindowManager.Tracking_numberWin.show())},ActionManager.translateError=function(response){var items=[];Ext.Array.each(response.data,function(item,index){items.push({fieldLabel:item.tracking_number,value:item.msg})}),Ext.create("Ext.window.Window",{modal:!0,minWidth:320,maxWidth:800,maxHeight:600,title:response.msg,iconCls:"error",bodyPadding:20,autoScroll:!0,bodyBorder:!1,defaults:{xtype:"displayfield",labelAlign:"right",labelWidth:160,width:750,labelClsExtra:"labelCanSelect"},items:items,buttonAlign:"center",buttons:[{text:"关闭",handler:function(com){com.up("window").close()}}]}).show()},ActionManager.delTracking_number=function(traget){var sm=traget.getSelectionModel(),records=sm.getSelection();if(records[0]){var ids=[];return Ext.Array.each(records,function(rec){0==rec.data.account_status&&ids.push(rec.data.tracking_number_id)}),0==ids.length?void Ext.Msg.alert("提示","请选择至少1条未结算状态的项目."):void GlobalConfig.newMessageBox.show({title:"提示",msg:"您确定要删除选定的(未结算)项目吗？",buttons:Ext.MessageBox.YESNO,closable:!1,fn:function(btn){if("yes"==btn){var param={sessiontoken:GlobalFun.getSeesionToken(),tracking_number_ids:ids.join()};WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.destroy,"Tracking_numberGrid",param,function(response,opts){new Ext.util.DelayedTask(function(){store.load()}).delay(500)},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("登录失败",response.msg)},!0)}},icon:Ext.MessageBox.QUESTION})}},ActionManager.account_statusTracking_number=function(target){var store=target.getStore(),extraParams=store.getProxy().extraParams,param={arrive_time_start:extraParams.arrive_time_start,arrive_time_end:extraParams.arrive_time_end,filter:extraParams.filter,sessiontoken:GlobalFun.getSeesionToken()};GlobalConfig.newMessageBox.show({title:"提示",msg:"您确定要设置当前的所有项目状态为已结算吗？",buttons:Ext.MessageBox.YESNO,closable:!1,fn:function(btn){"yes"==btn&&WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.setAccount_status,"setAccount_status",param,function(response,opts){new Ext.util.DelayedTask(function(){store.load()}).delay(500)},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!0)},icon:Ext.MessageBox.QUESTION})};
//# sourceMappingURL=Tracking_numberGridAction.js.map