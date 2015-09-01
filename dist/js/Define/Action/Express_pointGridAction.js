Ext.define("chl.Action.Express_pointGridAction",{extend:"WS.action.Base",category:"Express_pointGridAction"}),Ext.create("chl.Action.Express_pointGridAction",{itemId:"addExpress_point",iconCls:"base_add",tooltip:"添加网点",text:"添加网点",handler:function(){var me=this,target=me.getTargetView();ActionManager.addExpress_point(target)},updateStatus:function(selection){}}),Ext.create("chl.Action.Express_pointGridAction",{itemId:"editExpress_point",iconCls:"base_edit",tooltip:"编辑网点",text:"编辑网点",handler:function(){var me=this,target=me.getTargetView(),record=target.getSelectionModel().getSelection()[0];ActionManager.editExpress_point(target,record)},updateStatus:function(selection){this.setDisabled(1!=selection.length)}}),Ext.create("chl.Action.Express_pointGridAction",{itemId:"searchExpress_point",iconCls:"search",tooltip:"查询",text:"查询",handler:function(){var target=this.getTargetView();ActionManager.searchExpress_point(target)},updateStatus:function(selection){}}),Ext.create("chl.Action.Express_pointGridAction",{itemId:"delExpress_point",iconCls:"base_delete",tooltip:"删除",text:"删除",handler:function(){var target=this.getTargetView();ActionManager.delExpress_point(target)},updateStatus:function(selection){this.setDisabled(0==selection.length)}}),Ext.create("chl.Action.Express_pointGridAction",{itemId:"refreshExpress_point",iconCls:"refresh",tooltip:"刷新",text:"刷新",handler:function(){var target=this.getTargetView();ActionManager.refreshExpress_point(target)},updateStatus:function(selection){}}),ActionManager.refreshExpress_point=function(target){target.loadGrid()},ActionManager.addExpress_point=function(target){WindowManager.AddUpdateExpress_pointWin=Ext.create("chl.Grid.AddUpdateExpress_pointWin",{grid:target,iconCls:"base_add",action:"create",record:null,title:"新增"}),WindowManager.AddUpdateExpress_pointWin.show(null,function(){})},ActionManager.editExpress_point=function(target,record){WindowManager.AddUpdateExpress_pointWin=Ext.create("chl.Grid.AddUpdateExpress_pointWin",{grid:target,iconCls:"base_edit",action:"update",record:record,title:"编辑"}),WindowManager.AddUpdateExpress_pointWin.show(null,function(){WindowManager.AddUpdateExpress_pointWin.down("#formId").loadRecord(record)})},ActionManager.searchExpress_point=function(traget){WindowManager.searchExpress_pointWin&&""!=WindowManager.searchExpress_pointWin?WindowManager.searchExpress_pointWin.show():WindowManager.searchExpress_pointWin=Ext.create("Ext.window.Window",{modal:!0,resizable:!1,closeAction:"hide",title:"查询",defaultFocus:"Express_point_nameItemId",iconCls:"search",record:!1,formVals:"",height:200,width:500,layout:"vbox",listeners:{show:function(win){var form=win.down("#formId").getForm();""!=win.formVals&&form.setValues(win.formVals);var searchfield=traget.down("#Express_pointGridSearchfieldId");if(searchfield&&searchfield.paramName){var item=win.down("textfield[name="+searchfield.paramName+"]");if(item){var store=traget.getStore(),filter=Ext.JSON.decode(store.getProxy().extraParams.filter);item.setValue(filter[searchfield.paramName])}}}},items:[{xtype:"form",itemId:"formId",autoScroll:!0,height:190,width:500,border:!1,bodyPadding:15,defaultType:"textfield",layout:{type:"table",columns:1},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:40,enableKeyEvents:!0,listeners:{keydown:function(field,e,opts){var me=this;if(e.getKey()==e.ENTER){var win=me.up("window");win.down("#submit").fireHandler(e)}}}},items:[{name:"express_point_name",fieldLabel:"网点名称",itemId:"express_point_nameItemId"},{name:"express_point_code",fieldLabel:"网点代码",maxLength:20,itemId:"express_point_codeItemId"},{xtype:"combobox",name:"province_code",itemId:"province_codeItemId",fieldLabel:"省份",store:"ProvinceStoreId",queryMode:"local",displayField:"Name",valueField:"Id",editable:!1}]}],buttons:[{text:"重置",handler:function(){var me=this,w=me.up("window"),f=w.down("#formId");f.getForm().reset()}},{text:"确定",itemId:"submit",handler:function(){var me=this,win=me.up("window"),searchFlag=!1,store=traget.getStore(),form=(store.getProxy().extraParams,win.down("#formId").getForm());if(form.isValid()){win.formVals=form.getValues();var express_point_name=win.down("#express_point_nameItemId").getValue();""!=express_point_name?(GlobalFun.GridSearchInitFun("express_point_name",!1,store,express_point_name),searchFlag=!0):GlobalFun.GridSearchInitFun("express_point_name",!0,store,!1);var Searchfield=traget.down("#Express_pointGridSearchfieldId");Searchfield&&(Searchfield.setValue(express_point_name),Searchfield.setSearchStatus(""!=customer_name?!0:!1));var express_point_code=win.down("#express_point_codeItemId").getValue();""!=express_point_code?(GlobalFun.GridSearchInitFun("express_point_code",!1,store,express_point_code),searchFlag=!0):GlobalFun.GridSearchInitFun("express_point_code",!0,store,!1);var province_code=win.down("#province_codeItemId").getValue();""!=province_code?(GlobalFun.GridSearchInitFun("province_code",!1,store,province_code),searchFlag=!0):GlobalFun.GridSearchInitFun("province_code",!0,store,!1),searchFlag?(win.close(),traget.loadGrid(!0)):(win.close(),traget.loadGrid())}}},{text:"取消",handler:function(){var me=this;me.up("window").close()}}]}).show()},ActionManager.delExpress_point=function(traget){var sm=traget.getSelectionModel(),records=sm.getSelection();if(records[0]){var ids=[];Ext.Array.each(records,function(rec){ids.push(rec.data.point_id)});var store=traget.getStore();GlobalConfig.newMessageBox.show({title:"提示",msg:"您确定要删除选定的网点吗？",buttons:Ext.MessageBox.YESNO,closable:!1,fn:function(btn){if("yes"==btn){var param={sessiontoken:GlobalFun.getSeesionToken(),point_ids:ids.join()};WsCall.pcall(GlobalConfig.Controllers.Express_pointGrid.destroy,"Express_pointGridDestroy",param,function(response,opts){new Ext.util.DelayedTask(function(){store.load()}).delay(500)},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("登录失败",response.msg)},!0)}},icon:Ext.MessageBox.QUESTION})}};
//# sourceMappingURL=Express_pointGridAction.js.map