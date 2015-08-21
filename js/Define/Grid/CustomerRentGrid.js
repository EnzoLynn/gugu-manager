 

Ext.define('chl.gird.CustomerRentGrid', {
    alternateClassName: ['CustomerRentGrid'],
    alias: 'widget.CustomerRentGrid',
    extend: 'chl.grid.BaseGrid',
    store: 'CustomerRentGridStoreId',
    stateful: false,
    actionBaseName: 'CustomerRentGridAction',
    listeners: {
        itemclick: function(grid, record, hitem, index, e, opts) {
            var me = this;
        },
        itemdblclick: function(grid, record, hitem, index, e, opts) { 
        },
        itemcontextmenu: function(view, rec, item, index, e, opts) {
            e.stopEvent();

            CustomerRentGrid_RightMenu.showAt(e.getXY());
        },
        beforeitemmousedown: function(view, record, item, index, e, options) {
            var me = this;
        },
        selectionchange: function(view, seles, op) {
            if (!seles[0])
                return;
            //ActionBase.updateActions('CustomerRentGridAction', seles);
        }
    },
    columns: [{
        text: '编号',
        dataIndex: 'customer_rent_id',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '合同名',
        dataIndex: 'title',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '租贷面积(平米)',
        dataIndex: 'rent_area',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '面积单量比',
        dataIndex: 'area_to_order_number',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '房租单价',
        dataIndex: 'rent_pre_price',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '开始日期',
        dataIndex: 'date_start',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '结束日期',
        dataIndex: 'date_end',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }],
    dockedItems: [{
        xtype: 'toolbar',
        itemId: 'toolbarID',
        dock: 'top',
        layout: {
            overflowHandler: 'Menu'
        },
        items: [ActionBase.getAction('refreshCustomerRent'),
            ActionBase.getAction('addCustomerRent'), ActionBase.getAction('editCustomerRent'), ActionBase.getAction('addCustomerRentRent'), ActionBase.getAction('editCustomerRentRule')
        ]
    }, {
        xtype: 'Pagingtoolbar',
        itemId: 'pagingtoolbarID',
        store: 'CustomerRentGridStoreId',
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

        store.pageSize = GlobalConfig.GridPageSize;
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

        //ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    }
});


//根据传入参数创建客户表，返回自身
GridManager.CreateCustomerRentGrid = function(param) {
    var tmpArr = [{
        text: '编号',
        dataIndex: 'customer_rent_id',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '合同名',
        dataIndex: 'title',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '租贷面积(平米)',
        dataIndex: 'rent_area',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '面积单量比',
        dataIndex: 'area_to_order_number',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '房租单价',
        dataIndex: 'rent_pre_price',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '开始日期',
        dataIndex: 'date_start',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '结束日期',
        dataIndex: 'date_end',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }];
    GridManager.CustomerRentGrid = Ext.create('chl.gird.CustomerRentGrid',
        GridManager.BaseGridCfg('CustomerRentGrid', 'CustomerRentGridState', tmpArr));
    if (param && param.needLoad) {
        GridManager.CustomerRentGrid.loadGrid();
    }
    return GridManager.CustomerRentGrid;
};


//加载SelectionChange事件
GridManager.SetCustomerRentGridSelectionChangeEvent = function(param) {
    GridManager.CustomerRentGrid.on('selectionchange', function(view, seles, op) {
        if (!seles[0])
            return;

    });
};
//添加客户编辑
Ext.define('chl.Grid.AddUpdateCustomerRentWin', {
    extend: 'Ext.window.Window',
    title: "添加",
    defaultFocus: 'CustomerRentItemId',
    iconCls: '',
    record: false,
    //border: false,
    height: 500,
    width: 830,
    layout: 'vbox',
    modal: true,
    resizable: false,
    items: [{
        xtype: 'form',
        itemId: 'formId',
        autoScroll: true,
        height: 450,
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
            maxLength: 100,
            maxLengthText: '最大长度为100'
        },
        items: [{
            name: 'CustomerRent_name',
            fieldLabel: '客户名',
            itemId: 'CustomerRent_nameItemId',
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
        }, {
            name: 'customize_number_from',
            fieldLabel: '发放面单号开始',
            itemId: 'customize_number_fromItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }, {
            name: 'customize_number_to',
            fieldLabel: '发放面单号结束',
            itemId: 'customize_number_toItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }, {
            name: 'rent_area',
            fieldLabel: '租贷面积（平米）',
            itemId: 'rent_areaItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }, {
            name: 'area_to_order_number',
            fieldLabel: '面积单量比',
            itemId: 'area_to_order_numberItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexMoney2Fixed,
            regexText: '请输入数字'
        }, {
            name: 'rent_pre_price',
            fieldLabel: '房租单价',
            validateOnBlur: false,
            colspan: 2,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexMoney2Fixed,
            regexText: '请输入数字'
        }, {
            xtype: 'datefield',
            minValue: new Date(),
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
            minValue: new Date(),
            name: 'date_end',
            format: 'Y-m-d',
            fieldLabel: '结束时间',
            allowBlank: false,
            blankText: '不能为空',
            itemId: 'date_end',
            vtype: 'daterange',
            startDateField: 'date_start'
        }, {
            xtype: 'fieldset',
            colspan: 2,
            title: '规则',
            itemId: 'fs_rule',
            collapsible: true,
            padding: '2 2 2 5',
            width: 780,
            defaults: {
                labelAlign: 'right',
                labelPad: 15,
                xtype: 'fieldset',
                defaults: {
                    labelAlign: 'right',
                    labelPad: 15,
                    width: 340,
                    labelWidth: 125,
                    maxLength: 100,
                    maxLengthText: '最大长度为100'
                }
            },
            items: [],
            listeners: {
                boxready: function(com) {
                    //var w = com.up('window'); 
                }
            }
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

                var url = w.action == "create" ? GlobalConfig.Controllers.CustomerRentGrid.addCustomerRent : GlobalConfig.Controllers.CustomerRentGrid.updateCustomerRent;
                form.submit({
                    url: url,
                    params: {
                        req: 'dataset',
                        dataname: 'AddUpdateCustomerRent', // dataset名称，根据实际情况设置,数据库名
                        restype: 'json',
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
Ext.define('chl.Grid.AddUpdateCustomerRentRentWin', {
    extend: 'Ext.window.Window',
    title: "添加",
    defaultFocus: 'CustomerRentItemId',
    iconCls: '',
    record: false,
    //border: false,
    height: 300,
    width: 830,
    layout: 'vbox',
    modal: true,
    resizable: false,
    items: [{
        xtype: 'form',
        itemId: 'formId',
        autoScroll: true,
        height: 450,
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
            maxLength: 100,
            maxLengthText: '最大长度为100'
        },
        items: [{
            name: 'CustomerRent_name',
            fieldLabel: '客户名',
            itemId: 'CustomerRent_nameItemId',
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
        }, {
            name: 'customize_number_from',
            fieldLabel: '发放面单号开始',
            itemId: 'customize_number_fromItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }, {
            name: 'customize_number_to',
            fieldLabel: '发放面单号结束',
            itemId: 'customize_number_toItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }, {
            name: 'rent_area',
            fieldLabel: '租贷面积（平米）',
            itemId: 'rent_areaItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }, {
            name: 'area_to_order_number',
            fieldLabel: '面积单量比',
            itemId: 'area_to_order_numberItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexMoney2Fixed,
            regexText: '请输入数字'
        }, {
            name: 'rent_pre_price',
            fieldLabel: '房租单价',
            validateOnBlur: false,
            colspan: 2,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexMoney2Fixed,
            regexText: '请输入数字'
        }, {
            xtype: 'datefield',
            minValue: new Date(),
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
            minValue: new Date(),
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
            width: 100,
            text: '添加',
            handler: function(com) {
                var me = this;
                var w = me.up('window');

                var form = w.down('#formId').getForm();

                if (form.isValid()) {

                    var url = GlobalConfig.Controllers.CustomerRentGrid.addCustomerRentRent;
                    form.submit({
                        url: url,
                        params: {
                            req: 'dataset',
                            dataname: 'addCustomerRentRent', // dataset名称，根据实际情况设置,数据库名
                            restype: 'json',
                            CustomerRentId: w.cid,
                            action: w.action,
                            sessiontoken: GlobalFun.getSeesionToken()
                        },
                        success: function(form, action) {

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
        }]
    }, {
        xtype: 'grid'
    }],
    buttons: [{
        text: '关闭',
        handler: function() {
            var me = this;
            me.up('window').close();
        }
    }]
});

//添加编辑窗口  规则
Ext.define('chl.Grid.AddUpdateCustomerRentRuleWin', {
    extend: 'Ext.window.Window',
    title: "添加",
    defaultFocus: 'CustomerRentItemId',
    iconCls: '',
    record: false,
    //border: false,
    height: 500,
    width: 830,
    layout: 'vbox',
    modal: true,
    resizable: false,
    items: [{
        xtype: 'form',
        itemId: 'formId',
        autoScroll: true,
        height: 450,
        width: 810,
        border: false,
        bodyPadding: 5,
        defaultType: 'displayfield',
        layout: {
            type: 'table',
            columns: 2
        },
        defaults: {
            labelAlign: 'right',
            labelPad: 15,
            width: 340,
            labelWidth: 125,
            maxLength: 100,
            maxLengthText: '最大长度为100'
        },
        items: [{
            name: 'CustomerRent_name',
            fieldLabel: '客户名',
            itemId: 'CustomerRent_nameItemId',
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
        }, {
            name: 'customize_number_from',
            fieldLabel: '发放面单号开始',
            itemId: 'customize_number_fromItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }, {
            name: 'customize_number_to',
            fieldLabel: '发放面单号结束',
            itemId: 'customize_number_toItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }, {
            name: 'rent_area',
            fieldLabel: '租贷面积（平米）',
            itemId: 'rent_areaItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }, {
            name: 'area_to_order_number',
            fieldLabel: '面积单量比',
            itemId: 'area_to_order_numberItemId',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexMoney2Fixed,
            regexText: '请输入数字'
        }, {
            name: 'rent_pre_price',
            fieldLabel: '房租单价',
            validateOnBlur: false,
            colspan: 2,
            allowBlank: false,
            blankText: '不能为空',
            regex: GlobalConfig.RegexController.regexMoney2Fixed,
            regexText: '请输入数字'
        }, {
            minValue: new Date(),
            name: 'date_start',
            format: 'Y-m-d',
            fieldLabel: '开始时间',
            allowBlank: false,
            blankText: '不能为空',
            itemId: 'date_start',
            vtype: 'daterange',
            endDateField: 'date_end'
        }, {
            minValue: new Date(),
            name: 'date_end',
            format: 'Y-m-d',
            fieldLabel: '结束时间',
            allowBlank: false,
            blankText: '不能为空',
            itemId: 'date_end',
            vtype: 'daterange',
            startDateField: 'date_start'
        }, {
            xtype: 'fieldset',
            colspan: 2,
            title: '规则',
            itemId: 'fs_rule',
            collapsible: true,
            padding: '2 2 2 5',
            width: 780,
            defaults: {
                labelAlign: 'right',
                labelPad: 15,
                xtype: 'fieldset',
                defaults: {
                    labelAlign: 'right',
                    labelPad: 15,
                    width: 340,
                    labelWidth: 125,
                    maxLength: 100,
                    maxLengthText: '最大长度为100'
                }
            },
            items: [],
            listeners: {
                boxready: function(com) {
                    var w = com.up('window');
                    // if (w.action && w.action == "create") {

                    //     return;
                    // };
                    var itemsArr = [];
                    for (key in GlobalConfig.Province) {
                        itemsArr.push({
                            title: GlobalConfig.Province[key],
                            items: [{
                                xtype: 'label',
                                text: '现有规则:0',
                                priceType: 1,
                                itemId: 'lbl' + key
                            }, {
                                xtype: 'button',
                                width: 100,
                                text: '添加规则',
                                myval: key,
                                handler: function(com) {
                                    //如已有规则，规则类型确定禁用项目
                                    Ext.create('Ext.window.Window', {
                                        title: '添加规则' + '(' + GlobalConfig.Province[com.myval] + ')',
                                        pid: com.myval,
                                        width: 800,
                                        height: 700,
                                        action: 'create',
                                        modal: true,
                                        autoScroll: true,
                                        layout: 'vbox',
                                        bodyPadding: 10,
                                        dockedItems: [{
                                            xtype: 'container',
                                            dock: 'top',
                                            border: false,
                                            bodyPadding: 15,
                                            layout: {
                                                type: 'table',
                                                columns: 2
                                            },
                                            defaultType: 'textfield',
                                            defaults: {
                                                labelAlign: 'right',
                                                labelPad: 15,
                                                width: 340,
                                                labelWidth: 125,
                                                maxLength: 100,
                                                maxLengthText: '最大长度为100'
                                            },
                                            items: [{
                                                xtype: 'fieldcontainer',
                                                colspan: 2,
                                                fieldLabel: '计价方式',
                                                defaultType: 'radiofield',
                                                layout: 'hbox',
                                                defaults: {
                                                    flex: 1
                                                },
                                                items: [{
                                                    boxLabel: '固定价格',
                                                    checked: true,
                                                    itemId: 'rd_price0',
                                                    name: 'price_type',
                                                    inputValue: '0',
                                                    listeners: {
                                                        change: function(com, nval, oval, opts) {
                                                            var me = this;
                                                            var win = me.up('window');
                                                            if (nval) {
                                                                win.down('#price_type0').show();
                                                                win.down('#price_type1').hide();
                                                            } else {
                                                                win.down('#price_type1').show();
                                                                win.down('#price_type0').hide();

                                                            }
                                                        }
                                                    }
                                                }, {
                                                    boxLabel: '步进价格',
                                                    itemId: 'rd_price1',
                                                    name: 'price_type',
                                                    inputValue: '1'
                                                }]
                                            }, {
                                                xtype: 'form',
                                                itemId: 'price_type0',
                                                height: 100,
                                                width: 810,
                                                bodyPadding: 15,
                                                layout: {
                                                    type: 'table',
                                                    columns: 2
                                                },
                                                defaults: {
                                                    labelAlign: 'right',
                                                    labelPad: 15,
                                                    width: 340,
                                                    labelWidth: 125,
                                                    maxLength: 100,
                                                    maxLengthText: '最大长度为100'
                                                },
                                                items: [{
                                                    xtype: 'numberfield',
                                                    fieldLabel: '起价',
                                                    name: 'price_start',
                                                    minValue: 0,
                                                    decimalPrecision: 3,
                                                    maxValue: GlobalConfig.MaxLimit,
                                                    allowBlank: false,
                                                    blankText: '不能为空'
                                                }, {
                                                    xtype: 'numberfield',
                                                    fieldLabel: '后续单价',
                                                    name: 'price_pre',
                                                    minValue: 0,
                                                    decimalPrecision: 3,
                                                    maxValue: GlobalConfig.MaxLimit,
                                                    allowBlank: false,
                                                    blankText: '不能为空'
                                                }, {
                                                    xtype: 'button',
                                                    itemId: 'btn_add',
                                                    colspan: 2,
                                                    margin: '0 0 0 580',
                                                    width: 100,
                                                    text: '添加',
                                                    handler: function(com) {
                                                        var me = this;
                                                        var w = me.up('window');

                                                        var form = w.down('#price_type0').getForm();

                                                        if (form.isValid()) {

                                                            var url = GlobalConfig.Controllers.CustomerRentGrid.addCustomerRentRule;
                                                            form.submit({
                                                                url: url,
                                                                params: {
                                                                    req: 'dataset',
                                                                    dataname: 'addCustomerRentRule', // dataset名称，根据实际情况设置,数据库名
                                                                    restype: 'json',
                                                                    price_type: 0,
                                                                    province: w.pid,
                                                                    action: w.action,
                                                                    sessiontoken: GlobalFun.getSeesionToken()
                                                                },
                                                                success: function(form, action) {
                                                                    win.add({
                                                                        xtype: 'fieldset',
                                                                        title: '规则1'
                                                                    });
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
                                                }]
                                            }, {
                                                xtype: 'form',
                                                colspan: 2,
                                                bodyPadding: 15,
                                                itemId: 'price_type1',
                                                height: 280,
                                                width: 810,
                                                layout: {
                                                    type: 'table',
                                                    columns: 2
                                                },
                                                hidden: true,
                                                items: [{
                                                    xtype: 'fieldset',
                                                    title: '首重',
                                                    width: 780,
                                                    colspan: 2,
                                                    layout: {
                                                        type: 'table',
                                                        columns: 2
                                                    },
                                                    defaults: {
                                                        labelAlign: 'right',
                                                        labelPad: 15,
                                                        width: 340,
                                                        labelWidth: 125
                                                    },
                                                    items: [{
                                                        xtype: 'numberfield',
                                                        name: 'weight_min',
                                                        fieldLabel: '起始重量(kg)',
                                                        minValue: 0,
                                                        value: 0,
                                                        decimalPrecision: 3,
                                                        maxValue: GlobalConfig.MaxLimit,
                                                        allowBlank: false,
                                                        blankText: '不能为空'
                                                    }, {
                                                        xtype: 'numberfield',
                                                        name: 'weight_min_price',
                                                        fieldLabel: '结束重量(kg)',
                                                        minValue: 0,
                                                        value: 1,
                                                        maxValue: GlobalConfig.MaxLimit,
                                                        decimalPrecision: 3,
                                                        allowBlank: false,
                                                        blankText: '不能为空'
                                                    }, {
                                                        xtype: 'numberfield',
                                                        span: 2,
                                                        name: 'weight_min_price',
                                                        fieldLabel: '价格',
                                                        decimalPrecision: 2,
                                                        minValue: 0,
                                                        maxValue: GlobalConfig.MaxLimit,
                                                        regex: GlobalConfig.RegexController.regexMoney2Fixed,
                                                        regexText: '请填写两位小数的数字',
                                                        allowBlank: false,
                                                        blankText: '不能为空'
                                                    }]
                                                }, {
                                                    xtype: 'fieldset',
                                                    title: '续重',
                                                    width: 780,
                                                    layout: {
                                                        type: 'table',
                                                        columns: 2
                                                    },
                                                    defaults: {
                                                        labelAlign: 'right',
                                                        labelPad: 15,
                                                        width: 340,
                                                        labelWidth: 125
                                                    },
                                                    colspan: 2,
                                                    items: [{
                                                        xtype: 'numberfield',
                                                        name: 'weight_pre',
                                                        fieldLabel: '重量(kg)',
                                                        minValue: 0,
                                                        maxValue: GlobalConfig.MaxLimit,
                                                        decimalPrecision: 3,
                                                        allowBlank: false,
                                                        blankText: '不能为空'
                                                    }, {
                                                        xtype: 'numberfield',
                                                        name: 'weight_pre_price',
                                                        fieldLabel: '价格',
                                                        decimalPrecision: 2,
                                                        minValue: 0,
                                                        maxValue: GlobalConfig.MaxLimit,
                                                        allowBlank: false,
                                                        blankText: '不能为空'
                                                    }, {
                                                        xtype: 'fieldcontainer',
                                                        colspan: 2,
                                                        fieldLabel: '记重方式',
                                                        defaultType: 'radiofield',
                                                        layout: 'hbox',
                                                        defaults: {
                                                            flex: 1
                                                        },
                                                        items: [{
                                                            boxLabel: '进位',
                                                            checked: true,
                                                            name: 'weight_price_type',
                                                            inputValue: '0'
                                                        }, {
                                                            boxLabel: '实重',
                                                            name: 'weight_price_type',
                                                            inputValue: '1'
                                                        }]
                                                    }]
                                                }, {
                                                    fieldLabel: '排序',
                                                    xtype: 'numberfield',
                                                    name: 'sort_order',
                                                    decimalPrecision: 0,
                                                    minValue: 1,
                                                    value: 1
                                                }, {
                                                    xtype: 'button',
                                                    width: 100,
                                                    text: '添加',
                                                    handler: function(com) {
                                                        var me = this;
                                                        var w = me.up('window');

                                                        var form = w.down('#price_type1').getForm();
                                                        w.add({
                                                            xtype: 'fieldset',
                                                            title: '步进价格',
                                                            items: []
                                                        });
                                                        w.down('#rd_price0').setDisabled(true);
                                                        if (form.isValid()) {

                                                            var url = GlobalConfig.Controllers.CustomerRentGrid.addCustomerRentRule;
                                                            form.submit({
                                                                url: url,
                                                                params: {
                                                                    req: 'dataset',
                                                                    dataname: 'addCustomerRentRule', // dataset名称，根据实际情况设置,数据库名
                                                                    restype: 'json',
                                                                    price_type: 1,
                                                                    province: w.pid,
                                                                    action: w.action,
                                                                    sessiontoken: GlobalFun.getSeesionToken()
                                                                },
                                                                success: function(form, action) {
                                                                    var data = action.result.data;

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
                                                }]
                                            }]
                                        }],
                                        items: [{
                                            xtype: 'fieldset',
                                            title: '规则1'
                                        }],
                                        buttons: [{
                                            text: '退出',
                                            handler: function() {
                                                var me = this;
                                                me.up('window').close();
                                            }
                                        }]
                                    }).show();
                                }
                            }]
                        });
                    }


                    com.add(itemsArr);
                }
            }
        }]
    }],
    buttons: [{
        text: '关闭',
        handler: function() {
            var me = this;
            me.up('window').close();
        }
    }]
});
