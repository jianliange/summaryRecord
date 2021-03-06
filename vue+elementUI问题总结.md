# vue-infinite-scroll

问题描述：在空白页面没有铺满整个页面没有滚动条触发的情况下，只触发后台一次请求数据。

解决：给包裹的infinite-list-wrapper添加样式overflow: auto;

代码：

```html
<div class="infinite-list-wrapper">
   <ul
       v-infinite-scroll="getPolicyPreviewImgFun"
       class="list"
       infinite-scroll-disabled="picdisabled">
       <el-image v-for="(item,i) in imgList" :src="item.url" :key="item.attachmentNo" style="width: 110px;height: 110px;margin: 0 10px" :preview-src-list="originallistPreviewList" @click="getoriginallistPreviewList(i,item.url,imgList,'1')" fit="contain" lazy/>
    </ul>
    <p v-if="picloading" class="pic-load">加载中...</p>
    <p v-if="noMore" class="pic-load">没有更多了</p>
 </div>
 
 ```

 ```css
 .infinite-list-wrapper {
  /* height: 170px; */
  overflow: auto;
 }
 .infinite-list-wrapper .pic-load {
  font-size: 14px;
  text-align: center;
 }
 
 ```

 ## vue+elementUI   数据更新后，table中的树形下拉框显示值没有更新
 elementUI官网：https://element.eleme.cn/#/zh-CN/component/table#shu-xing-shu-ju-yu-lan-jia-zai
- 渲染树形数据时，必须要指定 row-key。
支持树类型的数据的显示。当 row 中包含 children 字段时，被视为树形数据。渲染树形数据时，必须要指定 row-key。支持子节点数据异步加载。设置 Table 的 lazy 属性为 true 与加载函数 load 。通过指定 row 中的 hasChildren 字段来指定哪些行是包含子节点。children 与 hasChildren 都可以通过 tree-props 配置。

```html
<el-table
    :data="tableData"
    style="width: 100%;margin-bottom: 20px;"
    row-key="id"
    border
    default-expand-all
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
    <el-table-column
      prop="date"
      label="日期"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="name"
      label="姓名"
      sortable
      width="180">
    </el-table-column>
    <el-table-column
      prop="address"
      label="地址">
    </el-table-column>
  </el-table>
```

## 菜单组件 控制台报错：Maximum call stack size exceeded

- 最后加了这个 { path: '*', redirect: '/404', hidden: true } ，但是跳转到/404的路由没有加

-   {

  ​    path: '/404',

  ​    component: () *=>* import('@/views/404'),

  ​    hidden: true

    },

## 弹框中的上传组件，文件信息闪现问题
- 描述：当弹框（el-dialog）不是第一次弹出时，上传组件中的文件列表中会出现上一次上传的文件信息，然后逐渐消失。
- 解决：弹框加一个 v-if ，加了v-if就会销毁组件。

## 路由跳转新的浏览器页面空白问题
对数据没有定义，没有进行判断，导致数据渲染时报错太多，页面崩溃
解决：进行判断，`v-if="data&&data.length>0"`
例如：
页面显示需要用到数组`{{data[0].key1}} {{data[0].key2}}`的数据,
但是data是个空数组，则会导致undefined报错。
table数据也可能有这样问题

## deep深度监听

vue监听里面添加的变量，只要加了deep深度监听，变量改变了，也会触发这个监听

## 生产发布后用户依旧调用了旧接口问题
前端排查：
①每次程序只要有变化，打包生成的js的hash都是不一样的。
②token失效了，后端返回401状态码，前端会重定向登录页面，并且会刷新页面（location.reload() // 为了重新实例化vue-router对象 避免bug）
③前端发布是无感的。
后端：
①默认token24小时有效
②后端服务器是k8s，和集群可以有一样的功能。新版本发布好之后，将后端指向新版本，无缝链接。

如果发布的时候，用户还在继续操作，将会导致，用户用的旧版本前端接口数据，接收请求的为新版本的后端接口，很容易导致数据问题。

解决方案：
为避免出现类似问题，后端每次发布都清除掉radis中用户token，这样用户token失效，返回401状态码，前端就会根据401状态码重定向到登录页，并刷新页面。实现用户使用新版本前端问题

## module in (webpack)/lib/NormalModule.js, (webpack)/lib/node/NodeTargetPlugin.js
项目启动报这个错
发现文件中莫名添加了这行代码 import  { debug } from "webpack"
去掉这行代码就行了