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
                                    //} else {                                        
                                    //ActionManager.showUpLoadExcelError(action.result.data);
                                    //}
                                },
                                failure: function(fp, action) {
                                    if (!GlobalFun.errorProcess(action.result.code)) {
                                        //Ext.Msg.alert('失败', action.result.msg);
                                        ActionManager.showUpLoadExcelError(action.result.data);
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
                    xtype: 'Html5FileUpload',
                    name: 'fileUpload',
                    labelAlign: 'right',

                    fieldLabel: '请选择导入的文件<br/>(可拖拽文件到此处)',
                    width: 600,
                    height: 100,
                    style: {
                        border: '1px solid green'
                    },
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
            }],
            buttons: [{
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

//刷新 
ActionManager.refreshTracking_number = function(traget) {
    traget.loadGrid();
};

ActionManager.showUpLoadExcelError = function(data) {
    var html = "";

    Ext.Array.each(data, function(item, index) {
        html += item.msg+"<br>";
    });

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
            name: 'message',
            html: html
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
                    maxLength: 100
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
                        endDateField: 'dateEnd',
                        editable: false
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
                        startDateField: 'dateStar',
                        editable: false
                    }]
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

                    //时间
                    var dateStarField = win.down('#dateStar');
                    var dateEndField = win.down('#dateEnd');
                    var dateStar = dateStarField.getValue();
                    var dateEnd = dateEndField.getValue();
                    GlobalFun.ValidDateStartEnd(dateStarField, dateEndField);
                    var form = win.down('#formId').getForm();
                    if (!form.isValid()) {
                        return;
                    }
                    //名称
                    var tracking_number = win.down('#tracking_number').getValue();
                    if (tracking_number != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('tracking_number', false, store, tracking_number);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('customer_name', true, store, false);
                    }
                    //手机号
                    var arrive_express_point_name = win.down('#arrive_express_point_name').getValue();
                    if (arrive_express_point_name != '') {
                        //加入filterMap
                        GlobalFun.GridSearchInitFun('arrive_express_point_name', false, store, arrive_express_point);
                        searchFlag = true;
                    } else {
                        GlobalFun.GridSearchInitFun('arrive_express_point_name', true, store, false);
                    }

                    //时间
                    if (dateStar && dateEnd) {
                        //加入.getProxy().extraParams
                        extraParams.DateFilter = true;
                        extraParams.arrive_time = Ext.Date.format(dateStar, 'Y-m-d') + ',' + Ext.Date.format(dateEnd, 'Y-m-d');
                        searchFlag = true;
                    } else {
                        extraParams.DateFilter = false;
                        extraParams.arrive_time = '';
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
