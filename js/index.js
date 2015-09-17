Ext.onReady(function() {

    

    Ext.getBody().mask('正在加载...');
    //修正Bug
    GlobalFun.fixedBugs();

   

    //创建Cookie状态保存  
    Ext.state.Manager.setProvider(Ext.create('Ext.state.CookieProvider', {
        expires: new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 30))
    }));
    //初始化快捷提示
    Ext.tip.QuickTipManager.init();
    //获取当前登录用户信息
    var LoadCurrUserInfo = function(callBack) {
        //获取当前登录用户信息
        var param = {
            sessiontoken: GlobalFun.getSeesionToken()
        };
        // 调用
        WsCall.pcall(GlobalConfig.Controllers.User.GetCurrUserInfo, 'GetCurrUserInfo', param, function(response, opts) {
             GlobalConfig.CurrUserInfo = response.data;
            Ext.util.Cookies.set("login_sessiontoken", GlobalConfig.CurrUserInfo.session_token,
                                    new Date(new Date().getTime()
                                            + (1000 * 60 * 60 * 24 * 30)));
            callBack();
        }, function(response, opts) {

            if (!GlobalFun.errorProcess(response.code)) {
                Ext.Msg.alert('登录失败', response.msg);
            }
        }, false);
    };
    //创建主数据界面
    var LoadMainView = function() {

        if (GlobalConfig.CurrUserInfo == '') {
            Ext.Msg.alert('登录失败', '登录失败！无效的登录信息', function() {
                GlobalFun.ReDirectUrl("login.html");
            });
            return;
        }


        //创建Df表格
        GridManager.ManageDfGrid = Ext.create('chl.dfgrid.ManageDfGrid');
        var roleArr = [
            ['001', '客户管理'],
            ['002', 'yy管理']
        ];
        GridManager.ManageDfGrid.getStore().loadData(roleArr);


        //创建测试表格
        // GridManager.CreateTestGrid({
        //     needLoad: false
        // });
        // GridManager.SetTestGridSelectionChangeEvent();

        //创建客户管理表格
        // GridManager.CreateCustomerRentGrid({
        //     needLoad: false
        // });
        // GridManager.SetCustomerRentGridSelectionChangeEvent();
        GridManager.CreateCustomerGrid({
            needLoad: false
        });
        GridManager.SetCustomerGridSelectionChangeEvent();
        //创建票号 票据 表格
        //Tracking_number
        GridManager.CreateTracking_numberGrid({
            needLoad: false
        });
        GridManager.SetTracking_numberGridSelectionChangeEvent();
        //创建快递网点
        //Tracking_number
        GridManager.CreateExpress_pointGrid({
            needLoad: false
        });
        GridManager.SetExpress_pointGridSelectionChangeEvent();

        //成本默认容器
        GridManager.CreateExpressPanel();
        GridManager.CreateCompanyPanel_Cost();
         //成本默认容器 
        GridManager.CreateCompanyPanel_Point();

         //创建面单号管理表格
        GridManager.CreateCustomer_number_allGrid({
            needLoad: false
        });
        GridManager.SetCustomer_number_allGridSelectionChangeEvent();

        //创建主目录树
        TreeManager.CreateMainItemListTree({
            needLoad: false
        });
        TreeManager.SetMainItemListTreeSelectionChangeEvent();



        GlobalConfig.ViewPort = Ext.create('Ext.container.Viewport', {
            layout: {
                type: 'border'
            },
            defaults: {
                split: true,
                collapsible: true
            },
            items: [{
                region: 'north',
                title: '公告栏',
                //stateId: 'northStateId',
                stateful: false,
                collapsed: true,
                height: 100,
                items: [{
                    xtype: 'container',
                    html: '暂无公告'
                }]
            }, {
                region: 'west',
                stateId: 'westStateId',
                stateful: true,
                iconCls: 'home',
                preventHeader: true,
                title: '管理菜单',
                layout: {
                    type: 'accordion',
                    animate: false,
                    activeOnTop: false,
                    collapseFirst: false,
                    titleCollapse: true
                },
                width: 200,
                listeners: {
                    boxready: function(com, width, height, opts) {
                        var treeArr = [];
                        treeArr.push(TreeManager.MainItemListTree);
                        com.add(treeArr);

                    }
                },
                items: []
            }, {
                region: 'center',
                stateId: 'centerStateId',
                stateful: true,
                //title: '主显示区域',
                collapsible: false,
                layout: {
                    type: 'border'
                },
                defaults: {
                    split: true,
                    collapsible: true,
                    border: false
                },
                items: [{
                    region: 'center',
                    stateId: 'centercenterStateId',
                    stateful: true,
                    collapsible: false,
                    itemId: 'centerGridDisplayContainer',
                    title: '信息',
                    layout: 'card',
                    height: 400,
                    listeners: {
                        boxready: function(com, width, height, opts) {
                            var gridArr = [];
                            gridArr.push(GridManager.ManageDfGrid);
                            //gridArr.push(GridManager.TestGrid);
                            gridArr.push(GridManager.CustomerGrid);
                            gridArr.push(GridManager.Tracking_numberGrid);
                            gridArr.push(GridManager.ExpressPanel);
                            gridArr.push(GridManager.CompanyPanel_Cost);                            
                            gridArr.push(GridManager.Express_pointGrid);
                            gridArr.push(GridManager.CompanyPanel_Point); 
                            gridArr.push(GridManager.Customer_number_allGrid);
                            com.add(gridArr);
                        }
                    },
                    items: []
                }, {
                    region: 'south',
                    stateId: 'centersouthStateId',
                    itemId: 'centerGridDetailContainer',
                    stateful: true,
                    //title: '详情',
                    preventHeader: true,
                    height: 200,
                    collapsed: true,
                    bodyBoder: false,
                    xtype: 'tabpanel',
                    frame: false,
                    border: false,
                    defaults: {
                        border: false
                    },
                    items: [{
                        title: '详细信息',
                        layout: 'auto',
                        itemId: 'southTab1',
                        autoScroll: true,
                        items: [{
                            xtype: 'container',
                            width: 800,
                            html: "留待开发..."
                        }]
                    }, {
                        title: '介绍',
                        autoScroll: true,
                        itemId: 'southTab2',
                        padding: '5px 5px 5px 20px',
                        items: [{
                            xtype: 'container',
                            width: 800,
                            html: "留待开发..."
                        }]
                    }]
                }]
            }, {
                region: 'south',
                stateId: 'southStateId',
                stateful: false,
                height: 30,
                xtype: 'toolbar',
                split: false,
                collapsible: false,
                items: ['->', '-',{
                    xtype:'button',
                    width: 120,
                    iconCls: 'about',
                    text: '关于(Version 9.17)',
                    tooltip: '关于本系统',
                    handler:function(){
                        Ext.Msg.alert('关于本系统(Version 9.17)','Designed by Enzo&YiHui. <br> Copyright © 2015-xxxx  gugu123.com 版权所有');
                    }
                }, '-',{
                    xtype: 'button',
                    width: 80,
                    iconCls: 'logout',
                    text: '退出登录',
                    tooltip: '退出登录当前用户',
                    handler: function() {
                        GlobalConfig.newMessageBox.confirm('退出登录', '确定要退出登录当前用户吗?', function(btn) {
                            if (btn == 'yes') {
                                var param = {};
                                // 调用
                                WsCall.call(GlobalConfig.Controllers.User.UserLoginOut, 'UserLoginOut', param, function(response, opts) {
                                    Ext.util.Cookies.clear("login_sessiontoken");
                                    //跳转页面
                                    Ext.getBody().mask("请稍候...");
                                    (new Ext.util.DelayedTask()).delay(20, function() {
                                        GlobalFun.ReDirectUrl("login.html");
                                    });
                                }, function(response, opts) {
                                    if (!GlobalFun.errorProcess(response.code)) {
                                        Ext.Msg.alert('注销失败', response.msg);
                                    }
                                }, false);
                            }

                        });
                    }
                }]
            }]
        });
    };
    //计数器
    var ComboSucCount = 0,
        ComboSucTotal = 1;
    //计数器回调方法
    var combInitCallBack = function(records, operation, success) {
        if (success) {
            ComboSucCount++;
            if (ComboSucCount == ComboSucTotal) {
                //获取当前登录用户信息
                LoadCurrUserInfo(function() {
                    LoadMainView();
                    GlobalFun.Heartbeat();
                    (new Ext.util.DelayedTask()).delay(200, function() {
                        Ext.getBody().unmask();
                    });

                });
            }
        }
    };

    //加载基础数据
    var LoadBaseEnumStore = function() {
        //列Sotre
        //StoreManager.ComboStore.ColumnStore.load(combInitCallBack);
        combInitCallBack(null, null, true);
    };

    LoadBaseEnumStore();

    GlobalFun.JsonToArray(GlobalConfig.Province);

});
