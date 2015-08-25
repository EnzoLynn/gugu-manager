Ext.define('chl.panel.CompanyPanel', {
    alternateClassName: ['CompanyPanel'],
    alias: 'widget.CompanyPanel',
    extend: 'Ext.panel.Panel',
    itemId: 'CompanyPanel'
});


//根据传入参数创建客户表，返回自身
GridManager.CreateCompanyPanel = function() {

    GridManager.CompanyPanel = Ext.create('chl.panel.CompanyPanel', {
        bodyPadding: 15,
        defaults: {
            xtype: 'button',
            width: 100,
            margin: '10 10 10 10'
        },
        items: [{
            text: '圆通快递',
            myval:'0031',
            id: '0031',
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
        }]
    });

    return GridManager.CompanyPanel;
};
