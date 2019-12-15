/*
*
*  引入lib库文件和LESS文件
*  必须要引入,过滤器会过滤lib文件夹里面的JS文件,做一个简单的复制
*  复制到相应的文件夹
*  引入的less会对less进行编译存放到css文件夹
* */
import '../less/style.less';

/** The animate() method */
import './util/fx';
/** Animated show, hide, toggle, and fade*() methods. */
import './util/fx_methods';
// import TD from './app/module/TD.js';

// 引入的包根据实际情况而定
import LoadViewController from './app/LoadViewController';
import IndexViewController from './app/IndexViewController';

// import './model/Far';
// import './model/Mid';
// import './model/Scroller';
// import Main2 from './model/Main2';

// 页面级对象池
var pagePool = {
    loadView: null,
    indexView: null
};

var init = function () {
    var loadPageBack = function () {
        pagePool.loadView = pagePool.loadView || new LoadViewController();

        var loadView = pagePool.loadView;
        loadView.show();
        loadView.onhide = indexPageBack;

        loadView.load();
    };

    // index页面
    var indexPageBack = function () {
        pagePool.indexView = pagePool.indexView || new IndexViewController();

        var indexView = pagePool.indexView;
        indexView.show();
        // indexView.onhide = gamePageBack;
    };

    loadPageBack();
};

init();

// document.querySelector('.step1').addEventListener('click', function () {
//     TD.push('用户操作', '点击开始按钮', '播放视频');
// });

// document.querySelector('.input_confirm_btn').addEventListener('click', function () {
//     TD.push('用户操作', '点击昵称确认按钮', '弹出科目，确认昵称');
// });
// for (var i = 0; i < 8; i++) {
//     document.querySelector('.select' + (i + 1)).addEventListener('click', function () {
//         TD.push('用户操作', '点击科目按钮', '选择科目');
//     });
// };
