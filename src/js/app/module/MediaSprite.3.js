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
    var self = this;

    self.config = config;

    self.media = null;

    self.firstUpdate = false;

    self.isStarted = false;

    self.updateSpace = 0.25;

    self.createMedia();

    self.view = self.media;

    self.startedCallback = [];

    self.startedCtr();

    self.autoFireMedia();
};

var fn = MediaSprite.prototype;

fn.createMedia = function () {
    var self = this;
    var config = self.config;
    var media = self.media;

    if (config.type === 'video') {
        media = document.createElement('video');

        media.setAttribute('webkit-playsinline', '');

        media.setAttribute('playsinline', '');

        media.setAttribute('preload', 'preload');

        // 没播放前最小化，防止部分机型闪现微信原生播放按钮
        media.style.width = '1px';
        media.style.height = 'auto';
    } else {
        media = document.createElement('audio');
    }

    config.loop && (media.loop = true);

    media.src = config.src;

    if (config.wrap) {
        document.querySelector(config.wrap).appendChild(media);
    } else {
        document.body.appendChild(media);
    }

    media.addEventListener('timeupdate', self.onTimeupdate.bind(self));

    self.normalPause = true;

    // media.addEventListener('pause', self.onPause.bind(self));

    this.media = media;
};

fn.play = function (param) {
    var self = this;
    var media = self.media;

    self.playParam = param;

    self.prettyKeyFram(param.name);

    self.firstUpdate = false;

    if (!self.isStarted) {
        self.onStart(function () {
            self.play(param);
        });
        log('onStart ' + self.config.type);
        return;
    }

    self.pauseTimer && clearTimeout(self.pauseTimer);

    media.currentTime = self.beginTime;

    self.normalPause = false;

    if (self.config.checkoutSelf) {
        self.onPause();
    }

    media.play();

    log('play ' + self.config.type + new Date().getTime());
};

// 格式化关键帧时间
fn.prettyKeyFram = function (name) {
    var self = this;
    var config = self.config;
    var thispart = config.timeline[name];

    var spaceTime = 1 / config.fps;

    var begin = thispart.begin;
    var beginInt = begin | 0;
    // 将后两位由帧数转化为秒数
    self.beginTime = beginInt + Math.abs(beginInt - begin) * spaceTime * 100 + 0.08;

    // 不设置开始时间时接上次时间
    if (!begin) {
        self.beginTime = self.lastEnd || 0;
    }

    var end = thispart.end;
    // 安卓上暂停时会少播一帧，那就多加一帧
    // var u = navigator.userAgent;
    // if ((u.indexOf('Android') > -1 || u.indexOf('Adr') > -1) && navigator.platform !== 'Win32') {
    //     end += 0.01;
    // }
    var endInt = end | 0;
    // 将后两位由帧数转化为秒数
    self.endTime = endInt + Math.abs(endInt - end) * spaceTime * 100 - 0.12;

    // 记录上次播放结尾
    self.lastEnd = end;
};

fn.on = function (time, cb) {
    var self = this;
    var spaceTime = 1 / self.config.fps;
    var beginInt = time | 0;
    var thisTime = beginInt + Math.abs(beginInt - time) * spaceTime * 100;
    var watch = function () {
        if (this.currentTime >= thisTime) {
            cb && cb();
            self.media.removeEventListener('timeupdate', watch);
        }
    };

    self.media.addEventListener('timeupdate', watch);
};

fn.onTimeupdate = function () {
    var self = this;
    var endT = self.endTime;
    var media = self.media;

    // self.normalPause = false;

    if (!self.firstUpdate && (media.currentTime > self.beginTime)) {
        self.playParam.onBegin && self.playParam.onBegin();
        self.firstUpdate = true;
    }

    // 在低性能机器上过长的间隔不足以触发定时计时，以常规方式
    if (media.currentTime >= endT) {
        self.normalPause = true;
        media.pause();
        self.pauseTimer && clearTimeout(self.pauseTimer);
        self.playParam.onComplete && self.playParam.onComplete();
        log('常规');
        return;
    }
    var space = endT - media.currentTime;

    // 在距离指定点两个间隔处设置setTimeout定时暂停，以达到精准暂停效果
    if (space <= self.updateSpace * 2 && !self.pauseTimer) {
        var time = space * 1000 | 0;
        time = time > 0 ? time : 0;
        self.pauseTimer = setTimeout(function () {
            if (self.playParam.loop) {
                media.currentTime = self.beginTime;
            } else {
                self.normalPause = true;
                media.pause();
                // clearInterval(self.onPauseTimer);
                self.playParam.onComplete && self.playParam.onComplete();
                log('pauseTimer__');
            }
            self.pauseTimer = null;
        }, time);
    }
};

fn.jump = function () {
    var self = this;
    self.media.currentTime = self.endTime;
    // self.normalPause = true;
    // self.media.pause();
    // self.pauseTimer && clearTimeout(self.pauseTimer);
    // self.playParam.onComplete && self.playParam.onComplete();
    log('jump__');
};

// 因网络卡顿暂停的也暂停定时器
fn.onPause = function () {
    var self = this;
    self.onPauseTimer && clearInterval(self.onPauseTimer);
    log('init onPauseTimer');
    self.onPauseTimer = setInterval(() => {
        log('mediaPaused normalPause ' + self.media.paused + '  ' + self.normalPause);
        if (self.media.paused && !self.normalPause) {
            log('play--');
            self.media.play();
        }
    }, 1000 + Math.random() * 300); // 随机数防止播放共振
};

fn.pause = function () {
    var self = this;
    // self.pauseTimer && clearTimeout(self.pauseTimer);
    self.normalPause = true;
    self.mPause = true;
    // self.onPauseTimer && clearInterval(self.onPauseTimer);
    self.media.pause();
};

fn.continue = function () {
    if (this.mPause) {
        this.media.play();
        this.mPause = false;
    }
};

fn.startedCtr = function (callback) {
    var self = this;
    var media = self.media;

    var onStarted = function () {
        if (this.currentTime > 0) {
            // 开始播放后最大化
            media.style.width = '100%';

            self.normalPause = true;

            media.pause();

            self.isStarted = true;

            self.startedCallback.forEach(ele => {
                ele && ele();
            });

            self.startedCallback = [];

            media.removeEventListener('timeupdate', onStarted);
        }
    };

    media.addEventListener('timeupdate', onStarted);
};

fn.autoFireMedia = function () {
    var self = this;
    var autoFire = self.config.autoFire;
    if (autoFire || autoFire === 0) {
        document.body.addEventListener('touchend', function videoCtrInit() {
            log('fire play touchend ' + self.config.type);
            self.media.play();
            document.body.removeEventListener('touchend', videoCtrInit);
        });
        document.body.addEventListener('click', function videoCtrInit2() {
            log('fire play click ' + self.config.type);
            self.media.play();
            document.body.removeEventListener('click', videoCtrInit2);
        });
    }
};

fn.onStart = function (callback) {
    this.startedCallback.push(callback);
};

module.exports = MediaSprite;
