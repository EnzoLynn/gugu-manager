// MainItemListTree类
Ext.define('chl.tree.MainItemListTree', {
    alias: 'widget.MainItemListTree',
    itemId: 'MainItemListTree',
    title: '系统',
    iconCls: 'home',
    extend: 'chl.tree.BaseTree',
    clearOnLoad: false,
    alternateClassName: ['MainItemListTree'],
    store: 'MainItemListTreeStoreId',
    ddGroup: 'MainItemListTreeDDGp',
    //width : 400,
    //height : 600,
    animate: false,
    rootVisible: false,
    frame: false,
    frameHeader: false,
    border: false,
    listeners: {
        itemcontextmenu: function(view, rec, item, index, e, opts) {
            //console.log(rec.data.id);
            e.stopEvent();
            //folderTree_RightMenu.showAt(e.getXY());
        },
        expand: function(tree, opts) {
            if (!tree.getSelectionModel().hasSelection()) {
                tree.getSelectionModel().select(0, true);
            } else {
                tree.fireEvent("selectionchange", tree, tree.getSelectionModel().getSelection(), opts);
            }
        },

        boxready: function(com, width, height, opts) {
            (new Ext.util.DelayedTask()).delay(200, function() {
                if (!TreeManager.MainItemListTree.getSelectionModel().hasSelection()) {
                    var cookie = Ext.util.Cookies.get("GlobalConfig.globalStatus");
                    if (cookie) {
                        var obj = Ext.JSON.decode(cookie);
                        if (obj.tree_sel_id) {
                            var node = TreeManager.MainItemListTree.getStore().getNodeById(obj.tree_sel_id);
                            if (node) {
                                TreeManager.MainItemListTree.getSelectionModel().select(node, true);
                            } else {
                                TreeManager.MainItemListTree.getSelectionModel().select(0, true);
                            }

                        } else {
                            TreeManager.MainItemListTree.getSelectionModel().select(0, true);
                        }

                    } else {
                        TreeManager.MainItemListTree.getSelectionModel().select(0, true);
                    }

                }
            });
        }

    },
    initComponent: function() {
        var me = this;
        me.callParent(arguments);

    }
});

//根据传入参数创建客户表，返回自身
TreeManager.CreateMainItemListTree = function(param) {
    TreeManager.MainItemListTree = Ext.create('chl.tree.MainItemListTree');
    if (param && param.needLoad) {
        TreeManager.MainItemListTree.getStore().load({
            callback: function() {
                var rootNode = TreeManager.MainItemListTree.getRootNode();
                rootNode.expand();
            }
        });
    }
    return TreeManager.MainItemListTree;
};

TreeManager.SetMainItemListTreeSelectionChangeEvent = function(param) {
    TreeManager.MainItemListTree.on('selectionchange', function(view, seles, op) {
        if (!seles[0])
            return;
        GlobalConfig.globalStatus.tree_sel_id = seles[0].data.id;
        Ext.util.Cookies.set("GlobalConfig.globalStatus", Ext.JSON.encode(GlobalConfig.globalStatus),
            new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 365)));
        //自动恢复收缩状态
        //预定、出售、落葬管理
        // if (seles[0].data.id == 201 || seles[0].data.id == 202 || seles[0].data.id == 203) {

        // } else {
        //     GlobalFun.RefreshDetailCollapseState();
        // }
        if (seles[0].data.id == "root") {
            GlobalFun.TreeSelChangeGrid('ManageDfGrid', GridManager.ManageDfGrid, '系统', true);
            return;
        }

        if (seles[0].data.id == "001") {
            GlobalFun.TreeSelChangeGrid('CustomerGrid', GridManager.CustomerGrid, '客户列表');
            return;
        }
        if (seles[0].data.id == "002") {
            GlobalFun.TreeSelChangeGrid('Tracking_numberGrid', GridManager.Tracking_numberGrid, '票据列表');
            return;
        }
        if (seles[0].data.id == "003") {
            GlobalFun.TreeSelChangeGrid('CompanyPanel', GridManager.CompanyPanel, '快递公司', true);
            return;
        }
        if (seles[0].data.id == "0031") {
            GlobalFun.TreeSelChangeGrid('ExpressPanel', GridManager.ExpressPanel, '各省规则', true);
            var param = {
                'express_id': seles[0].data.express_id,
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
            }, true, false, GridManager.ExpressPanel.el);
            return;
        }


        //业务管理
        // if (seles[0].data.id == 2) {
        //     GlobalFun.TreeSelChangeGrid('JobManageDfGrid', GridManager.AreaSetDfGrid, '业务管理', true);
        //     return;
        // }

        // //预定、出售、落葬管理
        // if (seles[0].data.id == 201 || seles[0].data.id == 202 || seles[0].data.id == 203) {
        //     var title = "";
        //     if (seles[0].data.id == 201) {
        //         title = "墓碑预定";
        //     } else if (seles[0].data.id == 202) {
        //         title = "墓碑维护";
        //     }
        //     else if (seles[0].data.id == 203) {
        //         title = "墓碑落葬";
        //     }
        //     //自动收缩
        //     GlobalFun.DetailCollapse();
        //     GlobalFun.TreeSelChangeGrid('AreaTombstoneImagePanel', GridManager.AreaTombstoneImagePanel, title, true);
        //     GridManager.AreaTombstoneImagePanel.down('#tombCode').inputEl.focus(100);
        //     return;
        // }


    });
};
