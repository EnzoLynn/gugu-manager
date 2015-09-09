Ext.define('chl.panel.CompanyPanel', {
    alternateClassName: ['CompanyPanel'],
    alias: 'widget.CompanyPanel',
    extend: 'Ext.panel.Panel',
    itemId: 'CompanyPanel'
});



GridManager.CreateCompanyBase = function(prefix) {
    return Ext.create('chl.panel.CompanyPanel', {
        bodyPadding: 15,   
        itemId: prefix+'_CompanyPanel',    
        defaults: {
            xtype: 'button',
            width: 100,
            margin: '10 10 10 10'
        },
        items: [{
            text: '圆通快递',
            myval: prefix + '_1',
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
}

//根据传入参数创建客户表，返回自身
GridManager.CreateCompanyPanel_Cost = function() {
    GridManager.CompanyPanel_Cost = GridManager.CreateCompanyBase('003');

    return GridManager.CompanyPanel_Cost;
};



//网点公司
GridManager.CreateCompanyPanel_Point = function() {
    GridManager.CompanyPanel_Point = GridManager.CreateCompanyBase('004');

    return GridManager.CompanyPanel_Point;
};
