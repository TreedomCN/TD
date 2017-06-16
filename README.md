# TD

0. 安装nodejs环境
1. 运行npm install 安装对应的node依赖包
2. 编译js和css运行：gulp
3. $ npm run **(对应的环境)

## 项目命名规范

tx-star-web-20160320（腾讯-明星大作战(项目名)-前端平台-时间）

## 主要开发文件目录
```
	 .
    ├── src
    │   ├── img     // 存放图片资源
    │   ├── js      
    │   │   ├── app      // 一些自己写的库
    │   │   ├── lib      // 第三方库
    │   │   └── index.js // 程序入口
    │   ├── less
    │   │   └── style.less
    │   └── media   // 存放媒体文件
    ├── index.ejs   // ejs模版
    ├── config.path.js   // 路径配置
    └── webpack.config.XX.js

```
## 配置文件说明

| 环境              | 配置文件                     | 资源路径    | 执行命令               | 生成文件         | NODE_ENV |js、css是否压缩 |
| :--------------- | :------------------------- | :--------- | -------------------- | ---------------- |--------- |------------- |
| 公用配置           | webpack.config.base.js     |            |                      |                  |         |               |
| 开发              | webpack.config.dev.js      |            | npm run dev          | 否               |dev       |               |
| 测试              | webpack.config.prod.js     |  ／         | npm run dist        | dist             |dist      |是 (保留console.log)|
| 线上              | webpack.config.prod.js     |  cnd地址    | npm run build       | dist             |prod      |是              |
| 交接              | webpack.config.handover.js |  客户提供    | npm run handover    | dist／ossweb-img |handover  |否              |


>  使用ejs模版，模版中的图片必需用`require`引入:

```
<img src="<%= require('./src/img/test.jpg') %>"alt="">

```

> 资源路径配置文件： `config.path.js` cnd与交接地址根据自己项目需求修改对应地址即可。

 
> 媒体文件打包后在img文件中

> webpack-dev-server 后在浏览器打开的ip是0.0.0.0:3000,如要在手机测试请在浏览将0.0.0.0替换为本机ip即可。

> 其它外部js直接在index.ejs中用script引入 

> 新增`rem.js` 如不需要rem布局，请在index.ejs将`<%= htmlWebpackPlugin.options.remjs %>`去掉。

## TODO

1. 多入口文件配置
2. dll配置

## License

[MIT](https://opensource.org/licenses/MIT)
