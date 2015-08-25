Ext.define('chl.panel.ExpressPanel', {
    alternateClassName: ['ExpressPanel'],
    alias: 'widget.ExpressPanel',
    extend: 'Ext.panel.Panel',
    itemId: 'ExpressPanel'
});


//根据传入参数创建客户表，返回自身
GridManager.CreateExpressPanel = function() {
    var items = [];
    Ext.Array.each(MainItemListTreeStoreCostChildrenArr, function(item, index) {
        items.push({
            text: item.text,
            myval: item.id,
            handler: function(com) {
                var node = TreeManager.MainItemListTree.getStore().getNodeById(com.myval);
                var parentNode = node.parentNode;
                if (parentNode.isExpanded()) {
                    TreeManager.MainItemListTree.getSelectionModel().select(node, true);
                } else {
                    parentNode.expand(false, function() {
                        TreeManager.MainItemListTree.getSelectionModel().select(node, true);
                    });
                }
            }
        });
    });
    GridManager.ExpressPanel = Ext.create('chl.panel.ExpressPanel', {
        bodyPadding: 15,
        defaults: {
            xtype: 'button',
            width: 100,
            margin:'10 10 10 10'
        },
        items: items
    });

    return GridManager.ExpressPanel;
};
