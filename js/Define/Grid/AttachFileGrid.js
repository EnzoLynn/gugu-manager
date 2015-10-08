//AttachFile
//创建一个上下文菜单
var AttachFileGrid_RightMenu = Ext.create('Ext.menu.Menu', {
    items: [ActionBase.getAction('refreshAttachFile'), '-',
        ActionBase.getAction('searchAttachFile'),
        ActionBase.getAction('removeAttachFile'),
        ActionBase.getAction('uploadAttachFile'), '-',
        ActionBase.getAction('validateAttachFile'),
      //  ActionBase.getAction('importAttachFile'),
        ActionBase.getAction('dlErrorReportAttachFile')
    ]
});



Ext.define('chl.gird.AttachFileGrid', {
    alternateClassName: ['AttachFileGrid'],
    alias: 'widget.AttachFileGrid',
    extend: 'chl.grid.BaseGrid',
    store: 'AttachFileGridStoreId',
    actionBaseName: 'AttachFileGridAction',
    multiSelect: true,
    // viewConfig: {
    //     loadingText: '<b>' + '正在加载数据...' + '</b>',
    //     enableTextSelection: true
    // },
    listeners: {
        itemclick: function(grid, record, hitem, index, e, opts) {
            var me = this;
        },
        itemdblclick: function(grid, record, hitem, index, e, opts) {
            //ActionBase.getAction('editAttachFile').execute();
        },
        itemcontextmenu: function(view, rec, item, index, e, opts) {
            e.stopEvent();
            AttachFileGrid_RightMenu.showAt(e.getXY());
        },
        beforeitemmousedown: function(view, record, item, index, e, options) {
            var me = this;
        },
        selectionchange: function(view, seles, op) {
            if (!seles[0])
                return;
            ActionBase.updateActions('AttachFileGridAction', seles);
        }
    },

    columns: [],
    dockedItems: [{
        xtype: 'toolbar',
        itemId: 'toolbarID',
        dock: 'top',
        layout: {
            overflowHandler: 'Menu'
        },
        items: [ActionBase.getAction('refreshAttachFile'), '-',
            ActionBase.getAction('searchAttachFile'),
            ActionBase.getAction('removeAttachFile'),
            ActionBase.getAction('uploadAttachFile'), '-',
            ActionBase.getAction('validateAttachFile'),
           // ActionBase.getAction('importAttachFile'),
            ActionBase.getAction('dlErrorReportAttachFile')

        ]
    }, {
        xtype: 'Pagingtoolbar',
        itemId: 'pagingtoolbarID',
        store: 'AttachFileGridStoreId',
        dock: 'bottom',
        items: [{
            xtype: 'tbtext',
            text: '过滤:'
        }, {
            xtype: 'GridFilterMenuButton',
            itemId: 'menuID',
            text: '全部状态',
            filterParam: {
                group: 'validate_statusGroup',
                text: '全部状态',
                filterKey: 'status',
                GridTypeName: 'AttachFileGrid',
                store: StoreManager.ComboStore.AttachFileGridValidate_statusStore
            }
        }, '-', {
            xtype: 'GridSelectCancelMenuButton',
            itemId: 'selectRecId',
            text: '选择',
            targetName: 'AttachFileGrid'
        }]
    }],
    initComponent: function() {
        var me = this;
        var filter = '';
        me.callParent(arguments); // 调用父类方法

        ActionBase.setTargetView(me.actionBaseName, me);
        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    },
    loadGrid: function(clearFilter, noPageOne) {
        var me = this;
        var store = me.getStore();

        // store.pageSize = GlobalConfig.GridPageSize;
        var sessiontoken = store.getProxy().extraParams.sessiontoken;
        if (!sessiontoken || sessiontoken.length == 0) {
            //return;
        }
        var filter = {};

        store.filterMap.each(function(key, value, length) {
            filter[key] = value;
        });
        store.getProxy().extraParams.filter = Ext.JSON.encode(filter);

        store.getProxy().extraParams.refresh = 1;
        if (noPageOne) {
            store.load();
        } else {
            store.loadPage(1);
        }

        store.getProxy().extraParams.refresh = null;
        GlobalFun.SetGridTitle(me.up('#centerGridDisplayContainer'), store, "票据列表");
        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    }
});

GridManager.AttachFileGridSerachfor_file_id = function(fileid) {
    var node = TreeManager.MainItemListTree.getStore().getNodeById('002');
    TreeManager.MainItemListTree.getSelectionModel().select(node, true);
    var store = GridManager.Tracking_numberGrid.getStore();
    var sessiontoken = store.getProxy().extraParams.sessiontoken;
    var filter = {};
    filter['file_id'] = fileid;
    if (!store.filterMap.containsKey('file_id')) {
        store.filterMap.add('file_id', fileid);
    } else {
        store.filterMap.replace('file_id', fileid);
    }
    store.getProxy().extraParams.filter = Ext.JSON.encode(filter);
    store.loadPage(1, {
        callback: function(records, operation, success) {
            GlobalFun.SetGridTitle(GridManager.Tracking_numberGrid.up('#centerGridDisplayContainer'), store, "票据列表");
            if (WindowManager.Tracking_numberWin && WindowManager.Tracking_numberWin != '') {

                var f = WindowManager.Tracking_numberWin.down('#formId');
                f.getForm().reset();
                WindowManager.Tracking_numberWin.down('#file_id').setValue(fileid);
            }

            var menuID = GridManager.Tracking_numberGrid.down('#menuID');

            menuID.setText(menuID.filterParam.text);
            menuID.setTooltip(menuID.filterParam.text);
            menuID.menu.items.items[0].setChecked(true);
        }
    });



};
//根据传入参数创建客户表，返回自身
GridManager.CreateAttachFileGrid = function(param) {
    var tmpArr = [{
        text: '文件编号',
        dataIndex: 'file_id',
        renderer: function(value, metaData, record) {
            if (record.data.status == 1) {
                return "<span onclick='GridManager.AttachFileGridSerachfor_file_id(" + value + ")'><img src='/dist/image/toolbar/NewDoc.png' style='margin-bottom: -2px;height:14px;'>&nbsp;" + value + "</span>";

            }

            return "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"+value;
        },
        flex: 1
    }, {
        text: '原文件名',
        dataIndex: 'file_name',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '服务器文件名',
        dataIndex: 'file_save_name',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '文件大小',
        dataIndex: 'file_size',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '操作人',
        dataIndex: 'admin_name',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '状态',
        dataIndex: 'status',
        renderer: function(value) {
            if (value == 1) {
                return '导入成功';
            }
            if (value == 2) {
                return '验证中';
            };
            if (value == 3) {
                return '验证失败';
            }
            if (value == 4) {
                return '导入中';
            }
            if (value == 5) {
                return '导入失败';
            }

            return '未验证';
        },
        flex: 1
    }, {
        text: '导入时间',
        dataIndex: 'import_time',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '创建时间',
        dataIndex: 'created_at',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }];
    GridManager.AttachFileGrid = Ext.create('chl.gird.AttachFileGrid',
        GridManager.BaseGridCfg('AttachFileGrid', 'AttachFileGridState', tmpArr));
    if (param && param.needLoad) {
        GridManager.AttachFileGrid.loadGrid();
    }
    return GridManager.AttachFileGrid;
};


//加载SelectionChange事件
GridManager.SetAttachFileGridSelectionChangeEvent = function(param) {
    GridManager.AttachFileGrid.on('selectionchange', function(view, seles, op) {
        if (!seles[0])
            return;

    });
};
