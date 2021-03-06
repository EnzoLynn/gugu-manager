﻿// 主页面树Model
Ext.define('chl.Model.MainItemListTreeModel', {
    extend: 'Ext.data.Model',
    fields: [{
        name: 'id',
        type: 'string' 
    }, {
        name: 'text',
        type: 'string' 
    }, {
        name: 'leaf',
        type: 'boolean' 
    }, {
        name: 'iconCls',
        type: 'string' 
    }, {
        name: 'expanded',
        type: 'boolean' 
    }, {
        name: 'linksrc',
        type: 'string' 
    }, {
        name: 'parent' 
    }, {
        name: 'children' 
    }, {
        name: 'cls' 
    },{
        name:'express_id'
    }]
});