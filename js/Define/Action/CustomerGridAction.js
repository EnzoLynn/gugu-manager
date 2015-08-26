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
        ActionManager.editCustomer(target,record);


    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length != 1);
    }
});

Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'editCustomer_number',
    iconCls: 'edit',
    tooltip: '管理客户面单号范围',
    text: '管理面单号范围',
    handler: function() {
        var me = this;
        var target = me.getTargetView();
        var record = target.getSelectionModel().getSelection()[0];
        ActionManager.editCustomer_number(target,record);


    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length != 1);
    }
});

Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'addCustomerRent',
    iconCls: 'edit',
    tooltip: '添加合同',
    text: '添加合同',
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

Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'editCustomerRule',
    iconCls: 'edit',
    tooltip: '添加规则',
    text: '添加规则',
    handler: function() {
        var me = this;
        var target = me.getTargetView();
        var record = target.getSelectionModel().getSelection()[0];
        ActionManager.editCustomerRule(target, record);
    },
    updateStatus: function(selection) { 
        var flag =  selection[0] && selection[0].data.customer_rent_id.length>0;
        this.setDisabled(selection.length != 1 || !flag);
    }
});


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
ActionManager.editCustomer = function(target,record) {
    //var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateCustomerWin = Ext.create('chl.Grid.AddUpdateCustomerWin', {
        grid: target,
        iconCls: 'edit',
        action: 'update',
        record: null,
        title: "编辑"
    });
    WindowManager.AddUpdateCustomerWin.show(null, function() {
        //WindowManager.AddUpdateCustomerWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);
         WindowManager.AddUpdateCustomerWin.down("#formId").loadRecord(record);
    });
};

//管理客户面单号范围
ActionManager.editCustomer_number = function(target,record) {
    //var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateCustomer_numberWin = Ext.create('chl.Grid.AddUpdateCustomer_numberWin', {
        grid: target,
        iconCls: 'add',
        action: 'create',
        record: record,
        title: "面单号范围(当前客户:"+record.data.customer_name+")"
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
        iconCls: 'add',
        action: 'create',
        record: record,
        title: "新增"
    });
    WindowManager.AddUpdateCustomerRentWin.show(null, function() {
        //WindowManager.AddUpdateCustomerWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);
        var grid = WindowManager.AddUpdateCustomerRentWin.down('CustomerRentGrid');
        grid.store.getProxy().extraParams.customer_id = record.data.customer_id;
        grid.loadGrid();
        WindowManager.AddUpdateCustomerRentWin.down("#formId").loadRecord(record);
    });
};
//添加规则
ActionManager.editCustomerRule = function(target, record) {
    var param = {
        'customer_rent_id': record.data.customer_rent_id,
        sessiontoken: GlobalFun.getSeesionToken()
    };
    // 调用
    WsCall.call(GlobalConfig.Controllers.CustomerGrid.GetCustomerRuleByRentId, 'GetCustomerRuleByRentId', param, function(response, opts) {

        var data = response.data;
        WindowManager.AddUpdateCustomerRuleWin = Ext.create('chl.Grid.AddUpdateCustomerRuleWin', {
            grid: target,
            iconCls: 'edit',
            record: record,
            action: 'update',
            title: "编辑"
        });
        WindowManager.AddUpdateCustomerRuleWin.show(null, function() {
            Ext.Array.each(data, function(item, index, alls) {
                var temp = WindowManager.AddUpdateCustomerRuleWin.down('#lbl' + item.province_code);
                temp.setText('现有规则:' + item.count);
            });

            WindowManager.AddUpdateCustomerRuleWin.down("#formId").loadRecord(record);
        });
    }, function(response, opts) {
        if (!GlobalFun.errorProcess(response.code)) {
            Ext.Msg.alert('失败', response.msg);
        }
    }, true);

};
