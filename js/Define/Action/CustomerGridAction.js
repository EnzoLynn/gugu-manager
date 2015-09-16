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

Ext.create('chl.Action.CustomerGridAction', {
    itemId: 'importCustomer_number',
    iconCls: 'import',
    tooltip: '导入面单号到目标用户',
    text: '导入面单号',
    handler: function() {
        var me = this;
        var target = me.getTargetView();
        var record = target.getSelectionModel().getSelection()[0];
        ActionManager.importCustomer_number(target, record);


    },
    updateStatus: function(selection) { 
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

//导入面单号
ActionManager.importCustomer_number = function(target, record){
      var win = Ext.create('Ext.window.Window', {
                    height: 360,
                    width: 800,
                    modal: true,
                    resizable: false,
                    iconCls: 'import',
                    title: '上传文件',
                    bodyPadding: 15,
                    defaults: {
                        margin: '0 0 20 0'
                    },
                    items: [{
                        xtype: 'form',
                        itemId: 'formId',
                        bodyPadding: 15,
                        items: [{
                            xtype: 'filefield',
                            name: 'fileUpload',
                            fieldLabel: '请选择导入的文件',
                            width: 600,
                            labelWidth: 150,
                            labelAlign: 'right',
                            blankText: '请选择导入的文件',
                            msgTarget: 'side',
                            itemId: 'fileupId',
                            buttonConfig: {
                                iconCls: 'import',
                                width: 100
                            },
                            buttonText: '添加文件',
                            listeners: {
                                change: function(com) {
                                    var me = com;
                                    var supType = new Array('xls', 'xlsx');
                                    var fNmae = me.getValue();
                                    var fType = fNmae.substring(
                                        fNmae.lastIndexOf('.') + 1,
                                        fNmae.length).toLowerCase();
                                    var returnFlag = true;

                                    Ext.Array.each(supType, function(rec) {
                                        if (rec == fType) {
                                            returnFlag = false;
                                            return false;
                                        }
                                    });

                                    if (returnFlag) {
                                        Ext.Msg.alert('添加文件', '不支持的文件格式！');
                                        return;
                                    }
                                    var f = me.up('form');
                                    var outWin = me.up('window');
                                    var form = f.getForm();
                                    var urlStr = GlobalConfig.Controllers.Customer_numberGrid.uploadExcel + "?req=call&callname=uploadExcel&sessiontoken=" + GlobalFun.getSeesionToken();
                                    form.submit({
                                        timeout: 60 * 10,
                                        url: urlStr,
                                        waitMsg: '正在上传...',
                                        waitTitle: '等待文件上传,请稍候...',
                                        success: function(fp, action) {
                                            var data = action.result.data;
                                            //if (action.result.success) {
                                            target.loadGrid();
                                            outWin.close();
                                            //} else {                                        
                                            //ActionManager.showUpLoadExcelError(action.result.data);
                                            //}
                                        },
                                        failure: function(fp, action) {
                                            if (!GlobalFun.errorProcess(action.result.code)) {
                                                var obj = {};
                                                obj[fNmae] = action.result.data;
                                                ActionManager.showUpLoadExcelError(obj);

                                            }
                                        }
                                    });
                                }
                            }
                        }]
                    }, {
                        xtype: 'form',
                        itemId: 'h5formId',
                        layout: 'vbox',
                        bodyPadding: 15,
                        items: [{
                            xtype: 'label',
                            style: {
                                'font-weight': 'bold'
                            },
                            text: '如果您使用的是高级的支持Html5的浏览器，请使用的这里的上传'
                        }, {
                            xtype: 'label',
                            style: {
                                color: 'red',
                                'font-weight': 'bold'
                            },
                            text: '多文件批量，更快捷，可拖拽文件，可视化的真实上传进度显示,更大的文件'
                        }, {
                            xtype: 'container',
                            style: {
                                border: '1px dotted  green'
                            },
                            items: [{
                                xtype: 'Html5FileUpload',
                                name: 'fileUpload',
                                labelAlign: 'right',

                                fieldLabel: '请选择导入的文件<br/>(可拖拽文件到此处)',
                                width: 600,
                                height: 100,
                                buttonOnly: true,
                                labelWidth: 150,
                                msgTarget: 'side',
                                itemId: 'fileupId',
                                buttonConfig: {
                                    iconCls: 'import',
                                    width: 300
                                },
                                uploadUrl: GlobalConfig.Controllers.Customer_numberGrid.uploadExcel + "?req=call&callname=uploadExcel&sessiontoken=" + GlobalFun.getSeesionToken(),
                                accept: ".xls*",
                                buttonText: '添加文件',
                                listeners: {
                                    change: function(com) {
                                        var me = com;
                                        if (Ext.isIE) {
                                            Ext.Msg.alert('消息', '您的浏览器不支持Html5上传,请更换浏览器或升级版本。');
                                            return;
                                        }
                                        var supType = new Array('xls', 'xlsx');
                                        var fNmae = me.getValue();
                                        var fType = fNmae.substring(
                                            fNmae.lastIndexOf('.') + 1,
                                            fNmae.length).toLowerCase();
                                        var returnFlag = true;

                                        Ext.Array.each(supType, function(rec) {
                                            if (rec == fType) {
                                                returnFlag = false;
                                                return false;
                                            }
                                        });

                                        if (returnFlag) {
                                            Ext.Msg.alert('添加文件', '不支持的文件格式！');
                                            return;
                                        }
                                        me.sendFiles(me.fileInputEl.dom.files);

                                    }
                                }
                            }]
                        }]
                    }],
                    buttons: [{
                        text: '关闭',
                        handler: function() {
                            win.close();
                        }
                    }]
                });
                win.show();
}
