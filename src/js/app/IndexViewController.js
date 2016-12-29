"use strict";

var TD = require('./TD'),
    Config = require('./Config'),
    Preload = require('./Preload'),
    KeyAnimation = require('./KeyAnimation');

//加载页对象
var IndexViewController = function(){

    //公共变量
    var _that = this;

    //私有变量
    var _private = {};

    _private.pageEl = $('.m-begin');

    _private.isInit = false;

    var gamma = 0;

    //初始化，包括整体页面
    _private.init = function(){

        if (_private.isInit === true) {
            return;
        }

        _private.isInit = true;

    };

    //显示
    _that.show = function(){
        _private.pageEl.show();
    };

    //隐藏
    _that.hide = function(){ 
        _that.onhide && _that.onhide();
        _private.pageEl.hide();
    };


    _private.init();

};

module.exports = IndexViewController;
