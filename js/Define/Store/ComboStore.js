StoreManager.ComboStore.ProvinceStore = Ext.create('Ext.data.Store', {
    storeId: 'ProvinceStoreId',
    fields: ['Id', 'Name'],
    data: GlobalFun.JsonToArray(GlobalConfig.Province)
});

//角色Store
StoreManager.ComboStore.RoleStore = Ext.create('Ext.data.Store', {
    storeId: 'RoleStoreId',
    fields: ['Id', 'Name'],
    proxy: {
        type: 'ajax',
        actionMethods: 'POST',
        url: GlobalConfig.Controllers.ComboStore.LoadRoleStore,
        reader: {
            type: 'json'
        },
        extraParams: {
            req: 'dataset',
            dataname: 'Role',
            restype: 'json',
            sessiontoken: GlobalFun.getSeesionToken()
        },
        listeners: {
            exception: function(proxy, response, operation) {
                var json = Ext.JSON.decode(response.responseText);
                var code = json.code;
                GlobalFun.errorProcess(code);
            }
        }
    },
    autoLoad: false
});
