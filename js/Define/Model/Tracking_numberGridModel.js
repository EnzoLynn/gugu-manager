Ext.define('chl.Model.Tracking_numberGridModel', {
    extend: 'Ext.data.Model',
    idProperty: 'Id',
    alternateClassName: ['Tracking_numberGridModel'],
    fields: [{
        name: 'Id',
        type: 'string'
    }, {
        name: 'Name',
        mapping: 'Name',
        type: 'string'
    }]
});