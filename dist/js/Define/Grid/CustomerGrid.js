var CustomerGrid_RightMenu=Ext.create("Ext.menu.Menu",{items:[ActionBase.getAction("refreshCustomer"),"-",ActionBase.getAction("searchCustomer"),ActionBase.getAction("addCustomer"),ActionBase.getAction("editCustomer"),"-",ActionBase.getAction("editCustomer_number"),ActionBase.getAction("addCustomerRent")]});Ext.define("chl.gird.CustomerGrid",{alternateClassName:["CustomerGrid"],alias:"widget.CustomerGrid",extend:"chl.grid.BaseGrid",store:"CustomerGridStoreId",actionBaseName:"CustomerGridAction",listeners:{itemclick:function(grid,record,hitem,index,e,opts){},itemdblclick:function(grid,record,hitem,index,e,opts){ActionBase.getAction("editCustomer").execute()},itemcontextmenu:function(view,rec,item,index,e,opts){e.stopEvent(),CustomerGrid_RightMenu.showAt(e.getXY())},beforeitemmousedown:function(view,record,item,index,e,options){},selectionchange:function(view,seles,op){seles[0]&&ActionBase.updateActions("CustomerGridAction",seles)}},columns:[],dockedItems:[{xtype:"toolbar",itemId:"toolbarID",dock:"top",layout:{overflowHandler:"Menu"},items:[ActionBase.getAction("refreshCustomer"),"-",ActionBase.getAction("searchCustomer"),ActionBase.getAction("addCustomer"),ActionBase.getAction("editCustomer"),"-",ActionBase.getAction("editCustomer_number"),ActionBase.getAction("addCustomerRent"),"->",{fieldLabel:"按客户名查找",text:"按客户名查找",width:300,labelAlign:"right",labelWidth:80,xtype:"searchfield",paramName:"customer_name",itemId:"CustomerGridSearchfieldId",listeners:{render:function(){var me=this;me.store=GridManager.CustomerGrid.getStore()}}}]},{xtype:"Pagingtoolbar",itemId:"pagingtoolbarID",store:"CustomerGridStoreId",dock:"bottom",items:[]}],initComponent:function(){var me=this;me.callParent(arguments),ActionBase.setTargetView(me.actionBaseName,me),ActionBase.updateActions(me.actionBaseName,me.getSelectionModel().getSelection())},loadGrid:function(isSearch){var me=this,store=me.getStore(),sessiontoken=store.getProxy().extraParams.sessiontoken;!sessiontoken||0==sessiontoken.length;var filter={};store.filterMap.each(function(key,value,length){filter[key]=value}),store.getProxy().extraParams.filter=Ext.JSON.encode(filter),store.getProxy().extraParams.refresh=1,store.loadPage(1),store.getProxy().extraParams.refresh=null,GlobalFun.SetGridTitle(me.up("#centerGridDisplayContainer"),store,"客户列表"),ActionBase.updateActions(me.actionBaseName,me.getSelectionModel().getSelection())}}),GridManager.CreateCustomerGrid=function(param){var tmpArr=[{text:"编号",dataIndex:"customer_id",renderer:GlobalFun.UpdateRecord,width:100},{text:"客户名",dataIndex:"customer_name",renderer:GlobalFun.UpdateRecord,width:100},{text:"客户编号",dataIndex:"customer_no",renderer:GlobalFun.UpdateRecord,width:100},{text:"圆通商家代码",dataIndex:"yto_no",renderer:GlobalFun.UpdateRecord,width:100},{text:"手机号",dataIndex:"mobile",renderer:GlobalFun.UpdateRecord,width:100},{text:"房租单价",dataIndex:"rent_area",renderer:GlobalFun.UpdateRecord,width:100,hidden:!0,groupable:!1,sortable:!1},{text:"面积单量比",dataIndex:"area_to_order_number",renderer:GlobalFun.UpdateRecord,width:100,hidden:!0,groupable:!1,sortable:!1},{text:"房租单价",dataIndex:"rent_pre_price",renderer:GlobalFun.UpdateRecord,width:100,hidden:!0,groupable:!1,sortable:!1},{text:"开始日期",dataIndex:"date_start",renderer:GlobalFun.UpdateRecord,width:100,hidden:!0,groupable:!1,sortable:!1},{text:"结束日期",dataIndex:"date_end",renderer:GlobalFun.UpdateRecord,width:100,hidden:!0,groupable:!1,sortable:!1}];return GridManager.CustomerGrid=Ext.create("chl.gird.CustomerGrid",GridManager.BaseGridCfg("CustomerGrid","CustomerGridState",tmpArr)),param&&param.needLoad&&GridManager.CustomerGrid.loadGrid(),GridManager.CustomerGrid},GridManager.SetCustomerGridSelectionChangeEvent=function(param){GridManager.CustomerGrid.on("selectionchange",function(view,seles,op){!seles[0]})},Ext.define("chl.Grid.AddUpdateCustomerWin",{extend:"Ext.window.Window",title:"添加",defaultFocus:"customer_nameItemId",iconCls:"",record:!1,height:160,width:830,layout:"vbox",modal:!0,resizable:!1,items:[{xtype:"form",itemId:"formId",autoScroll:!0,height:450,width:820,border:!1,bodyPadding:15,defaultType:"textfield",layout:{type:"table",columns:2},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:36,enableKeyEvents:!0,listeners:{keydown:function(field,e,opts){var me=this;if(e.getKey()==e.ENTER){var win=me.up("window");win.down("#submit").fireHandler(e)}}}},items:[{name:"customer_name",fieldLabel:"客户名",itemId:"customer_nameItemId",allowBlank:!1,blankText:"不能为空"},{name:"customer_no",fieldLabel:"客户编号",itemId:"customer_noItemId",allowBlank:!1,blankText:"不能为空"},{name:"yto_no",fieldLabel:"圆通商家代码",allowBlank:!1,blankText:"不能为空"},{name:"mobile",fieldLabel:"手机号",itemId:"mobileItemId",allowBlank:!1,blankText:"不能为空"}]}],buttons:[{text:"重置",handler:function(){var me=this,w=me.up("window"),f=w.down("#formId");if(f.getForm().reset(),"update"==w.action){var sm=w.grid.getSelectionModel();sm.hasSelection()&&f.getForm().loadRecord(sm.getSelection()[0])}}},{text:"确定",itemId:"submit",handler:function(){var me=this,w=me.up("window"),form=w.down("#formId").getForm();if(form.isValid()){var url="create"==w.action?GlobalConfig.Controllers.CustomerGrid.addCustomer:GlobalConfig.Controllers.CustomerGrid.updateCustomer;form.submit({url:url,params:{req:"dataset",dataname:"AddUpdateCustomer",restype:"json",customer_id:w.record?w.record.data.customer_id:0,Id:w.record?w.record.data.ControllTid:0,logId:w.record?w.record.data.Id:0,action:w.action,sessiontoken:GlobalFun.getSeesionToken()},success:function(form,action){w.grid.loadGrid(),w.close()},failure:function(form,action){GlobalFun.errorProcess(action.result.code)||Ext.Msg.alert("失败",action.result.msg)}})}}},{text:"取消",handler:function(){var me=this;me.up("window").close()}}]}),Ext.define("chl.Grid.AddUpdateCustomerRentWin",{extend:"Ext.window.Window",title:"添加",defaultFocus:"customer_nameItemId",iconCls:"",record:!1,height:650,width:830,layout:"vbox",modal:!0,resizable:!1,bodyPadding:5,items:[{xtype:"form",itemId:"formId",autoScroll:!0,height:200,width:810,border:!1,bodyPadding:5,defaultType:"textfield",layout:{type:"table",columns:2},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100},items:[{name:"customer_name",xtype:"displayfield",fieldLabel:"客户名",itemId:"customer_nameItemId",allowBlank:!1,blankText:"不能为空"},{name:"mobile",fieldLabel:"手机号",xtype:"displayfield",itemId:"mobileItemId",allowBlank:!1,blankText:"不能为空"},{name:"rent_no",fieldLabel:"合同编号",allowBlank:!1,blankText:"不能为空",maxLength:64},{name:"title",fieldLabel:"标题",maxLength:64},{name:"rent_area",fieldLabel:"租贷面积（平米）",itemId:"rent_areaItemId",allowBlank:!1,blankText:"不能为空",regex:GlobalConfig.RegexController.regexNumber,regexText:"请输入数字",maxLength:6},{name:"area_to_order_number",fieldLabel:"面积单量比",itemId:"area_to_order_numberItemId",allowBlank:!1,blankText:"不能为空",regex:GlobalConfig.RegexController.regexMoney2Fixed,regexText:"请输入数字"},{name:"rent_pre_price",fieldLabel:"房租单价",colspan:2,allowBlank:!1,blankText:"不能为空",regex:GlobalConfig.RegexController.regexMoney2Fixed,regexText:"请输入数字"},{xtype:"datefield",name:"date_start",format:"Y-m-d",fieldLabel:"开始时间",allowBlank:!1,blankText:"不能为空",itemId:"date_start",vtype:"daterange",endDateField:"date_end"},{xtype:"datefield",name:"date_end",format:"Y-m-d",fieldLabel:"结束时间",allowBlank:!1,blankText:"不能为空",itemId:"date_end",vtype:"daterange",startDateField:"date_start"},{xtype:"button",colspan:2,width:100,margin:"0 0 0 600",text:"添加",handler:function(com){var me=this,w=me.up("window"),form=w.down("#formId").getForm();if(form.isValid()){var url=GlobalConfig.Controllers.CustomerGrid.addCustomerRent;form.submit({url:url,params:{req:"dataset",dataname:"addCustomerRent",restype:"json",customerId:w.cid,action:w.action,sessiontoken:GlobalFun.getSeesionToken()},success:function(form,action){w.down("CustomerRentGrid").loadGrid()},failure:function(form,action){GlobalFun.errorProcess(action.result.code)||Ext.Msg.alert("失败",action.result.msg)}})}}},{xtype:"label",colspan:2,style:{color:"red"},text:"注：如客户存在多个租赁房间，添加合同时需要将多个房间面积相加后，再添加合同。多个房间对应的单量比和房租单价必须一致。每个客户只有最新添加的合同处于生效状态。"},{name:"customer_id",xtype:"hidden"}]},{xtype:"CustomerRentGrid",margin:"5 0 0 0",width:810,height:370}],buttons:[{text:"关闭",handler:function(){var me=this;me.up("window").close()}}],listeners:{beforehide:function(com){WindowManager.AddUpdateCustomerRentWin.grid.store.load({scope:this,callback:function(records,operation,success){var record=WindowManager.AddUpdateCustomerRentWin.record;Ext.Array.each(records,function(item,index){return record.data.customer_id==item.data.customer_id?(record=item,!1):void 0});var sm=WindowManager.AddUpdateCustomerRentWin.grid.getSelectionModel();sm.select(record)}})}}});
//# sourceMappingURL=CustomerGrid.js.map