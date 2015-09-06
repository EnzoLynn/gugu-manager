Ext.define('chl.panel.ExpressPanel', {
    alternateClassName: ['ExpressPanel'],
    alias: 'widget.ExpressPanel',
    extend: 'Ext.tab.Panel',
    itemId: 'ExpressPanel'
});

GlobalFun.ExpressPanel_addRuleFun = function(com) {
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
                        value: item['price']
                    }, {
                        fieldLabel: '排序',
                        value: item['sort_order']
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

                        GlobalConfig.ExpressPanel_svgData = [];
                        GlobalConfig.ExpressPanel_svgData = data;
                        if (GridManager.ExpressPanel.getActiveTab().tabIndex == 1) {
                            if (Ext.isGecko) {
                                GridManager.ExpressPanel.el.mask('正在加载图形');
                            };
                            GlobalFun.InitChinaSvgDataEvent(GlobalConfig.ExpressPanel_svgData);
                            if (Ext.isGecko) {
                                GridManager.ExpressPanel.el.unmask();
                            }
                        } else {
                            Ext.Array.each(data, function(item, index, alls) {
                                var temp = GridManager.ExpressPanel.down('#lbl' + item.province_code);
                                temp.setText('现有规则:' + item.count);
                            });
                        }

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
                    GlobalFun.ExpressPanel_addRuleFun(com);
                }
            }]
        });
    }
    var activeTab = 1;
    var cookie = Ext.util.Cookies.get("GlobalConfig.globalStatus");
    if (cookie) {
        var obj = Ext.JSON.decode(cookie);
        if (typeof obj.expressPanel_cardIndex != 'undefined') {
            activeTab = obj.expressPanel_cardIndex;
        }
    }
    GridManager.ExpressPanel = Ext.create('chl.panel.ExpressPanel', {
        bodyPadding: 15,
        stateful: true,
        stateId: 'ExpressPanelStateId',
        activeTab: activeTab,
        listeners: {
            tabchange: function(com, newCard) {
                GlobalConfig.globalStatus.expressPanel_cardIndex = newCard.tabIndex;
                Ext.util.Cookies.set("GlobalConfig.globalStatus", Ext.JSON.encode(GlobalConfig.globalStatus),
                    new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365)));
                if (true) {};
                if (GridManager.ExpressPanel.getActiveTab().tabIndex == 1) {
                    if (Ext.isGecko) {
                        GridManager.ExpressPanel.el.mask('正在加载图形');
                    };
                    GlobalFun.InitChinaSvgDataEvent(GlobalConfig.ExpressPanel_svgData);
                    if (Ext.isGecko) {
                        GridManager.ExpressPanel.el.unmask();
                    }
                }
            }
        },
        items: [{
                title: '普通视图',
                tabIndex: 0,
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
            }, {
                title: '图形视图',
                autoScroll: true,
                tabIndex: 1,

                items: [{
                    xtype: 'container',
                    listeners: {
                        boxready: function(com) {
                            if (Ext.isGecko) {
                                com.el.mask('正在加载图形');
                            };
                            GlobalFun.CreatChinaSvg(com);
                            //GlobalFun.InitChinaSvgDataEvent(GlobalConfig.ExpressPanel_svgData);
                            if (Ext.isGecko) {
                                com.el.unmask();
                            }
                        }
                    },
                    items: []
                }]
            }]
            //
    });

    return GridManager.ExpressPanel;
};

GlobalFun.CreatChinaSvg = function(com) {
    GlobalFun.raphelR = Raphael(com.el.dom, 800, 700);
    //调用绘制地图方法
    paintMap(GlobalFun.raphelR);

    GlobalFun.raphelR.setViewBox(0, 0, 600, 500, false);

}

GlobalFun.InitChinaSvgDataEvent = function(data) {
    var R = GlobalFun.raphelR;
    var textAttr = {
        "fill": "#000",
        "font-size": "12px",
        "cursor": "pointer"
    };

    for (var state in china) {
        china[state]['path'].color = Raphael.getColor(0.9);

        (function(st, state) {
            st.attr({
                "cursor": "pointer"
            });
            //获取当前图形的中心坐标
            var xx = st.getBBox().x + (st.getBBox().width / 2);
            var yy = st.getBBox().y + (st.getBBox().height / 2);

            //***修改部分地图文字偏移坐标
            switch (china[state]['name']) {
                case "江苏":
                    xx += 5;
                    yy -= 10;
                    break;
                case "河北":
                    xx -= 10;
                    yy += 20;
                    break;
                case "天津":
                    xx += 10;
                    yy += 10;
                    break;
                case "上海":
                    xx += 10;
                    break;
                case "广东":
                    yy -= 10;
                    break;
                case "澳门":
                    yy += 10;
                    break;
                case "香港":
                    xx += 20;
                    yy += 5;
                    break;
                case "甘肃":
                    xx -= 40;
                    yy -= 30;
                    break;
                case "陕西":
                    xx += 5;
                    yy += 10;
                    break;
                case "内蒙古":
                    xx -= 15;
                    yy += 65;
                    break;
                default:
            }
            //写入文字      
            var val = '0';
            Ext.Array.each(data, function(item, index, alls) {
                if (item.province_code == china[state]['code']) {
                    val = item.count;
                };
            });
            if (typeof china[state]['text'] != 'undefined') {
                china[state]['text'].remove();
            };
            china[state]['text'] = R.text(xx, yy, china[state]['name'] + "(" + val + ")").attr(textAttr);
            //console.log(china[state]['code']);
            st[0].onclick = china[state]['text'][0].onclick = function() {
                //console.log(china[state]['text']);
                GlobalFun.ExpressPanel_addRuleFun({
                    myval: china[state]['code']
                });
            }

            st[0].onmouseover = china[state]['text'][0].onmouseover = function() {

                st.animate({
                    fill: st.color,
                    stroke: "#eee"
                }, 500);
                china[state]['text'].toFront();
                R.safari();
            };
            st[0].onmouseout = china[state]['text'][0].onmouseout = function() {
                st.animate({
                    fill: "#97d6f5",
                    stroke: "#eee"
                }, 500);
                china[state]['text'].toFront();
                R.safari();
            };

        })(china[state]['path'], state);
    }



}
