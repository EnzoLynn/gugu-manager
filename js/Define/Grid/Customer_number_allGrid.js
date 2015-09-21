Ext.define('chl.Model.Customer_number_allGridModel', {
    extend: 'Ext.data.Model',
    idProperty: 'number_id',
    alternateClassName: ['Customer_number_allGridModel'],
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
    model: 'chl.Model.Customer_number_allGridModel',
    storeId: 'Customer_number_allStoreId',
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
            dataname: 'Customer_number_all', //dataset名称，根据实际情况设置,数据库名
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
//创建一个上下文菜单
var Customer_number_allGrid_RightMenu = Ext.create('Ext.menu.Menu', {
    items: [ActionBase.getAction('refreshCustomer_number_all'), '-'
    , ActionBase.getAction('searchCustomer_number_all')
    ,ActionBase.getAction('removeCustomer_number_all')]
});

Ext.define('chl.gird.Customer_number_allGrid', {
    extend: 'chl.grid.BaseGrid',
    alternateClassName: ['Customer_number_allGrid'],
    alias: 'widget.Customer_number_allGrid',
    store: 'Customer_number_allStoreId',
    columnLines: true,
    multiSelect: true,
    actionBaseName: 'Customer_number_allGridAction',
    dockedItems: [{
        xtype: 'Pagingtoolbar',
        itemId: 'pagingtoolbarID',
        store: 'Customer_number_allStoreId',
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
                GridTypeName: 'Customer_number_allGrid',
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
                GridTypeName: 'Customer_number_allGrid'
            }
        }, '-', {
            xtype: 'GridSelectCancelMenuButton',
            itemId: 'selectRecId',
            text: '选择',
            targetName: 'Customer_number_allGrid'
        }]
    }],
    listeners: {
        itemclick: function(grid, record, hitem, index, e, opts) {
            var me = this;
        },
        itemdblclick: function(grid, record, hitem, index, e, opts) {},
        itemcontextmenu: function(view, rec, item, index, e, opts) {
            e.stopEvent();
            Customer_number_allGrid_RightMenu.showAt(e.getXY());
        },
        beforeitemmousedown: function(view, record, item, index, e, options) {
            var me = this;
        },
        selectionchange: function(view, seles, op) {
            if (!seles[0])
                return;
 
            ActionBase.updateActions('Customer_number_allGridAction', seles);
        }
    },
    tbar: [ActionBase.getAction('refreshCustomer_number_all'), '-'
    , ActionBase.getAction('searchCustomer_number_all')
    ,ActionBase.getAction('removeCustomer_number_all_t')],
    columns: [],
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


//根据传入参数创建客户表，返回自身
GridManager.CreateCustomer_number_allGrid = function(param) {
    var tmpArr = [{
        header: '编号',
        dataIndex: 'number_id',
        flex: 1
    }, {
        header: '客户',
        dataIndex: 'customer_name',
        flex: 1
    }, {
        header: '面单编号',
        dataIndex: 'tracking_number',
        flex: 1
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
    }, {
        header: '创建时间',
        dataIndex: 'created_at',
        flex: 1
    }];
    GridManager.Customer_number_allGrid = Ext.create('chl.gird.Customer_number_allGrid',
        GridManager.BaseGridCfg('Customer_number_allGrid', 'Customer_number_allGridState', tmpArr));
    if (param && param.needLoad) {
        GridManager.Customer_number_allGrid.loadGrid();
    }
    return GridManager.Customer_number_allGrid;
};


//加载SelectionChange事件
GridManager.SetCustomer_number_allGridSelectionChangeEvent = function(param) {
    GridManager.Customer_number_allGrid.on('selectionchange', function(view, seles, op) {
        if (!seles[0])
            return;

    });
};
