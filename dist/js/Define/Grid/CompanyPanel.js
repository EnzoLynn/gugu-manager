Ext.define("chl.panel.CompanyPanel",{alternateClassName:["CompanyPanel"],alias:"widget.CompanyPanel",extend:"Ext.panel.Panel",itemId:"CompanyPanel"}),GridManager.CreateCompanyBase=function(prefix){return Ext.create("chl.panel.CompanyPanel",{bodyPadding:15,itemId:prefix+"_CompanyPanel",defaults:{xtype:"button",width:100,margin:"10 10 10 10"},items:[{text:"圆通快递",myval:prefix+"_1",handler:function(com){var node=TreeManager.MainItemListTree.getStore().getNodeById(com.myval),parentNode=node.parentNode;parentNode.isExpanded()?TreeManager.MainItemListTree.getSelectionModel().select(node,!0):parentNode.expand(!1,function(){TreeManager.MainItemListTree.getSelectionModel().select(node,!0)})}}]})},GridManager.CreateCompanyPanel_Cost=function(){return GridManager.CompanyPanel_Cost=GridManager.CreateCompanyBase("003"),GridManager.CompanyPanel_Cost},GridManager.CreateCompanyPanel_Point=function(){return GridManager.CompanyPanel_Point=GridManager.CreateCompanyBase("004"),GridManager.CompanyPanel_Point};
//# sourceMappingURL=CompanyPanel.js.map