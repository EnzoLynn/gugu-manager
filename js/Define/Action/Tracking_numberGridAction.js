Ext.define('chl.Action.Tracking_numberGridAction', {
    extend: 'WS.action.Base',
    category: 'Tracking_numberGridAction'
});

Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'searchTracking_number',
    iconCls: 'search',
    tooltip: '查询',
    text: '查询',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.searchTracking_number(target);
    },
    updateStatus: function(selection) {}
});


Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'importTracking_number',
    iconCls: 'import',
    tooltip: '导入',
    text: '导入',
    handler: function() {
        var target = this.getTargetView();
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
                            var urlStr = GlobalConfig.Controllers.Tracking_numberGrid.uploadExcel + "?req=call&callname=uploadExcel&sessiontoken=" + GlobalFun.getSeesionToken();
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
                        uploadUrl: GlobalConfig.Controllers.Tracking_numberGrid.uploadExcel + "?req=call&callname=uploadExcel&sessiontoken=" + GlobalFun.getSeesionToken(),
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
                text: '下载导入模版',
                iconCls: 'downloadTpl',
                width: 120,
                handler: function() {

                    var param = {
                        downType: 'importTracking_number',
                        sessiontoken: GlobalFun.getSeesionToken()
                    };
                    WsCall.downloadFile(GlobalConfig.Controllers.Tracking_numberGrid.downloadTemplate, 'download', param);
                }
            }, {
                text: '关闭',
                handler: function() {
                    win.close();
                }
            }]
        });
        win.show();
    },
    updateStatus: function(selection) {

    }
});
Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'exportTracking_number',
    iconCls: 'export',
    tooltip: '导出',
    text: '导出',
    handler: function() {
        var target = this.getTargetView();
        var store = target.getStore();
        var extraParams = store.getProxy().extraParams;
        var param = {
            downType: 'Tracking_number',
            arrive_time_start: extraParams.arrive_time_start,
            arrive_time_end: extraParams.arrive_time_end,
            dir: 'ASC',
            sort: 'tracking_number',
            filter: extraParams.filter,
            sessiontoken: GlobalFun.getSeesionToken()
        };
        WsCall.downloadFile(GlobalConfig.Controllers.Tracking_numberGrid.outPutExcel, 'download', param);
    },
    updateStatus: function(selection) {}
});

Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'removeTracking_number',
    iconCls: 'remove_base',
    tooltip: '删除',
    text: '删除',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.delTracking_number(target);
    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length < 1);
    }
});



Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'refreshTracking_number',
    iconCls: 'refresh',
    tooltip: '刷新',
    text: '刷新',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.refreshTracking_number(target);
    },
    updateStatus: function(selection) {}
});

Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'translateExpressTracking_number',
    iconCls: 'translate',
    tooltip: '计算收入',
    text: '计算收入',
    handler: function() {
        var target = this.getTargetView();
        var param = {
            sessiontoken: GlobalFun.getSeesionToken(),
            type: 'income'
        };
        // 调用
        WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.translateExpress, 'translateExpress', param, function(response, opts) {
            target.loadGrid();

        }, function(response, opts) {
            if (!GlobalFun.errorProcess(response.code)) {
                ActionManager.translateError(response);
            }
            target.loadGrid();
        }, true);
    },
    updateStatus: function(selection) {}
});
Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'translateCostTracking_number',
    iconCls: 'translate',
    tooltip: '计算成本',
    text: '计算成本',
    handler: function() {
        var target = this.getTargetView();
        var param = {
            sessiontoken: GlobalFun.getSeesionToken(),
            type: 'cost'
        };
        // 调用
        WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.translateExpress, 'translateExpress', param, function(response, opts) {
            target.loadGrid();
        }, function(response, opts) {
            if (!GlobalFun.errorProcess(response.code)) {
                ActionManager.translateError(response);
            }
            target.loadGrid();
        }, true);
    },
    updateStatus: function(selection) {}
});

Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'retranslateExpressTracking_number',
    iconCls: 'retranslate',
    tooltip: '重新计算收入',
    text: '重新计算收入',
    handler: function() {

        var target = this.getTargetView();
        var sm = target.getSelectionModel();
        var records = sm.getSelection();
        if (!records[0])
            return;
        var ids = [];
        Ext.Array.each(records, function(rec) {
            ids.push(rec.data.tracking_number_id);
        });
        var param = {
            sessiontoken: GlobalFun.getSeesionToken(),
            type: 'income',
            tracking_number_ids: ids.join()
        };
        // 调用
        WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.retranslateExpress, 'translateExpress', param, function(response, opts) {
            target.loadGrid(false, true);
        }, function(response, opts) {
            if (!GlobalFun.errorProcess(response.code)) {
                ActionManager.translateError(response);
            }
            target.loadGrid(false, true);
        }, true);
    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length < 1);
    }
});

Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'retranslateCostTracking_number',
    iconCls: 'retranslate',
    tooltip: '重新计算成本',
    text: '重新计算成本',
    handler: function() {
        var target = this.getTargetView();
        var sm = target.getSelectionModel();
        var records = sm.getSelection();
        if (!records[0])
            return;
        var ids = [];
        Ext.Array.each(records, function(rec) {
            ids.push(rec.data.tracking_number_id);
        });
        var param = {
            sessiontoken: GlobalFun.getSeesionToken(),
            type: 'cost',
            tracking_number_ids: ids.join()
        };
        // 调用
        WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.retranslateExpress, 'translateExpress', param, function(response, opts) {
            target.loadGrid(false, true);
        }, function(response, opts) {
            if (!GlobalFun.errorProcess(response.code)) {
                ActionManager.translateError(response);
            }
            target.loadGrid(false, true);
        }, true);
    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length < 1);
    }
});


Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'account_statusTracking_number',
    iconCls: 'status-suc',
    tooltip: '设置结算状态',
    text: '设置结算状态',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.account_statusTracking_number(target);
    },
    updateStatus: function(selection) {}
});

//刷新 
ActionManager.refreshTracking_number = function(traget) {
    traget.loadGrid();
};
//导入excel错误
ActionManager.showUpLoadExcelError = function(obj) {
    var items = [];

    for (key in obj) {
        var textItems = [];
        Ext.Array.each(obj[key], function(item, index) {
            textItems.push({
                xtype: 'label',
                text: item.msg
            });

        });
        items.push({
            xtype: 'fieldset',
            title: key,
            layout: 'vbox',
            collapsible: true,
            items: textItems
        });
    }



    Ext.create('Ext.window.Window', {
        title: '数据格式错误',
        modal: true,
        width: 700,
        height: 600,
        bodyPadding: 15,
        layout: {
            type: 'table',
            columns: 2
        },
        items: [{
            xtype: 'container',
            cls: 'x-message-box-error ',
            height: 34,
            width: 34,
        }, {
            xtype: 'label',
            text: '数据格式错误，请修改下列数据后重新上传'
        }, {
            xtype: 'container',
            margin: '15 0 0 0',
            colspan: 2,
            autoScroll: true,
            height: 470,
            width: 660,
            items: items
        }],
        buttons: [{
            text: '确定',
            handler: function(com) {
                com.up('window').close();
            }
        }]
    }).show();
};

//查询
ActionManager.searchTracking_number = function(traget) {
    if (WindowManager.Tracking_numberWin && WindowManager.Tracking_numberWin != '') {
        WindowManager.Tracking_numberWin.show();
    } else {
        WindowManager.Tracking_numberWin = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            closeAction: 'hide',
            title: "查询",
            defaultFocus: 'tracking_number',
            iconCls: 'search',
            record: false,
            formVals: '',
            height: 300,
            width: 500,
            layout: 'vbox',
            items: [{
                xtype: 'form',
                itemId: 'formId',
                autoScroll: true,
                height: 290,
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
                    maxLength: 100,
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
                    fieldLabel: '票据号',
                    itemId: 'tracking_number',
                    maxLength: 64
                }, {
                    fieldLabel: '网点',
                    itemId: 'arrive_express_point_name',
                    maxLength: 64
                }, {
                    fieldLabel: '网点代码',
                    itemId: 'arrive_express_point_code',
                    maxLength: 16
                }, {
                    xtype: 'fieldcontainer',
                    colspan: 2,
                    width: 490,
                    fieldLabel: '收货时间',
                    defaultType: 'datetimefield',
                    layout: {
                        type: 'hbox'
                    },
                    defaults: {
                        labelAlign: 'right',
                        width: 100
                    },
                    items: [{
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        itemId: 'dateStar',
                        vtype: 'daterange',
                        endDateField: 'dateEnd'
                    }, {
                        xtype: 'label',
                        margin: '0 0 0 5',
                        width: 20,
                        text: '至'
                    }, {
                        xtype: 'datefield',
                        format: 'Y-m-d',
                        itemId: 'dateEnd',
                        vtype: 'daterange',
                        startDateField: 'dateStar'
                    }]
                }, {
                    fieldLabel: '客户名称',
                    itemId: 'customer_name',
                    maxLength: 64
                }]
            }],
            listeners: {
                show: function(win) {
                    var form = win.down('#formId').getForm();
                    if (win.formVals != '') {
                        form.setValues(win.formVals);
                    };
                }
            },
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
                    var tracking_number = win.down('#tracking_number').getValue();
                    if (tracking_number != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('tracking_number', false, store, tracking_number);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('tracking_number', true, store, false);
                    }
                    //手机号
                    var arrive_express_point_name = win.down('#arrive_express_point_name').getValue();
                    if (arrive_express_point_name != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('arrive_express_point_name', false, store, arrive_express_point_name);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('arrive_express_point_name', true, store, false);
                    }
                    var arrive_express_point_code = win.down('#arrive_express_point_code').getValue();
                    if (arrive_express_point_code != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('arrive_express_point_code', false, store, arrive_express_point_code);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('arrive_express_point_code', true, store, false);
                    }

                    //时间                    
                    var dateStarField = win.down('#dateStar');
                    var dateEndField = win.down('#dateEnd');
                    var dateStar = dateStarField.getValue();
                    var dateEnd = dateEndField.getValue();
                    //GlobalFun.ValidDateStartEnd(dateStarField, dateEndField);
                    if (dateStar || dateEnd) {
                        //加入.getProxy().extraParams
                        extraParams.DateFilter = true;
                        extraParams.arrive_time_start = Ext.Date.format(dateStar, 'Y-m-d');
                        extraParams.arrive_time_end = Ext.Date.format(dateEnd, 'Y-m-d');
                        searchFlag = true;
                    } else {
                        extraParams.DateFilter = false;
                        extraParams.arrive_time_start = '';
                        extraParams.arrive_time_end = '';
                    }

                    //客户名称

                    var customer_name = win.down('#customer_name').getValue();
                    if (customer_name != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('customer_name', false, store, customer_name);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('customer_name', true, store, false);
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
        });

        WindowManager.Tracking_numberWin.show();
    }

};


//计算错误 提示
ActionManager.translateError = function(response) {
    var items = [];
    Ext.Array.each(response.data, function(item, index) {
        items.push({
            fieldLabel: item.tracking_number,
            value: item.msg
        });
    });

    Ext.create('Ext.window.Window', {
        modal: true,
        minWidth: 320,
        maxWidth: 800,
        maxHeight: 600,
        title: response.msg,
        iconCls: 'error',
        bodyPadding: 20,
        autoScroll: true,
        bodyBorder: false,
        defaults: {
            xtype: 'displayfield',
            labelAlign: 'right',
            labelWidth: 160,
            width: 750,
            labelClsExtra: "labelCanSelect"
        },
        items: items,
        buttonAlign: 'center',
        buttons: [{
            text: '关闭',
            handler: function(com) {

                com.up('window').close();
            }
        }]

    }).show();
}


//删除 
ActionManager.delTracking_number = function(traget) {
    var store = target.getStore();
    var sm = traget.getSelectionModel();
    var records = sm.getSelection();
    if (!records[0])
        return;
    var ids = [];
    Ext.Array.each(records, function(rec) {
        if (rec.data.account_status == 0) {
            ids.push(rec.data.tracking_number_id);
        };
    });

    if (ids.length == 0) {
        Ext.Msg.alert('提示', '请选择至少1条未结算状态的项目.');
        return;
    };
    GlobalConfig.newMessageBox.show({
        title: '提示',
        msg: '您确定要删除选定的(未结算)项目吗？',
        buttons: Ext.MessageBox.YESNO,
        closable: false,
        fn: function(btn) {
            if (btn == 'yes') {
                //获取当前登录用户信息
                var param = {
                    sessiontoken: GlobalFun.getSeesionToken(),
                    tracking_number_ids: ids.join()
                };
                // 调用
                WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.destroy, 'Tracking_numberGrid', param, function(response, opts) {
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

//设置状态
ActionManager.account_statusTracking_number = function(target) {
    var store = target.getStore();
    var extraParams = store.getProxy().extraParams;
    var param = {
        arrive_time_start: extraParams.arrive_time_start,
        arrive_time_end: extraParams.arrive_time_end,
        filter: extraParams.filter,
        sessiontoken: GlobalFun.getSeesionToken()
    };
    GlobalConfig.newMessageBox.show({
        title: '提示',
        msg: '您确定要设置当前的所有项目状态为已结算吗？',
        buttons: Ext.MessageBox.YESNO,
        closable: false,
        fn: function(btn) {
            if (btn == 'yes') {

                // 调用
                WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.setAccount_status, 'setAccount_status', param, function(response, opts) {
                    (new Ext.util.DelayedTask(function() {
                        store.load();
                    })).delay(500);
                }, function(response, opts) {

                    if (!GlobalFun.errorProcess(response.code)) {
                        Ext.Msg.alert('失败', response.msg);
                    }
                }, true);

            }
        },
        icon: Ext.MessageBox.QUESTION
    });
};
