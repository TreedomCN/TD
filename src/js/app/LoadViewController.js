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
};

// 加载页对象
var LoadViewController = function () {
    // 公共变量
    var _that = this;

    // 私有变量
    var _private = {};

    _private.pageEl = $('.m-loading');

    _private.isInit = false;

    var videoBox = _private.pageEl.find('.video-box');
    var video = videoBox.find('.loading-video').get(0);

    // 初始化，包括整体页面
    _private.init = function () {
        if (_private.isInit === true) {
            return;
        }
        initProject();

        let ratio = window.innerHeight / 1600;
        $('.loading_fire').css('transform', 'scale(' + ratio + ')');
        $('.loading_fire').css('webkitTransform', 'scale(' + ratio + ')');
        let fireSprite = new Image();
        fireSprite.src = require('../../img/css_sprites_350.png');
        fireSprite.onload = () => {
            $('.loading_fire').addClass('light');
        };

        // 加载体现在页面上
        _private.processLineEl = _private.pageEl.find('.loadProcess');

        _private.gload = new Config.Preload(Config.pageImgs);

        _private.gload.onloading = function (p) {
            console.log(p);
            _private.processLineEl.text(p + '%');
            // document.querySelector('.num').innerText = p + '%';
            // document.querySelector('.loading_text').classList.add('animation_fadein');
            // 预加载完成
            // document.querySelector('.step1').onclick = function () {
            //     if (p === 100) {
            //         loading_click();
            //     }
            // };
        };

        _private.gload.onload = function () {
            var videoClickFn = (e) => {
                _private.pageEl.find('.loading_text').fadeOut();
                _private.pageEl.find('.go-tips').fadeIn();
                video.play();
                _private.pageEl.off('click', videoClickFn);
                TD.push('用户操作', '点击开始按钮', '播放视频');
            };
            _private.processLineEl.fadeOut();
            setTimeout(() => {
                _private.pageEl.find('.loading_text').fadeIn();
            }, 300);

            _private.pageEl.on('click', videoClickFn);
            // _that.hide();
        };

        _private.gload.onfail = function (msg) {
            console.log(msg);
        };

        _private.isInit = true;
    };

    // 显示
    _that.show = function () {
        _private.pageEl.fadeIn();
        var timeFn = () => {
            videoBox.fadeIn();
            video.removeEventListener('timeupdate', timeFn);
        };
        video.addEventListener('timeupdate', timeFn);

        _private.pageEl.find('.video-skip').on('click', () => {
            video.pause();
            _that.hide();
            $('.m-index').fadeIn();
        });

        video.addEventListener('ended', () => {
            _that.hide();
            $('.m-index').css('display', 'block');
        });
    };

    // 隐藏
    _that.hide = function () {
        _that.onhide && _that.onhide();
        _private.pageEl.fadeOut();
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
