(function (doc, win) {
    var docEl = doc.documentElement;
    var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

    var reCalc = (function () {
        var reCalc = function () {
            var width = 1334;
            var height = 750;
            var winWidth = docEl.clientWidth;
            var winHeight = docEl.clientHeight;

            if (!winWidth) return;
            var fontSize;

            if (winWidth < winHeight) {
                // 竖屏
                fontSize = 100 * (winWidth / height);
                /*
                 if ((winWidth / winHeight) <= (height / width)) {
                 fontSize = 100 * (winWidth / height);
                 } else {
                 fontSize = 100 * (winHeight / width);
                 }
                 */
            } else {
                // 横屏
                fontSize = 100 * (winWidth / width);
                /*
                 if ((winWidth / winHeight) <= (width / height)) {
                 fontSize = 100 * (winWidth / width);
                 } else {
                 fontSize = 100 * (winHeight / height);
                 }
                 */
            }

            docEl.style.fontSize = fontSize + 'px';

            return reCalc;
        };
        return reCalc();
    })();
    if (!doc.addEventListener) return;
    win.addEventListener(rszEvt, reCalc);
})(document, window);

(function () {
    var getQuery = function (name) {
        var m = window.location.search.match(new RegExp('(\\?|&)' + name + '=([^&]*)(&|$)'));
        return !m ? '' : decodeURIComponent(m[2]);
    };
    if (!getQuery('_wv')) {
        if (window.location.search) {
            window.location.href += '&_wv=1';
        } else {
            window.location.href += '?_wv=1';
        }
    }
}());

// if (typeof (pgvMain) === 'function') pgvMain(); // 千万不能忘记！
// (function (doc, win) {
//     var docEl = doc.documentElement;
//     var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
//     var reCalc = (function () {
//         var reCalc = function () {
//             var winWidth = docEl.clientWidth;
//             var winHeight = docEl.clientHeight;
//             var fontSize;
//             if (!winWidth) return;

//             if (winWidth < winHeight) {
//                 if ((winWidth / winHeight) < (750 / 1200)) {
//                     fontSize = (100 * (winWidth / 750));
//                 } else {
//                     fontSize = (100 * (winHeight / 1200));
//                 }
//             } else {
//                 if ((winWidth / winHeight) < (1200 / 750)) {
//                     fontSize = (100 * (winWidth / 1200));
//                 } else {
//                     // 横屏宽高比小于等于16/9的cover，大于的contain
//                     if ((winWidth / winHeight) <= (16 / 9)) {
//                         fontSize = (100 * (winWidth / 1200));
//                     } else {
//                         fontSize = (100 * (winHeight / 750));
//                     }
//                 }
//             }
//             docEl.style.fontSize = (fontSize > 110 ? 110 : fontSize) + 'px';
//             return reCalc;
//         };
//         return reCalc();
//     })();
//     if (!doc.addEventListener) return;
//     win.addEventListener(rszEvt, reCalc);
// })(document, window);
