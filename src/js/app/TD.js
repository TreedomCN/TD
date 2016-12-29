"use strict";

var Config = require('./Config');

var TD = {};

//美林版ajax对应接口
TD.ajax = function(pm, succback, errorback){
	$.ajax({
		type: pm.type || 'GET',
		url: pm.url,
		dataType: 'json',
		data: pm.data || '',
		success: function(data){
			if (data.status == 1) {
				succback && succback(data.data);
			}else {
				errorback && errorback(data.message);
			}
		},
		error: function(xhr, status, thrown){
			errorback && errorback('网络连接不稳定，请重试或刷新页面！');
		}
	});
};

/*data参数说明
data = {
	title: string, 朋友圈标题，给朋友的描述
	desc: string, 给朋友的标题
	link: string, 链接
	img: string, 图标
	track: string, 分享数据上报地址,post {btn:'1'}朋友或{btn:'2'}朋友圈
}
*/
TD.wxShare = function(data, callback){
	wx.onMenuShareTimeline({
		title: data.title, // 分享标题
		link: data.link, // 分享链接
		imgUrl: data.img, // 分享图标
		success: function () {
			callback && callback();
			//上报朋友圈
			TD.ajax({
				url: 'http://click.treedom.cn/log',
				type: 'POST',
				data: {
					key: 'wechat',
                    val: 'timeline',
                    pro: data.proj
				}
			}, function(data){
				console.log(data);
			}, function(msg){
                console.log(msg);
            });

            _czc && _czc.push(['_trackEvent', '分享', "朋友圈"]);
		},
		cancel: function () {
			// 用户取消分享后执行的回调函数
		}
	});
	wx.onMenuShareAppMessage({
        title: data.title, // 分享标题
        desc: data.desc, // 分享描述
        link: data.link, // 分享链接
        imgUrl: data.img, // 分享图标
        success: function () {
            callback && callback();
            //上报朋友
            TD.ajax({
                url: 'http://click.treedom.cn/log',
                type: 'POST',
                data: {
                    key: 'wechat',
                    val: 'message',
                    pro: data.proj
                }
            }, function(data){

            }, function(msg){
                console.log(msg);
            });

            _czc && _czc.push(['_trackEvent', '分享', "好友"]);
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQQ({
        title: data.title, // 分享标题
        desc: data.desc, // 分享描述
        link: data.link, // 分享链接
        imgUrl: data.img, // 分享图标
	    success: function () { 
	       // 用户确认分享后执行的回调函数
	            callback && callback();
	            //上报朋友
	            TD.ajax({
	                url: 'http://click.treedom.cn/log',
	                type: 'POST',
	                data: {
	                    key: 'wechat',
	                    val: 'QQ',
	                    pro: data.proj
	                }
	            }, function(data){

	            }, function(msg){
	                console.log(msg);
	            });

	            _czc && _czc.push(['_trackEvent', '分享', "QQ好友"]);
	    },
	    cancel: function () { 
	       // 用户取消分享后执行的回调函数
	    }
	});

    wx.onMenuShareQZone({
        title: data.title, // 分享标题
        desc: data.desc, // 分享描述
        link: data.link, // 分享链接
        imgUrl: data.img, // 分享图标
	    success: function () { 
	       // 用户确认分享后执行的回调函数
	            callback && callback();
	            //上报朋友
	            TD.ajax({
	                url: 'http://click.treedom.cn/log',
	                type: 'POST',
	                data: {
	                    key: 'wechat',
	                    val: 'QZone',
	                    pro: data.proj
	                }
	            }, function(data){

	            }, function(msg){
	                console.log(msg);
	            });

	            _czc && _czc.push(['_trackEvent', '分享', "QZone"]);
	    },
	    cancel: function () { 
	        // 用户取消分享后执行的回调函数
	    }
	});
};

//初始化微信接口
//注意，与微信标准data相比，这里多了data.share属性，对应的是初始化页面时有默认的分享数据
TD.initWxApi = function(shareData, errback, succback){
	//服务器获取验证信息
	TD.ajax({
		url: 'http://click.treedom.cn/wx/signature',
		type: 'POST',
		data: {
			appid: shareData.appid,
        	url:  encodeURIComponent(shareData.link)
		}
	}, function(data){
		wx.config({
			debug: false,
			appId: data.appId,
			timestamp: data.timestamp,
			nonceStr: data.nonceStr,
			signature: data.signature,
			jsApiList: [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
	            'onMenuShareQQ',
	            'onMenuShareQZone',
				'startRecord',
				'stopRecord',
				'onVoiceRecordEnd',
				'playVoice',
				'pauseVoice',
				'stopVoice',
				'onVoicePlayEnd',
				'uploadVoice',
				'downloadVoice',
				'chooseImage',
				'previewImage',
				'uploadImage',
				'downloadImage',
				'getNetworkType'
			]
		});
		wx.ready(function(){
			succback && succback();
			TD.wxShare(shareData);
			wx.getNetworkType({
	            success: function (res) {
	                var networkType = res.networkType; // 返回网络类型2g，3g，4g，wifi
	                _czc && _czc.push(['_trackEvent', '网络类型', networkType]);
	            }
	        });
		});
	},function(err){
		console.log(err);
	});
	
};

//元素基于屏幕自适应缩放，dom上有data-response属性的元素都会受它影响
/*
config = {
	width: 375,
	height: 600,
	type: 'cover' // 'contain'
}
return config定义的scale值
v1 新增，在dom上增加data-type属性，可选内容有"cover"、"contain"
*/
TD.responseBody = function(config) {
	config = config || {};
	config.width = config.width || 375;
	config.height = config.height || 600;
	config.type = config.type || 'cover'; //'cover'、'contain'
	console.log(config);

	var responseList = $('[data-response]');

	var rate;
	var rateCover;
	var rateContain;

	var responseFn = function(){
		var rateX = window.innerWidth / config.width;
		var rateY = window.innerHeight / config.height;

		rateCover = rateX > rateY ? rateX : rateY;
		rateContain = rateX < rateY ? rateX : rateY;

		switch (config.type) {
			case 'cover':
				rate = rateCover;
				break;
			case 'contain':
				rate = rateContain;
				break;
			default:
				rate = 1;
		}

		responseList.each(function(i){
			var type = $(this).attr('data-type');
			var elRate;
			if(type == 'cover'){
				elRate = rateCover;
			}else if(type == 'contain') {
				elRate = rateContain;
			}else {
				elRate = rate;
			}
			this.style.webkitTransform = 'scale(' + elRate + ')';
		});
	};

	responseFn();

	$(window).on('resize', function(){
		responseFn();
	});

	return rate;
}

//提示竖屏函数
TD.portraitTips = function(el) {
	var portraitFloat = (typeof el === 'string') ? $(el) : el ;

	var orientHandler = function(){
		if(window.orientation == 90|| window.orientation == -90){
			portraitFloat.show();
		} else {
			portraitFloat.hide();
		}
	};
	orientHandler();

	$(window).on('resize', function(){
		orientHandler();
	});
};

/*检测转屏函数用法
API：TD.rotateScreen.addListener(callback);//添加事件侦听
	 TD.rotateScreen.removeListener();//取消事件侦听

example： 
	TD.rotateScreen.addListener(function (data) {
		if(data == 1){
			console.log('左转屏');
			TD.rotateScreen.removeListener();//注销事件侦听
		}

		if(data == 2){
			console.log('右转屏');
		}

		if(data == 3){
			console.log('竖屏');
		}

		if(data == 4){
			console.log('倒屏');
		}
	})*/
TD.rotateScreen = (function (){
    var rotate;

    var add = function (callback) {

        rotate = function (e) {
            if( Math.abs(e.beta) < 15 && e.gamma < -40 ){
                callback && callback(1);//左转屏
            }
            if( Math.abs(e.beta) < 15 && e.gamma > 40 ){
                callback && callback(2);//右转屏
            }
            if( e.beta > 40 && Math.abs(e.gamma) < 15 ){
                callback && callback(3);//竖屏
            }
            if( e.beta < -40 && Math.abs(e.gamma) < 15 ){
                callback && callback(4);//倒屏
            }
        }

        window.addEventListener('deviceorientation',rotate)
    }

    var remove = function () {
        /*解决ios设备会缓存上次移除deviceorientation事件时角度的问题。*/
        if ( navigator.userAgent.indexOf('Android') > -1 ) {
            window.removeEventListener('deviceorientation',rotate)
        }
    }

    return {
        addListener: add,
        removeListener: remove
    };
})(); 

//网络工具包
TD.util = {}
TD.util.getQuery = function(name){
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
};
TD.util.setCookie = function (name, value, expiredays) {
    var exdate = new Date();
    document.cookie = name + "=" + value + ";expires=" +
        ((expiredays == null) ? exdate.setDate(exdate.getDate() + expiredays) : exdate.toGMTString())
        + ";domain=treedom.cn";
};
TD.util.getCookie = function (name) {
    var c_start, c_end;
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(name + "=");
        if (c_start != -1) {
            c_start = c_start + name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1) c_end = document.cookie.length;
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return '';
};

//cnzz统计代码
var cnzzID = Config.defShare.cnzz;
    var cnzz_protocol = (("https:" == document.location.protocol) ? " https://" : " http://");
    document.write(unescape("%3Cspan id='cnzz_stat_icon_" + cnzzID + "'%3E%3C/span%3E%3Cscript src='" + cnzz_protocol + "s4.cnzz.com/z_stat.php%3Fid%3D"+ cnzzID +"' type='text/javascript'%3E%3C/script%3E"));
    $("#cnzz_stat_icon_" + cnzzID).hide();

// cnzz事件统计
TD.push = function (category,action,label,value) {
    /*category:事件类别;action:事件操作;label:事件标签;value:事件值;*/
    var category = category || '';
    var action = action || '';
    var label = label || '';
    var value = value || '';
     try {
         _czc.push(['_trackEvent', category, action,label,value]);
     } catch(e) {
         console.log(e);
     }
}

module.exports = TD;
