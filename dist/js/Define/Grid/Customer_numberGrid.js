Ext.define("chl.Model.Customer_numberGridModel",{extend:"Ext.data.Model",idProperty:"number_id",alternateClassName:["Customer_numberGridModel"],fields:[{name:"number_id"},{name:"customer_id"},{name:"customer_name"},{name:"customize_number_prefix"},{name:"customize_number_from"},{name:"customize_number_to"},{name:"customize_number_suffix"}]}),Ext.create("Ext.data.Store",{model:"chl.Model.Customer_numberGridModel",storeId:"Customer_numberStoreId",filterMap:Ext.create("Ext.util.HashMap"),pageSize:GlobalConfig.GridPageSize,autoSync:!1,autoLoad:!1,remoteSort:!0,sorters:[{property:"customer_id",direction:"DESC"}],proxy:{type:"ajax",api:GlobalConfig.Controllers.Customer_numberGrid,filterParam:"filter",sortParam:"sort",directionParam:"dir",limitParam:"limit",startParam:"start",simpleSortMode:!0,extraParams:{req:"data",dataname:"Customer_number",restype:"json",sessiontoken:GlobalFun.getSeesionToken(),folderid:-1,refresh:null,template:""},reader:{type:"json",root:"data",seccessProperty:"success",messageProperty:"msg",totalProperty:"total"},writer:{type:"json",writeAllFields:!1,allowSingle:!1},actionMethods:{create:"POST",read:"POST",update:"POST",destroy:"POST"},listeners:{exception:function(proxy,response,operation){var json=Ext.JSON.decode(response.responseText),code=json.code;GlobalFun.errorProcess(code),"read"!=operation.action}}},listeners:{load:function(store,records,suc,operation,opts){store.getTotalCount();suc||store.loadData([])}}});var Customer_numberGridRowEditing;Ext.define("chl.gird.Customer_numberGrid",{extend:"chl.grid.BaseGrid",alternateClassName:["Customer_numberGrid"],alias:"widget.Customer_numberGrid",store:"Customer_numberStoreId",columnLines:!0,multiSelect:!0,actionBaseName:"Customer_numberGridAction",dockedItems:[{xtype:"Pagingtoolbar",itemId:"pagingtoolbarID",store:"Customer_numberStoreId",dock:"bottom",items:[]}],listeners:{itemclick:function(grid,record,hitem,index,e,opts){},itemdblclick:function(grid,record,hitem,index,e,opts){},itemcontextmenu:function(view,rec,item,index,e,opts){e.stopEvent(),CustomerRentGrid_RightMenu.showAt(e.getXY())},beforeitemmousedown:function(view,record,item,index,e,options){},selectionchange:function(view,seles,op){if(seles[0]){var me=this;me.down("#removeCustomer_number").setDisabled(!seles.length)}}},tbar:[{text:"添加客户面单号范围",iconCls:"add",handler:function(){Customer_numberGridRowEditing.cancelEdit();var r=Ext.ModelManager.create({number_id:"",customer_id:WindowManager.AddUpdateCustomer_numberWin.record.data.customer_id,customer_name:WindowManager.AddUpdateCustomer_numberWin.record.data.customer_name,customize_number_prefix:"",customize_number_from:"",customize_number_to:"",customize_number_suffix:""},"chl.Model.Customer_numberGridModel");Ext.StoreMgr.lookup("Customer_numberStoreId").insert(0,r),Customer_numberGridRowEditing.startEdit(0,0)}},{itemId:"removeCustomer_number",text:"删除",iconCls:"remove",handler:function(){var me=this,sm=me.up("Customer_numberGrid").getSelectionModel();Customer_numberGridRowEditing.cancelEdit();var records=sm.getSelection();Ext.StoreMgr.lookup("Customer_numberStoreId").remove(records),Ext.StoreMgr.lookup("Customer_numberStoreId").sync({success:function(batch,opts){Ext.StoreMgr.lookup("Customer_numberStoreId").getCount()>0&&sm.select(0)},failure:function(batch,opts){Ext.Msg.alert("失败",action.result.msg)}})},disabled:!0}],columns:[{header:"编号",dataIndex:"number_id",flex:1,renderer:function(value){return value}},{header:"客户",dataIndex:"customer_name",flex:1.5},{header:"面单号前缀",dataIndex:"customize_number_prefix",flex:1,editor:{maxLength:20,maxLengthText:"长度最大为20字节"}},{header:"面单号起始编号",dataIndex:"customize_number_from",flex:1,editor:{allowBlank:!1,blankText:"不能为空",maxLength:9,maxLengthText:"长度最大为9字节",regex:GlobalConfig.RegexController.regexNumber,regexText:"请输入数字"}},{header:"面单号截止编号",dataIndex:"customize_number_to",flex:1,editor:{allowBlank:!1,blankText:"不能为空",maxLength:9,maxLengthText:"长度最大为9字节",regex:GlobalConfig.RegexController.regexNumber,regexText:"请输入数字"}},{header:"面单号后缀",dataIndex:"customize_number_suffix",flex:1,editor:{maxLength:20,maxLengthText:"长度最大为20字节"}}],initComponent:function(){var me=this;me.callParent(arguments),ActionBase.setTargetView(me.actionBaseName,me),ActionBase.updateActions(me.actionBaseName,me.getSelectionModel().getSelection())},loadGrid:function(isSearch){var me=this,store=me.getStore();store.pageSize=GlobalConfig.GridPageSize;var sessiontoken=store.getProxy().extraParams.sessiontoken;!sessiontoken||0==sessiontoken.length;var filter={};store.filterMap.each(function(key,value,length){filter[key]=value}),store.getProxy().extraParams.filter=Ext.JSON.encode(filter),store.getProxy().extraParams.refresh=1,store.loadPage(1),store.getProxy().extraParams.refresh=null,ActionBase.updateActions(me.actionBaseName,me.getSelectionModel().getSelection())}}),Ext.define("chl.Grid.AddUpdateCustomer_numberWin",{extend:"Ext.window.Window",title:"添加",iconCls:"",record:!1,height:700,width:830,bodyPadding:10,layout:"fit",modal:!0,resizable:!1,items:[{xtype:"Customer_numberGrid",itemId:"Customer_numberGrid",plugins:[Customer_numberGridRowEditing=Ext.create("Ext.grid.plugin.RowEditing",{clicksToMoveEditor:1,autoCancel:!0,listeners:{edit:function(editor,e,opts){Ext.StoreMgr.lookup("Customer_numberStoreId").sync({success:function(batch,opts){e.record.commit(),Ext.StoreMgr.lookup("Customer_numberStoreId").getCount()>0&&sm.select(0)},failure:function(batch,opts){Ext.Msg.alert("失败",action.result.msg)}})},canceledit:function(editor,e,opts){},beforeedit:function(editor,e,opts){Customer_numberGridRowEditing.getEditor().saveBtnText="提交",Customer_numberGridRowEditing.getEditor().cancelBtnText="取消",Customer_numberGridRowEditing.getEditor().errorsText="错误"}}})]}],buttons:[{text:"关闭",handler:function(){var me=this;Customer_numberGridRowEditing.cancelEdit(),me.up("window").close()}}],listeners:{show:function(win){var grid=win.down("Customer_numberGrid"),store=grid.getStore();store.getProxy().extraParams.customer_id=win.record.data.customer_id,win.down("Customer_numberGrid").loadGrid()}}});
//# sourceMappingURL=Customer_numberGrid.js.map