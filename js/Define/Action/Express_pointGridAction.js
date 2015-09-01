Ext.define('chl.Action.Express_pointGridAction', {
    extend: 'WS.action.Base',
    category: 'Express_pointGridAction'
});


Ext.create('chl.Action.Express_pointGridAction', {
    itemId: 'addExpress_point',
    iconCls: 'base_add',
    tooltip: '添加网点',
    text: '添加网点',
    handler: function() {
        var me = this;
        var target = me.getTargetView();

        ActionManager.addExpress_point(target);


    },
    updateStatus: function(selection) {}
});
Ext.create('chl.Action.Express_pointGridAction', {
    itemId: 'editExpress_point',
    iconCls: 'base_edit',
    tooltip: '编辑网点',
    text: '编辑网点',
    handler: function() {
        var me = this;
        var target = me.getTargetView();
        var record = target.getSelectionModel().getSelection()[0];
        ActionManager.editExpress_point(target, record);


    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length != 1);
    }
});

Ext.create('chl.Action.Express_pointGridAction', {
    itemId: 'searchExpress_point',
    iconCls: 'search',
    tooltip: '查询',
    text: '查询',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.searchExpress_point(target);
    },
    updateStatus: function(selection) {}
});

Ext.create('chl.Action.Express_pointGridAction', {
    itemId: 'delExpress_point',
    iconCls: 'base_delete',
    tooltip: '删除',
    text: '删除',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.delExpress_point(target);
    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length == 0);
    }
});

Ext.create('chl.Action.Express_pointGridAction', {
    itemId: 'refreshExpress_point',
    iconCls: 'refresh',
    tooltip: '刷新',
    text: '刷新',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.refreshExpress_point(target);
    },
    updateStatus: function(selection) {}
});

//刷新
ActionManager.refreshExpress_point = function(target) {
    target.loadGrid();
};
//新增 用户
ActionManager.addExpress_point = function(target) {
    //var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateExpress_pointWin = Ext.create('chl.Grid.AddUpdateExpress_pointWin', {
        grid: target,
        iconCls: 'add',
        action: 'create',
        record: null,
        title: "新增"
    });
    WindowManager.AddUpdateExpress_pointWin.show(null, function() {
        //WindowManager.AddUpdateExpress_pointWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);

    });
};
//编辑 用户
ActionManager.editExpress_point = function(target, record) {
    //var record = traget.getStore().getAt(0);
    WindowManager.AddUpdateExpress_pointWin = Ext.create('chl.Grid.AddUpdateExpress_pointWin', {
        grid: target,
        iconCls: 'edit',
        action: 'update',
        record: record,
        title: "编辑"
    });
    WindowManager.AddUpdateExpress_pointWin.show(null, function() {
        //WindowManager.AddUpdateExpress_pointWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);
        WindowManager.AddUpdateExpress_pointWin.down("#formId").loadRecord(record);
    });
};




//查询
ActionManager.searchExpress_point = function(traget) {
    if (WindowManager.searchExpress_pointWin && WindowManager.searchExpress_pointWin != '') {
        WindowManager.searchExpress_pointWin.show();
    } else {
        WindowManager.searchExpress_pointWin = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            closeAction: 'hide',
            title: "查询",
            defaultFocus: 'Express_point_nameItemId',
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
                    };
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
                    maxLength: 40,
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
                    name: 'express_point_name',
                    fieldLabel: '网点名称',
                    itemId: 'express_point_nameItemId'
                }, {
                    name: 'express_point_code',
                    fieldLabel: '网点代码',
                    maxLength: 20,
                    itemId: 'express_point_codeItemId'
                }, {
                    xtype: 'combobox',
                    name: 'province_code',
                    itemId: 'province_codeItemId',
                    fieldLabel: '省份',
                    store: 'ProvinceStoreId',
                    queryMode: 'local',
                    displayField: 'Name',
                    valueField: 'Id',
                    editable: false
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
                    var express_point_name = win.down('#express_point_nameItemId').getValue();
                    if (express_point_name != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('express_point_name', false, store, express_point_name);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('express_point_name', true, store, false);
                    }
                    //手机号
                    var express_point_code = win.down('#express_point_codeItemId').getValue();
                    if (express_point_code != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('express_point_code', false, store, express_point_code);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('express_point_code', true, store, false);
                    }
                    //手机号
                    var province_code = win.down('#province_codeItemId').getValue();
                    if (province_code != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('province_code', false, store, province_code);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('province_code', true, store, false);
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


//删除 
ActionManager.delExpress_point = function(traget) {
    var sm = traget.getSelectionModel();
    var records = sm.getSelection();
    if (!records[0])
        return;
    var ids = [];
    Ext.Array.each(records, function(rec) {
        ids.push(rec.data.point_id);
    });
    var store = traget.getStore(); 
    GlobalConfig.newMessageBox.show({
        title: '提示',
        msg: '您确定要删除选定的网点吗？',
        buttons: Ext.MessageBox.YESNO,
        closable: false,
        fn: function(btn) {
            if (btn == 'yes') {
                //获取当前登录用户信息
                var param = {
                    sessiontoken: GlobalFun.getSeesionToken(),
                    point_ids:ids.join()
                };
                // 调用
                WsCall.pcall(GlobalConfig.Controllers.Express_pointGrid.destroy, 'Express_pointGridDestroy', param, function(response, opts) {
                   (new Ext.util.DelayedTask(function() {
                        store.load();
                    })).delay(500);
                }, function(response, opts) {

                    if (!GlobalFun.errorProcess(response.code)) {
                        Ext.Msg.alert('登录失败', response.msg);
                    }
                }, true);
               
            }
        },
        icon: Ext.MessageBox.QUESTION
    });
};
