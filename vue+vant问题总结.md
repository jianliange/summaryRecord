
# 给图片添加水印
```js
    /* 照片转码成base64加上时间水印 */
    getBase64Time (url) {
      const that = this
      return new Promise((resolve, reject) => { // 异步处理
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const image = new Image()
        let fontSize // 水印的大小 
        // const  MAX_WH = 800// 图片的最大宽高比，因为在以上方法中获取的照片size太大，上传时耗时太多所以需要做处理
        image.crossOrigin = 'Anonymous'
        image.onload = function () { // 这里是一个异步，所以获取到的base64文件需要用回调
          // if (image.height > MAX_WH) {
          //   image.width *= MAX_WH / image.height
          //   image.height = MAX_WH
          // }
          // if (image.width > MAX_WH) {
          //   image.height *= MAX_WH / image.width
          //   image.width = MAX_WH
          // }
          canvas.height = image.height
          canvas.width = image.width
          ctx.drawImage(image, 0, 0, image.width, image.height)
          if (image.width > 100 && image.width < 500) {
            fontSize = '14px'
          } else if (image.width >= 500 && image.width < 1000) {
            fontSize = '24px'
          } else if (image.width >= 1000 && image.width < 1500) {
            fontSize = '34px'
          }
          ctx.font = `${fontSize} Arial`
          ctx.fillStyle = 'white'
          const time = that.nowTime// 获取当前的时间
          ctx.textAlign = 'left'
          ctx.textBaseline = 'middle'
          ctx.fillText(time, 20, image.height - 60) // 将当前时间添加到图片左下角位置
          const dataURL = canvas.toDataURL('image/jpeg')
          if (dataURL) {
            resolve(dataURL)
          } else {
            reject('err')
          }
        }
        image.src = url
      })
    },
```

# 部分浏览器上传照片没有文件选项问题
accept=".jpg,.jpeg" 改为 accept="image/jpg,image/jpeg"

# 腾讯地图定位
