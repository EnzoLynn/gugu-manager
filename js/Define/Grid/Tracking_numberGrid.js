//创建一个上下文菜单
var Tracking_numberGrid_RightMenu = Ext.create('Ext.menu.Menu', {
    items: [ActionBase.getAction('refreshTracking_number'), '-',
            ActionBase.getAction('searchTracking_number'),'-',
        ActionBase.getAction('importTracking_number'), ActionBase.getAction('exportTracking_number')
    ]
});


Ext.define('chl.gird.Tracking_numberGrid', {
    alternateClassName: ['Tracking_numberGrid'],
    alias: 'widget.Tracking_numberGrid',
    extend: 'chl.grid.BaseGrid',
    store: 'Tracking_numberGridStoreId', 
    actionBaseName: 'Tracking_numberGridAction',
    listeners: {
        itemclick: function(grid, record, hitem, index, e, opts) {
            var me = this;
        },
        itemdblclick: function(grid, record, hitem, index, e, opts) {
            //ActionBase.getAction('editTracking_number').execute();
        },
        itemcontextmenu: function(view, rec, item, index, e, opts) {
            e.stopEvent();
            Tracking_numberGrid_RightMenu.showAt(e.getXY());
        },
        beforeitemmousedown: function(view, record, item, index, e, options) {
            var me = this;
        },
        selectionchange: function(view, seles, op) {
            if (!seles[0])
                return;
            ActionBase.updateActions('Tracking_numberGridAction', seles);
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
        items: [ActionBase.getAction('refreshTracking_number'), '-',
            ActionBase.getAction('searchTracking_number'),'-',
            ActionBase.getAction('importTracking_number'), ActionBase.getAction('exportTracking_number')
        ]
    }, {
        xtype: 'Pagingtoolbar',
        itemId: 'pagingtoolbarID',
        store: 'Tracking_numberGridStoreId',
        dock: 'bottom',
        items: [{
            xtype: 'tbtext',
            text: '过滤:'
        }, {
            xtype: 'GridFilterMenuButton',
            itemId: 'menuID',
            text: '全部状态',
            filterParam: {
                group: 'account_statusGroup',
                text: '全部类别',
                filterKey: 'account_status',
                GridTypeName: 'Tracking_numberGrid',
                store: StoreManager.ComboStore.Tracking_numberGridTypeStore
            }
        }, '-', {
            xtype: 'GridSelectCancelMenuButton',
            itemId: 'selectRecId',
            text: '选择',
            targetName: 'Tracking_numberGrid'
        }]
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

        // store.pageSize = GlobalConfig.GridPageSize;
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
        GlobalFun.SetGridTitle(me.up('#centerGridDisplayContainer'), store, "票据列表");
        ActionBase.updateActions(me.actionBaseName, me.getSelectionModel().getSelection());
    }
});


//根据传入参数创建客户表，返回自身
GridManager.CreateTracking_numberGrid = function(param) {
    var tmpArr = [{
        text: '编号',
        dataIndex: 'tracking_number_id',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '票据号',
        dataIndex: 'tracking_number',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '重量',
        dataIndex: 'weight',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '网点',
        dataIndex: 'arrive_express_point_name',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '网点代码',
        dataIndex: 'arrive_express_point_code',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '收货时间',
        dataIndex: 'arrive_time',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '收入',
        dataIndex: 'income',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '成本',
        dataIndex: 'cost',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '客户名称',
        dataIndex: 'customer_name',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '操作人',
        dataIndex: 'admin_name',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }, {
        text: '结算状态',
        dataIndex: 'account_status_name',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    },{
        text: '快递公司',
        dataIndex: 'express_name',
        renderer: GlobalFun.UpdateRecord,
        flex: 1
    }];
    GridManager.Tracking_numberGrid = Ext.create('chl.gird.Tracking_numberGrid',
        GridManager.BaseGridCfg('Tracking_numberGrid', 'Tracking_numberGridState', tmpArr));
    if (param && param.needLoad) {
        GridManager.Tracking_numberGrid.loadGrid();
    }
    return GridManager.Tracking_numberGrid;
};


//加载SelectionChange事件
GridManager.SetTracking_numberGridSelectionChangeEvent = function(param) {
    GridManager.Tracking_numberGrid.on('selectionchange', function(view, seles, op) {
        if (!seles[0])
            return;

    });
};


//添加编辑窗口
// Ext.define('chl.Grid.AddUpdateTracking_numberWin', {
//     extend: 'Ext.window.Window',
//     title: "添加",
//     defaultFocus: 'Tracking_numberItemId',
//     iconCls: '',
//     record: false,
//     //border: false,
//     height: 500,
//     width: 830,
//     layout: 'vbox',
//     modal: true,
//     resizable: false,
//     items: [{
//         xtype: 'form',
//         itemId: 'formId',
//         autoScroll: true,
//         height: 450,
//         width: 810,
//         border: false,
//         bodyPadding: 5,
//         defaultType: 'textfield',
//         layout: {
//             type: 'table',
//             columns: 2
//         },
//         defaults: {
//             labelAlign: 'right',
//             labelPad: 15,
//             width: 340,
//             labelWidth: 125,
//             maxLength: 100,
//             maxLengthText: '最大长度为100'
//         },
//         items: [{
//             name: 'Name',
//             fieldLabel: '姓名',
//             itemId: 'NameItemId',
//             validateOnBlur: false,
//             allowBlank: false,
//             blankText: '不能为空'
//         }, {
//             name: 'Name',
//             fieldLabel: '姓名',
//             itemId: 'NameItemId1',
//             validateOnBlur: false,
//             allowBlank: false,
//             blankText: '不能为空'
//         }, {
//             xtype: 'fieldset',
//             colspan: 2,
//             title: '规则',
//             itemId: 'ReNewManageHistory',
//             collapsible: true,
//             padding: '2 2 2 5',
//             width: 780,
//             defaults: {
//                 labelAlign: 'right',
//                 labelPad: 15,
//                 xtype: 'fieldset',
//                 defaults: {
//                     labelAlign: 'right',
//                     labelPad: 15,
//                     width: 340,
//                     labelWidth: 125,
//                     maxLength: 100,
//                     maxLengthText: '最大长度为100'
//                 }
//             },
//             items: [],
//             listeners: {
//                 boxready: function(com) {
//                     for (key in GlobalConfig.Province) {
//                         com.add({
//                             title: GlobalConfig.Province[key],
//                             items: [{
//                                 xtype: 'label',
//                                 text: '现有规则:1'
//                             }, {
//                                 xtype: 'button',
//                                 width: 100,
//                                 text: '添加规则',
//                                 myval: key,
//                                 handler: function(com) {
//                                     var ruleWin = Ext.create('Ext.window.Window', {
//                                         title: com.myval,
//                                         width: 800,
//                                         height: 600,
//                                         modal: true,
//                                         autoScroll: true,
//                                         layout: 'vbox',
//                                         dockedItems: [{
//                                             xtype: 'form',
//                                             dock: 'top',
//                                             bodyStyle: {
//                                                 padding: '10 5 5 5'
//                                             },

//                                             height: 130,
//                                             width: 810,
//                                             layout: {
//                                                 type: 'table',
//                                                 columns: 2
//                                             },
//                                             defaultType: 'textfield',
//                                             defaults: {
//                                                 labelAlign: 'right',
//                                                 labelPad: 15,
//                                                 width: 340,
//                                                 labelWidth: 125,
//                                                 maxLength: 100,
//                                                 maxLengthText: '最大长度为100'
//                                             },
//                                             items: [{
//                                                 xtype: 'fieldcontainer',
//                                                 fieldLabel: '区间',
//                                                 labelWidth: 100,

//                                                 width: 800,
//                                                 colspan: 2,
//                                                 layout: 'hbox',
//                                                 items: [{
//                                                     xtype: 'numberfield',
//                                                     validateOnChange: true,
//                                                     minValue: 0,
//                                                     maxValue: 9999 //,
//                                                         //regex:GlobalConfig.RegexController.regexNumber,
//                                                         //regexText:'请填写两位小数的数字'
//                                                 }, {
//                                                     xtype: 'splitter'
//                                                 }, {
//                                                     xtype: 'numberfield',
//                                                     regex: GlobalConfig.RegexController.regexMoney2Fixed,
//                                                     regexText: '请填写两位小数的数字'
//                                                 }]
//                                             }, {
//                                                 fieldLabel: '价格'
//                                             }, {
//                                                 xtype: 'button',
//                                                 colspan: 2,
//                                                 text: '添加',
//                                                 handler: function(com) {
//                                                     var win = com.up('window');
//                                                     win.add({
//                                                         xtype: 'fieldset',
//                                                         title: '规则1'
//                                                     });

//                                                 }
//                                             }]
//                                         }],
//                                         items: [{
//                                             xtype: 'fieldset',
//                                             title: '规则1'
//                                         }],
//                                         buttons: [{
//                                             text: '确定'
//                                         }, {
//                                             text: '取消'
//                                         }]
//                                     }).show();
//                                 }
//                             }]
//                         });
//                     }
//                 }
//             }
//         }]
//     }],
//     buttons: [{
//         text: '重置',
//         handler: function() {
//             var me = this;
//             var w = me.up('window');
//             var f = w.down('#formId');
//             f.getForm().reset();
//             if (w.action == 'update') {
//                 var sm = w.grid.getSelectionModel();
//                 if (sm.hasSelection()) {
//                     f.getForm().loadRecord(sm.getSelection()[0]);
//                 }
//             }
//         }
//     }, {
//         text: '确定',
//         itemId: 'submit',
//         handler: function() {
//             var me = this;
//             var w = me.up('window');

//             var form = w.down('#formId').getForm();

//             if (form.isValid()) {

//                 var url = w.action == "create" ? GlobalConfig.Controllers.Tracking_numberGrid.addTracking_number : GlobalConfig.Controllers.Tracking_numberGrid.updateTracking_number;
//                 form.submit({
//                     url: url,
//                     params: {
//                         req: 'dataset',
//                         dataname: 'AddUpdateTracking_number', // dataset名称，根据实际情况设置,数据库名
//                         restype: 'json',
//                         Id: w.record ? w.record.data.ControllTid : 0,
//                         logId: w.record ? w.record.data.Id : 0,
//                         action: w.action,
//                         sessiontoken: GlobalFun.getSeesionToken()
//                     },
//                     success: function(form, action) {
//                         w.grid.loadGrid();
//                         w.close();

//                     },
//                     failure: function(form, action) {
//                         if (!GlobalFun.errorProcess(action.result.code)) {
//                             Ext.Msg.alert('失败', action.result.msg);
//                         }
//                     }
//                 });
//             }
//         }
//     }, {
//         text: '取消',
//         handler: function() {
//             var me = this;
//             me.up('window').close();
//         }
//     }]
// });
