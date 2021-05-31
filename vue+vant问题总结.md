
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

# 文件上传组件
```html
<van-field name="uploader" class='uploadPhoto'>
  <template #input>
    <van-uploader
      ref="uploadImg"
      v-model="images"
      :before-delete="beforeDel"
      :before-read="beforeRead"
      :after-read="afterRead"
      multiple
      :preview-full-image="false"
      @click-preview="clickPreview"
      preview-cover="加载中..."
      accept="image/jpg,image/jpeg"
      :max-size="5 * 1024 * 1024">
      </van-uploader>
  </template>
</van-field>
```
## beforeRead
- 调用Compressor：解决拍照上传的图片被旋转 90 度
```js
beforeRead (file) {
  return new Promise((resolve, reject) => {
    if (file instanceof Array) {
      for (let i = 0; i < file.length; i++) {
        if (file[i].type !== 'image/jpeg' && file[i].type !== 'image/jpg') {
          this.$toast.fail('请上传 jpg、jpeg 格式图片')
          reject()
        }
        new Compressor(file, {
          success: resolve,
          error (err) {
            console.log(err.message)
          }
        })
      }
    } else {
      if (file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
        this.$toast.fail('请上传 jpg、jpeg 格式图片')
        reject()
      }
      new Compressor(file, {
        success: resolve,
        error (err) {
          console.log(err.message)
        }
      })
    }
  })
},
```
## afterRead
```js
    afterRead (file, name) {
      // 此时可以自行将文件上传至服务器
      if (file instanceof Array) {
        file.map((v) => {
          v.status = 'uploading'
          v.message = '上传中...'
          v.index = name.index
          this.uploadImg(v)
        })
      } else {
        file.status = 'uploading'
        file.message = '上传中...'
        file.index = name.index
        this.uploadImg(file)
      }
    },
    blobToFile (file) {
      return new window.File([file.file], file.file.name, { type: file.file.type })
    },
    // 上传
    async uploadImg (file) {
      try {
        console.log('file1', file)
        //被Compressor插件处理过file，file.file会转成blob类型，此时进行转为file
        const response = await this.blobToFile(file)
        file.file = response
        // file.file = base64TOfile(response, file.file.name)
        const param = new FormData()
        param.append('file', file.file)
        const that = this
        uploadSurveyAnnexNew(param).then((res) => {
          if (res.status === '1') {
            if (file instanceof Array) {
            // 判断是否是数组
              file.map((v, i) => {
                v.status = 'success'
                v.message = ''
                v.content = `data:image/jpeg;base64,${res.data.filePath}`
              })
            } else {
              file.status = 'success'
              file.message = ''
              file.content = `data:image/jpeg;base64,${res.data.filePath}`
            }
          } else {
            file.status = 'failed'
            file.message = '上传失败'
            that.$toast(res.data.errMsg)
          }
        })
      } catch (error) {
        console.log(error)
      }
    },    

```
## clickPreview 点击缩略图预览原图
 - 将上传组件自带的预览大图去掉： `:preview-full-image="false"`
 - 引入图片预览组件 van-image-preview
 - 点击缩略图，向后台请求原图，并将原图存储进一个数组中，下次请求相同图片时，直接将数组中的值赋值给图片预览组件；原图预览组件中的图片数据，每次只要一张图片，所以每次赋值时，都需要把值改为空数组（如果是存储多张图片，会引起点击缩略图，打开的不是对应原图的问题）
```html
    <!-- 加载提示 -->
    <van-overlay :show="showPopup">
      <div class="wrapper" @click.stop style="margin-top: 200px;">
        <van-loading size="80px" color="#ffffff" vertical >加载中...</van-loading>
      </div>
    </van-overlay>
    <!-- 原图预览 :startPosition="index" -->
    <van-image-preview v-model="show" :images="previewOptions.images" :closeable="true"  :show-index="false">
      <!-- <template v-slot:index></template> -->
    </van-image-preview>
```
```js
    async clickPreview (file, name) {
      if (!this.clickedImages[name.index]) {
        this.showPopup = true
        const upData = {
          type: '01',
          taskno: this.investigateNo,
          filePath: file.attachmentNo,
          attachmentNo: file.attachmentNo,
          fileType: ''
        }
        getPrefileImg(upData).then(async (response) => {
          // const fileImg = await base64TOfile(`data:image/jpeg;base64,${response.data}`)
          // const imgSrc = await fileToBase64(fileImg)
          this.previewOptions.images = []
          this.previewOptions.images.push(`data:image/jpeg;base64,${response.data}`)
          this.$set(this.clickedImages, name.index, `data:image/jpeg;base64,${response.data}`)
          this.showPopup = false
          this.show = true
        }).catch(err => {
          this.showPopup = false
          this.show = false
          console.log('###previewImg##', err)
        })
      } else {
        this.previewOptions.images = []
        this.previewOptions.images.push(this.clickedImages[name.index])
        this.show = true
      }
    },
```