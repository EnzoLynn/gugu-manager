Ext.define('chl.Action.CustomerGridAction', {
    extend: 'WS.action.Base',
    category: 'CustomerGridAction'
});


Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'addCustomer',
    iconCls: 'add',
    tooltip: '添加客户',
    text: '添加客户',
    handler: function() {
        var me = this;
        var target = me.getTargetView();

        ActionManager.addCustomer(target);


    },
    updateStatus: function(selection) {}
});
Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'editCustomer',
    iconCls: 'edit',
    tooltip: '编辑客户',
    text: '编辑客户',
    handler: function() {
        var me = this;
        var target = me.getTargetView();
        var record = target.getSelectionModel().getSelection()[0];
        ActionManager.editCustomer(target, record);


    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length != 1);
    }
});

Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'searchCustomer',
    iconCls: 'search',
    tooltip: '查询',
    text: '查询',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.searchCustomer(target);
    },
    updateStatus: function(selection) {}
});

Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'editCustomer_number',
    iconCls: 'eidtCustomer_number',
    tooltip: '管理客户面单号范围',
    text: '管理面单号范围',
    handler: function() {
        var me = this;
        var target = me.getTargetView();
        var record = target.getSelectionModel().getSelection()[0];
        ActionManager.editCustomer_number(target, record);


    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length != 1);
    }
});

Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'addCustomerRent',
    iconCls: 'addCustomerRent',
    tooltip: '添加合同/规则',
    text: '添加合同/规则',
    handler: function() {
        var me = this;
        var target = me.getTargetView();
        var record = target.getSelectionModel().getSelection()[0];
        ActionManager.addCustomerRent(target, record);


    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length != 1);
    }
});

// Ext.create('chl.Action.CustomerGridAction', {
//     itemId: 'editCustomerRule',
//     iconCls: 'edit',
//     tooltip: '添加规则',
//     text: '添加规则',
//     handler: function() {
//         var me = this;
//         var target = me.getTargetView();
//         var record = target.getSelectionModel().getSelection()[0];
//         ActionManager.editCustomerRule(target, record);
//     },
//     updateStatus: function(selection) { 
//         var flag =  selection[0] && selection[0].data.customer_rent_id != 0;

//         this.setDisabled(selection.length != 1 || !flag);
//     }
// });


Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'refreshCustomer',
    iconCls: 'refresh',
    tooltip: '刷新',
    text: '刷新',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.refreshCustomer(target);
    },
    updateStatus: function(selection) {}
});

//刷新
ActionManager.refreshCustomer = function(target) {
    target.loadGrid();
};
//新增 用户
ActionManager.addCustomer = function(target) {
    //var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateCustomerWin = Ext.create('chl.Grid.AddUpdateCustomerWin', {
        grid: target,
        iconCls: 'add',
        action: 'create',
        record: null,
        title: "新增"
    });
    WindowManager.AddUpdateCustomerWin.show(null, function() {
        //WindowManager.AddUpdateCustomerWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);

    });
};
//编辑 用户
ActionManager.editCustomer = function(target, record) {
    //var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateCustomerWin = Ext.create('chl.Grid.AddUpdateCustomerWin', {
        grid: target,
        iconCls: 'edit',
        action: 'update',
        record: record,
        title: "编辑"
    });
    WindowManager.AddUpdateCustomerWin.show(null, function() {
        //WindowManager.AddUpdateCustomerWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);
        WindowManager.AddUpdateCustomerWin.down("#formId").loadRecord(record);
    });
};

//管理客户面单号范围
ActionManager.editCustomer_number = function(target, record) {
    //var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateCustomer_numberWin = Ext.create('chl.Grid.AddUpdateCustomer_numberWin', {
        grid: target,
        iconCls: 'eidtCustomer_number',
        action: 'create',
        record: record,
        title: "面单号范围(当前客户:" + record.data.customer_name + ")"
    });
    WindowManager.AddUpdateCustomer_numberWin.show(null, function() {
        //WindowManager.AddUpdateCustomerWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);

    });
};

//新增 添加合同
ActionManager.addCustomerRent = function(target, record) {
    //var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateCustomerRentWin = Ext.create('chl.Grid.AddUpdateCustomerRentWin', {
        grid: target,
        iconCls: 'addCustomerRent',
        action: 'create',
        record: record,
        title: "添加合同/规则"
    });
    WindowManager.AddUpdateCustomerRentWin.show(null, function() {
        //WindowManager.AddUpdateCustomerWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);
        var grid = WindowManager.AddUpdateCustomerRentWin.down('CustomerRentGrid');
        grid.store.getProxy().extraParams.customer_id = record.data.customer_id;
        grid.loadGrid();
        WindowManager.AddUpdateCustomerRentWin.down("#formId").loadRecord(record);
    });
};

//查询
ActionManager.searchCustomer = function(traget) {
    if (WindowManager.searchCustomerWin && WindowManager.searchCustomerWin != '') {
        WindowManager.searchCustomerWin.show();
    } else {
        WindowManager.searchCustomerWin = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            closeAction: 'hide',
            title: "查询",
            defaultFocus: 'customer_nameItemId',
            iconCls: 'search',
            record: false,
            formVals: '',
            height: 200,
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
                    name: 'mobile',
                    fieldLabel: '手机号',
                    itemId: 'mobileItemId'
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
                        
                        Searchfield.setSearchStatus(customer_name!=''? true:false);
                    };
                    //手机号
                    var mobile = win.down('#mobileItemId').getValue();
                    if (mobile != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('mobile', false, store, mobile);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('mobile', true, store, false);
                    }


                    if (searchFlag) {
                        win.close();
                        traget.loadGrid(true);
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
