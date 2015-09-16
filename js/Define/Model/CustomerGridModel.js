Ext.define('chl.Model.CustomerGridModel', {
    extend: 'Ext.data.Model',
    idProperty: 'Id',
    alternateClassName: ['CustomerGridModel'],
    fields: [{
        name: 'customer_id',
        type: 'string'
    }, {
        name: 'customer_name', 
        type: 'string'
    }, {
        name: 'customer_no', 
        type: 'string'
    }, {
        name: 'real_name', 
        type: 'string'
    }, {
        name: 'mobile', 
        type: 'string'
    },{
        name:'yto_no'
    }, {
        name: 'customize_number_from', 
        type: 'string'
    }, {
        name: 'customize_number_to', 
        type: 'string'
    },{
        name: 'customer_rent_id',
        type: 'string'
    },  {
        name: 'rent_area', 
        type: 'string'
    }, {
        name: 'area_to_order_number', 
        type: 'string'
    }, {
        name: 'rent_pre_price', 
        type: 'string'
    }, {
        name: 'date_start', 
        type: 'string'
    }, {
        name: 'date_end', 
        type: 'string'
    }, {
        name: 'updated_at', 
        type: 'string'
    }]
});