import TD from './module/TD.js';
import Config from './Config.js';

// 项目初始化的一些函数
var initProject = function () {
    // cnzz统计代码 强制HTTPS，防劫持
    (function () {
        var cnzzID = Config.defShare.cnzz;
        document.write(unescape('%3Cspan id="cnzz_stat_icon_' + cnzzID + '"%3E%3C/span%3E%3Cscript src="' + 'https://s4.cnzz.com/z_stat.php%3Fid%3D' + cnzzID + '" type="text/javascript"%3E%3C/script%3E'));
        $('#cnzz_stat_icon_' + cnzzID).hide();
    })();

    // 初始化微信接口
    TD.initWxApi(Config.defShare);

    // 阻止微信下拉；原生js绑定覆盖zepto的默认绑定
    document.body.addEventListener('touchmove', function (e) {
        e.preventDefault();
    }, {passive: false});

    /** 解决微信6.7.4 ios12 软键盘收回时页面不回弹 */
    $('input').on('blur', () => {
        window.scrollTo(0, 0);
    });

    // debug工具
    if (TD.util.getQuery('vconsole')) {
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        document.body.appendChild(script);
        script.onload = () => {
            var vConsole = new VConsole(); // eslint-disable-line
            console.log('Hello world');
        };
        script.src = require('../lib/vconsole.min.js');
    }
};

// 加载页对象
var LoadViewController = function () {
    // 公共变量
    var _that = this;

    // 私有变量
    var _private = {};

    _private.pageEl = $('.m-loading');

    _private.isInit = false;

    // 初始化，包括整体页面
    _private.init = function () {
        if (_private.isInit === true) {
            return;
        }
        initProject();

        // 加载体现在页面上
        _private.processLineEl = _private.pageEl.find('.loadProcess .inner');

        _private.gload = new Config.Preload(Config.pageImgs);

        _private.gload.onloading = function (p) {
            console.log(p);
            _private.processLineEl.css('height', p + '%');
        };

        _private.gload.onload = function () {
            _that.hide();
        };

        _private.gload.onfail = function (msg) {
            console.log(msg);
        };

        _private.isInit = true;
    };

    // 显示
    _that.show = function () {
        _private.pageEl.show();
    };

    // 隐藏
    _that.hide = function () {
        _that.onhide && _that.onhide();
        _private.pageEl.hide();
    };

    // 执行加载
    _that.load = function () {
        _private.gload.load();
    };

/* 此代码解决横竖屏切换时iso上触发多次的bug
    var rotateELSize = function (e) {
        var winWidth = document.documentElement.clientWidth;
        var winHeight = document.documentElement.clientHeight;

        if (e && winWidth / winHeight < 1.2 && winWidth / winHeight > 0.8) {
            return false;
        }

        // do something

        window.addEventListener('resize', rotateELSize);
    };
*/
    _private.init();
};

module.exports = LoadViewController;
