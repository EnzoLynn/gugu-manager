Ext.define('chl.Model.Express_pointGridModel', {
    extend: 'Ext.data.Model',
    idProperty: 'Id',
    alternateClassName: ['Express_pointGridModel'],
    fields: [{
        name: 'point_id',
        type: 'string'
    },{
        name: 'express_id',
        type: 'string'
    }, {
        name: 'express_name', 
        type: 'string'
    }, {
        name: 'express_point_name', 
        type: 'string'
    }, {
        name: 'express_point_code', 
        type: 'string'
    }, {
        name: 'province_code', 
        type: 'string'
    }, {
        name: 'province_name', 
        type: 'string'
    }]
});