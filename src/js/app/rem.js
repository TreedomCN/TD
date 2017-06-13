
(function (doc, win) {
    var docEl = doc.documentElement,
        rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        reCalc = (function () {
            var reCalc = function () {
                var winWidth = docEl.clientWidth;
                var winHeight = docEl.clientHeight;
                if (!winWidth) return;

                if (winWidth < winHeight) {
                    if ((winWidth/winHeight) > (750 / 1200)) {
                        var fontSize = (100 * ( winWidth / 750 ));
                    }else{
                        var fontSize = ( 100 * ( winHeight / 1200 ));
                    }
                } else {
                    if ((winWidth/winHeight) > (1200/750)) {
                        var fontSize = (100 * ( winWidth / 1200 ));
                    }else{
                        var fontSize = ( 100 * ( winHeight / 750 ));
                    }
                }

                docEl.style.fontSize = (fontSize > 110 ? 110 : fontSize) + 'px';
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
