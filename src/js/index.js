"use strict";

//引入的包根据实际情况而定
var TD = require('./app/TD'),
    Config = require('./app/Config'),
    Preload = require('./app/Preload'),
    KeyAnimation = require('./app/KeyAnimation'),
    MediaSprite = require('./app/MediaSprite'),
    LoadViewController = require('./app/LoadViewController'),
    IndexViewController = require('./app/IndexViewController');

/*
*
*  引入lib库文件和LESS文件
*  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
*  复制到相应的文件夹
*  引入的less会对less进行编译存放到css文件夹
* */
require('zepto');
//页面级对象池
var pagePool = {
    loadView: null,
    indexView: null
};

var init = function() {
    //load页面
    var loadPageBack = function() {
        pagePool.loadView = pagePool.loadView || new LoadViewController();
            
        var loadView = pagePool.loadView;
        loadView.show();
        loadView.onhide = indexPageBack;

        loadView.load();
    };

    //index页面
    var indexPageBack = function() {
        pagePool.indexView = pagePool.indexView || new IndexViewController();
            
        var indexView = pagePool.indexView;
        indexView.show();
        //indexView.onhide = gamePageBack;
    };

    loadPageBack();

};

//$(window).on('load', init);
init();
