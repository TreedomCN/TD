/*
 雪碧音

 var MediaSprite = new MediaSprite({
    wrap: '#videoWrap',   //如果没有wrap,直接添加到body
    type: 'video',         //如果是雪碧音可以填audio, 也可以不填
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


 {string} 雪碧音的命名
 {function} 回调函数, 函数参数为雪碧音名字
 {bool} 是否循环播放

 mediaSprite.play('first', function (name) {
    console.log(name + ' end');
 }, true);



 */

var MediaSprite = function (config) {

    var _config = config;
    var media = null,
        isLoad = false,
        loadCb = null,
        _currentHandler = null;

    var _createMedia = function () {

        if(_config.type == 'video'){

            media = document.createElement('video');

            media.setAttribute('webkit-playsinline', '');

            media.setAttribute('playsinline', '');

            media.setAttribute('preload', 'preload');

        } else {

            media = document.createElement('audio');

        }

        media.src = _config.src;

        media.id = 'spriteMedia' + Math.floor(Math.random()*100000);

        if( _config.wrap ) {

            document.querySelector(_config.wrap).appendChild(media);

        } else {

            document.body.appendChild(media);

        }

        media = document.querySelector('#' + media.id);

        _loadMedia();

    };

    var _loadMedia = function () {

        var loadHandler = function (e) {

            if (this.currentTime > 0) {

                this.pause();

                this.removeEventListener('timeupdate', loadHandler);

                setTimeout(function(){

                    loadCb && loadCb();

                }, 200);

                isLoad = true;
            }
        };

        media.addEventListener('timeupdate', loadHandler);

        media.play();

    };

    var play = function (name, callback, loop) {

        if( isLoad ) {

            gotoAndPlay(name, callback, loop);

        } else {

            loadCb = (function(name, callback, loop){

                return function(){
                    var begin = _config.timeline[name].begin,
                        end = _config.timeline[name].end;

                    media.currentTime = begin;

                    console.log(media.currentTime);

                    var playHandler = function () {

                        if(this.currentTime >= end){
                            if(loop){

                                media.currentTime = begin;

                            } else {

                                this.pause();

                                media.removeEventListener('timeupdate', playHandler);

                                callback && callback(name);

                            }

                        }
                    };

                    media.removeEventListener('timeupdate', _currentHandler);

                    media.addEventListener('timeupdate', playHandler);
                    
                    //0延时将plpy()请求置于队列末位消除回调里直接play的报错，by————xsy
                    setTimeout(function () {
                        media.play();
                    }, 0)

                    _currentHandler = playHandler;
                };

            })(name, callback, loop);

        }

    };

    var gotoAndPlay = function (name, callback, loop) {

        var begin = _config.timeline[name].begin,
            end = _config.timeline[name].end;

        media.currentTime = begin;

        console.log(media.currentTime);

        var playHandler = function () {

            if(this.currentTime >= end){
                if(loop){

                    media.currentTime = begin;

                } else {

                    this.pause();

                    media.removeEventListener('timeupdate', playHandler);

                    callback && callback(name);

                }

            }
        };

        media.removeEventListener('timeupdate', _currentHandler);

        media.addEventListener('timeupdate', playHandler);

        //异步执行防止直接play的报错
        setTimeout(function () {
            media.play();
        }, 0)

        _currentHandler = playHandler;

    };

    var _init = function () {

        _createMedia();

    };

    _init();

    return {

        play: play

    }
};

module.exports = MediaSprite;
