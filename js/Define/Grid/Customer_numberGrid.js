Ext.define('chl.Model.Customer_numberGridModel', {
    extend: 'Ext.data.Model',
    idProperty: 'number_id',
    alternateClassName: ['Customer_numberGridModel'],
    fields: [{
        name: 'number_id'
    }, {
        name: 'customer_id'
    }, {
        name: 'customer_name'
    }, {
        name: 'tracking_number'
    }, {
        name: 'use_status'
    }, {
        name: 'use_status_name'
    }, {
        name: 'use_time'
    },{
        name:'created_at'
    }]
});


Ext.create('Ext.data.Store', {
    model: 'chl.Model.Customer_numberGridModel',
    storeId: 'Customer_numberStoreId',
    filterMap: Ext.create('Ext.util.HashMap'),
    pageSize: GlobalConfig.GridPageSize + 150,
    autoSync: false,
    autoLoad: false,
    remoteSort: true, //排序通过查询数据库
    sorters: [{
        property: 'number_id',
        direction: 'DESC'
    }],
    proxy: {
        type: 'ajax',
        // headers: {"Content-Type": 'application/x-www-form-urlencoded' },
        api: GlobalConfig.Controllers.Customer_numberGrid,
        filterParam: 'filter',
        sortParam: 'sort',
        directionParam: 'dir',
        limitParam: 'limit',
        startParam: 'start',
        simpleSortMode: true, //单一字段排序
        extraParams: {
            req: 'data',
            dataname: 'Customer_number', //dataset名称，根据实际情况设置,数据库名
            restype: 'json',
            sessiontoken: GlobalFun.getSeesionToken(),
            folderid: -1,
            refresh: null,
            template: '' //当前模版
        },
        reader: {
            type: 'json',
            root: 'data',
            seccessProperty: 'success',
            messageProperty: 'msg',
            totalProperty: 'total'
        },
        writer: {
            type: 'json'
        },
        actionMethods: {
            create: "POST",
            read: "POST",
            update: "POST",
            destroy: "POST"
        },
        listeners: {
            exception: function(proxy, response, operation) {
                var json = Ext.JSON.decode(response.responseText);
                var code = json.code;
                GlobalFun.errorProcess(code);
                if (operation.action != 'read') {
                    //GridManager.UserGrid.loadGrid();
                }
            }
        }
    },
    listeners: {
        load: function(store, records, suc, operation, opts) {
            var total = store.getTotalCount();
            if (total == 0) {
                //if (GridManager.UserGrid) {
                //    GridManager.UserGrid.down("#next").setDisabled(true);
                //    GridManager.UserGrid.down("#last").setDisabled(true);
                //}
            }
            if (suc) {

            } else {
                store.loadData([]);
            }
        }
    }

});


//var Customer_numberGridRowEditing;

// function createPlugin() {
//     Customer_numberGridRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
//         clicksToMoveEditor: 1,
//         autoCancel: true,
//         listeners: {
//             edit: function(editor, e, opts) {
//                 //e.record.commit();
//                 //editor.context.record.data.faxNumber = covertToRightNumber(true,editor.context.record.data.faxNumber);
//                 //Ext.Store 

//                 var sm = e.grid.getSelectionModel(); 
//                 e.store.sync({
//                     success: function(batch, action) { 
//                         e.store.load({
//                             callback: function(records, operation, success) {
//                                 if (e.store.getCount() > 0) {
//                                     sm.select(0);
//                                 }
//                             }
//                         }); 
//                     },
//                     failure: function(batch, action) { 
//                         if (batch.hasException) {
//                             Ext.Msg.alert('失败', batch.exceptions[0].error);
//                         } else {
//                             Ext.Msg.alert('失败', "同步失败");
//                         }

//                     }
//                 });
//             },
//             canceledit: function(editor, e, opts) {
//                 //e.grid.loadGrid();
//                 e.store.load();
//             },
//             beforeedit: function(editor, e, opts) {
//                 // console.log(Customer_numberGridRowEditing.getEditor());
//                 // Customer_numberGridRowEditing.getEditor().saveBtnText = '提交';
//                 // Customer_numberGridRowEditing.getEditor().cancelBtnText = '取消';
//                 // Customer_numberGridRowEditing.getEditor().errorsText = '错误';
//             }
//         }
//     });
// }
// createPlugin();
Ext.define('chl.gird.Customer_numberGrid', {
    extend: 'chl.grid.BaseGrid',
    alternateClassName: ['Customer_numberGrid'],
    alias: 'widget.Customer_numberGrid',
    store: 'Customer_numberStoreId',
    columnLines: true,
    multiSelect: true,
    actionBaseName: 'Customer_numberGridAction',
    dockedItems: [{
        xtype: 'Pagingtoolbar',
        itemId: 'pagingtoolbarID',
        store: 'Customer_numberStoreId',
        dock: 'bottom',
        items: [{
            xtype: 'tbtext',
            text: '过滤:'
        }, {
            xtype: 'GridFilterMenuButton',
            itemId: 'menuID',
            text: '全部状态',
            filterParam: {
                group: 'customer_nubmer_statusGroup',
                text: '全部类别',
                filterKey: 'use_status',
                GridTypeName: 'Customer_numberGrid',
                store: StoreManager.ComboStore.Customer_numberGridStatusStore
            }
        }, {
            xtype: 'GridFilterMenuButton',
            text: '全部时间',
            filterParam: {
                menuType: 'date',
                group: 'customer_nubmer_use_timeGroup',
                text: '全部时间',
                filterKey: 'use_time',
                GridTypeName: 'Customer_numberGrid'
            }
        }, '-', {
            xtype: 'GridSelectCancelMenuButton',
            itemId: 'selectRecId',
            text: '选择',
            targetName: 'Customer_numberGrid'
        }]
    }],
    listeners: {
        itemclick: function(grid, record, hitem, index, e, opts) {
            var me = this;
        },
        itemdblclick: function(grid, record, hitem, index, e, opts) {},
        itemcontextmenu: function(view, rec, item, index, e, opts) {
            e.stopEvent();
        },
        beforeitemmousedown: function(view, record, item, index, e, options) {
            var me = this;
        },
        selectionchange: function(view, seles, op) {
            if (!seles[0])
                return;

            var me = this;
            me.down('#removeCustomer_number').setDisabled(!seles.length);
            //me.down('#editCustomer_number').setDisabled(seles.length != 1);
            //ActionBase.updateActions('CustomerRentGridAction', seles);
        }
    },
    tbar: [{
            text: '刷新',
            tooltip: '刷新',
            iconCls: 'refresh',
            handler: function() {
                var me = this;
                var grid = me.up('Customer_numberGrid');
                Ext.StoreMgr.lookup('Customer_numberStoreId').load();
                grid.down('#removeCustomer_number').setDisabled(true);
                //grid.down('#editCustomer_number').setDisabled(true);

            }
        }, '-', {
            text: '添加',
            tooltip: '添加客户面单号范围',
            iconCls: 'add',
            handler: function() {
                var me = this;
                var target = me.up('Customer_numberGrid');

                ActionManager.addCustomer_number(target);
                //Customer_numberGridRowEditing.cancelEdit();

                // Create a record instance through the ModelManager
                // var r = Ext.ModelManager.create({
                //     number_id: '',
                //     customer_id: WindowManager.AddUpdateCustomer_numberWin.record.data.customer_id,
                //     customer_name: WindowManager.AddUpdateCustomer_numberWin.record.data.customer_name,
                //     customize_number_prefix: '',
                //     customize_number_from: '',
                //     customize_number_to: '',
                //     customize_number_suffix: ''
                // }, 'chl.Model.Customer_numberGridModel');

                // Ext.StoreMgr.lookup('Customer_numberStoreId').insert(0, r);

                // Customer_numberGridRowEditing.startEdit(0, 1);

            }
        }
        // , {
        //     text: '编辑',
        //     tooltip: '编辑客户面单号范围',
        //     itemId: 'editCustomer_number',
        //     iconCls: 'edit',
        //     handler: function() {
        //         var me = this;
        //         var grid = me.up('Customer_numberGrid');
        //         var sm = me.up('Customer_numberGrid').getSelectionModel();
        //         var record = sm.getSelection()[0];
        //         //Customer_numberGridRowEditing.startEdit(record, 1);

        //     },
        //     disabled: true
        // }
        // , {
        //     itemId: 'removeCustomer_number',
        //     text: '删除',
        //     tooltip: '删除',
        //     iconCls: 'remove',
        //     handler: function() {
        //         var me = this;
        //         var grid = me.up('Customer_numberGrid');

        //         ActionManager.delCustomer_number(grid);
        //         // Customer_numberGridRowEditing.cancelEdit();
        //         // Ext.StoreMgr.lookup('Customer_numberStoreId').remove(records);
        //         // Ext.StoreMgr.lookup('Customer_numberStoreId').sync({
        //         //     success: function(batch, opts) {

        //         //         grid.loadGrid();
        //         //         if (Ext.StoreMgr.lookup('Customer_numberStoreId').getCount() > 0) {
        //         //             sm.select(0);
        //         //         }
        //         //     },
        //         //     failure: function(batch, opts) {
        //         //         Ext.Msg.alert('失败', action.result.msg);
        //         //     }
        //         // });

        //     },
        //     disabled: true
        // }
    ],
    columns: [{
        header: '编号',
        dataIndex: 'number_id',
        flex: 1,
        renderer: function(value) {
            return value;
        }
    }, {
        header: '面单编号',
        dataIndex: 'tracking_number',
        flex: 1 //,
            // editor: {
            //     allowBlank: false,
            //     blankText: '不能为空',
            //     maxLength: 20,
            //     maxLengthText: '长度最大为20字节',
            //     regex: GlobalConfig.RegexController.regexNumber,
            //     regexText: '请输入数字'
            // }
    }, {
        header: '状态',
        dataIndex: 'use_status',
        flex: 1,
        renderer: function(value) {

            return value == 0 ? '未用' : '已用';
        }
    }, {
        header: '使用时间',
        dataIndex: 'use_time',
        flex: 1
    }],
    initComponent: function() {
        var me = this;
        var filter = '';
        me.callParent(arguments); // 调用父类方法

        ActionBase.setTargetView(me.actionBaseName, me);
        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    },
    loadGrid: function(clearFilter) {
        var me = this;
        var store = me.getStore();

        //store.pageSize = GlobalConfig.GridPageSize;
        var sessiontoken = store.getProxy().extraParams.sessiontoken;
        if (!sessiontoken || sessiontoken.length == 0) {
            //return;
        }
        var filter = {};
        if (clearFilter) {
            filter = {};
        } else {
            store.filterMap.each(function(key, value, length) {
                filter[key] = value;
            });
        }

        store.getProxy().extraParams.filter = Ext.JSON.encode(filter);



        store.getProxy().extraParams.refresh = 1;

        store.loadPage(1);
        store.getProxy().extraParams.refresh = null;

        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    }
});

//添加客户面单号范围编辑
Ext.define('chl.Grid.AddUpdateCustomer_numberWin', {
    extend: 'Ext.window.Window',
    title: "添加",
    iconCls: '',
    record: false,
    //border: false,
    height: 600,
    width: 830,
    bodyPadding: 10,
    layout: 'fit',
    modal: true,
    resizable: false,
    items: [],
    buttons: [{
        text: '关闭',
        handler: function() {
            var me = this;
            //Customer_numberGridRowEditing.cancelEdit();
            me.up('window').close();
        }
    }],
    listeners: {
        boxready: function(win) {
            //createPlugin();
            win.add({
                xtype: 'Customer_numberGrid',
                itemId: 'Customer_numberGrid' //,
                    //plugins: [Customer_numberGridRowEditing]
            });
            var grid = win.down('Customer_numberGrid');

            var store = grid.getStore();

            store.getProxy().extraParams.customer_id = win.record.data.customer_id;
            win.down('Customer_numberGrid').loadGrid();
        }
    }
});


// 添加面单号window
Ext.define('chl.Grid.Customer_numberActionWin', {
    extend: 'Ext.window.Window',
    title: "添加",
    defaultFocus: 'tracking_number_start',
    iconCls: '',
    record: false,
    //border: false,
    height: 140,
    width: 530,
    layout: 'fit',
    modal: true,
    resizable: false,
    items: [{
        xtype: 'form',
        itemId: 'formId',
        border: false,
        bodyPadding: 5,
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
            name: 'tracking_number_start',
            itemId: 'tracking_number_start',
            fieldLabel: '面单号起始编号',
            allowBlank: false,
            blankText: '不能为空',
            maxLength: 18
        }, {
            name: 'tracking_number_end',
            itemId: 'tracking_number_end',
            fieldLabel: '面单号截止编号',
            allowBlank: false,
            blankText: '不能为空',
            maxLength: 18
        }]
    }],
    buttons: [{
        text: '重置',
        handler: function() {
            var me = this;
            var w = me.up('window');
            var f = w.down('#formId');
            f.getForm().reset();
            if (w.action == 'update') {
                var sm = w.grid.getSelectionModel();
                if (sm.hasSelection()) {
                    f.getForm().loadRecord(sm.getSelection()[0]);
                }
            }
        }
    }, {
        text: '确定',
        itemId: 'submit',
        handler: function() {
            var me = this;
            var w = me.up('window');

            var form = w.down('#formId').getForm();

            if (form.isValid()) {
                //面单号数量提示
                //普通面单：12位数字
                //到付面单：D+11位数字 
                //承诺达面单：C+11位数字 
                //电子面单：12或18位数字 
                //电子到付面单：DD+8位或10位数字 
                var regex = /^([A-Za-z]*)(\d+)$/;
                var tracking_number_start = w.down('#tracking_number_start').getValue();
                var tracking_number_end = w.down('#tracking_number_end').getValue();
                if (tracking_number_start.length != tracking_number_end.length) {
                    Ext.Msg.alert('提示', '请输入位数一致的面单范围.');
                    return;
                };
                var number_start_fix = tracking_number_start.replace(regex, function($0, $1, $2, $3) {
                    return $1;
                });
                var number_end_fix = tracking_number_end.replace(regex, function($0, $1, $2, $3) {
                    return $1;
                });
                if (number_start_fix.toUpperCase() != number_end_fix.toUpperCase()) {
                    Ext.Msg.alert('提示', '请输入相同的面单前缀.');
                    return;
                };
                var number_start_number = tracking_number_start.replace(regex, function($0, $1, $2, $3) {
                    return $2;
                });
                var number_end_number = tracking_number_end.replace(regex, function($0, $1, $2, $3) {
                    return $2;
                });
                var tempCount = Math.abs(number_start_number - number_end_number) + 1;
                GlobalConfig.newMessageBox.show({
                    title: '提示',
                    msg: '该面单范围即将产生' + tempCount + '条面单数据，是否继续?',
                    buttons: Ext.MessageBox.YESNO,
                    closable: false,
                    fn: function(btn) {
                        if (btn == 'yes') {
                            var url = w.action == "create" ? GlobalConfig.Controllers.Customer_numberGrid.create : GlobalConfig.Controllers.Customer_numberGrid.update;
                            form.submit({
                                url: url,
                                params: {
                                    req: 'dataset',
                                    dataname: 'Customer_numberGridAction', // dataset名称，根据实际情况设置,数据库名
                                    restype: 'json',
                                    customer_id: WindowManager.AddUpdateCustomer_numberWin.record.data.customer_id,
                                    action: w.action,
                                    sessiontoken: GlobalFun.getSeesionToken()
                                },
                                success: function(form, action) {
                                    w.grid.loadGrid();
                                    w.close();

                                },
                                failure: function(form, action) {
                                    if (!GlobalFun.errorProcess(action.result.code)) {
                                        Ext.Msg.alert('失败', action.result.msg);
                                    }
                                }
                            });
                        }
                    },
                    icon: Ext.MessageBox.QUESTION
                });



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



//新增 用户面单号
ActionManager.addCustomer_number = function(target) {
    //var record = traget.getStore().getAt(0);
    WindowManager.Customer_numberActionWin = Ext.create('chl.Grid.Customer_numberActionWin', {
        grid: target,
        iconCls: 'add',
        action: 'create',
        record: null,
        title: "新增"
    });
    WindowManager.Customer_numberActionWin.show(null, function() {
        //WindowManager.AddUpdateCustomerWin.down("#SupperManageItemId").setDisabled(GlobalFun.IsAllowFun('无限期管理年限') ? false : true);

    });
};

//删除 
ActionManager.delCustomer_number = function(traget) {
    var sm = traget.getSelectionModel();
    var records = sm.getSelection();
    if (!records[0])
        return;
    var ids = [];
    Ext.Array.each(records, function(rec) {
        ids.push(rec.data.number_id);
    });
    var store = traget.getStore();
    GlobalConfig.newMessageBox.show({
        title: '提示',
        msg: '您确定要删除选定的项目吗？',
        buttons: Ext.MessageBox.YESNO,
        closable: false,
        fn: function(btn) {
            if (btn == 'yes') {
                //获取当前登录用户信息
                var param = {
                    sessiontoken: GlobalFun.getSeesionToken(),
                    number_ids: ids.join()
                };
                // 调用
                WsCall.pcall(GlobalConfig.Controllers.Customer_numberGrid.destroy, 'Customer_numberGrid', param, function(response, opts) {
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
