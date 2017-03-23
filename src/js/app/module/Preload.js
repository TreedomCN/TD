"use strict";

var TD = require('./TD');
/*
//全局加载器v.0.2
pm = {
	imgs: [
		{
			url: url,
			name: name
		},
		{
			url: url2,
			name: name2
		}
	],
	sprites: [
		{
			url: url,
			name: name
		}
	],
	//keyimgs实际是Preload.loadKeyImgs的一个二次包装，参数详情参看preloadImgs方法
	keyimgs: [
		{
			el: elDom,
			pathPrefix: 'img/',
			postfix: 'jpg'
		}
	]
	ajaxs: [
		{
			url: 'xxx.html',
			type: 'POST',
			data: {},
			succback: function(data){
				console.log(data);
			},
			errback: function(msg){
				console.log(msg);
			}
		},
		{
			url: 'xxx.html'
		}
	]
}

var x = new Preload(param);
x.onloading = function(p){
	console.log(p);
}
x.onload = function(){
	console.log('succback');
}
//默认只有ajax请求不成功才会触发
x.onfail = function(err){
	console.log(err.url);
	console.log(err.msg);
}
//返回当前状态的百分比，完成是100
x.getProcess();

//启动
x.load();

加载完毕后Preload有一个全局的buffer，里面存了所有图片的键值对，格式如下例子
Preload.buffer = {
	imgs: {
		bg: imgObj
	},
	sprites: {
		sp: imgObj
	},
	keyimgs: {
		title: Preload.loadKeyImgs.buffer
	}
}

*/
var Preload = function(pm, keyW){
	var that = this;
	
	//预定义回调
	this.onloading = null;
	this.onload = null;
	this.onfail = null;
	
	//预定义全局变量
	var imgsLen = pm.imgs ? pm.imgs.length : 0;
	var spritesLen = pm.sprites ? pm.sprites.length : 0;
	var keyimgsLen = pm.keyimgs ? pm.keyimgs.length : 0;
	var ajaxsLen = pm.ajaxs ? pm.ajaxs.length : 0;
	var keyimgsWeight = keyW || 7;
	var totalLen = imgsLen + spritesLen + keyimgsLen * keyimgsWeight + ajaxsLen;
	var count = 0;
	
	this.getProcess = function(){
		return count;
	}
	
	//载入普通图片
	var loadImg = function(){
		var imgSuccessFn = function(e){
			count++;
			//存入内存中
			Preload.buffer.imgs[this.bufferName] = this;
			if (count == totalLen){
				that.onloading && that.onloading(100);
				that.onload && that.onload();
			}else {
				that.onloading && that.onloading(Math.round(count/totalLen * 100));
			}
		};
		
		for (var i = 0; i < imgsLen; i++) {
			var img = new Image();
			img.onload = img.onerror = imgSuccessFn;
			//加个属性
			img.bufferName = pm.imgs[i].name;
			img.src = pm.imgs[i].url;
		}
	};
	
	//载入雪碧图
	var loadSprite = function(){
		var imgSuccessFn = function(){
			count++;
			//存入内存中
			Preload.buffer.sprites[this.bufferName] = this;
			if (count == totalLen){
				that.onloading && that.onloading(100);
				that.onload && that.onload();
			}else {
				that.onloading && that.onloading(Math.round(count/totalLen * 100));
			}
		};
		
		for (var i = 0; i < spritesLen; i++) {
			var img = new Image();
			img.onload = img.onerror = imgSuccessFn;
			//加个属性
			img.bufferName = pm.sprites[i].name;
			img.src = pm.sprites[i].url;
		}
	};
	
	//载入帧动画图片
	var loadKeyimg = function(){
		var keyimgSuccessFn = function(){
			count = count + keyimgsWeight - this.keyProcess;
			Preload.buffer.keyimgs = Preload.loadKeyImgs.buffer;
			if (count == totalLen) {
				that.onloading && that.onloading(100);
				that.onload && that.onload();
			}else {
				that.onloading && that.onloading(Math.round(count/totalLen * 100));
			}
		};
		
		var keyimgLoadFn = function(p){
			var c = Math.floor(p*keyimgsWeight/100);
			//如果没有变化就不执行
			if (c == this.keyProcess) {
				return;
			}
			var increase = c - this.keyProcess;
			count = count + increase;
			this.keyProcess = c;
			c !== keyimgsWeight && that.onloading && that.onloading(Math.round(count/totalLen * 100));
		};
		
		for (var i = 0; i < keyimgsLen; i++){
			var keyimg = new Preload.loadKeyImgs(pm.keyimgs[i].el, pm.keyimgs[i].pathPrefix, pm.keyimgs[i].pad , pm.keyimgs[i].postfix);
			keyimg.onload = keyimgSuccessFn;
			keyimg.onloading = keyimgLoadFn;
			//加一个对象属性，记录进度
			keyimg.keyProcess = 0;
			keyimg.load();
		}
	};
	
	//载入ajax,加载器只负责加载资源，如果ajax载入不成功，也默认不去阻碍整体流程，但是可以在onfail中处理异常
	//ajax加载失败会在errback和onfail中同时被触发
	var loadAjax = function(){
		//计数器
		var ajaxSuccessFn = function(){
			count++;
			if (count == totalLen) {
				that.onloading && that.onloading(100);
				that.onload && that.onload();
			}else {
				that.onloading && that.onloading(Math.round(count/totalLen * 100));
			}
		};
		
		pm.ajaxs.forEach(function(value){
			TD.ajax({
				url: value.url,
				type: value.type || 'GET',
				data: value.data || '',
			}, (function(v){
				return function(data){
					ajaxSuccessFn();
					v.succback && v.succback(data);
				};
			})(value), (function(v){
				return function(msg){
					ajaxSuccessFn();
					v.errback && v.errback(msg);
					that.onfail && that.onfail({
						msg: msg,
						url: v.url
					});
				};
			})(value));
		});
	};
	
	this.load = function(){
		if (totalLen == 0) {
			this.onload && this.onload();
			return;
		}
		
		imgsLen !== 0 && loadImg();
		spritesLen !== 0 && loadSprite();
		keyimgsLen !== 0 && loadKeyimg();
		ajaxsLen !== 0 && loadAjax();
	};
};
Preload.buffer = {
	imgs: {},
	sprites: {},
	keyimgs: {}
};

//数字补位函数pad(100, 5) => '00100'
Preload.pad = (function() {
    var padLen = 5; //补位常数
    var tbl = [];
    return function(num, n) {
        n = n || padLen;
        var len = n-num.toString().length;
        if (len <= 0) return num;
        if (!tbl[len]) tbl[len] = (new Array(len+1)).join('0');
        return tbl[len] + num;
    }
})();

//加载单个动画帧
/*
dom使用规则：<div class="canvas" data-prefix="title_" data-keyTo="83"></div>
data-prefix是文件名前缀，也是内存中图片数组的名字，如上例内存中名字是title
data-keyTo图片命名从0开始，例子中83是最后一张，图片需要数字补齐如title_00083.png

el：canvas容器，jq对象；
pathPrefix：图片的url前缀，如'img/'
pad：图片名序列号补位数，默认是5位，如83补位5就是00083；
postfix: 图片后缀，默认是png；

//图片已加载完成回调
loadKeyImgs.onload = callback;

//图片加载中回调
loadKeyImgs.onloading = callback;
callback = function(p){
	//p是图片加载百分数
}

//执行加载，应该要放到上面两个回调函数之后用
loadKeyImgs.load();

//所有已经成功加载的图片数组都被存到了Preload.loadKeyImgs对象的buffer中，属性名就是文件前缀，如上例就是Preload.loadKeyImgs.buffer.title
*/

Preload.loadKeyImgs = (function(){

    var fn = function(el, pathPrefix, pad, postfix){
        var that = this;
        var prefixName = el.attr('data-prefix');
        var keyTo = parseInt(el.attr('data-keyTo'));
        var keyList = [];
        var count = 0;
        pad = pad || 5;
        postfix = postfix || 'png';
        this.len = keyTo+1;
        var successFn = function(){
            count++;

            that.onloading && that.onloading(Math.floor(count/(keyTo + 1) * 100));

            if (count == keyTo+1) {
                //把已经加载好的dom存入内存缓存中方便后续调用:Preload.loadKeyImgs.home_title
                Preload.loadKeyImgs.buffer[prefixName.slice(0, prefixName.length-1)] = keyList;
                that.onload && that.onload();
            }
        }

        //写的时候必须先绑定onload，否则有可能从缓存中读取的onload事件会被忽略
        this.onload = null;
        this.onloading = null;
        this.load = function(){
            //如果在内存中已经保存
			/*
            if (Preload.loadKeyImgs.buffer[prefixName.slice(0, prefixName.length-1)]) {
                for(var i = 0; i < keyTo+1; i++){
                    count++;
                    that.onloading && that.onloading(100);
                }
                that.onload && that.onload();
                return;
            };
			*/

            for(var i = 0; i < keyTo+1; i++){
                var img = new Image();
                img.src = pathPrefix + prefixName + Preload.pad(i, pad) + '.' + postfix;
                img.onload = img.onerror = successFn;
                keyList.push(img);
            }
        }

    }
    //把函数当对象使用，存东西
    fn.buffer = {};
    return fn;
})();

module.exports = Preload;
