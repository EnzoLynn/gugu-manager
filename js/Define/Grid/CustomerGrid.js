//创建一个上下文菜单
var CustomerGrid_RightMenu = Ext.create('Ext.menu.Menu', {
    items: [ActionBase.getAction('refreshCustomer'), '-',
        ActionBase.getAction('searchCustomer'),
        ActionBase.getAction('addCustomer'), ActionBase.getAction('editCustomer'),
        '-', ActionBase.getAction('editCustomer_number'),
        ActionBase.getAction('addCustomerRent')

    ]
});


Ext.define('chl.gird.CustomerGrid', {
    alternateClassName: ['CustomerGrid'],
    alias: 'widget.CustomerGrid',
    extend: 'chl.grid.BaseGrid',
    store: 'CustomerGridStoreId',
    actionBaseName: 'CustomerGridAction',
    listeners: {
        itemclick: function(grid, record, hitem, index, e, opts) {
            var me = this;
        },
        itemdblclick: function(grid, record, hitem, index, e, opts) {
            ActionBase.getAction('editCustomer').execute();
        },
        itemcontextmenu: function(view, rec, item, index, e, opts) {
            e.stopEvent();

            CustomerGrid_RightMenu.showAt(e.getXY());
        },
        beforeitemmousedown: function(view, record, item, index, e, options) {
            var me = this;
        },
        selectionchange: function(view, seles, op) {
            if (!seles[0])
                return;
            ActionBase.updateActions('CustomerGridAction', seles);
        }
    },
    columns: [],
    dockedItems: [{
        xtype: 'toolbar',
        itemId: 'toolbarID',
        dock: 'top',
        layout: {
            overflowHandler: 'Menu'
        },
        items: [ActionBase.getAction('refreshCustomer'), '-',
            ActionBase.getAction('searchCustomer'),
            ActionBase.getAction('addCustomer'), ActionBase.getAction('editCustomer'), '-',
            ActionBase.getAction('editCustomer_number'), ActionBase.getAction('addCustomerRent')

            , '->', {
                fieldLabel: '按客户名查找',
                text: '按客户名查找', //用于控制工具栏使用
                width: 300,
                labelAlign: 'right',
                labelWidth: 80,
                xtype: 'searchfield',
                paramName: 'customer_name',
                //paramObject: true,
                //minLength: 6,
                //minLengthText: '请输入6位编码',
                //maxLength: 6,
                //maxLengthText: '请输入6位编码',
                //paramNameArr: ['Area', 'Row', 'Column'],
                //store: searchStore,
                itemId: 'CustomerGridSearchfieldId',
                listeners: {
                    render: function() {
                        var me = this;
                        me.store = GridManager.CustomerGrid.getStore();
                    }
                }
            }
        ]
    }, {
        xtype: 'Pagingtoolbar',
        itemId: 'pagingtoolbarID',
        store: 'CustomerGridStoreId',
        dock: 'bottom',
        items: []
    }],
    initComponent: function() {
        var me = this;
        var filter = '';
        me.callParent(arguments); // 调用父类方法

        ActionBase.setTargetView(me.actionBaseName, me);
        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    },
    loadGrid: function(isSearch) {
        var me = this;
        var store = me.getStore();


        var sessiontoken = store.getProxy().extraParams.sessiontoken;
        if (!sessiontoken || sessiontoken.length == 0) {
            //return;
        }
        var filter = {};

        store.filterMap.each(function(key, value, length) {
            filter[key] = value;
        });
        store.getProxy().extraParams.filter = Ext.JSON.encode(filter);

        store.getProxy().extraParams.refresh = 1;

        store.loadPage(1);
        store.getProxy().extraParams.refresh = null;
        GlobalFun.SetGridTitle(me.up('#centerGridDisplayContainer'), store, "客户列表");
        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    }
});


//根据传入参数创建客户表，返回自身
GridManager.CreateCustomerGrid = function(param) {
    var tmpArr = [{
        text: '编号',
        dataIndex: 'customer_id',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '客户名',
        dataIndex: 'customer_name',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '客户编号',
        dataIndex: 'customer_no',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '圆通商家代码',
        dataIndex: 'yto_no',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '手机号',
        dataIndex: 'mobile',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '房租单价',
        dataIndex: 'rent_area',
        renderer: GlobalFun.UpdateRecord,
        width: 100,
        hidden: true,
        groupable: false,
        sortable: false
    }, {
        text: '面积单量比',
        dataIndex: 'area_to_order_number',
        renderer: GlobalFun.UpdateRecord,
        width: 100,
        hidden: true,
        groupable: false,
        sortable: false
    }, {
        text: '房租单价',
        dataIndex: 'rent_pre_price',
        renderer: GlobalFun.UpdateRecord,
        width: 100,
        hidden: true,
        groupable: false,
        sortable: false
    }, {
        text: '开始日期',
        dataIndex: 'date_start',
        renderer: GlobalFun.UpdateRecord,
        width: 100,
        hidden: true,
        groupable: false,
        sortable: false
    }, {
        text: '结束日期',
        dataIndex: 'date_end',
        renderer: GlobalFun.UpdateRecord,
        width: 100,
        hidden: true,
        groupable: false,
        sortable: false
    }];
    GridManager.CustomerGrid = Ext.create('chl.gird.CustomerGrid',
        GridManager.BaseGridCfg('CustomerGrid', 'CustomerGridState', tmpArr));
    if (param && param.needLoad) {
        GridManager.CustomerGrid.loadGrid();
    }
    return GridManager.CustomerGrid;
};


//加载SelectionChange事件
GridManager.SetCustomerGridSelectionChangeEvent = function(param) {
    GridManager.CustomerGrid.on('selectionchange', function(view, seles, op) {
        if (!seles[0])
            return;

    });
};
//添加客户编辑
Ext.define('chl.Grid.AddUpdateCustomerWin', {
    extend: 'Ext.window.Window',
    title: "添加",
    defaultFocus: 'customer_nameItemId',
    iconCls: '',
    record: false,
    //border: false,
    height: 160,
    width: 830,
    layout: 'vbox',
    modal: true,
    resizable: false,
    items: [{
        xtype: 'form',
        itemId: 'formId',
        autoScroll: true,
        height: 450,
        width: 820,
        border: false,
        bodyPadding: 15,
        defaultType: 'textfield',
        layout: {
            type: 'table',
            columns: 2
        },
        defaults: {
            labelAlign: 'right',
            labelPad: 15,
            width: 340,
            labelWidth: 125,
            maxLength: 36,
            enableKeyEvents: true,
            listeners: {
                keydown: function(field, e, opts) {
                    var me = this;
                    if (e.getKey() == e.ENTER) {

                        var win = me.up('window');
                        win.down('#submit').fireHandler(e);
                    }
                }
            }
        },
        items: [{
            name: 'customer_name',
            fieldLabel: '客户名',
            itemId: 'customer_nameItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空'
        }, {
            name: 'customer_no',
            fieldLabel: '客户编号',
            itemId: 'customer_noItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空'
        }, {
            name: 'yto_no',
            fieldLabel: '圆通商家代码', 
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空'
        }, {
            name: 'mobile',
            fieldLabel: '手机号',
            itemId: 'mobileItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空'
        }]
    }],
    buttons: [{
        text: '重置',
        handler: function() {
            var me = this;
            var w = me.up('window');
            var f = w.down('#formId');
            f.getForm().reset();
            if (w.action == 'update') {
                var sm = w.grid.getSelectionModel();
                if (sm.hasSelection()) {
                    f.getForm().loadRecord(sm.getSelection()[0]);
                }
            }
        }
    }, {
        text: '确定',
        itemId: 'submit',
        handler: function() {
            var me = this;
            var w = me.up('window');

            var form = w.down('#formId').getForm();

            if (form.isValid()) {

                var url = w.action == "create" ? GlobalConfig.Controllers.CustomerGrid.addCustomer : GlobalConfig.Controllers.CustomerGrid.updateCustomer;
                form.submit({
                    url: url,
                    params: {
                        req: 'dataset',
                        dataname: 'AddUpdateCustomer', // dataset名称，根据实际情况设置,数据库名
                        restype: 'json',
                        customer_id: w.record ? w.record.data.customer_id : 0,
                        Id: w.record ? w.record.data.ControllTid : 0,
                        logId: w.record ? w.record.data.Id : 0,
                        action: w.action,
                        sessiontoken: GlobalFun.getSeesionToken()
                    },
                    success: function(form, action) {
                        w.grid.loadGrid();
                        w.close();

                    },
                    failure: function(form, action) {
                        if (!GlobalFun.errorProcess(action.result.code)) {
                            Ext.Msg.alert('失败', action.result.msg);
                        }
                    }
                });
            }
        }
    }, {
        text: '取消',
        handler: function() {
            var me = this;
            me.up('window').close();
        }
    }]
});






// 添加合同
Ext.define('chl.Grid.AddUpdateCustomerRentWin', {
    extend: 'Ext.window.Window',
    title: "添加",
    defaultFocus: 'customer_nameItemId',
    iconCls: '',
    record: false,
    //border: false,
    height: 650,
    width: 830,
    layout: 'vbox',
    modal: true,
    resizable: false,
    bodyPadding: 5,
    items: [{
        xtype: 'form',
        itemId: 'formId',
        autoScroll: true,
        height: 200,
        width: 810,
        border: false,
        bodyPadding: 5,
        defaultType: 'textfield',
        layout: {
            type: 'table',
            columns: 2
        },
        defaults: {
            labelAlign: 'right',
            labelPad: 15,
            width: 340,
            labelWidth: 125,
            maxLength: 100
        },
        items: [{
            name: 'customer_name',
            xtype: 'displayfield',
            fieldLabel: '客户名',
            itemId: 'customer_nameItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空'
        }, {
            name: 'mobile',
            fieldLabel: '手机号',

            xtype: 'displayfield',
            itemId: 'mobileItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空'
        }, {
            name: 'rent_no',
            fieldLabel: '合同编号',  
            allowBlank: false,
            blankText: '不能为空', 
            maxLength: 64
        }, {
            name: 'title',
            fieldLabel: '标题',  
            maxLength: 64
        }, {
            name: 'rent_area',
            fieldLabel: '租贷面积（平米）',
            itemId: 'rent_areaItemId', 
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字',
            maxLength: 6
        }, {
            name: 'area_to_order_number',
            fieldLabel: '面积单量比',
            itemId: 'area_to_order_numberItemId', 
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexMoney2Fixed,
            regexText: '请输入数字'
        }, {
            name: 'rent_pre_price',
            fieldLabel: '房租单价', 
            colspan: 2,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexMoney2Fixed,
            regexText: '请输入数字'
        }, {
            xtype: 'datefield',
            name: 'date_start',
            format: 'Y-m-d',
            fieldLabel: '开始时间',
            allowBlank: false,
            blankText: '不能为空',
            itemId: 'date_start',
            vtype: 'daterange',
            endDateField: 'date_end'
        }, {
            xtype: 'datefield',
            name: 'date_end',
            format: 'Y-m-d',
            fieldLabel: '结束时间',
            allowBlank: false,
            blankText: '不能为空',
            itemId: 'date_end',
            vtype: 'daterange',
            startDateField: 'date_start'
        }, {
            xtype: 'button',
            colspan: 2,
            width: 100,
            margin: '0 0 0 600',
            text: '添加',
            handler: function(com) {
                var me = this;
                var w = me.up('window');

                var form = w.down('#formId').getForm();

                if (form.isValid()) {

                    var url = GlobalConfig.Controllers.CustomerGrid.addCustomerRent;
                    form.submit({
                        url: url,
                        params: {
                            req: 'dataset',
                            dataname: 'addCustomerRent', // dataset名称，根据实际情况设置,数据库名
                            restype: 'json',
                            customerId: w.cid,
                            action: w.action,
                            sessiontoken: GlobalFun.getSeesionToken()
                        },
                        success: function(form, action) {
                            w.down('CustomerRentGrid').loadGrid();
                            //w.grid.loadGrid();
                            //w.close();

                        },
                        failure: function(form, action) {
                            if (!GlobalFun.errorProcess(action.result.code)) {
                                Ext.Msg.alert('失败', action.result.msg);
                            }
                        }
                    });
                }
            }
        },{
            xtype:'label',
            colspan:2,
            style:{
                color:'red'
            },
            text:'注：如客户存在多个租赁房间，添加合同时需要将多个房间面积相加后，再添加合同。多个房间对应的单量比和房租单价必须一致。每个客户只有最新添加的合同处于生效状态。'
        }, {
            name: 'customer_id',
            xtype: 'hidden'
        }]
    }, {
        xtype: 'CustomerRentGrid',
        margin: '5 0 0 0',
        width: 810,
        height: 370
    }],
    buttons: [{
        text: '关闭',
        handler: function() {
            var me = this;
            me.up('window').close();
        }
    }],
    listeners: {
        beforehide: function(com) {
            WindowManager.AddUpdateCustomerRentWin.grid.store.load({
                scope: this,
                callback: function(records, operation, success) {
                    var record = WindowManager.AddUpdateCustomerRentWin.record;
                    Ext.Array.each(records, function(item, index) {
                        if (record.data.customer_id == item.data.customer_id) {
                            record = item;
                            return false;
                        };
                    });

                    var sm = WindowManager.AddUpdateCustomerRentWin.grid.getSelectionModel();
                    sm.select(record);

                }
            });


        }
    }
});
