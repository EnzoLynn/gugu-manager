Ext.onReady(function(){var win=Ext.create("Ext.window.Window",{title:"登录",layout:{type:"table",columns:1},bodyPadding:20,defaults:{xtype:"textfield",labelAlign:"right",labelPad:15,width:340,labelWidth:125,maxLength:100,maxLengthText:"最大长度为100"},items:[{fieldLabel:"用户名",itemId:"admin_name",allowBlank:!1,blankText:"用户名不能为空",enableKeyEvents:!0,listeners:{keydown:function(field,e,opts){e.getKey()==e.ENTER&&win.down("#Login").fireEvent("click")}}},{fieldLabel:"密码",xtype:"MyPasswordField",enableKeyEvents:!0,allowBlank:!1,blankText:"用户名不能为空",itemId:"admin_pwd",listeners:{keydown:function(field,e,opts){e.getKey()==e.ENTER&&win.down("#Login").fireEvent("click")}}},{xtype:"button",itemId:"Login",text:"登录",listeners:{click:function(){if(win.down("#admin_name").isValid()&&win.down("#admin_pwd").isValid()){var param={admin_name:win.down("#admin_name").getValue(),admin_pwd:win.down("#admin_pwd").getValue()};WsCall.pcall(GlobalConfig.Controllers.User.GetCurrUserInfo,"GetCurrUserInfo",param,function(response,opts){GlobalConfig.CurrUserInfo=response.data[0],GlobalFun.ReDirectUrl("index.html")},function(response,opts){GlobalFun.errorProcess(response.code)||Ext.Msg.alert("获取用户失败",response.msg)},!0,!1,win.el)}}}}]});win.show(null,function(){win.down("#admin_name").focus(null,500)})});
//# sourceMappingURL=login.js.map