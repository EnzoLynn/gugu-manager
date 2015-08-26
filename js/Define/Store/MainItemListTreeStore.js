 Ext.create('Ext.data.TreeStore', {
     model: 'chl.Model.MainItemListTreeModel',
     storeId: 'MainItemListTreeStoreId',
     root: {
         id: "000",
         expanded: true,
         children: [{
             id: "001",
             text: "客户管理",
             leaf: true
         }, {
             id: "002",
             text: "票据管理",
             leaf: true
         }, {
             id: "003",
             text: "成本管理",
             expanded: true,
             children: [{
                 id: '0031',
                 express_id:1,
                 text: '圆通快递',
                 leaf: true
             }]
         }]
     }
 });
 // // 主页面树Store
 // Ext.create('Ext.data.TreeStore', {
 //     model: 'chl.Model.MainItemListTreeModel',
 //     storeId: 'MainItemListTreeStoreId',
 //     //autoLoad: false,
 //     // clearOnLoad:false,
 //     // proxy: {
 //     //     type: 'ajax',
 //     //     url: GlobalConfig.Controllers.MainItemListTree,
 //     //     extraParams: {
 //     //         sessiontoken: GlobalFun.getSeesionToken(),
 //     //         req: 'treenodes',
 //     //         treename: 'MainItemListTree',
 //     //         restype: 'json',
 //     //         hadsel: false

 //     //     },
 //     //     reader: {
 //     //         type: 'json',
 //     //         root: 'data',
 //     //         successProperty: 'success',
 //     //         messageProperty: 'msg'
 //     //     },
 //     //     actionMethods: {
 //     //         create: "POST",
 //     //         read: "GET",
 //     //         update: "POST",
 //     //         destroy: "POST"
 //     //     },
 //     //     listeners: {
 //     //         exception: function(proxy, response, operation) {
 //     //             var json = Ext.JSON.decode(response.responseText);
 //     //             var code = json.code;
 //     //             GlobalFun.errorProcess(code);
 //     //         }
 //     //     }
 //     // },

 //     root: {
 //         expanded: true,
 //         text: '系统',
 //         iconCls: 'fax',
 //         children: [{
 //             "Id": "001",
 //             "Text": "客户管理",
 //             "IsLeaf": true,
 //             "IconCls": "",
 //             "Expanded": false,
 //             "LinkSrc": "",
 //             "Parent": {
 //                 "Id": "000",
 //                 "Text": "系统",
 //                 "IsLeaf": false,
 //                 "IconCls": null,
 //                 "Expanded": false,
 //                 "LinkSrc": null,
 //                 "Parent": null,
 //                 "Children": null,
 //                 "Cls": null
 //             },
 //             "Children": null,
 //             "Cls": "treepanel-bigFontSize"
 //         }, {
 //             "Id": "002",
 //             "Text": "票据管理",
 //             "IsLeaf": true,
 //             "IconCls": "",
 //             "Expanded": false,
 //             "LinkSrc": "",
 //             "Parent": {
 //                 "Id": "000",
 //                 "Text": "系统",
 //                 "IsLeaf": false,
 //                 "IconCls": null,
 //                 "Expanded": false,
 //                 "LinkSrc": null,
 //                 "Parent": null,
 //                 "Children": null,
 //                 "Cls": null
 //             },
 //             "Children": null,
 //             "Cls": "treepanel-bigFontSize"
 //         }, {
 //             "Id": "003",
 //             "Text": "成本管理",
 //             "IsLeaf": false,
 //             "IconCls": "",
 //             "Expanded": false,
 //             "LinkSrc": "",
 //             "Parent": {
 //                 "Id": "000",
 //                 "Text": "系统",
 //                 "IsLeaf": false,
 //                 "IconCls": null,
 //                 "Expanded": false,
 //                 "LinkSrc": null,
 //                 "Parent": null,
 //                 "Children": null,
 //                 "Cls": null
 //             },
 //             "Children": [{
 //                 "Id": "0031",
 //                 "Text": "北京",
 //                 "IsLeaf": true,
 //                 "IconCls": "",
 //                 "Expanded": false,
 //                 "LinkSrc": "",
 //                 "Parent": {},
 //                 "Children": null,
 //                 "Cls": "treepanel-bigFontSize"
 //             },{
 //                 "Id": "0032",
 //                 "Text": "南京",
 //                 "IsLeaf": true,
 //                 "IconCls": "",
 //                 "Expanded": false,
 //                 "LinkSrc": "",
 //                 "Parent": {},
 //                 "Children": null,
 //                 "Cls": "treepanel-bigFontSize"
 //             }],
 //             "Cls": "treepanel-bigFontSize"
 //         }]
 //     }
 // });
