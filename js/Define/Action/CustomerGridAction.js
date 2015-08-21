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

        ActionManager.addCustomerRent(target);


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
        ActionManager.addCustomerRent(target,record);


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
        this.setDisabled(selection.length != 1);
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
ActionManager.refreshCustomer = function(traget) {
    traget.loadGrid();
};
//新增 用户
ActionManager.addCustomer = function(traget) {
    //var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateCustomerWin = Ext.create('chl.Grid.AddUpdateCustomerWin', {
        grid: traget,
        iconCls: 'add',
        action: 'create',
        record: null,
        title: "新增"
    });
    WindowManager.AddUpdateCustomerWin.show(null, function() {
        //WindowManager.AddUpdateCustomerWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);

        WindowManager.AddUpdateCustomerWin.down("#fs_rule").setDisabled(true);
    });
};

//新增 添加合同
ActionManager.addCustomerRent = function(traget,record) {
    //var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateCustomerRentWin = Ext.create('chl.Grid.AddUpdateCustomerRentWin', {
        grid: traget,
        iconCls: 'add',
        action: 'create',
        record: null,
        title: "新增"
    });
    WindowManager.AddUpdateCustomerRentWin.show(null, function() {
        //WindowManager.AddUpdateCustomerWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);
        WindowManager.AddUpdateCustomerRentWin.down('CustomerRentGrid').loadGrid();
        WindowManager.AddUpdateCustomerRentWin.down("#formId").loadRecord(record);   
    });
};
//添加规则
ActionManager.editCustomerRule = function(traget, record) {

    //var record = target.getSelectionModel().getSelection()[0];
    var param = {
        sessiontoken: GlobalFun.getSeesionToken()
    };
    // 调用
    WsCall.call(GlobalConfig.Controllers.CustomerGrid.getCustomerRule, 'GetCustomerRule', param, function(response, opts) {

        var data = response.data;
        WindowManager.AddUpdateCustomerRuleWin = Ext.create('chl.Grid.AddUpdateCustomerRuleWin', {
            grid: traget,
            iconCls: 'edit',
            record: record,
            action: 'update',
            title: "编辑"
        });
        WindowManager.AddUpdateCustomerRuleWin.show(null, function() {
            Ext.Array.each(data.data,function(item,index,alls){
                var temp = WindowManager.AddUpdateCustomerRuleWin.down('lbl'+item.key);
                temp.setText('现有规则:'+item.count);
                temp.priceType = item.priceType;
            });
           
            WindowManager.AddUpdateCustomerRuleWin.down("#formId").loadRecord(record);
        });
    }, function(response, opts) {
        if (!GlobalFun.errorProcess(response.code)) {
            Ext.Msg.alert('失败', response.msg);
        }
    }, true);

};
