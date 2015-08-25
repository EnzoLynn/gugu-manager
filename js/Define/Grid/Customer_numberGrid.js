Ext.define('chl.Model.Customer_numberGridModel', {
    extend: 'Ext.data.Model',
    idProperty: 'number_id',
    alternateClassName: ['Customer_numberGridModel'],
    fields: [{
        name: 'number_id'
    }, {
        name: 'customer_id'
    }, {
        name: 'customer_name'
    }, {
        name: 'customize_number_prefix'
    }, {
        name: 'customize_number_from'
    }, {
        name: 'customize_number_to'
    }, {
        name: 'customize_number_suffix'
    }]
});

Ext.create('Ext.data.Store', {
    model: 'chl.Model.Customer_numberGridModel',
    storeId: 'Customer_numberStoreId',
    filterMap: Ext.create('Ext.util.HashMap'),
    pageSize: GlobalConfig.GridPageSize,
    autoLoad: false,
    remoteSort: true, //排序通过查询数据库
    sorters: [{
        property: 'customer_id',
        direction: 'DESC'
    }],
    autoSync: false,
    proxy: {
        type: 'ajax',
        api: GlobalConfig.Controllers.Customer_numberGrid,
        filterParam: 'filter',
        sortParam: 'sort',
        directionParam: 'dir',
        limitParam: 'limit',
        startParam: 'start',
        simpleSortMode: true, //单一字段排序
        extraParams: {
            req: 'data',
            dataname: 'Customer_number', //dataset名称，根据实际情况设置,数据库名
            restype: 'json',
            sessiontoken: GlobalFun.getSeesionToken(),
            folderid: -1,
            refresh: null,
            template: '' //当前模版
        },
        reader: {
            type: 'json',
            root: 'data',
            seccessProperty: 'success',
            messageProperty: 'msg',
            totalProperty: 'total'
        },
        writer: {
            type: 'json',
            writeAllFields: false,
            allowSingle: false
                //			root: 'dataset'
        },
        actionMethods: {
            create: "POST",
            read: "GET",
            update: "POST",
            destroy: "POST"
        },
        listeners: {
            exception: function(proxy, response, operation) {
                var json = Ext.JSON.decode(response.responseText);
                var code = json.code;
                GlobalFun.errorProcess(code);
                if (operation.action != 'read') {
                    //GridManager.UserGrid.loadGrid();
                }
            }
        }
    },
    listeners: {
        load: function(store, records, suc, operation, opts) {
            var total = store.getTotalCount();
            if (total == 0) {
                //if (GridManager.UserGrid) {
                //    GridManager.UserGrid.down("#next").setDisabled(true);
                //    GridManager.UserGrid.down("#last").setDisabled(true);
                //}
            }
            if (suc) {

            } else {
                store.loadData([]);
            }
        }
    }

});


 

Ext.define('chl.gird.Customer_numberGrid', {
    extend: 'Ext.grid.Panel',
    alternateClassName: ['Customer_numberGrid'],
    alias: 'widget.Customer_numberGrid',
    store: 'Customer_numberStoreId',
    columnLines: true,
    multiSelect: true,
    actionBaseName: 'Customer_numberGridAction',
    dockedItems: [{
        xtype: 'Pagingtoolbar',
        itemId: 'pagingtoolbarID',
        store: 'CustomerRentGridStoreId',
        dock: 'bottom',
        items: []
    }],
    listeners: {
        itemclick: function(grid, record, hitem, index, e, opts) {
            var me = this;
        },
        itemdblclick: function(grid, record, hitem, index, e, opts) {},
        itemcontextmenu: function(view, rec, item, index, e, opts) {
            e.stopEvent();

            CustomerRentGrid_RightMenu.showAt(e.getXY());
        },
        beforeitemmousedown: function(view, record, item, index, e, options) {
            var me = this;
        },
        selectionchange: function(view, seles, op) {
            if (!seles[0])
                return;
            //ActionBase.updateActions('CustomerRentGridAction', seles);
        }
    },
    columns: [{
        header: '编号',
        dataIndex: 'number_id',
        flex: 1,
        renderer: function(value) {
            return value;
        }
    }, {
        header: '客户',
        dataIndex: 'customer_name',
        flex: 1.5
    }, {
        header: '面单号前缀',
        dataIndex: 'customize_number_prefix',
        flex: 1,
        editor: {
            maxLength: 20,
            maxLengthText: '长度最大为20字节'
        }
    }, {
        header: '面单号起始编号',
        dataIndex: 'customize_number_from',
        flex: 1,
        editor: {
            allowBlank: false,
            blankText: '不能为空',
            maxLength: 9,
            maxLengthText: '长度最大为9字节',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }
    }, {
        header: '面单号截止编号',
        dataIndex: 'customize_number_to',
        flex: 1,
        editor: {
            allowBlank: false,
            blankText: '不能为空',
            maxLength: 9,
            maxLengthText: '长度最大为9字节',
            regex: GlobalConfig.RegexController.regexNumber,
            regexText: '请输入数字'
        }
    }, {
        header: '面单号后缀',
        dataIndex: 'customize_number_suffix',
        flex: 1,
        editor: {
            maxLength: 20,
            maxLengthText: '长度最大为20字节'
        }
    }],
    initComponent: function() {
        var me = this;
        var filter = '';
        me.callParent(arguments); // 调用父类方法

        ActionBase.setTargetView(me.actionBaseName, me);
        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    },
    loadGrid: function(isSearch) {
        var me = this;
        var store = me.getStore();

        store.pageSize = GlobalConfig.GridPageSize;
        var sessiontoken = store.getProxy().extraParams.sessiontoken;
        if (!sessiontoken || sessiontoken.length == 0) {
            //return;
        }
        var filter = {};

        store.filterMap.each(function(key, value, length) {
            filter[key] = value;
        });
        store.getProxy().extraParams.filter = Ext.JSON.encode(filter);

        store.getProxy().extraParams.refresh = 1;

        store.loadPage(1);
        store.getProxy().extraParams.refresh = null;

        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    }
});

var Customer_numberGridRowEditing;
//添加客户面单号范围编辑
Ext.define('chl.Grid.AddUpdateCustomer_numberWin', {
    extend: 'Ext.window.Window',
    title: "添加",
    iconCls: '',
    record: false,
    //border: false,
    height: 700,
    width: 830,
    bodyPadding:10,
    layout: 'fit',
    modal: true,
    resizable: false,
    items: [{
        xtype: 'Customer_numberGrid',
        itemId: 'Customer_numberGrid',
        plugins: [
            Customer_numberGridRowEditing = Ext.create('Ext.grid.plugin.RowEditing', {
                clicksToMoveEditor: 1,
                autoCancel: true,
                listeners: {
                    edit: function(editor, obj, opts) {
                        //editor.context.record.data.faxNumber = covertToRightNumber(true,editor.context.record.data.faxNumber);
                        //Ext.StoreMgr.lookup('Customer_numberGridStore').sort('dispName');
                    },
                    beforeedit: function(editor, obj, opts) {
                        Customer_numberGridRowEditing.getEditor().saveBtnText = '提交';
                        Customer_numberGridRowEditing.getEditor().cancelBtnText = '取消';
                        Customer_numberGridRowEditing.getEditor().errorsText = '错误';
                    }
                }
            })
        ]
    }],
    buttons: [{
        text: '关闭',
        handler: function() {
            var me = this;
            Customer_numberGridRowEditing.cancelEdit();
            me.up('window').close();
        }
    }]
});