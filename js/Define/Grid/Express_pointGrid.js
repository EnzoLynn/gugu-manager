//创建一个上下文菜单
var Express_pointGrid_RightMenu = Ext.create('Ext.menu.Menu', {
    items: [ActionBase.getAction('refreshExpress_point'), '-',
        ActionBase.getAction('searchExpress_point'),
        ActionBase.getAction('addExpress_point'), ActionBase.getAction('editExpress_point'),
        ActionBase.getAction('delExpress_point')
    ]
});


Ext.define('chl.gird.Express_pointGrid', {
    alternateClassName: ['Express_pointGrid'],
    alias: 'widget.Express_pointGrid',
    extend: 'chl.grid.BaseGrid',
    store: 'Express_pointGridStoreId',
    actionBaseName: 'Express_pointGridAction',
    listeners: {
        itemclick: function(grid, record, hitem, index, e, opts) {
            var me = this;
        },
        itemdblclick: function(grid, record, hitem, index, e, opts) {
            ActionBase.getAction('editExpress_point').execute();
        },
        itemcontextmenu: function(view, rec, item, index, e, opts) {
            e.stopEvent();

            Express_pointGrid_RightMenu.showAt(e.getXY());
        },
        beforeitemmousedown: function(view, record, item, index, e, options) {
            var me = this;
        },
        selectionchange: function(view, seles, op) {
            if (!seles[0])
                return;
            ActionBase.updateActions('Express_pointGridAction', seles);
        }
    },
    columns: [],
    dockedItems: [{
        xtype: 'toolbar',
        itemId: 'toolbarID',
        dock: 'top',
        layout: {
            overflowHandler: 'Menu'
        },
        items: [ActionBase.getAction('refreshExpress_point'), '-',
            ActionBase.getAction('searchExpress_point'),
            ActionBase.getAction('addExpress_point'), ActionBase.getAction('editExpress_point'), ActionBase.getAction('delExpress_point')

            , '->', {
                fieldLabel: '按网点名查找',
                text: '按网点名查找', //用于控制工具栏使用
                width: 300,
                labelAlign: 'right',
                labelWidth: 80,
                xtype: 'searchfield',
                paramName: 'express_point_name',
                //paramObject: true,
                //minLength: 6,
                //minLengthText: '请输入6位编码',
                //maxLength: 6,
                //maxLengthText: '请输入6位编码',
                //paramNameArr: ['Area', 'Row', 'Column'],
                //store: searchStore,
                itemId: 'Express_pointGridSearchfieldId',
                listeners: {
                    render: function() {
                        var me = this;
                        me.store = GridManager.Express_pointGrid.getStore();
                    }
                }
            }
        ]
    }, {
        xtype: 'Pagingtoolbar',
        itemId: 'pagingtoolbarID',
        store: 'Express_pointGridStoreId',
        dock: 'bottom',
        items: []
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
        GlobalFun.SetGridTitle(me.up('#centerGridDisplayContainer'), store, "客户列表");
        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    }
});


//根据传入参数创建客户表，返回自身
GridManager.CreateExpress_pointGrid = function(param) {
    var tmpArr = [{
        text: '编号',
        dataIndex: 'point_id',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '网点名称',
        dataIndex: 'express_point_name',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '网点代码',
        dataIndex: 'express_point_code',
        renderer: GlobalFun.UpdateRecord,
        width: 100
    }, {
        text: '省份代码',
        dataIndex: 'province_code',
        renderer: GlobalFun.UpdateRecord,
        width: 100 
    }, {
        text: '省份名称',
        dataIndex: 'province_name',
        renderer: GlobalFun.UpdateRecord,
        width: 100,
        groupable: false,
        sortable: false
    }];
    GridManager.Express_pointGrid = Ext.create('chl.gird.Express_pointGrid',
        GridManager.BaseGridCfg('Express_pointGrid', 'Express_pointGridState', tmpArr));
    if (param && param.needLoad) {
        GridManager.Express_pointGrid.loadGrid();
    }
    return GridManager.Express_pointGrid;
};


//加载SelectionChange事件
GridManager.SetExpress_pointGridSelectionChangeEvent = function(param) {
    GridManager.Express_pointGrid.on('selectionchange', function(view, seles, op) {
        if (!seles[0])
            return;

    });
};
//添加客户编辑
Ext.define('chl.Grid.AddUpdateExpress_pointWin', {
    extend: 'Ext.window.Window',
    title: "添加",
    defaultFocus: 'express_point_nameItemId',
    iconCls: '',
    record: false,
    //border: false,
    height: 220,
    width: 430,
    layout: 'vbox',
    modal: true,
    resizable: false,
    items: [{
        xtype: 'form',
        itemId: 'formId',
        autoScroll: true,
        height: 250,
        width: 420,
        border: false,
        bodyPadding: 15,
        defaultType: 'textfield',
        layout: {
            type: 'table',
            columns: 1
        },
        defaults: {
            labelAlign: 'right',
            labelPad: 15,
            width: 340,
            labelWidth: 125,
            maxLength: 100,
            enableKeyEvents: true,
            listeners: {
                keydown: function(field, e, opts) {
                    var me = this;
                    if (e.getKey() == e.ENTER) {
                        var win = me.up('window');
                        win.down('#submit').fireHandler(e);
                    }
                }
            }
        },
        items: [{
            name: 'express_point_name',
            fieldLabel: '网点名称',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            maxLength: 40
        }, {
            name: 'express_point_code',
            fieldLabel: '网点代码',
            validateOnBlur: false,
            allowBlank: false,
            blankText: '不能为空',
            maxLength: 20
        }, {
            xtype: 'combobox',
            name: 'province_code',
            fieldLabel: '省份',
            store: 'ProvinceStoreId',
            queryMode: 'local',
            displayField: 'Name',
            valueField: 'Id',
            editable: false,
            allowBlank: false,
            blankText: '不能为空',
            listeners: {
                boxready: function(com) {
                    var w = com.up('window');
                    GlobalFun.comboSelectFirstOrDefaultVal(com);
                }
            }
        }]
    }],
    buttons: [{
        text: '重置',
        handler: function() {
            var me = this;
            var w = me.up('window');
            var f = w.down('#formId');
            f.getForm().reset();
            if (w.action == 'update') {
                var sm = w.grid.getSelectionModel();
                if (sm.hasSelection()) {
                    f.getForm().loadRecord(sm.getSelection()[0]);
                }
            }
        }
    }, {
        text: '确定',
        itemId: 'submit',
        handler: function() {
            var me = this;
            var w = me.up('window');

            var form = w.down('#formId').getForm();

            if (form.isValid()) {

                var url = w.action == "create" ? GlobalConfig.Controllers.Express_pointGrid.create : GlobalConfig.Controllers.Express_pointGrid.update;
                form.submit({
                    url: url,
                    params: {
                        req: 'dataset',
                        dataname: 'AddUpdateExpress_point', // dataset名称，根据实际情况设置,数据库名
                        restype: 'json',
                        express_id:1,
                        point_id: w.record ? w.record.data.point_id : 0,
                        action: w.action,
                        sessiontoken: GlobalFun.getSeesionToken()
                    },
                    success: function(form, action) {
                        w.grid.loadGrid();
                        w.close();

                    },
                    failure: function(form, action) {
                        if (!GlobalFun.errorProcess(action.result.code)) {
                            Ext.Msg.alert('失败', action.result.msg);
                        }
                    }
                });
            }
        }
    }, {
        text: '取消',
        handler: function() {
            var me = this;
            me.up('window').close();
        }
    }]
});
