Ext.define('chl.Model.Tracking_numberGridModel', {
    extend: 'Ext.data.Model',
    idProperty: 'Id',
    alternateClassName: ['Tracking_numberGridModel'],
    fields: [{
        name: 'tracking_number_id',
        type: 'string'
    },{
        name: 'tracking_number',
        type: 'string'
    }, {
        name: 'weight', 
        type: 'string'
    }, {
        name: 'arrive_express_point_name', 
        type: 'string'
    }, {
        name: 'arrive_express_point_code', 
        type: 'string'
    }, {
        name: 'arrive_time', 
        type: 'string'
    }, {
        name: 'income', 
        type: 'string'
    }, {
        name: 'cost', 
        type: 'string'
    }, {
        name: 'customer_id', 
        type: 'string'
    }, {
        name: 'customer_name', 
        type: 'string'
    }, {
        name: 'admin_id', 
        type: 'string'
    }, {
        name: 'admin_name', 
        type: 'string'
    }, {
        name: 'account_status', 
        type: 'string'
    }, {
        name: 'account_status_name', 
        type: 'string'
    }, {
        name: 'customer_rent_id', 
        type: 'string'
    },{
        name:'express_id'
    },{
        name:'express_name'
    }]
});