# webpack
- 官网：https://v4.webpack.docschina.org/concepts/
- 起步指南：https://v4.webpack.docschina.org/guides/getting-started/
## vue项目配置webpack
- 从零开始：一个正式的vue+webpack项目的目录结构是怎么形成的：https://www.cnblogs.com/scode2/p/8809007.html

1、 npm install -D vue-loader vue-template-compiler
2、 npm i webpack -D

## 关于关于babel-polyfill的介绍与使用
链接：https://www.cnblogs.com/liuhp/p/9675255.html
```js
import 'babel-polyfill';
module.exports = {
  entry:['babel-polyfill','./src/main.js'] //使用babel-polyfill，为当前环境提供一个垫片,转码ES6语法进行兼容
}
```

## 打包大优化
### 一、vue项目懒加载
```js
const home = () => import('@/views/index/index.vue')
```
### 二、UI库按需加载
### 三、不生成.map文件
配置里productionSourceMap设置成为false，能差不多减少一半的体积。
### 四、通过cdn方式引入
将不怎么会改动的第三方包通过<script>标签引入，并且在webpack.base.config.js中的externals添加包名，表示不打包的文件，去除在main.js中的引用。（这个方法可以解决打包后app.js、vendor.js文件过大的问题。）
```js
  externals: {
      'vue': 'Vue',
      'vue-router': 'VueRouter',
      'axios': 'axios',
  },
```
### 五、图片压缩
可利用一些网站对大体积图片进行压缩，例如：
- tinypng：https://tinypng.com/
### 六、使用webpack提供的gizp压缩工具
同样的在config.index.build中找到productionGzip这个把默认的false改成true，不过在修改之前我们要先去下载compression-webpack-plugin直接在该项目中执行npm install --save-dev
compression-webpack-plugin即可了