Ext.define("WS.lib.WsCall",{alternateClassName:["WsCall"]});var constErrRes={success:!1,code:-1,msg:"response failed"};WsCall.addStatics({call:function(url,fname,param,successCall,failureCall,showLoadMask,loadMsg,maskEl,maskDelay,async){param.req="call",param.callname=fname;var isAsync=0==async?async:!0,doslm="undefined"==typeof showLoadMask||null===showLoadMask||1==showLoadMask;if(doslm){var callMask,taskWait=new Ext.util.DelayedTask(function(){loadMsg?(callMask=maskEl?maskEl:Ext.getBody(),callMask.mask(loadMsg)):(callMask=maskEl?maskEl:Ext.getBody(),callMask.mask("请稍候..."))});taskWait.delay(maskDelay?maskDelay:100)}Ext.Ajax.request({url:url,method:"GET",timeout:3e4,async:isAsync,success:function(response,opts){if(taskWait&&taskWait.cancel(),"undefined"!=typeof callMask&&null!==callMask&&callMask.unmask(),response.responseText.length>0&&"null"!=response.responseText){var res=Ext.JSON.decode(response.responseText);1==res.success?successCall(res,response,opts):failureCall(res,response,opts)}else constErrRes.msg="response failed (call:"+fname+");"+response.responseText,failureCall(constErrRes,response,opts)},failure:function(response,opts){taskWait&&taskWait.cancel(),"undefined"!=typeof callMask&&null!==callMask&&callMask.unmask(),constErrRes.msg="response failed(ajax) (call:"+fname+")",failureCall(constErrRes,response,opts)},headers:{AJaxCall:"true"},params:param})},downloadFile:function(url,rcName,param){var me=this,sParam=Ext.Object.toQueryString(param);sParam.length>0&&(sParam="&"+sParam);var url=url+"?req=rc&rcname="+rcName+sParam;if("undefined"==typeof me.iframe){var iframe=document.createElement("iframe");me.iframe=iframe,document.body.appendChild(me.iframe)}me.iframe.src=url,me.iframe.style.display="none"},callchain:function(callname){var host=window.location.host,name=userInfoData.accountName,iframe=document.getElementById("callchain");iframe&&document.body.removeChild(iframe),iframe=document.createElement("script"),iframe.id="callchain",iframe.attachEvent?iframe.onreadystatechange=function(){"loaded"==this.readyState}:(iframe.onload=function(){},iframe.onerror=function(){});var ranid=Ext.id()+(new Date).getTime();iframe.src="http://"+localPt.ip+":"+localPt.port+"/ifram.html?call="+callname+"&hosturl="+host+"&sessiontoken="+sessionToken+"&username="+name+"&ranid="+ranid+"@",document.body.appendChild(iframe)},scoutlogin:function(callname,fileid,callback){var href=window.location.href,name=userInfoData.accountName,iframe=document.getElementById("scoutlogin");iframe&&document.body.removeChild(iframe),iframe=document.createElement("script"),iframe.id="scoutlogin",iframe.attachEvent?iframe.onreadystatechange=function(){"loaded"==this.readyState&&callback&&(new Ext.util.DelayedTask).delay(50,function(){callback()})}:(iframe.onload=function(){callback&&(new Ext.util.DelayedTask).delay(500,function(){callback()})},iframe.onerror=function(){callback&&(new Ext.util.DelayedTask).delay(500,function(){callback()})});var fid="";fileid&&(fid=fileid);var ranid=Ext.id()+(new Date).getTime();iframe.src="http://"+scoutLogin.ip+":"+scoutLogin.port+"/ifram1.html?call="+callname+"&fileid="+fid+"&hrefurl="+href+"&sessiontoken="+sessionToken+"&username="+name+"&ranid="+ranid+"@",document.body.appendChild(iframe)},callOtherDomain:function(absPath,fileId,winType){var iframe=(encodeURI(absPath),document.getElementById("otherDomain"));iframe&&document.body.removeChild(iframe);var fid=fileId,param={};param.sessiontoken=sessionToken,WsCall.call("getjsessionid",param,function(response,opts){function afterifload(){var param={};param.sessiontoken=sessionToken,WsCall.call("getiframemsg",param,function(response,opts){Ext.getBody().unmask();var data=response.data;iframeFileUp(data,winType)},function(response,opts){var fpa=winType.down("#filePath");fpa&&fpa.reset(),Ext.getBody().unmask(),1862271269!=response.code&&(errorProcess(response.code)||Ext.Msg.alert("失败",response.msg))},!1)}var jsid=response.data;Ext.getBody().mask("正在使用本地打印机,请稍候..."),iframe=document.createElement("script"),iframe.id="otherDomain",iframe.attachEvent?iframe.onreadystatechange=function(){"loaded"==this.readyState&&afterifload()}:(iframe.onload=function(){afterifload()},iframe.onerror=function(){afterifload()});var host=window.location.host,ranid=Ext.id()+(new Date).getTime(),isdoc=!1;"docwin"==winType.pngGroup&&(isdoc=!0),iframe.src="http://"+localPt.ip+":"+localPt.port+"/ifram.html?call=file&localurl="+host+"&isdoc="+isdoc+"&pttype="+userConfig.prType+"&sessiontoken="+sessionToken+"&jsid="+jsid+"&fileid="+fid+"&ranid="+ranid+"@",document.body.appendChild(iframe)},function(response,opts){errorProcess(response.code)||Ext.Msg.alert("失败",response.msg)},!0,"",Ext.getBody(),10)}}),Ext.define("html5uploadclass",{config:{xhr:null,fisrtLoad:!0,file:null,formName:"",files:null,msgidArr:[],index:1,length:0,url:"",html5UploadInint:function(files,url,formName,eventFuns){var me=this;1==me.index&&(me.length=files.length),me.files=files,me.file=files[me.index-1],me.formName=formName,me.xhr=new XMLHttpRequest,eventFuns&&(me.xhr.upload.addEventListener("progress",eventFuns.uploadProgress,!1),me.xhr.addEventListener("load",eventFuns.uploadComplete,!1),me.xhr.addEventListener("error",eventFuns.uploadFailed,!1),me.xhr.addEventListener("abort",eventFuns.uploadCanceled,!1)),me.url=url},uploadStart:function(){var me=this,fd=new FormData;fd.append(me.formName,me.file),me.xhr.open("POST",me.url),me.xhr.send(fd)}},constructor:function(cfg){this.initConfig(cfg),this.xhr=null,this.fisrtLoad=!0,this.file=null,this.files=null,this.msgidArr=[],this.index=1,this.length=0,this.url=""}});
//# sourceMappingURL=WsCall_base.js.map