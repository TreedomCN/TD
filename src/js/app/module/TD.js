var TD = {};

// 美林版ajax对应接口
TD.ajax = function (pm, succback, errorback) {
    $.ajax({
        type: pm.type || 'GET',
        url: pm.url,
        dataType: 'json',
        data: pm.data || '',
        success: function (data) {
            if (data.status === 1) {
                succback && succback(data.data);
            } else {
                errorback && errorback(data.message);
            }
        },
        error: function () {
            errorback && errorback('网络连接不稳定，请重试或刷新页面！');
        }
    });
};
/*
data参数说明
data = {
    title: string, 朋友圈标题，给朋友的描述
    desc: string, 给朋友的标题
    link: string, 链接
    img: string, 图标
    track: string, 分享数据上报地址,post {btn:'1'}朋友或{btn:'2'}朋友圈
}
*/
TD.wxShare = function (data, callback) {
    wx.onMenuShareTimeline({
        title: data.title, //  分享标题
        link: data.link, //  分享链接
        imgUrl: data.img, //  分享图标
        success: function () {
            callback && callback();
            // 上报朋友圈
            TD.ajax({
                url: 'https://click.treedom.cn/log',
                type: 'POST',
                data: {
                    key: 'wechat',
                    val: 'timeline',
                    pro: data.proj
                }
            }, function (data) {
                console.log(data);
            }, function (msg) {
                console.log(msg);
            });

            // TD.push(['分享', "朋友圈"]);
            _czc && _czc.push(['_trackEvent', '分享', '朋友圈']);
        },
        cancel: function () {
            //  用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareAppMessage({
        title: data.title, //  分享标题
        desc: data.desc, //  分享描述
        link: data.link, //  分享链接
        imgUrl: data.img, //  分享图标
        success: function () {
            callback && callback();
            // 上报朋友
            TD.ajax({
                url: 'https://click.treedom.cn/log',
                type: 'POST',
                data: {
                    key: 'wechat',
                    val: 'message',
                    pro: data.proj
                }
            }, function () {}, function (msg) {
                console.log(msg);
            });

            // TD.push(['分享', "好友"]);
            _czc && _czc.push(['_trackEvent', '分享', '好友']);
        },
        cancel: function () {
            //  用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQQ({
        title: data.title, //  分享标题
        desc: data.desc, //  分享描述
        link: data.link, //  分享链接
        imgUrl: data.img, //  分享图标
        success: function () {
            //  用户确认分享后执行的回调函数
            callback && callback();
            // 上报朋友
            TD.ajax({
                url: 'https://click.treedom.cn/log',
                type: 'POST',
                data: {
                    key: 'wechat',
                    val: 'QQ',
                    pro: data.proj
                }
            }, function () {}, function (msg) {
                console.log(msg);
            });

            // TD.push(['分享', "QQ好友"]);
            _czc && _czc.push(['_trackEvent', '分享', 'QQ好友']);
        },
        cancel: function () {
            //  用户取消分享后执行的回调函数
        }
    });
    wx.onMenuShareQZone({
        title: data.title, //  分享标题
        desc: data.desc, //  分享描述
        link: data.link, //  分享链接
        imgUrl: data.img, //  分享图标
        success: function () {
            //  用户确认分享后执行的回调函数
            callback && callback();
            // 上报朋友
            TD.ajax({
                url: 'https://click.treedom.cn/log',
                type: 'POST',
                data: {
                    key: 'wechat',
                    val: 'QZone',
                    pro: data.proj
                }
            }, function () {}, function (msg) {
                console.log(msg);
            });

            // TD.push(['分享', "QZone"]);
            _czc && _czc.push(['_trackEvent', '分享', 'QZone']);
        },
        cancel: function () {
            //  用户取消分享后执行的回调函数
        }
    });

    // 手Q分享
    $('#share-name').attr('content', data.title);
    $('#share-description').attr('content', data.desc);
    $('#share-image').attr('content', data.img);
};

// 初始化微信接口
// 注意，与微信标准data相比，这里多了data.share属性，对应的是初始化页面时有默认的分享数据
TD.initWxApi = function (shareData, errback, succback) {
    // 服务器获取验证信息
    TD.ajax({
        url: 'https://click.treedom.cn/wx/signature',
        type: 'POST',
        data: {
            appid: shareData.appid,
            url: encodeURIComponent(shareData.link)
        }
    }, function (data) {
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
        wx.ready(function () {
            succback && succback();
            TD.wxShare(shareData);
            wx.getNetworkType({
                success: function (res) {
                    var networkType = res.networkType; //  返回网络类型2g，3g，4g，wifi
                    // TD.push(['网络类型', networkType]);
                    _czc && _czc.push(['_trackEvent', '网络类型', networkType]);
                }
            });
        });
    }, function (err) {
        console.log(err);
    });
};

// 元素基于屏幕自适应缩放，dom上有data-response属性的元素都会受它影响
/*
config = {
    width: 375,
    height: 600,
    type: 'cover' //  'contain'
}
return config定义的scale值
v1 新增，在dom上增加data-type属性，可选内容有"cover"、"contain"
*/
TD.responseBody = function (config) {
    config = config || {};
    config.width = config.width || 375;
    config.height = config.height || 600;
    config.type = config.type || 'cover'; // 'cover'、'contain'

    var responseList = $('[data-response]');

    var rate;
    var rateCover;
    var rateContain;

    var responseFn = function () {
        var rateX = document.documentElement.clientWidth / config.width;
        var rateY = document.documentElement.clientHeight / config.height;

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

        responseList.each(function () {
            var type = $(this).attr('data-type');
            var elRate;
            if (type === 'cover') {
                elRate = rateCover;
            } else if (type === 'contain') {
                elRate = rateContain;
            } else {
                elRate = rate;
            }
            this.style.webkitTransform = 'scale(' + elRate + ')';
        });
    };

    responseFn();

    $(window).on('resize', function () {
        responseFn();
    });

    return rate;
};

// 提示竖屏函数
TD.portraitTips = function (el) {
    var portraitFloat = (typeof el === 'string') ? $(el) : el;

    var orientHandler = function () {
        if (window.orientation === 90 || window.orientation === -90) {
            portraitFloat.show();
        } else {
            portraitFloat.hide();
        }
    };
    orientHandler();

    $(window).on('resize', function () {
        orientHandler();
    });
};

/*
检测转屏函数用法
API：TD.rotateScreen.addListener(callback);// 添加事件侦听
     TD.rotateScreen.removeListener();// 取消事件侦听

example:
TD.rotateScreen.addListener(function (data) {
    if(data == 1) {
        console.log('左转屏');
        TD.rotateScreen.removeListener();// 注销事件侦听
    }

    if(data == 2) {
        console.log('右转屏');
    }

    if(data == 3) {
        console.log('竖屏');
    }

    if(data == 4) {
        console.log('倒屏');
    }
})
*/
TD.rotateScreen = (function () {
    var rotate;

    var add = function (callback) {
        var num;

        rotate = function (e) {
            if (Math.abs(e.beta) < 15 && e.gamma < -40) {
                num = 1;
                callback && callback(num); // 左转屏
            }
            if (Math.abs(e.beta) < 15 && e.gamma > 40) {
                num = 2;
                callback && callback(num); // 右转屏
            }
            if (e.beta > 40 && Math.abs(e.gamma) < 15) {
                num = 3;
                callback && callback(num); // 竖屏
            }
            if (e.beta < -40 && Math.abs(e.gamma) < 15) {
                num = 4;
                callback && callback(num); // 倒屏
            }
        };

        window.addEventListener('deviceorientation', rotate);
    };

    var remove = function () {
        // 解决ios设备会缓存上次移除deviceorientation事件时角度的问题。
        if (navigator.userAgent.indexOf('Android') > -1) {
            window.removeEventListener('deviceorientation', rotate);
        };
    };

    return {
        addListener: add,
        removeListener: remove
    };
})();

// 网络工具包
TD.util = {};
TD.util.getQuery = function (name) {
    var m = window.location.search.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'));
    return !m ? '' : decodeURIComponent(m[2]);
};
TD.util.setCookie = function (name, value, expiredays) {
    var exdate = new Date();
    document.cookie = name + '=' + value + ';expires=' +
        ((expiredays === null) ? exdate.setDate(exdate.getDate() + expiredays) : exdate.toGMTString()) + ';domain=treedom.cn';
};
TD.util.getCookie = function (name) {
    var cStart, cEnd;
    if (document.cookie.length > 0) {
        cStart = document.cookie.indexOf(name + '=');
        if (cStart !== -1) {
            cStart = cStart + name.length + 1;
            cEnd = document.cookie.indexOf(';', cStart);
            if (cEnd === -1) cEnd = document.cookie.length;
            return unescape(document.cookie.substring(cStart, cEnd));
        }
    }
    return '';
};

// todo: webpack-strip 不能去除TD.debug.xx(function () {}) 与 TD.debug.xx()形式, 函数回掉不要用匿名函数
/*
  例：
  let jumpCallback = function () {};

  TD.debug.jump(jumpCallback)

 */
/*
debug工具包
*/
TD.debug = {};

/*
移动端console.log()
*/
TD.debug.log = function (info, num) {
    var _num = num || 50;
    console.log(info);
    if (info instanceof Array) {
        info.join();
    } else if (typeof info === 'object') {
        var _info = JSON.stringify(info);
        console.log(_info);
    } else {
        info.toString();
    }
    if (!window.lloogg) {
        var dom = document.createElement('div');
        dom.setAttribute('id', 'log');
        document.body.appendChild(dom);
        dom.style.position = 'absolute';
        dom.style.zIndex = '9999';
        dom.style.color = '#fff';
        dom.style.backgroundColor = 'rgba(0,0,0,0.6)';
        dom.style.fontSize = '13px';
        window.lloogg = 0;
    }
    var domWrap = document.getElementById('log');
    if (window.lloogg > _num) {
        domWrap.removeChild(domWrap.childNodes[0]);
    }
    var text = document.createElement('p');
    text.style.margin = '0';
    text.style.padding = '0';
    text.innerHTML = info + '</br>';
    domWrap.appendChild(text);
    window.lloogg++;
};

/*
隐藏手势功能，在视频项目时非常好用；
 触发方式：相对于竖屏状态的双击左划左划；
 el：
 TD.debug.jump(function () {
 _video.currentTime = 100;
 })
 */

TD.debug.jump = function (name, callback) {
    callback && callback();
    // $('body').one('doubleTap', function (e) {
    //     var data = new Date().getTime();
    //     $('body').one('swipeLeft', function (e) {
    //         $('body').one('swipeLeft', function (e) {
    //             if ((new Date().getTime() - data) > 2000) {
    //                 return false;
    //             } else {
    //                 callback && callback();
    //             }
    //         });
    //     });
    // });
};

TD.debug.videoJump = function () {
    return 'test';
};

TD.pad = (num, n) => {
    let tbl = [];
    n = n || 5;
    let len = n - num.toString().length;
    if (len <= 0) return num;
    if (!tbl[len]) tbl[len] = (new Array(len + 1)).join('0');
    return tbl[len] + num;
};

/**
 * 获取m~n的随机数
 * @param {Number} m
 * @param {Number} n
 */
TD.getRandom = (m, n, Integer) => {
    return Math[Integer](Math.random() * (n - m) + m);
};

/** 为数字添加千位分隔符
 *
 * el: formatNum(10001) => 10,001
 *     formatNum(123456789) => 123,456,789
 */
TD.formatNum = (str) => {
    str += '';
    return str.replace(/\d{1,3}(?=(\d{3})+$)/g, function (s) {
        return s + ',';
    });
};

TD.loadingAni = function () {
    let loadingEl = document.createElement('div');
    loadingEl.style.display = 'none';
    loadingEl.style.width = '80px';
    loadingEl.style.height = '80px';
    loadingEl.style.borderRadius = '10px';
    loadingEl.style.backgroundColor = 'rgba(0, 0, 0, 0.65)';
    loadingEl.style.zIndex = '999';
    loadingEl.style.position = 'absolute';
    loadingEl.style.top = '50%';
    loadingEl.style.left = '50%';
    loadingEl.style.margin = '-40px 0 0 -40px';
    let loadingAniEl = document.createElement('div');
    loadingEl.appendChild(loadingAniEl);
    loadingAniEl.style.width = '16px';
    loadingAniEl.style.height = '11px';
    loadingAniEl.style.position = 'absolute';
    loadingAniEl.style.top = '50%';
    loadingAniEl.style.left = '50%';
    loadingAniEl.style.margin = '-5.5px 0 0 -8px';
    loadingAniEl.style.backgroundImage = 'url(data:image/gif;base64,R0lGODlhEAALAPQAAP///wAAANra2tDQ0Orq6gcHBwAAAC8vL4KCgmFhYbq6uiMjI0tLS4qKimVlZb6+vicnJwUFBU9PT+bm5tjY2PT09Dk5Odzc3PLy8ra2tqCgoMrKyu7u7gAAAAAAAAAAACH5BAkLAAAAIf4aQ3JlYXRlZCB3aXRoIGFqYXhsb2FkLmluZm8AIf8LTkVUU0NBUEUyLjADAQAAACwAAAAAEAALAAAFLSAgjmRpnqSgCuLKAq5AEIM4zDVw03ve27ifDgfkEYe04kDIDC5zrtYKRa2WQgAh+QQJCwAAACwAAAAAEAALAAAFJGBhGAVgnqhpHIeRvsDawqns0qeN5+y967tYLyicBYE7EYkYAgAh+QQJCwAAACwAAAAAEAALAAAFNiAgjothLOOIJAkiGgxjpGKiKMkbz7SN6zIawJcDwIK9W/HISxGBzdHTuBNOmcJVCyoUlk7CEAAh+QQJCwAAACwAAAAAEAALAAAFNSAgjqQIRRFUAo3jNGIkSdHqPI8Tz3V55zuaDacDyIQ+YrBH+hWPzJFzOQQaeavWi7oqnVIhACH5BAkLAAAALAAAAAAQAAsAAAUyICCOZGme1rJY5kRRk7hI0mJSVUXJtF3iOl7tltsBZsNfUegjAY3I5sgFY55KqdX1GgIAIfkECQsAAAAsAAAAABAACwAABTcgII5kaZ4kcV2EqLJipmnZhWGXaOOitm2aXQ4g7P2Ct2ER4AMul00kj5g0Al8tADY2y6C+4FIIACH5BAkLAAAALAAAAAAQAAsAAAUvICCOZGme5ERRk6iy7qpyHCVStA3gNa/7txxwlwv2isSacYUc+l4tADQGQ1mvpBAAIfkECQsAAAAsAAAAABAACwAABS8gII5kaZ7kRFGTqLLuqnIcJVK0DeA1r/u3HHCXC/aKxJpxhRz6Xi0ANAZDWa+kEAA7)';
    document.body.appendChild(loadingEl);

    let ctr = {};
    ctr.show = function () {
        loadingEl.style.display = 'block';
    };
    ctr.hide = function () {
        loadingEl.style.display = 'none';
    };

    return ctr;
};

TD.canvas2Img = function (param, width, height) {
    let canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    let ctx = canvas.getContext('2d');

    const draw = () => {
        return new Promise((resolve, reject) => {
            let para = param.shift();

            if (para.type === 'img') {
                let img = document.createElement('img');
                img.onload = () => {
                    if (para.isArc) {

                    }
                    ctx.drawImage(img, para.x, para.y, para.w, para.h);
                    param.length && draw();
                    resolve();
                };
                img.setAttribute('crossOrigin', 'Anonymous');
                img.src = para.src;
            } else if (para.type === 'text') {
                ctx.font = para.font || '30px Microsoft Yahei';
                ctx.fillStyle = para.color || '#000';
                ctx.textAlign = para.textAlign || 'start';
                ctx.fillText(para.string, para.x, para.y);
            } else if (para.type === 'imgArc') {

            }
        });
    };
    draw();
};

TD.imgLoader = function (imgSrc, notAnonymous) {
    return new Promise((resolve, reject) => {
        let img = document.createElement('img');
        img.onload = resolve.bind(this, img);
        !notAnonymous && img.setAttribute('crossOrigin', 'Anonymous');
        img.src = imgSrc;
    });
};

TD.getCanvas = function (w, h) {
    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext('2d');
    return {
        canvas: canvas,
        ctx: ctx
    };
};

// 事件统计
TD.push = function (category, action, label, value, e, el) {
    /*
    category:事件类别;action:事件操作;label:事件标签;value:事件值;
    */
    var _category = category || '';
    var _action = action || '';
    var _label = label || '';
    var _value = value || '';
    if (typeof _czc !== 'undefined') {
        _czc.push(['_trackEvent', _category, _action, _label, _value]);
    }
    if (typeof _tdga !== 'undefined') {
        _tdga && _tdga.addEvent(_category, _action, _label, _value, e, el);
    }
    if (typeof PTTSendClick !== 'undefined') {
        PTTSendClick(category, action, label);
    }
};

/*
    判断访问终端和语言（精简）
    date：20190102
    使用：
    if ( TD.browser.versions.QQ ) {
        console.log('go go');
    }
    其他详细判断参考：https://github.com/mumuy/browser
*/
TD.browser = {
    versions: (function () {
        var u = navigator.userAgent;
        return {
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), // 移动终端
            Tablet: u.indexOf('Tablet') > -1 || u.indexOf('Pad') > -1 || u.indexOf('Nexus 7') > -1, // 平板
            ios: u.indexOf('like Mac OS X') > -1, // ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, // android终端
            Safari: u.indexOf('Safari') > -1,
            Chrome: u.indexOf('Chrome') > -1 || u.indexOf('CriOS') > -1,
            IE: u.indexOf('MSIE') > -1 || u.indexOf('Trident') > -1,
            Edge: u.indexOf('Edge') > -1,
            QQBrowser: u.indexOf('QQBrowser') > -1,
            QQ: u.indexOf('QQ/') > -1,
            Wechat: u.indexOf('MicroMessenger') > -1,
            Weibo: u.indexOf('Weibo') > -1,
            360: u.indexOf('QihooBrowser') > -1,
            UC: u.indexOf('UC') > -1 || u.indexOf(' UBrowser') > -1,
            Taobao: u.indexOf('AliApp(TB') > -1,
            Alipay: u.indexOf('AliApp(AP') > -1
        };
    })(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
};

module.exports = TD;
