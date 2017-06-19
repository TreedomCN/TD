
(function (doc, win) {
    var docEl = doc.documentElement,
        rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        reCalc = (function () {
            var reCalc = function () {
                var width = 1200, height = 640;
                var winWidth = docEl.clientWidth;
                var winHeight = docEl.clientHeight;

                if (!winWidth) return;

                if (winWidth < winHeight) {
                    //竖屏
                    if ((winWidth / winHeight) <= (height / width)) {
                        var fontSize = 100 * (winWidth / height);
                    } else {
                        var fontSize = 100 * (winHeight / width );
                    }
                } else {
                    //横屏
                    if ((winWidth / winHeight) <= (width / height)) {
                        var fontSize = 100 * (winWidth / width);
                    } else {
                        var fontSize = 100 * (winHeight / height);
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
            window.location.href += '&_wv=1'
        }else{
            window.location.href += '?_wv=1'
        }
    }
}());
