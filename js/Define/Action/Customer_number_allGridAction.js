Ext.define('chl.Action.Customer_number_allGridAction', {
    extend: 'WS.action.Base',
    category: 'Customer_number_allGridAction'
});

Ext.create('chl.Action.Customer_number_allGridAction', {
    itemId: 'searchCustomer_number_all',
    iconCls: 'search',
    tooltip: '查询',
    text: '查询',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.searchCustomer_number_all(target);
    },
    updateStatus: function(selection) {}
});
Ext.create('chl.Action.Customer_number_allGridAction', {
    itemId: 'refreshCustomer_number_all',
    iconCls: 'refresh',
    tooltip: '刷新',
    text: '刷新',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.refreshCustomer_number_all(target);
    },
    updateStatus: function(selection) {}
});

//刷新
ActionManager.refreshCustomer_number_all = function(target) {
    target.loadGrid();
};

//查询
ActionManager.searchCustomer_number_all = function(traget) {
    if (WindowManager.searchCustomer_number_allWin && WindowManager.searchCustomer_number_allWin != '') {
        WindowManager.searchCustomer_number_allWin.show();
    } else {
        WindowManager.searchCustomer_number_allWin = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            closeAction: 'hide',
            title: "查询",
            defaultFocus: 'customer_nameItemId',
            iconCls: 'search',
            record: false,
            formVals: '',
            height: 140,
            width: 500,
            layout: 'vbox',
            listeners: {
                show: function(win) {
                    var form = win.down('#formId').getForm();
                    if (win.formVals != '') {
                        form.setValues(win.formVals);
                    }
                    //是否有快速搜索 相同项目  
                    var searchfield = traget.down('#CustomerGridSearchfieldId');
                    if (searchfield && searchfield.paramName) {
                        var item = win.down("textfield[name=" + searchfield.paramName + "]");
                        if (item) {
                            var store = traget.getStore();
                            var filter = Ext.JSON.decode(store.getProxy().extraParams.filter);
                            item.setValue(filter[searchfield.paramName]);
                        }
                    }
                }

            },
            items: [{
                xtype: 'form',
                itemId: 'formId',
                autoScroll: true,
                height: 190,
                width: 500,
                border: false,
                bodyPadding: 15,
                defaultType: 'textfield',
                layout: {
                    type: 'table',
                    columns: 1
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
                    itemId: 'customer_nameItemId'
                }, {
                    name: 'tracking_number',
                    fieldLabel: '面单号',
                    itemId: 'tracking_numberItemId'
                }]
            }],
            buttons: [{
                text: '重置',
                handler: function() {
                    var me = this;
                    var w = me.up('window');
                    var f = w.down('#formId');
                    f.getForm().reset();
                }
            }, {
                text: '确定',
                itemId: 'submit',
                handler: function() {
                    var me = this;
                    var win = me.up('window');



                    var searchFlag = false;
                    var store = traget.getStore();
                    var extraParams = store.getProxy().extraParams;

                    var form = win.down('#formId').getForm();
                    if (!form.isValid()) {
                        return;
                    }
                    //保存状态
                    win.formVals = form.getValues();
                    //名称
                    var customer_name = win.down('#customer_nameItemId').getValue();
                    if (customer_name != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('customer_name', false, store, customer_name);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('customer_name', true, store, false);
                    }
                    //是否有快速搜索 相同项目  
                    var Searchfield = traget.down('#CustomerGridSearchfieldId');
                    if (Searchfield) {
                        Searchfield.setValue(customer_name);

                        Searchfield.setSearchStatus(customer_name != '' ? true : false);
                    };
                    //手机号
                    var tracking_number = win.down('#tracking_numberItemId').getValue();
                    if (tracking_number != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('tracking_number', false, store, tracking_number);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('tracking_number', true, store, false);
                    }


                    if (searchFlag) {
                        win.close();
                        traget.loadGrid();
                    } else {
                        win.close();
                        traget.loadGrid();
                    }

                }
            }, {
                text: '取消',
                handler: function() {
                    var me = this;
                    me.up('window').close();
                }
            }]
        }).show();
    }

};