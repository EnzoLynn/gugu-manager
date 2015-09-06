Ext.define("chl.Model.Customer_numberGridModel",{extend:"Ext.data.Model",idProperty:"number_id",alternateClassName:["Customer_numberGridModel"],fields:[{name:"number_id"},{name:"customer_id"},{name:"customer_name"},{name:"tracking_number"},{name:"use_status"},{name:"use_status_name"},{name:"use_time"}]}),Ext.create("Ext.data.Store",{model:"chl.Model.Customer_numberGridModel",storeId:"Customer_numberStoreId",filterMap:Ext.create("Ext.util.HashMap"),pageSize:GlobalConfig.GridPageSize,autoSync:!1,autoLoad:!1,remoteSort:!0,sorters:[{property:"customer_id",direction:"DESC"}],proxy:{type:"ajax",api:GlobalConfig.Controllers.Customer_numberGrid,filterParam:"filter",sortParam:"sort",directionParam:"dir",limitParam:"limit",startParam:"start",simpleSortMode:!0,extraParams:{req:"data",dataname:"Customer_number",restype:"json",sessiontoken:GlobalFun.getSeesionToken(),folderid:-1,refresh:null,template:""},reader:{type:"json",root:"data",seccessProperty:"success",messageProperty:"msg",totalProperty:"total"},writer:{type:"json"},actionMethods:{create:"POST",read:"POST",update:"POST",destroy:"POST"},listeners:{exception:function(proxy,response,operation){var json=Ext.JSON.decode(response.responseText),code=json.code;GlobalFun.errorProcess(code),"read"!=operation.action}}},listeners:{load:function(store,records,suc,operation,opts){store.getTotalCount();suc||store.loadData([])}}}),Ext.define("chl.gird.Customer_numberGrid",{extend:"chl.grid.BaseGrid",alternateClassName:["Customer_numberGrid"],alias:"widget.Customer_numberGrid",store:"Customer_numberStoreId",columnLines:!0,multiSelect:!0,actionBaseName:"Customer_numberGridAction",dockedItems:[{xtype:"Pagingtoolbar",itemId:"pagingtoolbarID",store:"Customer_numberStoreId",dock:"bottom",items:[]}],listeners:{itemclick:function(grid,record,hitem,index,e,opts){},itemdblclick:function(grid,record,hitem,index,e,opts){},itemcontextmenu:function(view,rec,item,index,e,opts){e.stopEvent(),CustomerRentGrid_RightMenu.showAt(e.getXY())},beforeitemmousedown:function(view,record,item,index,e,options){},selectionchange:function(view,seles,op){if(seles[0]){var me=this;me.down("#removeCustomer_number").setDisabled(!seles.length)}}},tbar:[{text:"刷新",tooltip:"刷新",iconCls:"refresh",handler:function(){var me=this,grid=me.up("Customer_numberGrid");Ext.StoreMgr.lookup("Customer_numberStoreId").load(),grid.down("#removeCustomer_number").setDisabled(!0)}},{text:"添加",tooltip:"添加客户面单号范围",iconCls:"add",handler:function(){var me=this,target=me.up("Customer_numberGrid");ActionManager.addCustomer_number(target)}},{itemId:"removeCustomer_number",text:"删除",tooltip:"删除",iconCls:"remove",handler:function(){var me=this,grid=me.up("Customer_numberGrid");ActionManager.delCustomer_number(grid)},disabled:!0}],columns:[{header:"编号",dataIndex:"number_id",flex:1,renderer:function(value){return value}},{header:"面单号截止编号",dataIndex:"tracking_number",flex:1},{header:"状态",dataIndex:"use_status",flex:1},{header:"使用时间",dataIndex:"use_time",flex:1}],initComponent:function(){var me=this;me.callParent(arguments),ActionBase.setTargetView(me.actionBaseName,me),ActionBase.updateActions(me.actionBaseName,me.getSelectionModel().getSelection())},loadGrid:function(isSearch){var me=this,store=me.getStore(),sessiontoken=store.getProxy().extraParams.sessiontoken;!sessiontoken||0==sessiontoken.length;var filter={};store.filterMap.each(function(key,value,length){filter[key]=value}),store.getProxy().extraParams.filter=Ext.JSON.encode(filter),store.getProxy().extraParams.refresh=1,store.loadPage(1),store.getProxy().extraParams.refresh=null,ActionBase.updateActions(me.actionBaseName,me.getSelectionModel().getSelection())}}),Ext.define("chl.Grid.AddUpdateCustomer_numberWin",{extend:"Ext.window.Window",title:"添加",iconCls:"",record:!1,height:600,width:830,bodyPadding:10,layout:"fit",modal:!0,resizable:!1,items:[],buttons:[{text:"关闭",handler:function(){var me=this;me.up("window").close()}}],listeners:{boxready:function(win){win.add({xtype:"Customer_numberGrid",itemId:"Customer_numberGrid"});var grid=win.down("Customer_numberGrid"),store=grid.getStore();store.getProxy().extraParams.customer_id=win.record.data.customer_id,win.down("Customer_numberGrid").loadGrid()}}}),Ext.define("chl.Grid.Customer_numberActionWin",{extend:"Ext.window.Window",title:"添加",defaultFocus:"tracking_number_start",iconCls:"",record:!1,height:180,width:830,layout:"fit",modal:!0,resizable:!1,items:[{xtype:"form",itemId:"formId",border:!1,bodyPadding:5,defaultType:"textfield",layout:{type:"table",columns:2},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:36,enableKeyEvents:!0,listeners:{keydown:function(field,e,opts){var me=this;if(e.getKey()==e.ENTER){var win=me.up("window");win.down("#submit").fireHandler(e)}}}},items:[{name:"tracking_number_prefix",colspan:2,fieldLabel:"面单号前缀",maxLength:2},{name:"tracking_number_start",itemId:"tracking_number_start",fieldLabel:"面单号起始编号",allowBlank:!1,blankText:"不能为空",maxLength:18,regex:GlobalConfig.RegexController.regexNumber,regexText:"请输入数字"},{name:"tracking_number_end",fieldLabel:"面单号截止编号",allowBlank:!1,blankText:"不能为空",maxLength:18,regex:GlobalConfig.RegexController.regexNumber,regexText:"请输入数字"}]}],buttons:[{text:"重置",handler:function(){var me=this,w=me.up("window"),f=w.down("#formId");if(f.getForm().reset(),"update"==w.action){var sm=w.grid.getSelectionModel();sm.hasSelection()&&f.getForm().loadRecord(sm.getSelection()[0])}}},{text:"确定",itemId:"submit",handler:function(){var me=this,w=me.up("window"),form=w.down("#formId").getForm();if(form.isValid()){var url="create"==w.action?GlobalConfig.Controllers.Customer_numberGrid.create:GlobalConfig.Controllers.Customer_numberGrid.update;form.submit({url:url,params:{req:"dataset",dataname:"Customer_numberGridAction",restype:"json",customer_id:WindowManager.AddUpdateCustomer_numberWin.record.data.customer_id,action:w.action,sessiontoken:GlobalFun.getSeesionToken()},success:function(form,action){w.grid.loadGrid(),w.close()},failure:function(form,action){GlobalFun.errorProcess(action.result.code)||Ext.Msg.alert("失败",action.result.msg)}})}}},{text:"取消",handler:function(){var me=this;me.up("window").close()}}]}),ActionManager.addCustomer_number=function(target){WindowManager.Customer_numberActionWin=Ext.create("chl.Grid.Customer_numberActionWin",{grid:target,iconCls:"add",action:"create",record:null,title:"新增"}),WindowManager.Customer_numberActionWin.show(null,function(){})},ActionManager.delCustomer_number=function(traget){var sm=traget.getSelectionModel(),records=sm.getSelection();if(records[0]){var ids=[];Ext.Array.each(records,function(rec){ids.push(rec.data.number_id)});var store=traget.getStore();GlobalConfig.newMessageBox.show({title:"提示",msg:"您确定要删除选定的项目吗？",buttons:Ext.MessageBox.YESNO,closable:!1,fn:function(btn){if("yes"==btn){var param={sessiontoken:GlobalFun.getSeesionToken(),number_ids:ids.join()};WsCall.pcall(GlobalConfig.Controllers.Customer_numberGrid.destroy,"Customer_numberGrid",param,function(response,opts){new Ext.util.DelayedTask(function(){store.load()}).delay(500)},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("登录失败",response.msg)},!0)}},icon:Ext.MessageBox.QUESTION})}};
//# sourceMappingURL=Customer_numberGrid.js.map