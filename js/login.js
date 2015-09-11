 Ext.onReady(function() {
     var win = Ext.create('Ext.window.Window', {
         title: '登录',
         layout: {
             type: 'table',
             columns: 1
         },
         bodyPadding: 20,
         defaults: {
             xtype: 'textfield',
             labelAlign: 'right',
             labelPad: 15,
             width: 340,
             labelWidth: 125,
             maxLength: 100,
             maxLengthText: '最大长度为100'
         },
         items: [{
             fieldLabel: '用户名',
             itemId: 'admin_name',
             allowBlank: false,
             blankText: '用户名不能为空',
             enableKeyEvents: true,
             listeners: {
                 keydown: function(field, e, opts) {
                     if (e.getKey() == e.ENTER) {
                         win.down('#Login').fireEvent("click");
                     }
                 }
             }
         }, {
             fieldLabel: '密码',
             xtype:'textfield',//'MyPasswordField',
             inputType:'password',
             enableKeyEvents: true,
             allowBlank: false,
             blankText: '用户名不能为空',
             itemId: 'admin_pwd',
             listeners: {
                 keydown: function(field, e, opts) {
                     if (e.getKey() == e.ENTER) {
                         win.down('#Login').fireEvent("click");
                     }
                 }
             }
         }, {
             xtype: 'button',
             itemId: 'Login',
             text: '登录',
             listeners: {
                 click: function() {
                     if (!win.down('#admin_name').isValid() || !win.down('#admin_pwd').isValid()) {
                         return;
                     };
                     //获取当前登录用户信息
                     var param = {
                         admin_name: win.down('#admin_name').getValue(),
                         admin_pwd: win.down('#admin_pwd').getValue()
                     };
                     // 调用
                     WsCall.pcall(GlobalConfig.Controllers.User.GetCurrUserInfo, 'GetCurrUserInfo', param, function(response, opts) {
                         GlobalConfig.CurrUserInfo = response.data;
                         //console.log(GlobalConfig.CurrUserInfo);
                         Ext.util.Cookies.set("login_sessiontoken", GlobalConfig.CurrUserInfo.session_token,
                                    new Date(new Date().getTime()
                                            + (1000 * 60 * 60 * 24 * 30)));
                         GlobalFun.ReDirectUrl("index.html");
                     }, function(response, opts) {
                         if (!GlobalFun.errorProcess(response.code)) {
                             Ext.Msg.alert('获取用户失败', response.msg);
                         }
                     }, true, false, win.el);
                 }
             }
         }]
     });
     win.show(null, function() {
         win.down('#admin_name').focus(null, 500);
     })
 });
