import Preload from './module/Preload.js';

var Config = {};

// ajax请求链接
Config.requireUrl = '';

// 图片路径前缀
// 如kf文件里图片不使用require时 img地址：Config.imgPath
Config.imgPath = process.env.NODE_ENV === 'handover' ? process.env.PATH : process.env.PATH + 'img/';

// 默认分享语
Config.defShare = {
    title: '分享标题',
    desc: '分享描述',
    link: location.href,
    // 分享配图
    img: Config.imgPath + 'share.jpg',
    // 项目名，数据查询时候用
    proj: 'streetgame',
    // 填写公众号绑定的appid
    // appid: 'wx12380ea254191f1b',
    appid: 'wxd9c36d6cbc5d53f3',
    cnzz: '1278291595'
};

Config.Preload = Preload;
window.Preload = Preload;

// 预加载的图片
Config.pageImgs = {
    imgs: [
        {
            name: 'test1',
            url: require('../../img/bg.jpg')
        },
        {
            name: 'test3',
            url: require('../../img/box.png')
        },
        {
            name: 'test4',
            url: require('../../img/bt_msg.png')
        },
        {
            name: 'test5',
            url: require('../../img/css_sprites_350.png')
        },
        {
            name: 'test6',
            url: require('../../img/select1.png')
        },
        {
            name: 'test7',
            url: require('../../img/select2.png')
        },
        {
            name: 'test8',
            url: require('../../img/select3.png')
        },
        {
            name: 'test9',
            url: require('../../img/select4.png')
        },
        {
            name: 'test10',
            url: require('../../img/select5.png')
        },
        {
            name: 'test11',
            url: require('../../img/select6.png')
        },
        {
            name: 'test12',
            url: require('../../img/select7.png')
        },
        {
            name: 'test13',
            url: require('../../img/select8.png')
        },
        {
            name: 'test14',
            url: require('../../img/share_box.png')
        },
        {
            name: 'test15',
            url: require('../../img/share_close.png')
        },
        {
            name: 'test16',
            url: require('../../img/skip.png')
        },
        {
            name: 'test18',
            url: require('../../img/tip_select.png')
        },
        {
            name: 'bill_box',
            url: require('../../img/bill_box.png')
        },
        {
            name: 'xinli_slogan1',
            url: require('../../img/xinli_slogan1.png')
        },
        {
            name: 'xinli_slogan2',
            url: require('../../img/xinli_slogan2.png')
        },
        {
            name: 'xinli_slogan3',
            url: require('../../img/xinli_slogan3.png')
        },
        {
            name: 'wenxue_slogan1',
            url: require('../../img/wenxue_slogan1.png')
        },
        {
            name: 'wenxue_slogan2',
            url: require('../../img/wenxue_slogan2.png')
        },
        {
            name: 'wenxue_slogan3',
            url: require('../../img/wenxue_slogan3.png')
        },
        {
            name: 'tianwen_slogan1',
            url: require('../../img/tianwen_slogan1.png')
        },
        {
            name: 'tianwen_slogan2',
            url: require('../../img/tianwen_slogan2.png')
        },
        {
            name: 'tianwen_slogan3',
            url: require('../../img/tianwen_slogan3.png')
        },
        {
            name: 'shengwu_slogan1',
            url: require('../../img/shengwu_slogan1.png')
        },
        {
            name: 'shengwu_slogan2',
            url: require('../../img/shengwu_slogan2.png')
        },
        {
            name: 'shengwu_slogan3',
            url: require('../../img/shengwu_slogan3.png')
        },
        {
            name: 'jisuanji_slogan1',
            url: require('../../img/jisuanji_slogan1.png')
        },
        {
            name: 'jisuanji_slogan2',
            url: require('../../img/jisuanji_slogan2.png')
        },
        {
            name: 'jisuanji_slogan3',
            url: require('../../img/jisuanji_slogan3.png')
        },
        {
            name: 'jingji_slogan1',
            url: require('../../img/jingji_slogan1.png')
        },
        {
            name: 'jingji_slogan2',
            url: require('../../img/jingji_slogan2.png')
        },
        {
            name: 'jingji_slogan3',
            url: require('../../img/jingji_slogan3.png')
        },
        {
            name: 'jianzhu_slogan1',
            url: require('../../img/jianzhu_slogan1.png')
        },
        {
            name: 'jianzhu_slogan2',
            url: require('../../img/jianzhu_slogan2.png')
        },
        {
            name: 'jianzhu_slogan3',
            url: require('../../img/jianzhu_slogan3.png')
        },
        {
            name: 'huaxue_slogan1',
            url: require('../../img/huaxue_slogan1.png')
        },
        {
            name: 'huaxue_slogan2',
            url: require('../../img/huaxue_slogan2.png')
        },
        {
            name: 'huaxue_slogan3',
            url: require('../../img/huaxue_slogan3.png')
        },
        {
            name: 'bill_xinli',
            url: require('../../img/bill_xinli.jpg')
        },
        {
            name: 'bill_wenxue',
            url: require('../../img/bill_wenxue.jpg')
        },
        {
            name: 'bill_tianwen',
            url: require('../../img/bill_tianwen.jpg')
        },
        {
            name: 'bill_shengwu',
            url: require('../../img/bill_shengwu.jpg')
        },
        {
            name: 'bill_jisuanji',
            url: require('../../img/bill_jisuanji.jpg')
        },
        {
            name: 'bill_jingji',
            url: require('../../img/bill_jingji.jpg')
        },
        {
            name: 'bill_jianzhu',
            url: require('../../img/bill_jianzhu.jpg')
        },
        {
            name: 'bill_huaxue',
            url: require('../../img/bill_huaxue.jpg')
        },
        {
            name: 'tip_msg',
            url: require('../../img/tip_msg.png')
        },
        {
            name: 'bill_box_xinli',
            url: require('../../img/bill_box_xinli.png')
        },
        {
            name: 'bill_box_huaxue',
            url: require('../../img/bill_box_huaxue.png')
        },
        {
            name: 'bill_box_jianzhu',
            url: require('../../img/bill_box_jianzhu.png')
        },
        {
            name: 'bill_box_jingji',
            url: require('../../img/bill_box_jingji.png')
        },
        {
            name: 'bill_box_jisuanji',
            url: require('../../img/bill_box_jisuanji.png')
        },
        {
            name: 'bill_box_shengwu',
            url: require('../../img/bill_box_shengwu.png')
        },
        {
            name: 'bill_box_tianwen',
            url: require('../../img/bill_box_tianwen.png')
        },
        {
            name: 'bill_box_wenxue',
            url: require('../../img/bill_box_wenxue.png')
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
    keyimgs: [
        /*
        {
            el: $('.m-game .kf-game-video'),
            pathPrefix: Config.imgPath,
            postfix: 'jpg'
        }
        */
    ]
};

module.exports = Config;
