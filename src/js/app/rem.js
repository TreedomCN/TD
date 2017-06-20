
(function (doc, win) {
    var docEl = doc.documentElement;
    var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';

    var reCalc = (function () {
        var reCalc = function () {
            var width = 1200;
            var height = 640;
            var winWidth = docEl.clientWidth;
            var winHeight = docEl.clientHeight;

            if (!winWidth) return;
            var fontSize;

            if (winWidth < winHeight) {
                // 竖屏
                if ((winWidth / winHeight) <= (height / width)) {
                    fontSize = 100 * (winWidth / height);
                } else {
                    fontSize = 100 * (winHeight / width);
                }
            } else {
                // 横屏
                if ((winWidth / winHeight) <= (width / height)) {
                    fontSize = 100 * (winWidth / width);
                } else {
                    fontSize = 100 * (winHeight / height);
                }
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
