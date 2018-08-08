/*
 雪碧视频&雪碧音

 var newMediaSprite = new MediaSprite({
    wrap: '#videoWrap',   //如果没有wrap,直接添加到body
    type: 'video',        //如果是雪碧音可以填audio, 也可以不填
    fps: 25,              // 视频帧率；
    src: 'http://hymm.treedom.cn/sound/bg.mp3',
    timeline: {
        'first': {
            begin: 0.0,
            end: 6.0
        },
        'second': {
            begin: 10.0,
            end: 15.0
        }
    }
 });

接口：

newMediaSprite.play(string,function,bool)       {string} 雪碧音的命名
                                                {function} 回调函数
                                                {bool} 是否循环播放

newMediaSprite.started(function)  media开始播放时触发function一次，视频项目时利器；

newMediaSprite.view       返回当前media的dom节点；

el:
mediaSprite.play('first', function (name) {
    console.log(name + ' end');
}, true);

 */

var MediaSprite = function (config) {
    this.config = config;
    this.media = null;

    this.createMedia();
    this.view = this.media;
};

var fn = MediaSprite.prototype;

fn.view = null;

fn.createMedia = function () {
    var config = this.config;
    var media = this.media;

    if (config.type === 'video') {
        media = document.createElement('video');

        media.setAttribute('webkit-playsinline', '');

        media.setAttribute('playsinline', '');

        media.setAttribute('preload', 'preload');

        // 没播放前最小化，防止部分机型闪现微信原生按钮
        media.style.width = '1px';
        media.style.height = 'auto';
    } else {
        media = document.createElement('audio');
    }

    media.src = config.src;

    if (config.wrap) {
        document.querySelector(config.wrap).appendChild(media);
    } else {
        document.body.appendChild(media);
    }

    this.media = media;
};

fn.play = function (name, loop, callback) {
    var self = this;
    var config = this.config;
    var thispart = config.timeline[name];

    self.normalPause = false;

    var spaceTime = 1 / config.fps;
    var update = 0.25;

    var begin = thispart.begin;
    var beginInt = parseInt(begin);
    // 将后两位由帧数转化为秒数
    begin = beginInt + Math.abs(beginInt - begin) * spaceTime * 100;

    var end = thispart.end;
    var u = navigator.userAgent;
    // 安卓上暂停时会少播一帧，那就多加一帧
    if ((u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) && navigator.platform !== 'Win32') {
        end += 0.01;
    }
    var endInt = parseInt(end);
    // 将后两位由帧数转化为秒数
    end = endInt + Math.abs(endInt - end) * spaceTime * 100;

    var media = this.media;

    self.playHandler && self.media.removeEventListener('timeupdate', self.playHandler);

    // 当不设置起始点时，从上段结束点开始
    if (begin || begin === 0) {
        media.currentTime = begin;
        this.lastEnd = end;
    } else {
        begin = this.lastEnd || 0;
        media.currentTime = begin;
    }

    var playHandler = function () {
        // 在低性能机器上过长的间隔不足以触发定时计时，以常规方式
        if (media.currentTime > end) {
            media.pause();
            media.removeEventListener('timeupdate', playHandler);
            self.pauseTimer && clearTimeout(self.pauseTimer);
            return;
        }
        var space = end - media.currentTime;

        if (space <= update * 2) {
            media.removeEventListener('timeupdate', playHandler);
            var time = Math.ceil(space * 1000);
            time = time > 0 ? time : 0;
            // 在距离指定点两个间隔处设置setTimeout定时暂停，以达到精准暂停效果
            self.pauseTimer = setTimeout(function () {
                if (loop) {
                    media.currentTime = begin;
                    media.addEventListener('timeupdate', playHandler);
                } else {
                    self.normalPause = true;
                    media.pause();
                    callback && callback();
                }
            }, time);
        }
    };

    self.playHandler = playHandler;

    media.addEventListener('timeupdate', playHandler);

    // 因网络卡顿暂停的也暂停定时器
    media.addEventListener('pause', function pauseFun() {
        if (self.normalPause) {
            return false;
        }
        media.removeEventListener('pause', pauseFun);
        clearTimeout(self.pauseTimer);

        media.addEventListener('play', function playFun() {
            media.removeEventListener('play', playFun);
            playHandler();
        });
    });

    // 异步执行防止直接play的报错
    setTimeout(function () {
        media.play();
    }, 0);
};

fn.started = function (callback) {
    var media = this.media;
    var beginTime = function () {
        if (this.currentTime > 0) {
            // 开始播放后最大化
            media.style.width = '100%';

            callback && callback();

            media.removeEventListener('timeupdate', beginTime);
        }
    };

    media.addEventListener('timeupdate', beginTime);
};

module.exports = MediaSprite;
