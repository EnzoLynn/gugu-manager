Ext.define("chl.Action.CustomerRentGridAction",{extend:"WS.action.Base",category:"CustomerRentGridAction"}),Ext.create("chl.Action.CustomerRentGridAction",{itemId:"editCustomerRule",iconCls:"editCustomerRule",tooltip:"添加规则",text:"添加规则",handler:function(){var me=this,target=me.getTargetView(),record=target.getSelectionModel().getSelection()[0];ActionManager.editCustomerRule(target,record)},updateStatus:function(selection){this.setDisabled(1!=selection.length)}}),Ext.create("chl.Action.CustomerRentGridAction",{itemId:"copyCustomerRule",iconCls:"copyCustomerRule",tooltip:"复制已有规则到选择项目",text:"复制已有规则",handler:function(){var me=this,target=me.getTargetView(),record=target.getSelectionModel().getSelection()[0];ActionManager.copyCustomerRule(target,record)},updateStatus:function(selection){this.setDisabled(1!=selection.length)}}),Ext.create("chl.Action.CustomerRentGridAction",{itemId:"refreshCustomerRent",iconCls:"refresh",tooltip:"刷新",text:"刷新",handler:function(){var target=this.getTargetView();ActionManager.refreshCustomerRent(target)},updateStatus:function(selection){}}),ActionManager.refreshCustomerRent=function(target){target.loadGrid()};var CustomerRentGrid_RightMenu=Ext.create("Ext.menu.Menu",{items:[ActionBase.getAction("refreshCustomerRent"),"-",ActionBase.getAction("editCustomerRule"),ActionBase.getAction("copyCustomerRule")]});Ext.define("chl.gird.CustomerRentGrid",{alternateClassName:["CustomerRentGrid"],alias:"widget.CustomerRentGrid",extend:"chl.grid.BaseGrid",store:"CustomerRentGridStoreId",actionBaseName:"CustomerRentGridAction",multiSelect:!1,listeners:{itemclick:function(grid,record,hitem,index,e,opts){},itemdblclick:function(grid,record,hitem,index,e,opts){ActionBase.getAction("editCustomerRule").execute()},itemcontextmenu:function(view,rec,item,index,e,opts){e.stopEvent(),CustomerRentGrid_RightMenu.showAt(e.getXY())},beforeitemmousedown:function(view,record,item,index,e,options){},selectionchange:function(view,seles,op){seles[0]&&ActionBase.updateActions("CustomerRentGridAction",seles)}},columns:[{text:"自动编号",dataIndex:"customer_rent_id",hidden:!0,renderer:GlobalFun.UpdateRecord,width:80},{text:"合同编号",dataIndex:"rent_no",renderer:GlobalFun.UpdateRecord,width:80},{text:"标题",dataIndex:"title",renderer:GlobalFun.UpdateRecord,width:100},{text:"租贷面积(平米)",dataIndex:"rent_area",renderer:GlobalFun.UpdateRecord,width:100},{text:"面积单量比",dataIndex:"area_to_order_number",renderer:GlobalFun.UpdateRecord,width:100},{text:"房租单价",dataIndex:"rent_pre_price",renderer:GlobalFun.UpdateRecord,width:100},{text:"开始日期",dataIndex:"date_start",renderer:GlobalFun.UpdateRecord,width:100},{text:"结束日期",dataIndex:"date_end",renderer:GlobalFun.UpdateRecord,width:100},{text:"状态",dataIndex:"status",renderer:GlobalFun.UpdateRecord,width:100}],dockedItems:[{xtype:"toolbar",itemId:"toolbarID",dock:"top",layout:{overflowHandler:"Menu"},items:[ActionBase.getAction("refreshCustomerRent"),"-",ActionBase.getAction("editCustomerRule"),ActionBase.getAction("copyCustomerRule")]},{xtype:"Pagingtoolbar",itemId:"pagingtoolbarID",store:"CustomerRentGridStoreId",dock:"bottom",items:[]}],initComponent:function(){var me=this;me.callParent(arguments),ActionBase.setTargetView(me.actionBaseName,me),ActionBase.updateActions(me.actionBaseName,me.getSelectionModel().getSelection())},loadGrid:function(isSearch){var me=this,store=me.getStore(),sessiontoken=store.getProxy().extraParams.sessiontoken;!sessiontoken||0==sessiontoken.length;var filter={};store.filterMap.each(function(key,value,length){filter[key]=value}),store.getProxy().extraParams.filter=Ext.JSON.encode(filter),store.getProxy().extraParams.refresh=1,store.loadPage(1),store.getProxy().extraParams.refresh=null,ActionBase.updateActions(me.actionBaseName,me.getSelectionModel().getSelection())}}),GridManager.CreateCustomerRentGrid=function(param){var tmpArr=[{text:"编号",dataIndex:"customer_rent_id",renderer:GlobalFun.UpdateRecord,width:100},{text:"合同名",dataIndex:"title",renderer:GlobalFun.UpdateRecord,width:100},{text:"租贷面积(平米)",dataIndex:"rent_area",renderer:GlobalFun.UpdateRecord,width:100},{text:"面积单量比",dataIndex:"area_to_order_number",renderer:GlobalFun.UpdateRecord,width:100},{text:"房租单价",dataIndex:"rent_pre_price",renderer:GlobalFun.UpdateRecord,width:100},{text:"开始日期",dataIndex:"date_start",renderer:GlobalFun.UpdateRecord,width:100},{text:"结束日期",dataIndex:"date_end",renderer:GlobalFun.UpdateRecord,width:100}];return GridManager.CustomerRentGrid=Ext.create("chl.gird.CustomerRentGrid",GridManager.BaseGridCfg("CustomerRentGrid","CustomerRentGridState",tmpArr)),param&&param.needLoad&&GridManager.CustomerRentGrid.loadGrid(),GridManager.CustomerRentGrid},GridManager.SetCustomerRentGridSelectionChangeEvent=function(param){GridManager.CustomerRentGrid.on("selectionchange",function(view,seles,op){!seles[0]})},ActionManager.editCustomerRule=function(target,record){var param={customer_rent_id:record.data.customer_rent_id,sessiontoken:GlobalFun.getSeesionToken()};WsCall.call(GlobalConfig.Controllers.CustomerGrid.GetCustomerRuleByRentId,"GetCustomerRuleByRentId",param,function(response,opts){var data=response.data;WindowManager.AddUpdateCustomerRuleWin=Ext.create("chl.Grid.AddUpdateCustomerRuleWin",{grid:target,iconCls:"editCustomerRule",record:record,action:"update",loaded:!1,title:"添加规则"}),WindowManager.AddUpdateCustomerRuleWin.show(null,function(){Ext.isGecko&&WindowManager.AddUpdateCustomerRuleWin.el.mask("正在加载图形"),WindowManager.AddUpdateCustomerRuleWin.loaded||GlobalFun.CreatChinaSvg(WindowManager.AddUpdateCustomerRuleWin.down("#fs_rule")),WindowManager.AddUpdateCustomerRuleWin.loaded=!0,GlobalFun.InitChinaSvgDataEvent(data,function(code){GlobalFun.CustomerRent_CreateRuleFun({myval:code})}),Ext.isGecko&&WindowManager.AddUpdateCustomerRuleWin.el.unmask(),WindowManager.AddUpdateCustomerRuleWin.down("#formId").loadRecord(record)})},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!0)},ActionManager.copyCustomerRule=function(target,record){GlobalConfig.newMessageBox.prompt("复制已有规则","请输入合同编号:",function(btn,text){if("ok"==btn){var param={rent_no_from:record.data.rent_no,rent_no_to:text,sessiontoken:GlobalFun.getSeesionToken()};WsCall.pcall(GlobalConfig.Controllers.CustomerRentGrid.copyRuleToRent,"copyRuleToRent",param,function(response,opts){response.data;Ext.Msg.alert("成功","复制成功.")},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!1)}})},Ext.define("chl.Grid.AddUpdateCustomerRuleWin",{extend:"Ext.window.Window",title:"添加",defaultFocus:"customer_rent_idItemId",iconCls:"",record:!1,closeAction:"hide",height:600,width:830,layout:"vbox",modal:!0,resizable:!1,items:[{xtype:"form",itemId:"formId",autoScroll:!0,height:580,width:810,border:!1,bodyPadding:5,defaultType:"displayfield",layout:{type:"table",columns:2},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100,maxLengthText:"最大长度为100"},items:[{name:"customer_rent_id",fieldLabel:"合同编号",itemId:"customer_rent_idItemId",validateOnBlur:!1,allowBlank:!1,blankText:"不能为空"},{name:"rent_area",fieldLabel:"租贷面积（平米）",itemId:"rent_areaItemId",validateOnBlur:!1,allowBlank:!1,blankText:"不能为空",regex:GlobalConfig.RegexController.regexNumber,regexText:"请输入数字"},{name:"area_to_order_number",fieldLabel:"面积单量比",itemId:"area_to_order_numberItemId",validateOnBlur:!1,allowBlank:!1,blankText:"不能为空",regex:GlobalConfig.RegexController.regexMoney2Fixed,regexText:"请输入数字"},{name:"rent_pre_price",fieldLabel:"房租单价",validateOnBlur:!1,allowBlank:!1,blankText:"不能为空",regex:GlobalConfig.RegexController.regexMoney2Fixed,regexText:"请输入数字"},{minValue:new Date,name:"date_start",format:"Y-m-d",fieldLabel:"开始时间",allowBlank:!1,blankText:"不能为空",itemId:"date_start",vtype:"daterange",endDateField:"date_end"},{minValue:new Date,name:"date_end",format:"Y-m-d",fieldLabel:"结束时间",allowBlank:!1,blankText:"不能为空",itemId:"date_end",vtype:"daterange",startDateField:"date_start"},{xtype:"container",colspan:2,title:"规则",itemId:"fs_rule",collapsible:!0,padding:"2 2 2 5",width:780,items:[],listeners:{boxready:function(com){}}}]}],buttons:[{text:"关闭",handler:function(){var me=this;me.up("window").close()}}]}),GlobalFun.CustomerRent_CreateRuleFun=function(com){var param={customer_rent_id:WindowManager.AddUpdateCustomerRuleWin.record.data.customer_rent_id,province_code:com.myval,sessiontoken:GlobalFun.getSeesionToken()};WsCall.call(GlobalConfig.Controllers.CustomerGrid.getCustomerRule,"GetCustomerRule",param,function(response,opts){function createRuleRow(rowData){var tempRuleItems=[];return Ext.Array.each(rowData,function(item,index,alls){var obj={};obj={xtype:"fieldset",legend:{xtype:"component",style:{height:40,"background-color":"red"}},title:'<font style="font-size:14px;">  [ 首重区间(kg): <font style="color:red;">'+item.weight_min+"-"+item.weight_max+"</font> ]</font>",width:770,collapsible:!0,layout:{type:"table",columns:2},defaults:{xtype:"displayfield",labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100,maxLengthText:"最大长度为100"},items:[{fieldLabel:"首重价格",value:item.weight_start_price,colspan:2},{fieldLabel:"续重重量(kg)",value:item.weight_pre},{fieldLabel:"续重价格",value:item.weight_pre_price},{fieldLabel:"记重方式",value:item.weight_price_type_name},{fieldLabel:"排序",value:item.sort_order},{xtype:"button",colspan:2,rule_id:item.item_id,width:100,margin:"0 0 0 630",text:"删除",handler:function(com){var rule_id=com.rule_id,param={item_id:rule_id,sessiontoken:GlobalFun.getSeesionToken()};WsCall.call(GlobalConfig.Controllers.CustomerGrid.delCustomerRule,"delCustomerRule",param,function(response,opts){com.up("fieldset").destroy()},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!0,!1,com.up("window").getEl())}}]},tempRuleItems.push(obj)}),tempRuleItems}var data=response.data;Ext.create("Ext.window.Window",{title:"添加规则("+GlobalConfig.Province[com.myval]+")",pid:com.myval,width:820,height:600,iconCls:"editCustomerRule",resizable:!1,action:"create",modal:!0,autoScroll:!0,layout:"vbox",bodyPadding:10,dockedItems:[{xtype:"container",dock:"top",border:!1,bodyPadding:15,layout:{type:"table",columns:2},defaultType:"textfield",defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100,maxLengthText:"最大长度为100"},items:[{xtype:"form",colspan:2,bodyPadding:15,itemId:"price_type1",height:280,width:810,layout:{type:"table",columns:2},items:[{xtype:"fieldset",title:"首重",width:780,colspan:2,layout:{type:"table",columns:2},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125},items:[{xtype:"numberfield",name:"weight_min",fieldLabel:"起始重量(kg)",minValue:0,value:0,decimalPrecision:2,maxValue:GlobalConfig.MaxLimit,allowBlank:!1,blankText:"不能为空"},{xtype:"numberfield",name:"weight_max",fieldLabel:"结束重量(kg)",minValue:0,value:1,maxValue:GlobalConfig.MaxLimit,decimalPrecision:2,allowBlank:!1,blankText:"不能为空"},{xtype:"numberfield",span:2,name:"weight_start_price",fieldLabel:"价格",decimalPrecision:2,minValue:0,value:0,maxValue:GlobalConfig.MaxLimit,regex:GlobalConfig.RegexController.regexMoney2Fixed,regexText:"请填写两位小数的数字",allowBlank:!1,blankText:"不能为空"}]},{xtype:"fieldset",title:"续重",width:780,layout:{type:"table",columns:2},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125},colspan:2,items:[{xtype:"numberfield",name:"weight_pre",fieldLabel:"重量(kg)",minValue:0,value:0,maxValue:GlobalConfig.MaxLimit,decimalPrecision:2,allowBlank:!1,blankText:"不能为空"},{xtype:"numberfield",name:"weight_pre_price",fieldLabel:"价格",decimalPrecision:2,minValue:0,value:0,maxValue:GlobalConfig.MaxLimit,allowBlank:!1,blankText:"不能为空"},{xtype:"fieldcontainer",colspan:2,fieldLabel:"记重方式",defaultType:"radiofield",layout:"hbox",defaults:{flex:1},items:[{boxLabel:"进位",checked:!0,name:"weight_price_type",inputValue:"0"},{boxLabel:"实重",name:"weight_price_type",inputValue:"1"}]}]},{fieldLabel:"排序",xtype:"numberfield",name:"sort_order",decimalPrecision:0,minValue:1,value:1},{xtype:"button",width:100,text:"添加",handler:function(com){var me=this,w=me.up("window"),form=w.down("#price_type1").getForm();if(form.isValid()){var url=GlobalConfig.Controllers.CustomerGrid.addCustomerRule;form.submit({url:url,params:{req:"dataset",dataname:"addCustomerRule",restype:"json",price_type:1,province_code:w.pid,action:w.action,customer_rent_id:WindowManager.AddUpdateCustomerRuleWin.record.data.customer_rent_id,sessiontoken:GlobalFun.getSeesionToken()},success:function(form,action){var data=action.result.data,arr=createRuleRow(data);w.removeAll(),w.add(arr)},failure:function(form,action){GlobalFun.errorProcess(action.result.code)||Ext.Msg.alert("失败",action.result.msg)}})}}}]}]}],items:[],listeners:{boxready:function(com){var tempRuleItems=createRuleRow(data);com.add(tempRuleItems)},beforehide:function(com){var param={customer_rent_id:WindowManager.AddUpdateCustomerRuleWin.record.data.customer_rent_id,sessiontoken:GlobalFun.getSeesionToken()};WsCall.call(GlobalConfig.Controllers.CustomerGrid.GetCustomerRuleByRentId,"GetCustomerRuleByRentId",param,function(response,opts){var data=response.data;Ext.isGecko&&WindowManager.AddUpdateCustomerRuleWin.el.mask("正在加载图形"),GlobalFun.InitChinaSvgDataEvent(data,function(code){GlobalFun.CustomerRent_CreateRuleFun({myval:code})}),Ext.isGecko&&WindowManager.AddUpdateCustomerRuleWin.el.unmask()},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!1)}},buttons:[{text:"退出",handler:function(){var me=this;me.up("window").close()}}]}).show()},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!1)};
//# sourceMappingURL=CustomerRentGrid.js.map