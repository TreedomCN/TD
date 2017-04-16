"use strict";

var TD = require('./module/TD'),
    Config = require('./Config'),
    KeyAnimation = require('./module/KeyAnimation');

//项目初始化的一些函数
var initProject = function(){

    //cnzz统计代码 强制HTTPS，防劫持
    (function () {
        var cnzzID = Config.defShare.cnzz;
        document.write(unescape("%3Cspan id='cnzz_stat_icon_" + cnzzID + "'%3E%3C/span%3E%3Cscript src='" + "https://s4.cnzz.com/z_stat.php%3Fid%3D"+ cnzzID +"' type='text/javascript'%3E%3C/script%3E"));
        $("#cnzz_stat_icon_" + cnzzID).hide();
    }())
 
    //初始化微信接口
    TD.initWxApi(Config.defShare);

    //禁止微信下拉
    $(document.documentElement).on('swipeDown', function(e) {
        e.preventDefault();
    });

    //禁止微信长按浏览器打开
    $(document.documentElement).on('longTap', function(e) {
        e.preventDefault();
    });
    
};

//加载页对象
var LoadViewController = function(){
    
    //公共变量
    var _that = this;
    
    //私有变量
    var _private = {};
    
    _private.pageEl = $('.m-loading');
    
    _private.isInit = false;
    
    //初始化，包括整体页面
    _private.init = function(){
        if (_private.isInit === true) {
            return;
        }
        initProject();
        
        //加载体现在页面上
        // _private.processLineEl = _private.pageEl.find('.loadProcess');
        
        _private.gload = new Config.Preload(Config.pageImgs);
        
        _private.gload.onloading = function(p){
            console.log(p);
            // _private.processLineEl.css('height', p + '%');
        };
        
        _private.gload.onload = function(){
            // _that.hide();
        };
        
        _private.gload.onfail = function(msg){
            console.log(msg);
        };
        
        // _private.loadAudio();
        
        _private.isInit = true;
    };
    
    //显示
    _that.show = function(){ 
        _private.pageEl.show();
    };
    
    //隐藏
    _that.hide = function(){ 
        _private.pageEl.hide();
        
        _that.onhide && _that.onhide();
    };
    
    //执行加载
    _that.load = function(){ 
        _private.gload.load();
    };
    
    _private.init();
    
};
    
module.exports = LoadViewController;
