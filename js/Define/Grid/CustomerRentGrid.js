 

Ext.define('chl.gird.CustomerRentGrid', {
    alternateClassName: ['CustomerRentGrid'],
    alias: 'widget.CustomerRentGrid',
    extend: 'chl.grid.BaseGrid',
    store: 'CustomerRentGridStoreId',
    stateful: false,
    actionBaseName: 'CustomerRentGridAction',
    listeners: {
        itemclick: function(grid, record, hitem, index, e, opts) {
            var me = this;
        },
        itemdblclick: function(grid, record, hitem, index, e, opts) { 
        },
        itemcontextmenu: function(view, rec, item, index, e, opts) {
            e.stopEvent();

            CustomerRentGrid_RightMenu.showAt(e.getXY());
        },
        beforeitemmousedown: function(view, record, item, index, e, options) {
            var me = this;
        },
        selectionchange: function(view, seles, op) {
            if (!seles[0])
                return;
            //ActionBase.updateActions('CustomerRentGridAction', seles);
        }
    },
    columns: [{
        text: '编号',
        dataIndex: 'customer_rent_id',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '租贷面积(平米)',
        dataIndex: 'rent_area',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '面积单量比',
        dataIndex: 'area_to_order_number',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '房租单价',
        dataIndex: 'rent_pre_price',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '开始日期',
        dataIndex: 'date_start',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '结束日期',
        dataIndex: 'date_end',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }],
    dockedItems: [{
        xtype: 'toolbar',
        itemId: 'toolbarID',
        dock: 'top',
        layout: {
            overflowHandler: 'Menu'
        },
        items: [ActionBase.getAction('refreshCustomerRent'),
            ActionBase.getAction('addCustomerRent'), ActionBase.getAction('editCustomerRent'), ActionBase.getAction('addCustomerRentRent'), ActionBase.getAction('editCustomerRentRule')
        ]
    }, {
        xtype: 'Pagingtoolbar',
        itemId: 'pagingtoolbarID',
        store: 'CustomerRentGridStoreId',
        dock: 'bottom',
        items: []
    }],
    initComponent: function() {
        var me = this;
        var filter = '';
        me.callParent(arguments); // 调用父类方法

        ActionBase.setTargetView(me.actionBaseName, me);
        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    },
    loadGrid: function(isSearch) {
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

        store.loadPage(1);
        store.getProxy().extraParams.refresh = null;

        //ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    }
});


//根据传入参数创建客户表，返回自身
GridManager.CreateCustomerRentGrid = function(param) {
    var tmpArr = [{
        text: '编号',
        dataIndex: 'customer_rent_id',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '合同名',
        dataIndex: 'title',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '租贷面积(平米)',
        dataIndex: 'rent_area',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '面积单量比',
        dataIndex: 'area_to_order_number',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '房租单价',
        dataIndex: 'rent_pre_price',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '开始日期',
        dataIndex: 'date_start',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '结束日期',
        dataIndex: 'date_end',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }];
    GridManager.CustomerRentGrid = Ext.create('chl.gird.CustomerRentGrid',
        GridManager.BaseGridCfg('CustomerRentGrid', 'CustomerRentGridState', tmpArr));
    if (param && param.needLoad) {
        GridManager.CustomerRentGrid.loadGrid();
    }
    return GridManager.CustomerRentGrid;
};


//加载SelectionChange事件
GridManager.SetCustomerRentGridSelectionChangeEvent = function(param) {
    GridManager.CustomerRentGrid.on('selectionchange', function(view, seles, op) {
        if (!seles[0])
            return;

    });
};
