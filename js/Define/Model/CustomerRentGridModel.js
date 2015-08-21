Ext.define('chl.Model.CustomerRentGridModel', {
    extend: 'Ext.data.Model',
    idProperty: 'Id',
    alternateClassName: ['CustomerRentGridModel'],
    fields: [{
        name: 'customer_rent_id',
        type: 'string'
    }, {
        name: 'title', 
        type: 'string'
    }, {
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
    }]
});