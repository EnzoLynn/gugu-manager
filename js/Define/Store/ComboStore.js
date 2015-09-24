StoreManager.ComboStore.ProvinceStore = Ext.create('Ext.data.Store', {
    storeId: 'ProvinceStoreId',
    fields: ['Id', 'Name'],
    data: GlobalFun.JsonToArray(GlobalConfig.Province)
});

StoreManager.ComboStore.Tracking_numberGridTypeStore = Ext.create('Ext.data.Store', {
    storeId: 'Tracking_numberGridTypeStoreId',
    fields: ['Id', 'Name'],
    data: [{
        Id: 0,
        Name: '未结算'
    }, {
        Id: 1,
        Name: '已结算'
    }]
});

StoreManager.ComboStore.Customer_numberGridStatusStore = Ext.create('Ext.data.Store', {
    storeId: 'Tracking_numberGridTypeStoreId',
    fields: ['Id', 'Name'],
    data: [{
        Id: 0,
        Name: '未使用'
    }, {
        Id: 1,
        Name: '已使用'
    }]
});

StoreManager.ComboStore.AttachFileGridValidate_statusStore = Ext.create('Ext.data.Store', {
    storeId: 'Tracking_numberGridTypeStoreId',
    fields: ['Id', 'Name'],
    data: [{
        Id: 0,
        Name: '未验证'
    }, {
        Id: 1,
        Name: '已验证'
    }]
});
StoreManager.ComboStore.AttachFileGridImport_statusStore = Ext.create('Ext.data.Store', {
    storeId: 'Tracking_numberGridTypeStoreId',
    fields: ['Id', 'Name'],
    data: [{
        Id: 0,
        Name: '未导入'
    }, {
        Id: 1,
        Name: '已导入'
    }]
});


//角色Store
// StoreManager.ComboStore.RoleStore = Ext.create('Ext.data.Store', {
//     storeId: 'RoleStoreId',
//     fields: ['Id', 'Name'],
//     proxy: {
//         type: 'ajax',
//         actionMethods: 'POST',
//         url: GlobalConfig.Controllers.ComboStore.LoadRoleStore,
//         reader: {
//             type: 'json'
//         },
//         extraParams: {
//             req: 'dataset',
//             dataname: 'Role',
//             restype: 'json',
//             sessiontoken: GlobalFun.getSeesionToken()
//         },
//         listeners: {
//             exception: function(proxy, response, operation) {
//                 var json = Ext.JSON.decode(response.responseText);
//                 var code = json.code;
//                 GlobalFun.errorProcess(code);
//             }
//         }
//     },
//     autoLoad: false
// });
