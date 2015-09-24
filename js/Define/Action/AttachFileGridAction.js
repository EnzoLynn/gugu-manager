Ext.define('chl.Action.AttachFileGridAction', {
    extend: 'WS.action.Base',
    category: 'AttachFileGridAction'
});

Ext.create('chl.Action.AttachFileGridAction', {
    itemId: 'searchAttachFile',
    iconCls: 'search',
    tooltip: '查询',
    text: '查询',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.searchAttachFile(target);
    },
    updateStatus: function(selection) {}
});


Ext.create('chl.Action.AttachFileGridAction', {
    itemId: 'uploadAttachFile',
    iconCls: 'upload',
    tooltip: '上传文件',
    text: '上传',
    handler: function() {
        var target = this.getTargetView();
        var win = Ext.create('Ext.window.Window', {
            height: 200,
            width: 800,
            modal: true,
            resizable: false,
            iconCls: 'upload',
            title: '上传文件',
            bodyPadding: 5,
            defaults: {
                margin: '0 0 20 0'
            },
            items: [{
                xtype: 'form',
                itemId: 'formId',
                hidden: true,
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
                            var urlStr = GlobalConfig.Controllers.AttachFileGrid.uploadExcel + "?req=call&callname=uploadExcel&sessiontoken=" + GlobalFun.getSeesionToken();
                            form.submit({
                                timeout: 60 * 10,
                                url: urlStr,
                                waitMsg: '正在上传...',
                                waitTitle: '等待文件上传,请稍候...',
                                success: function(fp, action) {
                                    var data = action.result.data;

                                    target.loadGrid();
                                    outWin.close();
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
                bodyPadding: 5,
                items: [{
                    xtype: 'container',
                    style: {
                        border: '1px dotted  green'
                    },
                    items: [{
                        xtype: 'Html5FileUpload',
                        name: 'fileUpload',
                        labelAlign: 'right',

                        fieldLabel: '请选择导入的文件<br/>(可拖拽文件到此处)',
                        width: 700,
                        height: 100,
                        buttonOnly: true,
                        labelWidth: 150,
                        msgTarget: 'side',
                        itemId: 'fileupId',
                        buttonConfig: {
                            iconCls: 'import',
                            width: 300
                        },
                        uploadUrl: GlobalConfig.Controllers.AttachFileGrid.uploadExcel + "?req=call&callname=uploadExcel&sessiontoken=" + GlobalFun.getSeesionToken(),
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
                                me.sendFiles(me.fileInputEl.dom.files, target, win);
                                me.fileInputEl.dom.value = "";
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
                        downType: 'importAttachFile',
                        sessiontoken: GlobalFun.getSeesionToken()
                    };
                    WsCall.downloadFile(GlobalConfig.Controllers.AttachFileGrid.downloadTemplate, 'download', param);
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

Ext.create('chl.Action.AttachFileGridAction', {
    itemId: 'validateAttachFile',
    iconCls: 'translate',
    tooltip: '验证数据',
    text: '验证',
    handler: function() {
        var target = this.getTargetView();
        var sm = target.getSelectionModel();
        var records = sm.getSelection();
        if (!records[0])
            return;
        var param = {
            sessiontoken: GlobalFun.getSeesionToken(),
            file_id: records[0].data.file_id

        };
        // 调用
        WsCall.pcall(GlobalConfig.Controllers.AttachFileGrid.validateAttachFile, 'translateExpress', param, function(response, opts) {
            target.loadGrid(false, true);
        }, function(response, opts) {
            if (!GlobalFun.errorProcess(response.code)) {
                 Ext.Msg.alert('失败', response.msg);
            }
            target.loadGrid(false, true);
        }, true);
    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length != 1 || selection[0].data.validate_status == 1);
    }
});

Ext.create('chl.Action.AttachFileGridAction', {
    itemId: 'importAttachFile',
    iconCls: 'import',
    tooltip: '导入数据到票据管理',
    text: '导入',
    handler: function() {
        var target = this.getTargetView();
        var sm = target.getSelectionModel();
        var records = sm.getSelection();
        if (!records[0])
            return;
        var param = {
            sessiontoken: GlobalFun.getSeesionToken(),
            file_id: records[0].data.file_id

        };
        // 调用
        WsCall.pcall(GlobalConfig.Controllers.AttachFileGrid.importAttachFile, 'translateExpress', param, function(response, opts) {
            target.loadGrid(false, true);
        }, function(response, opts) {
            if (!GlobalFun.errorProcess(response.code)) {
               Ext.Msg.alert('失败', response.msg);
            }
            target.loadGrid(false, true);
        }, true);
    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length != 1 || selection[0].data.import_status == 1
            || selection[0].data.validate_status != 1);
    }
});


Ext.create('chl.Action.AttachFileGridAction', {
    itemId: 'refreshAttachFile',
    iconCls: 'refresh',
    tooltip: '刷新',
    text: '刷新',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.refreshAttachFile(target);
    },
    updateStatus: function(selection) {}
});
Ext.create('chl.Action.AttachFileGridAction', {
    itemId: 'dlErrorReportAttachFile',
    iconCls: 'download',
    tooltip: '下载错误报告',
    text: '下载错误报告',
    handler: function() {
        var target = this.getTargetView();
        var store = target.getStore();
        var sm = target.getSelectionModel();
        var records = sm.getSelection();
        if (!records[0])
            return;

        var param = {
            downType: 'ErrorReport',
            file_id: records[0].data.file_id,
            sessiontoken: GlobalFun.getSeesionToken()
        };
        var url = GlobalConfig.Controllers.AttachFileGrid.dlErrorReportAttachFile;
        WsCall.downloadFile(url, 'dlErrorReportAttachFile', param);

    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length != 1);
    }
});

Ext.create('chl.Action.AttachFileGridAction', {
    itemId: 'removeAttachFile',
    iconCls: 'remove_base',
    tooltip: '删除',
    text: '删除',
    handler: function() {
        var target = this.getTargetView();
        ActionManager.delAttachFile(target);
    },
    updateStatus: function(selection) {
        this.setDisabled(selection.length != 1);
    }
});

//刷新 
ActionManager.refreshAttachFile = function(traget) {
    traget.loadGrid();
};
//导入excel错误
ActionManager.showUpLoadExcelError = function(obj, isCustomer_number) {
    var items = [];

    for (key in obj) {
        var textItems = [];
        Ext.Array.each(obj[key], function(item, index) {
            textItems.push({
                xtype: 'label',
                text: item.msg
            });
            if (index >= 200) {
                return false;
            };


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
        buttons: [
            // {
            //     text: '下载错误报告',
            //     iconCls: 'download',
            //     handler: function(com) {
            //         var param = {
            //             downType: 'ErrorReport',
            //             sessiontoken: GlobalFun.getSeesionToken()
            //         };
            //         var url = isCustomer_number ? GlobalConfig.Controllers.Customer_numberGrid.errorReport : GlobalConfig.Controllers.AttachFileGrid.errorReport;
            //         WsCall.downloadFile(url, 'download', param);
            //     }
            // }, 
            {
                text: '确定',
                handler: function(com) {
                    com.up('window').close();
                }
            }
        ]
    }).show();
};
//删除 
ActionManager.delAttachFile = function(target, opts) {
    var store = target.getStore();
    var sm = target.getSelectionModel();
    var records = sm.getSelection();
    if (!opts && !records[0])
        return;
    var ids = [];
    Ext.Array.each(records, function(rec) {
        if (rec.data.account_status == 0) {
            ids.push(rec.data.tracking_number_id);
        };
    });

    if (!opts && ids.length == 0) {
        Ext.Msg.alert('提示', '至少需要1条未结算状态的项目.');
        return;
    };

    var defConfig = {
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
                if (opts && opts.filter) {
                    var extraParams = store.getProxy().extraParams;
                    param = {
                        arrive_time_start: extraParams.arrive_time_start,
                        arrive_time_end: extraParams.arrive_time_end,
                        sessiontoken: GlobalFun.getSeesionToken(),
                        filter: extraParams.filter
                    }
                };
                // 调用
                WsCall.pcall(GlobalConfig.Controllers.Tracking_numberGrid.destroy, 'Tracking_numberGrid', param, function(response, opts) {
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
    };
    var mesConfig = Ext.Object.merge(defConfig, opts);
    GlobalConfig.newMessageBox.show(mesConfig);
};
//查询
ActionManager.searchAttachFile = function(traget) {
    if (WindowManager.AttachFileWin && WindowManager.AttachFileWin != '') {
        WindowManager.AttachFileWin.show();
    } else {
        WindowManager.AttachFileWin = Ext.create('Ext.window.Window', {
            modal: true,
            resizable: false,
            closeAction: 'hide',
            title: "查询",
            defaultFocus: 'file_name',
            iconCls: 'search',
            record: false,
            formVals: '',
            height: 200,
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
                    fieldLabel: '原文件名',
                    itemId: 'file_name',
                    maxLength: 64
                }, {
                    fieldLabel: '服务器文件名',
                    itemId: 'file_save_name',
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
                    var file_name = win.down('#file_name').getValue();
                    if (file_name != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('file_name', false, store, file_name);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('file_name', true, store, false);
                    }

                    //名称
                    var file_save_name = win.down('#file_save_name').getValue();
                    if (file_save_name != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('file_save_name', false, store, file_save_name);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('file_save_name', true, store, false);
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

        WindowManager.AttachFileWin.show();
    }

};


