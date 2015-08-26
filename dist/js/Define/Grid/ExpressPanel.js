Ext.define("chl.panel.ExpressPanel",{alternateClassName:["ExpressPanel"],alias:"widget.ExpressPanel",extend:"Ext.panel.Panel",itemId:"ExpressPanel"}),GridManager.CreateExpressPanel=function(){var items=[];for(key in GlobalConfig.Province)items.push({title:GlobalConfig.Province[key],code:key,layout:"hbox",items:[{xtype:"label",text:"现有规则:0",itemId:"lbl"+key},{xtype:"button",text:"添加规则",myval:key,handler:function(com){var sel=TreeManager.MainItemListTree.getSelectionModel().getSelection()[0],param={express_id:sel.data.express_id,province_code:com.myval,sessiontoken:GlobalFun.getSeesionToken()};WsCall.call(GlobalConfig.Controllers.ExpressPanel.GetExpressRule,"GetExpressRule",param,function(response,opts){var data=response.data;Ext.create("Ext.window.Window",{title:"添加规则("+GlobalConfig.Province[com.myval]+")",pid:com.myval,width:820,height:700,resizable:!1,action:"create",modal:!0,autoScroll:!0,layout:"vbox",bodyPadding:10,dockedItems:[{xtype:"container",dock:"top",border:!1,bodyPadding:15,layout:{type:"table",columns:2},defaultType:"textfield",defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100},items:[{xtype:"fieldcontainer",colspan:2,fieldLabel:"计价方式",defaultType:"radiofield",layout:"hbox",defaults:{flex:1},items:[{boxLabel:"固定价格",checked:!0,itemId:"rd_price0",name:"price_type",inputValue:"0",listeners:{change:function(com,nval,oval,opts){var me=this,win=me.up("window");nval?(win.down("#price_type0").show(),win.down("#price_type1").hide()):(win.down("#price_type1").show(),win.down("#price_type0").hide())}}},{boxLabel:"步进价格",itemId:"rd_price1",name:"price_type",inputValue:"1"}]},{xtype:"form",itemId:"price_type0",height:100,width:810,bodyPadding:15,layout:{type:"table",columns:2},defaults:{labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100,maxLengthText:"最大长度为100"},items:[{xtype:"numberfield",name:"weight_min",fieldLabel:"起始重量(kg)",minValue:0,value:0,decimalPrecision:3,maxValue:GlobalConfig.MaxLimit,allowBlank:!1,blankText:"不能为空"},{xtype:"numberfield",name:"weight_min_price",fieldLabel:"结束重量(kg)",minValue:0,value:1,maxValue:GlobalConfig.MaxLimit,decimalPrecision:3,allowBlank:!1,blankText:"不能为空"},{xtype:"numberfield",span:2,name:"weight_min_price",fieldLabel:"价格",decimalPrecision:2,minValue:0,maxValue:GlobalConfig.MaxLimit,regex:GlobalConfig.RegexController.regexMoney2Fixed,regexText:"请填写两位小数的数字",allowBlank:!1,blankText:"不能为空"},{fieldLabel:"排序",xtype:"numberfield",name:"sort_order",decimalPrecision:0,minValue:1,value:1},{xtype:"button",itemId:"btn_add",colspan:2,margin:"0 0 0 580",width:100,text:"添加",handler:function(com){var me=this,w=me.up("window"),form=w.down("#price_type0").getForm();if(form.isValid()){var url=GlobalConfig.Controllers.CustomerGrid.addCustomerRule;form.submit({url:url,params:{req:"dataset",dataname:"addCustomerRule",restype:"json",price_type:0,province:w.pid,action:w.action,sessiontoken:GlobalFun.getSeesionToken()},success:function(form,action){},failure:function(form,action){GlobalFun.errorProcess(action.result.code)||Ext.Msg.alert("失败",action.result.msg)}})}}}]}]}],items:[],listeners:{boxready:function(com){var tempRuleItems=[];Ext.Array.each(data,function(item,index,alls){var obj={};obj="0"==item.price_type?{xtype:"fieldset",collapsible:!0,title:"固定价格",width:770,layout:{type:"table",columns:2},defaults:{xtype:"displayfield",labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100,maxLengthText:"最大长度为100"},items:[{fieldLabel:"起价",value:item.price_start},{fieldLabel:"后续单价",value:item.price_pre},{xtype:"button",rule_id:item.rule_id,colspan:2,width:100,margin:"0 0 0 630",text:"删除",handler:function(com){var rule_id=com.rule_id,param={rule_id:rule_id,sessiontoken:GlobalFun.getSeesionToken()};WsCall.call(GlobalConfig.Controllers.CustomerGrid.delCustomerRule,"delCustomerRule",param,function(response,opts){GlobalConfig.CurrUserInfo=response.data[0],callBack()},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!0,!1,com.up("window").getEl())}}]}:{xtype:"fieldset",title:"步进价格",width:770,collapsible:!0,items:[{xtype:"fieldset",title:"首重",layout:{type:"table",columns:2},defaults:{xtype:"displayfield",labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100,maxLengthText:"最大长度为100"},items:[{fieldLabel:"起始重量(kg)",value:item.weight_min},{fieldLabel:"结束重量(kg)",value:item.weight_max},{fieldLabel:"价格",value:item.weight_start_price,colspan:2}]},{xtype:"fieldset",title:"续重",layout:{type:"table",columns:2},defaults:{xtype:"displayfield",labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100,maxLengthText:"最大长度为100"},items:[{fieldLabel:"重量(kg)",value:item.weight_pre},{fieldLabel:"价格",value:item.weight_pre_price},{fieldLabel:"记重方式",colspan:2,value:item.weight_price_type}]},{xtype:"button",colspan:2,rule_id:item.rule_id,width:100,margin:"0 0 0 630",text:"删除",handler:function(com){var rule_id=com.rule_id,param={rule_id:rule_id,sessiontoken:GlobalFun.getSeesionToken()};WsCall.call(GlobalConfig.Controllers.CustomerGrid.delCustomerRule,"delCustomerRule",param,function(response,opts){GlobalConfig.CurrUserInfo=response.data[0],callBack()},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!0,!1,com.up("window").getEl())}}]},tempRuleItems.push(obj)}),com.add(tempRuleItems)},beforehide:function(com){var param={express_id:sel.data.express_id,sessiontoken:GlobalFun.getSeesionToken()};WsCall.call(GlobalConfig.Controllers.ExpressPanel.GetCustomer_numberCount,"GetCustomer_numberCount",param,function(response,opts){var data=response.data;Ext.Array.each(data,function(item,index,alls){var temp=GridManager.ExpressPanel.down("#lbl"+item.key);temp.setText("现有规则:"+item.count)})},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!1)}},buttons:[{text:"退出",handler:function(){var me=this;me.up("window").close()}}]}).show()},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!0)}}]});return GridManager.ExpressPanel=Ext.create("chl.panel.ExpressPanel",{bodyPadding:15,autoScroll:!0,layout:{type:"table",columns:2},defaults:{xtype:"fieldset",width:400,margin:"10 10 10 10"},items:items}),GridManager.ExpressPanel};
//# sourceMappingURL=ExpressPanel.js.map