var mykeycodeConvert={32:" ",48:"0","48s":")",49:"1","49s":"!",50:"2","50s":"@",51:"3","51s":"#",52:"4","52s":"$",53:"5","53s":"%",54:"6","54s":"^",55:"7","55s":"&",56:"8","56s":"*",57:"9","57s":"(",65:"a","65s":"A",66:"b","66s":"B",67:"c","67s":"C",68:"d","68s":"D",69:"e","69s":"E",70:"f","70s":"F",71:"g","71s":"G",72:"h","72s":"H",73:"i","73s":"I",74:"j","74s":"J",75:"k","75s":"K",76:"l","76s":"L",77:"m","77s":"M",78:"n","78s":"N",79:"o","79s":"O",80:"p","80s":"P",81:"q","81s":"Q",82:"r","82s":"R",83:"s","83s":"S",84:"t","84s":"T",85:"u","85s":"U",86:"v","86s":"V",87:"w","87s":"W",88:"x","88s":"X",89:"y","89s":"Y",90:"z","90s":"Z",96:"0",97:"1",98:"2",99:"3",100:"4",101:"5",102:"6",103:"7",104:"8",105:"9",106:"*",107:"+",109:"-",110:".",111:"/",186:";","186s":":",187:"=","187s":"+",188:",","188s":"<",189:"-","189s":"_",190:".","190s":">",191:"/","191s":"?",192:"`","192s":"~",219:"[","219s":"{",220:"\\","220s":"|",221:"]","221s":"}",222:"'","222s":'"'};Ext.define("Ext.ux.form.field.MyPasswordField",{extend:"Ext.form.field.Text",alias:"widget.MyPasswordField",keyCodeArr:[],inputType:"password",replaceChar:"●",onKeyDown:function(e){var me=this,keycode=e.getKey();if(e.ctrlKey)keycode!=e.BACKSPACE&&(me.keyCodeArr=[]);else if(32==keycode||keycode>=65&&90>=keycode||keycode>=48&&57>=keycode||keycode>=96&&107>=keycode||keycode>=109&&111>=keycode||keycode>=186&&192>=keycode||keycode>=219&&222>=keycode||keycode==e.BACKSPACE){var selectedText;window.getSelection?selectedText=window.getSelection():document.selection&&(selectedText=document.selection.createRange().text);var length=selectedText.toString().length;if(keycode!=e.BACKSPACE)length&&length>0&&(me.keyCodeArr=[]),keycode>=65&&90>=keycode||keycode>=48&&57>=keycode||keycode>=186&&192>=keycode||keycode>=219&&222>=keycode?e.shiftKey?me.keyCodeArr.push(mykeycodeConvert[keycode+"s"]):me.keyCodeArr.push(mykeycodeConvert[keycode]):(32==keycode||keycode>=96&&107>=keycode||keycode>=109&&111>=keycode)&&me.keyCodeArr.push(mykeycodeConvert[keycode]);else if(length&&length>0)for(var i=0;length>i;i++)me.keyCodeArr.pop();else me.keyCodeArr.pop();for(var strVal="",i=0;i<me.keyCodeArr.length;i++)strVal+=me.replaceChar;me.setValue(strVal,!0),e.stopEvent()}this.fireEvent("keydown",this,e)},onKeyUp:function(e){this.fireEvent("keyup",this,e)},onKeyPress:function(e){this.fireEvent("keypress",this,e)},initComponent:function(){var me=this;me.keyCodeArr=[],me.callParent()},getValue:function(){for(var me=this,val=me.rawToValue(me.processRawValue(me.getRawValue())),strVal="",i=0;i<me.keyCodeArr.length;i++)strVal+=me.replaceChar;return me.value=strVal,val},rawToValue:function(rawValue){return rawValue},processRawValue:function(value){return value},getRawValue:function(){var me=this,v=me.keyCodeArr.join("");return me.rawValue=v,v},setRawValue:function(value){var me=this;return value=Ext.value(me.transformRawValue(value),""),me.rawValue=value,me.inputEl&&(me.inputEl.dom.value=value),value},transformRawValue:function(value){return value},valueToRaw:function(value){return""+Ext.value(value,"")},setValue:function(value,nopush){var me=this,myval=me.valueToRaw(value);if(!nopush){me.keyCodeArr=[];for(var i=0;i<myval.length;i++)me.keyCodeArr.push(myval.charAt(i))}for(var strVal="",i=0;i<me.keyCodeArr.length;i++)strVal+=me.replaceChar;return me.setRawValue(strVal),me.mixins.field.setValue.call(me,strVal)},onBoxReady:function(){var me=this;me.inputEl.dom.style.imeMode="disabled",me.inputEl.on("dblclick",function(){me.selectText()}),me.callParent()}});
//# sourceMappingURL=MyPasswordfield.js.map