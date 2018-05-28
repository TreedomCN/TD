// 加载页对象
var IndexViewController = function () {
    // 公共变量
    var _that = this;

    // 私有变量
    var _private = {};

    _private.pageEl = $('.m-index');

    _private.isInit = false;

    // 初始化，包括整体页面
    _private.init = function () {
        if (_private.isInit === true) {
            return;
        }

        var videoBox = _private.pageEl.find('.video-box');
        var video = videoBox.find('.video').get(0);
        var endBox = _private.pageEl.find('.end-box');
        var btnHref = endBox.find('.btn-href');
        var btnShare = endBox.find('.btn-share');
        var shareFloat = $('.m-share-float');
        var shareBox = shareFloat.find('.share-box');
        var btnSkip = videoBox.find('.btn-skip');
        var isPlay = false;
        var step = 0;
        var isSkip = false;

        var canplayEvent = function () {
            if (!isPlay && video.currentTime > 1) {
                isPlay = true;
                _that.onplaying && _that.onplaying();
                return false;
            }
            if (step === 0 && video.currentTime > 0 && video.currentTime < video.duration / 4) {
                step = 1;
                // ----- 交接版统计 -----
                // PTTSendClick('video', 'time', '0/4位置');
                // ----- 本地版统计 -----
                // TD.push('系统事件', '视频进度', '0/4位置', '');
            } else if (step === 1 && video.currentTime > video.duration / 4 && video.currentTime < video.duration / 2) {
                step = 2;
                // ----- 交接版统计 -----
                // PTTSendClick('video', 'time', '1/4位置');
                // ----- 本地版统计 -----
                // TD.push('系统事件', '视频进度', '1/4位置', '');
            } else if (step === 2 && video.currentTime > video.duration / 2 && video.currentTime < video.duration / 4 * 3) {
                step = 3;
                // ----- 交接版统计 -----
                // PTTSendClick('video', 'time', '2/4位置');
                // ----- 本地版统计 -----
                // TD.push('系统事件', '视频进度', '2/4位置', '');
            } else if (step === 3 && video.currentTime > video.duration / 4 * 3) {
                step = 4;
                // ----- 交接版统计 -----
                // PTTSendClick('video', 'time', '3/4位置');
                // ----- 本地版统计 -----
                // TD.push('系统事件', '视频进度', '3/4位置', '');
            }
            if (!isSkip && video.currentTime > video.duration / 4) {
                btnSkip.show();
            }
            if (video.currentTime > video.duration - 2) {
                endBox.show();
                btnSkip.hide();
                video.removeEventListener('timeupdate', canplayEvent);
            }
        };

        video.addEventListener('timeupdate', canplayEvent);

        video.addEventListener('ended', function () {
            endBox.addClass('show');
        });

        video.play();

        btnShare.on('click', function (e) {
            shareFloat.show();
            // ----- 交接版统计 -----
            // PTTSendClick('btn', 'share', '分享');
            // ----- 本地版统计 -----
            // TD.push('用户操作', '点击按钮', '分享', '', e, this);
        });

        btnHref.on('click', function (e) {
            // ----- 交接版统计 -----
            // PTTSendClick('btn', 'download', '跳转');
            // ----- 本地版统计 -----
            // TD.push('用户操作', '点击按钮', '跳转', '', e, this);
        });

        shareFloat.on('click', function (e) {
            $(this).hide();
        });

        btnSkip.on('click', function (e) {
            video.currentTime = video.duration - 2;
            $(this).hide();
            // ----- 交接版统计 -----
            // PTTSendClick('btn', 'skip', '跳过视频');
            // ----- 本地版统计 -----
            // TD.push('用户操作', '点击按钮', '跳过视频', '', e, this);
        });

        var shareResize = function (e) {
            setTimeout(function () {
                var width = window.innerWidth;
                var height = window.innerHeight;
                if (e && height / width < 1.2 && height / width > 0.8) {
                    return false;
                }
                if (width > height) {
                    shareBox.css({
                        width: width + 'px',
                        height: height + 'px'
                    });
                } else {
                    shareBox.css({
                        width: height + 'px',
                        height: width + 'px'
                    });
                }
            }, 500);
        };

        $(window).on('resize', shareResize);
        shareResize();

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

    _private.init();
};

module.exports = IndexViewController;
