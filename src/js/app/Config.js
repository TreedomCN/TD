
var Preload = require('./module/Preload');

var Config = {};

/*
 var audioPath = require('../../media/test_audio.mp3');

 var audio = new Audio(audioPath);

 console.log(audio);
 */

// ajax请求链接
Config.requireUrl = '';

// 图片路径前缀
// 如kf文件里图片不使用require时 img地址：Config.imgPath
Config.imgPath = process.env.NODE_ENV === 'handover' ? process.env.PATH : process.env.PATH + 'img/';

Config.scale = 1;

Config.Preload = Preload;

// 预加载的图片
Config.pageImgs = {
    imgs: [
        {
            name: 'bg_load_tips',
            url: require('../../img/bg_load_tips.png')
        },
        {
            name: 'bg_end',
            url: require('../../img/bg_end.jpg')
        },
        {
            name: 'bg_float_share',
            url: require('../../img/bg_float_share.png')
        },
        {
            name: 'bg_skip',
            url: require('../../img/bg_skip.png')
        }
    ],
    sprites: [
        /*
        {
            el: $('.m-game .kf-game-video'),
            pathPrefix: Config.imgPath,
            postfix: 'jpg'
        }
        */
    ],
    keyimgs: []
};

module.exports = Config;
