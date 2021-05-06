# webpack
- 官网：https://v4.webpack.docschina.org/concepts/

## 关于关于babel-polyfill的介绍与使用
链接：https://www.cnblogs.com/liuhp/p/9675255.html
```js
import 'babel-polyfill';
module.exports = {
  entry:['babel-polyfill','./src/main.js'] //使用babel-polyfill，为当前环境提供一个垫片,转码ES6语法进行兼容
}
```