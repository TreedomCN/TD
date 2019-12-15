(function (doc, win) {
    var width = 1000;
    var height = 1600;
    var rootValue = 100; // 此处值与postcss配置中'postcss-pxtorem'的值一样

    var docEl = doc.documentElement;
    var rszEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var reCalc = (function () {
        var reCalc = function () {
            var winWidth = docEl.clientWidth;
            var winHeight = docEl.clientHeight;
            if (!winWidth) return;
            var fontSize;
            if (winWidth / winHeight > 0.8 && winWidth / winHeight < 1.2) return;
            // alert(winWidth / winHeight);
            if (winWidth < winHeight) {
                if ((winWidth / winHeight) > (height / width)) {
                    fontSize = (rootValue * (winHeight / height));
                } else {
                    fontSize = (rootValue * (winHeight / height));
                }
            } else {
                if ((winWidth / winHeight) > (height / width)) {
                    fontSize = (rootValue * (winHeight / height));
                } else {
                    fontSize = (rootValue * (winHeight / height));
                }
            }
            docEl.style.fontSize = (fontSize > 110 ? 110 : fontSize) + 'px';
            return reCalc;
        };
        return reCalc();
    })();
    reCalc();
    setTimeout(function () {
        reCalc();
    }, 300);
    win.addEventListener('load', reCalc, false);
    win.addEventListener(rszEvt, reCalc, false);
    if (!doc.addEventListener) return;
    doc.addEventListener('DOMContentLoaded', reCalc, false);
})(document, window);
