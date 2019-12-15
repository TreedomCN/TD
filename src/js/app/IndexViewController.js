import TD from './module/TD';
// 加载页对象
var IndexViewController = function () {
    // 公共变量
    var _that = this;

    // 私有变量
    var _private = {};

    _private.pageEl = $('.m-index');

    _private.isInit = false;

    var imgCanvasShow = new Image();
    var imgCanvasDownload = new Image();

    var imgFlag = false;
    // 生成海报 name,学科,slogan
    _private.buildCanvas = (name, i) => {
        if (imgFlag) {
            // 删除上一次的海报
            document.querySelector('.bill').removeChild(imgCanvasShow);
        };
        var subject;
        if (i === 0) {
            console.log('建筑', subject);
            subject = 'jianzhu';
        } else if (i === 1) {
            console.log('文学');
            subject = 'wenxue';
        } else if (i === 2) {
            console.log('天文学');
            subject = 'tianwen';
        } else if (i === 3) {
            console.log('计算机');
            subject = 'jisuanji';
        } else if (i === 4) {
            console.log('生物学');
            subject = 'shengwu';
        } else if (i === 5) {
            console.log('心理学');
            subject = 'xinli';
        } else if (i === 6) {
            console.log('经济学');
            subject = 'jingji';
        } else if (i === 7) {
            console.log('化学');
            subject = 'huaxue';
        };
        var canvas = document.createElement('canvas');
        var canvas2 = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var ctx2 = canvas2.getContext('2d');
        console.log(subject);
        var imgBg1 = Preload.buffer.imgs['bill_box_' + subject];
        console.log(imgBg1);
        var num = Math.floor(Math.random() * 3 + 1);
        var imgBg2 = Preload.buffer.imgs[subject + '_slogan' + num];
        // var imgBg1 = Preload.buffer.imgs['bill_box'];
        // var imgBg2 = Preload.buffer.imgs['xinli_slogan' + Math.floor(Math.random() * 3 + 1)];
        // 保存海报底
        var imgBg3 = Preload.buffer.imgs['bill_' + subject];

        var shareImgData;
        var downloadImgData;

        canvas.width = 1000;
        canvas.height = 1600;

        canvas2.width = 750;
        canvas2.height = 1600;

        setTimeout(() => {
            // 生成展示海报；
            ctx.drawImage(imgBg1, 0, 0, canvas.width, canvas.height);
            // ctx.drawImage(imgBg, 0, 0, window.innerWidth, window.innerHeight);
            ctx.font = 'bolder 30px Heiti';
            // ctx.fillStyle = '#3bdaef';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(name, canvas.width * 0.55, 395);
            if (subject === 'jisuanji' && num === 2) {
                ctx.drawImage(imgBg2, 500 - 30 * imgBg2.width / imgBg2.height, 430, 60 * imgBg2.width / imgBg2.height, 80);
            } else {
                ctx.drawImage(imgBg2, 500 - 55 * imgBg2.width / imgBg2.height, 430, 110 * imgBg2.width / imgBg2.height, 110);
            };
            // ctx.drawImage(imgBg2, 350, 440, 290, 110);
            // ctx.drawImage(imgBg2, 350 - imgBg2.width / 2, 440 - imgBg2.height / 2, imgBg2.width, imgBg2.height);
            // ctx.drawImage(imgBg2, 500 - 55 * imgBg2.width / imgBg2.height, 430, 110 * imgBg2.width / imgBg2.height, 110);
            shareImgData = canvas.toDataURL('image/png');
            imgCanvasShow.src = shareImgData;
            document.querySelector('.bill').appendChild(imgCanvasShow);
            imgFlag = true;
        }, 100);

        // 生成保存海报；
        setTimeout(() => {
            // 生成展示海报；
            ctx2.drawImage(imgBg3, 0, 0, canvas2.width, canvas2.height);
            // ctx.drawImage(imgBg, 0, 0, window.innerWidth, window.innerHeight);
            ctx2.font = 'bolder 40px Heiti';
            // ctx2.fillStyle = '#3bdaef';
            ctx2.fillStyle = '#ffffff';
            ctx2.fillText(name, 425, 260);

            // ctx2.drawImage(imgBg2, 175, 300, 400, 110);
            if (subject === 'jisuanji' && num === 2) {
                ctx2.drawImage(imgBg2, 375 - 35 * imgBg2.width / imgBg2.height, 360, 70 * imgBg2.width / imgBg2.height, 70);
            } else {
                ctx2.drawImage(imgBg2, 375 - 65 * imgBg2.width / imgBg2.height, 330, 130 * imgBg2.width / imgBg2.height, 130);
            };
            // ctx2.drawImage(imgBg2, 175 - imgBg2.width / 2, 300 - imgBg2.height / 2, imgBg2.width, imgBg2.height);
            downloadImgData = canvas2.toDataURL('image/png');
            imgCanvasDownload.src = downloadImgData;
            imgCanvasDownload.classList.add('imgDownload');
            document.querySelector('.bill').appendChild(imgCanvasDownload);
            // imgFlag = true;
        }, 100);

        $('.m-index').addClass('blur');
    }

    // 初始化，包括整体页面
    _private.init = function () {
        if (_private.isInit === true) {
            return;
        }
        // var indexBox = _private.pageEl.find('.index-box');

        _private.isInit = true;

        // 播放音乐
        _private.pageEl.find('.music').get(0).play();
        console.log('play');
        setTimeout(() => {
            $('.title').fadeOut();
            setTimeout(() => {
                $('.input-box').fadeIn();
            }, 400);
        }, 400);
        /** 解决微信6.7.4 ios12 软键盘收回时页面不回弹 */
        $('input').on('blur', () => {
            window.scrollTo(0, 0);
            $('body').scrollTop(0);
            $('.m-wrap').css('marginTop', '0');
        });
        $('input').on('focus', () => {
            if (TD.browser.versions.ios) {
                // window.scrollTo(0, -50);
                $('.m-wrap').css('marginTop', '-1.5rem');
            }
        });

        var inputBox = _private.pageEl.find('.input-box');
        var resultBox = _private.pageEl.find('.result-box');
        var inputName = _private.pageEl.find('.input').get(0);
        var confirm = _private.pageEl.find('.btn-confirm').get(0);
        var name;
        confirm.addEventListener('click', () => {
            if (inputName.value) {
                name = inputName.value;
                console.log(name);
                inputBox.fadeOut();
                resultBox.fadeIn();
                window.scrollTo(0, 0);
                document.body.scrollTop = 0;
                console.log('blur');
            }
        });
        var subjects = _private.pageEl.find('.subject-start');
        for (let i = 0; i < 8; i++) {
            subjects[i].addEventListener('click', (e) => {
                subjects[i].classList.add('animation-scale');
                setTimeout(() => {
                    subjects[i].classList.remove('animation-scale');
                }, 400);
                _private.buildCanvas(name, i);
                setTimeout(() => {
                    $('.bill').fadeIn();
                }, 300);
                console.log('click subject', i, e, this);
                subjects[i].classList.add('animation-subject');
            });
        };
        // 关闭海报
        $('.bill-close').get(0).addEventListener('click', () => {
            console.log('bill close');
            $('.bill').fadeOut();
            $('.m-index').removeClass('blur');
        });
    };
    // 显示
    _that.show = function () {
        // _private.pageEl.css('display', 'block');
        // _private.pageEl.fadeIn();
    };

    // 隐藏
    _that.hide = function () {
        _that.onhide && _that.onhide();
        _private.pageEl.hide();
    };

    _private.init();
};

module.exports = IndexViewController;
