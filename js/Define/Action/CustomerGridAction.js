Ext.define('chl.Action.CustomerGridAction', {
    extend: 'WS.action.Base',
    category: 'CustomerGridAction'
});


Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'addCustomer',
    iconCls: 'add',
    tooltip: '添加',
    text: '添加',
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
    tooltip: '编辑',
    text: '编辑',
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

//刷新逝者
ActionManager.refreshCustomer = function(traget) {
    traget.loadGrid();
};
//新增逝者
ActionManager.addCustomer = function(traget) {
    var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateCustomerWin = Ext.create('chl.Grid.AddUpdateCustomerWin', {
        grid: traget,
        iconCls: 'add',
        action: 'create',
        record: record,
        title: "新增"
    });
    WindowManager.AddUpdateCustomerWin.show(null, function() {
        //WindowManager.AddUpdateCustomerWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);

        WindowManager.AddUpdateCustomerWin.down("#formId").loadRecord(record);
    });
};
//编辑逝者
ActionManager.editCustomer = function(traget, record) {

    //var record = target.getSelectionModel().getSelection()[0];
    var param = {
        sessiontoken: GlobalFun.getSeesionToken()
    };
    // 调用
    WsCall.call(GlobalConfig.Controllers.User.GetCurrUserInfo, 'GetCurrUserInfo', param, function(response, opts) {

        var data = response.data;
        WindowManager.AddUpdateCustomerWin = Ext.create('chl.Grid.AddUpdateCustomerWin', {
            grid: traget,
            iconCls: 'edit',
            record: record,
            action: 'update',
            title: "编辑"
        });
        WindowManager.AddUpdateCustomerWin.show(null, function() {
            Ext.Array.each(data.data,function(item,index,alls){
                WindowManager.AddUpdateCustomerWin.down('lbl'+item.key).setText('现有规则:'+item.count);
            });
           
            WindowManager.AddUpdateCustomerWin.down("#formId").loadRecord(record);
        });
    }, function(response, opts) {
        if (!GlobalFun.errorProcess(response.code)) {
            Ext.Msg.alert('失败', response.msg);
        }
    }, true);

};
