Ext.define('chl.Action.TestGridAction', {
    extend: 'WS.action.Base',
    category: 'TestGridAction'
});


Ext.create('chl.Action.TestGridAction', {
    itemId: 'addTest',
    iconCls: 'add',
    tooltip: '添加',
    text: '添加',
    handler: function () {
        var me = this;
        var target = me.getTargetView();
        //var record = target.getSelectionModel().getSelection()[0];
        ActionManager.addTest(target);
    },
    updateStatus: function (selection) {
        
    }
});

Ext.create('chl.Action.TestGridAction', {
    itemId: 'editTest',
    iconCls: 'edit',
    tooltip: '编辑',
    text: '编辑',
    handler: function () {
        var me = this;
        var target = me.getTargetView();
        var record = target.getSelectionModel().getSelection()[0];
        ActionManager.editTest(target, record);
    },
    updateStatus: function (selection) {
        this.setDisabled(selection.length != 1);
    }
});


Ext.create('chl.Action.TestGridAction', {
    itemId: 'refreshTest',
    iconCls: 'refresh',
    tooltip: '刷新',
    text: '刷新',
    handler: function () {
        var target = this.getTargetView();
        ActionManager.refreshTest(target);
    },
    updateStatus: function (selection) {
    }
});

//刷新逝者
ActionManager.refreshTest = function (traget) {
    traget.loadGrid();
};
//新增逝者
ActionManager.addTest = function (traget) {
    var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateTestWin = Ext.create('chl.Grid.AddUpdateTestWin', {
        grid: traget,
        iconCls: 'add',
        action: 'create',
        record: record,
        title: "新增逝者"
    });
    WindowManager.AddUpdateTestWin.show(null, function () {
        WindowManager.AddUpdateTestWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);
       
        WindowManager.AddUpdateTestWin.down("#formId").loadRecord(record);
    });
};
//编辑逝者
ActionManager.editTest = function (traget, record) {
    WindowManager.AddUpdateTestWin = Ext.create('chl.Grid.AddUpdateTestWin', {
        grid: traget,
        iconCls: 'edit',
        record: record,
        action: 'update',
        title: "编辑逝者"
    });
    WindowManager.AddUpdateTestWin.show(null, function () {
        WindowManager.AddUpdateTestWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);
        WindowManager.AddUpdateTestWin.down("#formId").loadRecord(record);
      
    });
};