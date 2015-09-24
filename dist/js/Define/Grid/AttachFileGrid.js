var AttachFileGrid_RightMenu=Ext.create("Ext.menu.Menu",{items:[ActionBase.getAction("refreshAttachFile"),"-",ActionBase.getAction("searchAttachFile"),ActionBase.getAction("uploadAttachFile"),"-",ActionBase.getAction("validateAttachFile"),ActionBase.getAction("importAttachFile")]});Ext.define("chl.gird.AttachFileGrid",{alternateClassName:["AttachFileGrid"],alias:"widget.AttachFileGrid",extend:"chl.grid.BaseGrid",store:"AttachFileGridStoreId",actionBaseName:"AttachFileGridAction",viewConfig:{loadingText:"<b>正在加载数据...</b>",enableTextSelection:!0},listeners:{itemclick:function(grid,record,hitem,index,e,opts){},itemdblclick:function(grid,record,hitem,index,e,opts){},itemcontextmenu:function(view,rec,item,index,e,opts){e.stopEvent(),AttachFileGrid_RightMenu.showAt(e.getXY())},beforeitemmousedown:function(view,record,item,index,e,options){},selectionchange:function(view,seles,op){seles[0]&&ActionBase.updateActions("AttachFileGridAction",seles)}},columns:[],dockedItems:[{xtype:"toolbar",itemId:"toolbarID",dock:"top",layout:{overflowHandler:"Menu"},items:[ActionBase.getAction("refreshAttachFile"),"-",ActionBase.getAction("searchAttachFile"),ActionBase.getAction("uploadAttachFile"),"-",ActionBase.getAction("validateAttachFile"),ActionBase.getAction("importAttachFile")]},{xtype:"Pagingtoolbar",itemId:"pagingtoolbarID",store:"AttachFileGridStoreId",dock:"bottom",items:[{xtype:"tbtext",text:"过滤:"},{xtype:"GridFilterMenuButton",itemId:"menuID",text:"全部验证状态",filterParam:{group:"validate_statusGroup",text:"全部验证状态",filterKey:"validate_status",GridTypeName:"AttachFileGrid",store:StoreManager.ComboStore.AttachFileGridValidate_statusStore}},{xtype:"GridFilterMenuButton",itemId:"import_statusmenuID",text:"全部导入状态",filterParam:{group:"import_statusGroup",text:"全部导入状态",filterKey:"import_status",GridTypeName:"AttachFileGrid",store:StoreManager.ComboStore.AttachFileGridImport_statusStore}},"-",{xtype:"GridSelectCancelMenuButton",itemId:"selectRecId",text:"选择",targetName:"AttachFileGrid"}]}],initComponent:function(){var me=this;me.callParent(arguments),ActionBase.setTargetView(me.actionBaseName,me),ActionBase.updateActions(me.actionBaseName,me.getSelectionModel().getSelection())},loadGrid:function(clearFilter,noPageOne){var me=this,store=me.getStore(),sessiontoken=store.getProxy().extraParams.sessiontoken;!sessiontoken||0==sessiontoken.length;var filter={};store.filterMap.each(function(key,value,length){filter[key]=value}),store.getProxy().extraParams.filter=Ext.JSON.encode(filter),store.getProxy().extraParams.refresh=1,noPageOne?store.load():store.loadPage(1),store.getProxy().extraParams.refresh=null,GlobalFun.SetGridTitle(me.up("#centerGridDisplayContainer"),store,"票据列表"),ActionBase.updateActions(me.actionBaseName,me.getSelectionModel().getSelection())}}),GridManager.CreateAttachFileGrid=function(param){var tmpArr=[{text:"文件编号",dataIndex:"file_id",renderer:GlobalFun.UpdateRecord,flex:1},{text:"原文件名",dataIndex:"file_name",renderer:GlobalFun.UpdateRecord,flex:1},{text:"服务器文件名",dataIndex:"file_save_name",renderer:GlobalFun.UpdateRecord,flex:1},{text:"文件大小",dataIndex:"file_size",renderer:GlobalFun.UpdateRecord,flex:1},{text:"操作人",dataIndex:"admin_name",renderer:GlobalFun.UpdateRecord,flex:1},{text:"验证状态",dataIndex:"validate_status",renderer:function(value){return 0==value?"未验证":"已验证"},flex:1},{text:"导入状态",dataIndex:"import_status",renderer:function(value){return 0==value?"未导入":"已导入"},flex:1},{text:"导入时间",dataIndex:"import_time",renderer:GlobalFun.UpdateRecord,flex:1},{text:"创建时间",dataIndex:"created_at",renderer:GlobalFun.UpdateRecord,flex:1}];return GridManager.AttachFileGrid=Ext.create("chl.gird.AttachFileGrid",GridManager.BaseGridCfg("AttachFileGrid","AttachFileGridState",tmpArr)),param&&param.needLoad&&GridManager.AttachFileGrid.loadGrid(),GridManager.AttachFileGrid},GridManager.SetAttachFileGridSelectionChangeEvent=function(param){GridManager.AttachFileGrid.on("selectionchange",function(view,seles,op){!seles[0]})};
//# sourceMappingURL=AttachFileGrid.js.map