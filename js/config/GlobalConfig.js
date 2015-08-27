//55,24

var login_sessiontoken = Ext.util.Cookies.get("login_sessiontoken");
var login_username = Ext.util.Cookies.get("login_username");
var login_password = Ext.util.Cookies.get("login_password");
var login_checksavepass = Ext.util.Cookies.get("login_checksavepass");




//存储管理
Ext.namespace('GlobalFun', 'GlobalFun');
//存储管理
Ext.namespace('StoreManager', 'StoreManager.GridStore'); //表格数据
Ext.namespace('StoreManager', 'StoreManager.ComboStore'); //下拉列表数据
//模型管理
Ext.namespace('ModelManager', 'ModelManager.GridModel');
//模型初始化管理
Ext.namespace('ModelInfoManager', 'ModelInfoManager.GridModelInfo');
//表格管理
Ext.namespace('GridManager', 'GridManager');
//通用窗口管理
Ext.namespace('WindowManager', 'WindowManager');
//action 管理
Ext.namespace('ActionManager', 'ActionManager');

//全局数据管理
Ext.namespace('GlobalConfig', 'GlobalConfig');

//全局拖拽控件操作类
Ext.namespace('DropDragControl', 'DropDragControl');
//全局模版管理
Ext.namespace('Template', 'Template');


//全局主显示框架Component
GlobalConfig.ViewPort = '';

//全局表格分页控制
GlobalConfig.GridPageSize = 50;
//最大值
GlobalConfig.MaxLimit = 99999;

//树管理
Ext.namespace('TreeManager', 'TreeManager');


//是否自动收缩详细
GlobalConfig.DetailAutoCollapse = false;

//全局用户信息
GlobalConfig.CurrUserInfo = "";

//全局Style String管理
GlobalConfig.Css = {
    RemarkDisplay: "white-space:normal; word-break:break-all;",
    RemarkReadOnlyDisplay: "white-space:normal; word-break:break-all;readonly:true;"
};
//全局心跳
GlobalConfig.HeartbeatRunner = new Ext.util.TaskRunner();
//全局消息对话框
//对话框
GlobalConfig.newMessageBox = Ext.create('Ext.window.MessageBox', {});

//全局Controller路径配置
var globalFix = "/data";
GlobalConfig.Controllers = {
    TestGrid: {
        create: '/data/TestGrid.json',
        read: '/data/TestGrid.json',
        update: '/data/TestGrid.json',
        destroy: '/data/TestGrid.json',
    },

    Heartbeat: 'login/heartbeat',//'/login/heartbeat.json', //心跳

    User: { //用户登录相关
        GetCurrUserInfo: '/login/ajaxLogin', //'/data/login.json',
        CheckUserPassword: '/CheckUserPassword111',
        UserLoginOut: '/data/UserLoginOut.json'
    },
    UserGrid: { //用户表

    },
    CustomerGrid: { //客户表
        create: globalFix + '/CustomerGrid.json',
        read: 'customer/getList',//globalFix + '/CustomerGrid.json',
        update: 'customer/update',//globalFix + '/CustomerGrid.json',
        destroy: globalFix + '/CustomerGrid.json',
        loadRuleCount: globalFix + '/loadRuleCount.json',
        addCustomer: '/customer/add',//globalFix + '/AddCustomer.json',
        updateCustomer: globalFix + '/UpdateCustomer.json',
        addCustomerRent: '/customerRent/add',//globalFix + '/addCustomerRent.php',
        addCustomerRule: 'customerExpressRule/addRule',//globalFix + '/AddCustomerRule.php',
        delCustomerRule: 'customerExpressRule/deleteRule',//globalFix + '/DelCustomerRule.php',
        delCustomer: globalFix + '/DelCustomer.json',
        GetCustomerRuleByRentId: 'customerExpressRule/countProvinceRule',//globalFix + '/GetCustomerRuleByRentId.json',
        getCustomerRule: 'customerExpressRule/show',//globalFix + '/GetCustomerRule.json',
        uploadCustomerExcel: globalFix + '/UploadCustomerExcel.json'
    },
    Customer_numberGrid:{
        create: 'customerNumber/add',//globalFix + '/Customer_numberGridadd',
        read: 'customerNumber/getList', //globalFix + '/Customer_numberGrid.json',
        update: 'customerNumber/update',
        destroy: 'customerNumber/delete'
    },
    CustomerRentGrid: { //合同
        create: '/customerRent/add',//globalFix + '/CustomerRentGrid.json',
        read: '/customerRent/getList',//globalFix + '/CustomerRentGrid.json',
        update: globalFix + '/CustomerRentGrid.json',
        destroy: globalFix + '/CustomerRentGrid.json'
    },
    ExpressPanel:{
        GetCustomer_numberCount: 'expressRule/countProvinceRule',//globalFix + '/GetCustomer_numberCount.json',
        GetExpressRule:'expressRule/show',//globalFix + '/GetExpressRule.json',
        delExpressRule:'expressRule/deleteRule',//'delExpressRule',
        addExpressRule:'expressRule/addRule'//'addExpressRule'
    },
    Tracking_numberGrid: { //票号 票据
        create: globalFix + '/traking_numberGrid.json',
        read: globalFix + '/traking_numberGrid.json',
        update: globalFix + '/traking_numberGrid.json',
        destroy: globalFix + '/traking_numberGrid.json',
        uploadExcel: globalFix + '/uploadExcel',
        outPutExcel:globalFix + '/outPutExcel'
    },
    MainItemListTree: '/data/LoadMainItemListTree.json', //主目录树 

};
//全局正则表达式
GlobalConfig.RegexController = {
    // 数字验证用正则表达式
    regexNumber: /^\d*$/,
    // 数字验证用正则表达式
    regexNumberF: /^([-]\d*|\d*)$/,
    // 字母及数字验证用
    regexAlphabetNumber: /^(\d|[A-Za-z])*$/,
    //手机号码验证
    regexTelePhoneNumber: /^\d{11}$/,
    // 传真号码匹配的正则表达式
    regexFaxNumber: /(^sip\:[0-9a-zA-Z#-_]+@[0-9a-zA-Z.-_]+$)|(^\d+-(\d|\#|\*)*$)|(^\(\d+\)(\d|\#|\*)*$)|(^\+[\d][123457890](\d*) (\d|\#|\*)+$)|(^\+[123456790][\d](\d*) (\d|\#|\*)+$)|(^\+[1] (\d|\#|\*)+$)|(^\+[7] (\d|\#|\*)+$)|(^\+[\d][6](\d+) (\d|\#|\*)+$)|(^\+(\d+)\(\d+\)(\d|\#|\*)+$)|(^(0+[1-9]\d{2,})$)|(^\d+$)/,
    //文件夹名称验证
    regexFolderName: /^[^\\\/?: *"<>|]+$/,
    //邮箱验证正则表达式
    regexEmail: /^(\w|\.)+\@\w+\.\w+$/,
    //3,5,7位数字
    regexTombstoneCode: /^(\d{3}|\d{5}|\d{7})$/,
    //3位数字
    regexAreaCode: /^\d{3}$/,
    //金额验证，两位小数 8:2
    regexMoney2Fixed: /^[0-9]\d{0,7}((\.)?\d{1,2})?$/, 
    //重量验证，3位小数
    regexMoney3Fixed: /^[0-9]\d{0,8}((\.)?\d{1,3})?$/
};


//全局错误定义
GlobalConfig.ErrorCode = {
    RootFolderID: 0,
    RecycleFolderID: 0x3FFFFFFE,
    PublicRootFolderID: 0x7FFFFFF0,
    PublicRecycleFolderID: 0x7FFFFFFE,
    DontCareFolderID: 0x3FFFFFFF, // 任何目录,在某些函数的调用中,此参数表示忽略目录ID
    // 操作返回错误码
    ResOK: 0x00000000, // 操作成功完成
    ResFullPrint: 0x00000018, // 没有空闲的 转换队列
    ResPartialOK: 0x0F000001, // 操作部分成功完成,用于需要查询记录状态以确定操作结果
    ResSessionTokenError: 0x0F000002, // 无效登录事务标识
    ResSessionTimeOut: 0x0F000004, // 此登录事务已超时,请重新登录
    ResOperationDeny: 0x0F000008, // 事务标识所属用户无权限
    ResDBError: 0x0F000009, // 服务器数据库异常
    ResInternalError: 0x0F000010, // 服务器内部异常
    ResParamError: 0x0F000011, // 参数错误
    ResSystemError: 0x0F000014, // 服务器操作系统异常
    ResInputParamsError: 0x0F000018, // 传入参数错误
    ResConnectServerFailed: 0x0F000019, // 连接服务器失败
    ResOperationNoSense: 0x0F000020, // 操作无意义
    ResHasNotImplement: 0x0F000021, // 操作还未实现
    ConServerError: 0x6FFFFFFB, //主控服务异常，连接失败

    CasLogoutCode: 0x6FFFFFFE, //cas登出标识代码

    //登录失败错误码
    ResNoUserName: 0x0F000110, //无效用户名
    ResPasswordError: 0x0F000111, //密码错误
    LoginFail: 0x0F000112, //登录失败
    ResUserInvalid: 0x0F000113, //用户被冻结或无效
    ResDomainLoginFailed: 0x0F000114, //映射域登陆验证失败

    ResInvalidFolderID: 0x0F000030, //  无效目录ID
    ResFolderTypeNotMatch: 0x0F000032, //   目录类型不匹配
    ResDupFolderName: 0x0F000033, //    目录名称重复
    ResFolderNotEmpty: 0x0F000034, //   目录非空
    ResTooManyFolders: 0x0F000038, //   目录数量超过限制

    ResInvalidDocID: 0x0F000E31, //无效的归档ID
    ResInvalidDocInfo: 0x0F000E32, //无效的归档信息

    SeesionTimeOut: 99 //登录信息失效
};
//全局模版



//全局省份
GlobalConfig.Province = {
    '110000': '北京市',
    '120000': '天津市',
    '130000': '河北省',
    '140000': '山西省',
    '150000': '内蒙古自治区',
    '210000': '辽宁省',
    '220000': '吉林省',
    '230000': '黑龙江省',
    '310000': '上海市',
    '320000': '江苏省',
    '330000': '浙江省',
    '340000': '安徽省',
    '350000': '福建省',
    '360000': '江西省',
    '370000': '山东省',
    '410000': '河南省',
    '420000': '湖北省',
    '430000': '湖南省',
    '440000': '广东省',
    '450000': '广西壮族自治区',
    '460000': '海南省',
    '500000': '重庆市',
    '510000': '四川省',
    '520000': '贵州省',
    '530000': '云南省',
    '540000': '西藏自治区',
    '610000': '陕西省',
    '620000': '甘肃省',
    '630000': '青海省',
    '640000': '宁夏回族自治区',
    '650000': '新疆维吾尔自治区',
    '710000': '台湾省',
    '810000': '香港特别行政区',
    '820000': '澳门特别行政区'


};
