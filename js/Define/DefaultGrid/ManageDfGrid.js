Ext.create('Ext.data.ArrayStore', {
    storeId: 'ManageDfGridStoreId',
    fields: [{
        name: 'gridId',
        type: 'string'
    }, {
        name: 'gridName',
        type: 'string'
    }],
    autoLoad: false,
    pageSize: 10,
    data: [
	['001', '客户管理'],
	["002", 'yy管理']
    ]
});

Ext.define('chl.dfgrid.ManageDfGrid', {
    alternateClassName: ['ManageDfGrid'],
    alias: 'widget.ManageDfGrid',
    extend: 'Ext.grid.Panel',
    store: 'ManageDfGridStoreId',
    actionBaseName: 'ManageDfGrid',
    itemId: 'ManageDfGrid',
    FirstLoad: true,
    hideHeaders:true,
    viewConfig: {
        loadMask: false
    },
    columns: [{        
        groupable: false,
        sortable:false,
        dataIndex: 'gridName',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }],
    listeners: {
        itemclick: function (view, record) {
            var node = TreeManager.MainItemListTree.getStore().getNodeById(record.data.gridId);
            TreeManager.MainItemListTree.getSelectionModel().select(node, true);
        },
        itemmouseenter: function (view, record, item, index, e, eOpts) {
            item.style.cursor = 'pointer';
        },
        itemmouseleave: function (view, record, item, index, e, eOpts) {
            item.style.cursor = 'auto';
        }
    }
});