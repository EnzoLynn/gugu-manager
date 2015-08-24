Ext.define('chl.Action.Tracking_numberGridAction', {
    extend: 'WS.action.Base',
    category: 'Tracking_numberGridAction'
});


Ext.create('chl.Action.Tracking_numberGridAction', {
    itemId: 'importTracking_number',
    iconCls: 'import',
    tooltip: '导入',
    text: '导入',
    handler: function() {
        var target = this.getTargetView();
        var win = Ext.create('Ext.window.Window', {
            height: 400,
            width: 800,
            resizeabled: false,
            title: '上传文件',
            items: [{
                xtype: 'form',
                itemId: 'formId',
                items: [{
                    xtype: 'filefield',
                    name: 'importAddr',
                    fieldLabel: '请选择导入的文件',
                    width: 400,
                    labelWidth: 150,
                    blankText: '请选择导入的文件',
                    msgTarget: 'side',
                    itemId: 'fileupId',
                    buttonText: '...',
                    listeners: {
                        change: function() {
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
                            var urlStr = GlobalConfig.Controllers.Tracking_numberGrid.uploadExcel + "?req=call&callname=importcustomerUp&sessiontoken=" + GlobalFun.getSeesionToken();
                            form.submit({
                                timeout: 60 * 10,
                                url: urlStr,
                                waitMsg: '正在上传...',
                                waitTitle: '等待文件上传,请稍候...',
                                success: function(fp, o) {
                                    var data = action.result.data;
                                    if (action.result.success) {
                                        target.loadGrid();
                                    };
                                },
                                failure: function(fp, o) {
                                    if (!GlobalFun.errorProcess(o.result.code)) {
                                        Ext.Msg.alert('登录失败', response.msg);
                                    }
                                }
                            });
                        }
                    }
                }]
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
    handler: function () {
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
    updateStatus: function (selection) {
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

//刷新逝者
ActionManager.refreshTracking_number = function(traget) {
    traget.loadGrid();
};
