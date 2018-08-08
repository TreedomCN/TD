/*
todo: 1、2、3优先，4、5次优先
    内在功能：1、根据传入的DOM节点自动生成media节点，并添加相关属性；
             2、未播放前视频默认1px大小， 开始播放时自动100%；
             3、根据传入的时间帧自动转换为时间单位；
             4、给根节点添加事件，自动触发视频播放功能；
             5、监测视频异常暂停，弹出加载中的提示，缓冲完再次播放时移除提示；
 */

export default class MediaSprite {
    /**
     * 雪碧媒体库
     * @param {*} element media的父元素节点
     * @param {string} src media的地址
     * @param {object} timeline 视频片段的时间线，例如
     * {
     *  first: [0, 10.2],
     *  second: [10.2, 11.2]
     * }
     */
    constructor (element, src, timeline) {
        this.view = null;
    }

    /**
     * 播放一个视频片段
     * @param {tring} name 需要播放的片段名称
     * @param {boolean} loop 是否循环播放
     * @param {function} callback 视频播放完成的回调函数或者一个数组：第一个元素为开始播放的回调，第二个为播放结束的回调
     */
    play (name, loop, callback) {
    }

    /**
     * 暂停当前播放的视频片段，并可通过continue方法继续播放
     */
    pause () {
    }

    /**
     * 从pause方法暂停的地方继续播放
     */
    continue () {
    }

    /**
     * 停止播放
     */
    stop () {
    }
};
