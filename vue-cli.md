# vue-cli
## 打包
### 配置项官网参考
官网：https://cli.vuejs.org/zh/config/#vue-config-js
### vue-cli搭建的项目打包后，无法引用js文件
- 问题原因：项目打包路径默认绝对路径"./",改为相对路径""
- 解决方案：在项目根目录下新建vue-config.js文件，配置资源路径
```js
module.exports = {
  lintOnSave: false,
  publicPath: process.env.NODE_ENV === 'production' ? '' : '/', //文件打包后引入资源路径
  outputDir: 'dist',  // 生成的打包文件夹名，默认为dist
  devServer: {
    // open: true,
    // host: 'localhost',
    // port: 8080,
    // https: false
    // 以上的ip和端口是我们本机的;下面为需要跨域的
    // proxy: { // 配置跨域
    //   '/api': {
    //     target: 'http://127.0.0.1/api', // 这里后台的地址模拟的;应该填写你们真实的后台接口
    //     ws: true,
    //     changOrigin: true, // 允许跨域
    //     pathRewrite: {
    //       '^/api': 'api'// 请求的时候使用这个api就可以
    //     }
    //   }
    // }
  }
}

```

## vue-cli已经默认配置了一些打包优化配置