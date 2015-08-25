Ext.define('chl.panel.ExpressPanel', {
    alternateClassName: ['ExpressPanel'],
    alias: 'widget.ExpressPanel',
    extend: 'Ext.panel.Panel',
    itemId: 'ExpressPanel'
});


//根据传入参数创建客户表，返回自身
GridManager.CreateExpressPanel = function() {
    var items = [];
    for (key in GlobalConfig.Province) {
        
        items.push({
            title:GlobalConfig.Province[key],
            code:key
        });
    }

    GridManager.ExpressPanel = Ext.create('chl.panel.ExpressPanel', {
        bodyPadding: 15,
        autoScroll:true,
        defaults: {
            xtype: 'fieldset',
            width: 100,
            margin: '10 10 10 10'
        },
        items: items
    });

    return GridManager.ExpressPanel;
};
