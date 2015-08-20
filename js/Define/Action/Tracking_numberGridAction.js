Ext.define('chl.Action.Tracking_numberGridAction', {
    extend: 'WS.action.Base',
    category: 'Tracking_numberGridAction'
});


Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'addTracking_number',
    iconCls: 'add',
    tooltip: '添加',
    text: '添加',
    handler: function () {
        var me = this;
        var target = me.getTargetView();
        //var record = target.getSelectionModel().getSelection()[0];
        ActionManager.addTracking_number(target);
    },
    updateStatus: function (selection) {
        
    }
});

Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'editTracking_number',
    iconCls: 'edit',
    tooltip: '编辑',
    text: '编辑',
    handler: function () {
        var me = this;
        var target = me.getTargetView();
        var record = target.getSelectionModel().getSelection()[0];
        ActionManager.editTracking_number(target, record);
    },
    updateStatus: function (selection) {
        this.setDisabled(selection.length != 1);
    }
});


Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'refreshTracking_number',
    iconCls: 'refresh',
    tooltip: '刷新',
    text: '刷新',
    handler: function () {
        var target = this.getTargetView();
        ActionManager.refreshTracking_number(target);
    },
    updateStatus: function (selection) {
    }
});

//刷新逝者
ActionManager.refreshTracking_number = function (traget) {
    traget.loadGrid();
};
//新增逝者
ActionManager.addTracking_number = function (traget) {
    var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateTracking_numberWin = Ext.create('chl.Grid.AddUpdateTracking_numberWin', {
        grid: traget,
        iconCls: 'add',
        action: 'create',
        record: record,
        title: "新增"
    });
    WindowManager.AddUpdateTracking_numberWin.show(null, function () {
        //WindowManager.AddUpdateTracking_numberWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);
       
        WindowManager.AddUpdateTracking_numberWin.down("#formId").loadRecord(record);
    });
};
//编辑逝者
ActionManager.editTracking_number = function (traget, record) {
    WindowManager.AddUpdateTracking_numberWin = Ext.create('chl.Grid.AddUpdateTracking_numberWin', {
        grid: traget,
        iconCls: 'edit',
        record: record,
        action: 'update',
        title: "编辑"
    });
    WindowManager.AddUpdateTracking_numberWin.show(null, function () {
        
        WindowManager.AddUpdateTracking_numberWin.down("#formId").loadRecord(record);
      
    });
};