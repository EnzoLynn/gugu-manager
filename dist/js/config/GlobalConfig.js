var login_sessiontoken=Ext.util.Cookies.get("login_sessiontoken"),login_username=Ext.util.Cookies.get("login_username"),login_password=Ext.util.Cookies.get("login_password"),login_checksavepass=Ext.util.Cookies.get("login_checksavepass");Ext.namespace("GlobalFun","GlobalFun"),Ext.namespace("StoreManager","StoreManager.GridStore"),Ext.namespace("StoreManager","StoreManager.ComboStore"),Ext.namespace("ModelManager","ModelManager.GridModel"),Ext.namespace("ModelInfoManager","ModelInfoManager.GridModelInfo"),Ext.namespace("GridManager","GridManager"),Ext.namespace("WindowManager","WindowManager"),Ext.namespace("ActionManager","ActionManager"),Ext.namespace("GlobalConfig","GlobalConfig"),Ext.namespace("DropDragControl","DropDragControl"),Ext.namespace("Template","Template"),GlobalConfig.ViewPort="",GlobalConfig.GridPageSize=50,GlobalConfig.MaxLimit=99999,Ext.namespace("TreeManager","TreeManager"),GlobalConfig.DetailAutoCollapse=!1,GlobalConfig.CurrUserInfo="",GlobalConfig.Css={RemarkDisplay:"white-space:normal; word-break:break-all;",RemarkReadOnlyDisplay:"white-space:normal; word-break:break-all;readonly:true;"},GlobalConfig.HeartbeatRunner=new Ext.util.TaskRunner,GlobalConfig.newMessageBox=Ext.create("Ext.window.MessageBox",{});var globalFix="/data";GlobalConfig.Controllers={TestGrid:{create:"/data/TestGrid.json",read:"/data/TestGrid.json",update:"/data/TestGrid.json",destroy:"/data/TestGrid.json"},Heartbeat:"login/heartbeat",User:{GetCurrUserInfo:"/login/ajaxLogin",CheckUserPassword:"/CheckUserPassword111",UserLoginOut:"/data/UserLoginOut.json"},UserGrid:{},CustomerGrid:{create:globalFix+"/CustomerGrid.json",read:"customer/getList",update:"customer/update",destroy:globalFix+"/CustomerGrid.json",loadRuleCount:globalFix+"/loadRuleCount.json",addCustomer:"/customer/add",updateCustomer:globalFix+"/UpdateCustomer.json",addCustomerRent:"/customerRent/add",addCustomerRule:"customerExpressRule/addRule",delCustomerRule:"customerExpressRule/deleteRule",delCustomer:globalFix+"/DelCustomer.json",GetCustomerRuleByRentId:"customerExpressRule/countProvinceRule",getCustomerRule:"customerExpressRule/show",uploadCustomerExcel:globalFix+"/UploadCustomerExcel.json"},Customer_numberGrid:{create:"customerNumber/add",read:"customerNumber/getList",update:"customerNumber/update",destroy:"customerNumber/delete"},CustomerRentGrid:{create:"/customerRent/add",read:"/customerRent/getList",update:globalFix+"/CustomerRentGrid.json",destroy:globalFix+"/CustomerRentGrid.json"},ExpressPanel:{GetCustomer_numberCount:"expressRule/countProvinceRule",GetExpressRule:"expressRule/show",delExpressRule:"expressRule/deleteRule",addExpressRule:"expressRule/addRule"},Tracking_numberGrid:{create:globalFix+"/traking_numberGrid.json",read:globalFix+"/traking_numberGrid.json",update:globalFix+"/traking_numberGrid.json",destroy:globalFix+"/traking_numberGrid.json",uploadExcel:"/uploadTrackingNumber/upload",outPutExcel:globalFix+"/outPutExcel"},MainItemListTree:"/data/LoadMainItemListTree.json"},GlobalConfig.RegexController={regexNumber:/^\d*$/,regexNumberF:/^([-]\d*|\d*)$/,regexAlphabetNumber:/^(\d|[A-Za-z])*$/,regexTelePhoneNumber:/^\d{11}$/,regexFaxNumber:/(^sip\:[0-9a-zA-Z#-_]+@[0-9a-zA-Z.-_]+$)|(^\d+-(\d|\#|\*)*$)|(^\(\d+\)(\d|\#|\*)*$)|(^\+[\d][123457890](\d*) (\d|\#|\*)+$)|(^\+[123456790][\d](\d*) (\d|\#|\*)+$)|(^\+[1] (\d|\#|\*)+$)|(^\+[7] (\d|\#|\*)+$)|(^\+[\d][6](\d+) (\d|\#|\*)+$)|(^\+(\d+)\(\d+\)(\d|\#|\*)+$)|(^(0+[1-9]\d{2,})$)|(^\d+$)/,regexFolderName:/^[^\\\/?: *"<>|]+$/,regexEmail:/^(\w|\.)+\@\w+\.\w+$/,regexTombstoneCode:/^(\d{3}|\d{5}|\d{7})$/,regexAreaCode:/^\d{3}$/,regexMoney2Fixed:/^[0-9]\d{0,7}((\.)?\d{1,2})?$/,regexMoney3Fixed:/^[0-9]\d{0,8}((\.)?\d{1,3})?$/},GlobalConfig.ErrorCode={RootFolderID:0,RecycleFolderID:1073741822,PublicRootFolderID:2147483632,PublicRecycleFolderID:2147483646,DontCareFolderID:1073741823,ResOK:0,ResFullPrint:24,ResPartialOK:251658241,ResSessionTokenError:251658242,ResSessionTimeOut:251658244,ResOperationDeny:251658248,ResDBError:251658249,ResInternalError:251658256,ResParamError:251658257,ResSystemError:251658260,ResInputParamsError:251658264,ResConnectServerFailed:251658265,ResOperationNoSense:251658272,ResHasNotImplement:251658273,ConServerError:1879048187,CasLogoutCode:1879048190,ResNoUserName:251658512,ResPasswordError:251658513,LoginFail:251658514,ResUserInvalid:251658515,ResDomainLoginFailed:251658516,ResInvalidFolderID:251658288,ResFolderTypeNotMatch:251658290,ResDupFolderName:251658291,ResFolderNotEmpty:251658292,ResTooManyFolders:251658296,ResInvalidDocID:251661873,ResInvalidDocInfo:251661874,SeesionTimeOut:99},GlobalConfig.Province={110000:"北京市",120000:"天津市",130000:"河北省",140000:"山西省",150000:"内蒙古自治区",210000:"辽宁省",220000:"吉林省",230000:"黑龙江省",310000:"上海市",320000:"江苏省",330000:"浙江省",340000:"安徽省",350000:"福建省",360000:"江西省",370000:"山东省",410000:"河南省",420000:"湖北省",430000:"湖南省",440000:"广东省",450000:"广西壮族自治区",460000:"海南省",500000:"重庆市",510000:"四川省",520000:"贵州省",530000:"云南省",540000:"西藏自治区",610000:"陕西省",620000:"甘肃省",630000:"青海省",640000:"宁夏回族自治区",650000:"新疆维吾尔自治区",710000:"台湾省",810000:"香港特别行政区",820000:"澳门特别行政区"};
//# sourceMappingURL=GlobalConfig.js.map