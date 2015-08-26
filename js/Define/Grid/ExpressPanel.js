Ext.define('chl.panel.ExpressPanel', {
    alternateClassName: ['ExpressPanel'],
    alias: 'widget.ExpressPanel',
    extend: 'Ext.panel.Panel',
    itemId: 'ExpressPanel'
});


//根据传入参数创建客户表，返回自身
GridManager.CreateExpressPanel = function() {
    var items = [];
    for (key in GlobalConfig.Province) {

        items.push({
            title: GlobalConfig.Province[key],
            code: key,
            layout: 'hbox',
            items: [{
                xtype: 'label',
                text: '现有规则:0',
                itemId: 'lbl' + key
            }, {
                xtype: 'button',
                text: '添加规则',
                margin: '0 0 0 20',
                width: 100,
                iconCls: 'btnAdd',
                myval: key,
                handler: function(com) {
                    var sel = TreeManager.MainItemListTree.getSelectionModel().getSelection()[0];
                    var param = {
                        express_id: sel.data.express_id,
                        province_code: com.myval,
                        sessiontoken: GlobalFun.getSeesionToken()
                    };
                    // 调用
                    WsCall.call(GlobalConfig.Controllers.ExpressPanel.GetExpressRule, 'GetExpressRule', param, function(response, opts) {

                        var data = response.data;

                        function createRuleRow(rowData) {
                            var tempRuleItems = [];
                            Ext.Array.each(rowData, function(item, index, alls) {
                                var obj = {},
                                    title = '';
                                if (item['price_type'] == "1") {
                                    title = '固定价格';
                                } else {
                                    title = '称重价格';
                                }
                                obj = {
                                    xtype: 'fieldset',
                                    title: title,
                                    width: 770,
                                    collapsible: true,
                                    layout: {
                                        type: 'table',
                                        columns: 2
                                    },
                                    defaults: {
                                        xtype: 'displayfield',
                                        labelAlign: 'right',
                                        labelPad: 15,
                                        width: 340,
                                        labelWidth: 125,
                                        maxLength: 100,
                                        maxLengthText: '最大长度为100'
                                    },
                                    items: [{
                                        fieldLabel: '起始重量(kg)',
                                        value: item['weight_min']
                                    }, {
                                        fieldLabel: '结束重量(kg)',
                                        value: item['weight_max']
                                    }, {
                                        fieldLabel: '价格',
                                        value: item['price'],
                                        colspan: 2
                                    }, {
                                        xtype: 'button',
                                        colspan: 2,
                                        rule_id: item['rule_id'],
                                        width: 100,
                                        margin: '0 0 0 630',
                                        text: '删除',
                                        handler: function(com) {

                                            var rule_id = com.rule_id;
                                            var param = {
                                                'rule_id': rule_id,
                                                sessiontoken: GlobalFun.getSeesionToken()
                                            };
                                            // 调用
                                            WsCall.call(GlobalConfig.Controllers.ExpressPanel.delExpressRule, 'delExpressRule', param, function(response, opts) {

                                                com.up('fieldset').destroy();
                                            }, function(response, opts) {
                                                if (!GlobalFun.errorProcess(response.code)) {
                                                    Ext.Msg.alert('失败', response.msg);
                                                }
                                            }, true, false, com.up('window').getEl());
                                        }
                                    }]
                                };
                                tempRuleItems.push(obj);
                            });
                            return tempRuleItems;
                        }
                        // priceType: 1,
                        // 获取详细的规则信息
                        //如已有规则，规则类型确定禁用项目
                        Ext.create('Ext.window.Window', {
                            title: '添加规则' + '(' + GlobalConfig.Province[com.myval] + ')',
                            pid: com.myval,
                            width: 820,
                            height: 700,
                            iconCls: 'editCustomerRule',
                            resizable: false,
                            action: 'create',
                            modal: true,
                            autoScroll: true,
                            layout: 'vbox',
                            bodyPadding: 10,
                            dockedItems: [{
                                xtype: 'container',
                                dock: 'top',
                                border: false,
                                bodyPadding: 15,
                                layout: {
                                    type: 'table',
                                    columns: 2
                                },
                                defaultType: 'textfield',
                                defaults: {
                                    labelAlign: 'right',
                                    labelPad: 15,
                                    width: 340,
                                    labelWidth: 125,
                                    maxLength: 100
                                },
                                items: [{
                                    xtype: 'form',
                                    itemId: 'price_type0',
                                    height: 140,
                                    width: 810,
                                    bodyPadding: 15,
                                    layout: {
                                        type: 'table',
                                        columns: 2
                                    },
                                    defaults: {
                                        labelAlign: 'right',
                                        labelPad: 15,
                                        width: 340,
                                        labelWidth: 125,
                                        maxLength: 100,
                                        maxLengthText: '最大长度为100'
                                    },
                                    items: [{
                                        xtype: 'fieldcontainer',
                                        colspan: 2,
                                        fieldLabel: '价格类型',
                                        defaultType: 'radiofield',
                                        layout: 'hbox',
                                        defaults: {
                                            flex: 1
                                        },
                                        items: [{
                                            boxLabel: '固定价格',
                                            checked: true,
                                            name: 'price_type',
                                            inputValue: '1'
                                        }, {
                                            boxLabel: '称重价格',
                                            name: 'price_type',
                                            inputValue: '2'
                                        }]
                                    }, {
                                        xtype: 'numberfield',
                                        name: 'weight_min',
                                        fieldLabel: '起始重量(kg)',
                                        minValue: 0,
                                        value: 0,
                                        decimalPrecision: 3,
                                        maxValue: GlobalConfig.MaxLimit,
                                        allowBlank: false,
                                        blankText: '不能为空'
                                    }, {
                                        xtype: 'numberfield',
                                        name: 'weight_max',
                                        fieldLabel: '结束重量(kg)',
                                        minValue: 0,
                                        value: 1,
                                        maxValue: GlobalConfig.MaxLimit,
                                        decimalPrecision: 3,
                                        allowBlank: false,
                                        blankText: '不能为空'
                                    }, {
                                        xtype: 'numberfield',
                                        name: 'price',
                                        fieldLabel: '价格',
                                        decimalPrecision: 2,
                                        minValue: 0,
                                        maxValue: GlobalConfig.MaxLimit,
                                        regex: GlobalConfig.RegexController.regexMoney2Fixed,
                                        regexText: '请填写两位小数的数字',
                                        allowBlank: false,
                                        blankText: '不能为空'
                                    }, {
                                        fieldLabel: '排序',
                                        xtype: 'numberfield',
                                        name: 'sort_order',
                                        decimalPrecision: 0,
                                        minValue: 1,
                                        value: 1
                                    }, {
                                        xtype: 'button',
                                        itemId: 'btn_add',
                                        colspan: 2,
                                        margin: '0 0 0 580',
                                        width: 100,
                                        text: '添加',
                                        handler: function(com) {
                                            var me = this;
                                            var w = me.up('window');

                                            var form = w.down('#price_type0').getForm();

                                            if (form.isValid()) {

                                                var url = GlobalConfig.Controllers.ExpressPanel.addExpressRule;
                                                form.submit({
                                                    url: url,
                                                    params: {
                                                        req: 'dataset',
                                                        dataname: 'addCustomerRule', // dataset名称，根据实际情况设置,数据库名
                                                        restype: 'json',
                                                        price_type: 0,
                                                        express_id: sel.data.express_id,
                                                        province_code: w.pid,
                                                        action: w.action,
                                                        sessiontoken: GlobalFun.getSeesionToken()
                                                    },
                                                    success: function(form, action) {
                                                        var data = action.result.data;
                                                        var arr = createRuleRow(data);
                                                        w.removeAll();
                                                        w.add(arr);

                                                    },
                                                    failure: function(form, action) {
                                                        if (!GlobalFun.errorProcess(action.result.code)) {
                                                            Ext.Msg.alert('失败', action.result.msg);
                                                        }
                                                    }
                                                });
                                            }


                                        }
                                    }]
                                }]
                            }],
                            items: [],
                            listeners: {
                                boxready: function(com) {
                                    var tempRuleItems = createRuleRow(data);

                                    com.add(tempRuleItems);
                                },
                                beforehide: function(com) {

                                    var param = {
                                        'express_id': sel.data.express_id,
                                        sessiontoken: GlobalFun.getSeesionToken()
                                    };
                                    // 调用
                                    WsCall.call(GlobalConfig.Controllers.ExpressPanel.GetCustomer_numberCount, 'GetCustomer_numberCount', param, function(response, opts) {

                                        var data = response.data;


                                        Ext.Array.each(data, function(item, index, alls) {
                                            var temp = GridManager.ExpressPanel.down('#lbl' + item.province_code);
                                            temp.setText('现有规则:' + item.count);
                                        });
                                    }, function(response, opts) {
                                        if (!GlobalFun.errorProcess(response.code)) {
                                            Ext.Msg.alert('失败', response.msg);
                                        }
                                    }, false);
                                }
                            },
                            buttons: [{
                                text: '退出',
                                handler: function() {
                                    var me = this;
                                    me.up('window').close();
                                }
                            }]
                        }).show();

                    }, function(response, opts) {
                        if (!GlobalFun.errorProcess(response.code)) {
                            Ext.Msg.alert('失败', response.msg);
                        }
                    }, true);
                }
            }]
        });
    }

    GridManager.ExpressPanel = Ext.create('chl.panel.ExpressPanel', {
        bodyPadding: 15,
        autoScroll: true,
        layout: {
            type: 'table',
            columns: 2
        },
        defaults: {
            xtype: 'fieldset',
            width: 400,
            margin: '10 10 10 10'
        },
        items: items
    });

    return GridManager.ExpressPanel;
};
