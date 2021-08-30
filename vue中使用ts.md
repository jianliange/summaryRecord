# 1、引入Typescript
```shell
npm install vue-class-component vue-property-decorator --save
npm install ts-loader typescript tslint tslint-loader tslint-config-standard --save-dev
```
`vue-class-component`：扩展vue支持typescript，将原有的vue语法通过声明的方式来支持ts

`vue-property-decorator`：基于vue-class-component扩展更多装饰器

`ts-loader`：让webpack能够识别ts文件

`tslint-loader`：tslint用来约束文件编码

`tslint-config-standard`： tslint 配置 standard风格的约束

# 2、配置文件
webpack配置
根据项目的不同配置的地方不同，如果是vue cli 3.0创建的项目需要在vue.config.js中配置，如果是3.0以下版本的话，需要webpack.base.conf中配置。(以下说明是在webpack.base.conf文件中更改)

1. 在resolve.extensions中增加.ts，目的是在代码中引入ts文件不用写.ts后缀
```js
  resolve: {
    extensions: ['.js', '.vue', '.json', '.ts'],
    alias: {}
  }
```
2. 在module.rules中增加ts的rules
```js
module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        enforce: 'pre',
        loader: 'tslint-loader'
      },
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      }
    ]
  }
```
3. tsconfig.json配置
ts-loader会检索文件中的tsconfig.json.以其中的规则来解析ts文件，详细的配置可以参考https://www.tslang.cn/docs/handbook/tsconfig-json.html
贴上测试项目tsconfig.json文件
```js
{
  // 编译选项
  "compilerOptions": {
    // 输出目录
    "outDir": "./output",
    // 是否包含可以用于 debug 的 sourceMap
    "sourceMap": true,
    // 以严格模式解析
    "strict": false,
    // 采用的模块系统
    "module": "esnext",
    // 如何处理模块
    "moduleResolution": "node",
    // 编译输出目标 ES 版本
    "target": "es5",
    // 允许从没有设置默认导出的模块中默认导入
    "allowSyntheticDefaultImports": true,
    // 将每个文件作为单独的模块
    "isolatedModules": false,
    // 启用装饰器
    "experimentalDecorators": true,
    // 启用设计类型元数据（用于反射）
    "emitDecoratorMetadata": true,
    // 在表达式和声明上有隐含的any类型时报错
    "noImplicitAny": false,
    // 不是函数的所有返回路径都有返回值时报错。
    "noImplicitReturns": true,
    // 从 tslib 导入外部帮助库: 比如__extends，__rest等
    "importHelpers": true,
    // 编译过程中打印文件名
    "listFiles": true,
    // 移除注释
    "removeComments": true,
    "suppressImplicitAnyIndexErrors": true,
    // 允许编译javascript文件
    "allowJs": true,
    // 解析非相对模块名的基准目录
    "baseUrl": "./",
    // 指定特殊模块的路径
    "paths": {
      "jquery": [
        "node_modules/jquery/dist/jquery"
      ]
    },
    // 编译过程中需要引入的库文件的列表
    "lib": [
      "dom",
      "es2015",
      "es2015.promise"
    ]
  }
}
```
4. tslint.json配置
在目录中新增tslint.json文件，由于我们前面安装了tslint-config-standard，所以可以直接用tslint-config-standard中规则，文件如下:
# 3、让项目识别.ts
由于 TypeScript 默认并不支持 *.vue 后缀的文件，所以在 vue 项目中引入的时候需要创建一个 vue-shim.d.ts 文件，放在根目录下
```js
declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
```
# 4、vue组件的编写
vue组件里大多数的方法改成通过@xxx（装饰器）来表明当前定义的为什么数据，类似ng中的注入。而业务逻辑js的部分就可以直接采用ts的写法了。
## 基本写法
模板`template`和样式`style`的写法不变，`script`的模块进行了改变，基本写法如下：
```js
<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
@Component
export default class Test extends Vue {
  
};
</script>
```
`lang="ts"`：script张声明下当前的语言是ts
`@Component`：注明此类为一个vue组件
`export default class Test extends Vue`： export当前组件类是继承vue的
## data()中定义数据
data中的数据由原来的data()方法改成直接在对象中定义
```js
export default class Test extends Vue {
 public message1: string = "heimayu";
 public message2: string = "真好看";
}
```
## props传值
props的话就没有data那么舒服了，因为他需要使用装饰器了，写法如下
```js
@Prop()
propA:string

@Prop()
propB:number
```
## $emit传值
### 不带参数
```js
  // 原来写法：this.$emit('bindSend')
  // 现在直接写 this.bindSend()
  // 多个定义
  @Emit()
  bindSend():string{
      return this.message
  }
```
### 方法带参数
```js
  // 原来写法：this.$emit('bindSend', msg)
  // 现在直接写： this.bindSend(msg)
  // 多个下面的定义
  @Emit()
  bindSend(msg:string){
      // to do something
  }
```
### emit带参数
```js
  // 这里的test是改变组件引用的@事件名称这时候要写@test 而不是@bindSend2
  @Emit('test)
  private bindSend2(){
      
  }
```
## watch观察数据
```js
  // 原来的写法 watch:{}

  @Watch('propA',{
      deep:true
  })
  test(newValue:string,oldValue:string){
      console.log('propA值改变了' + newValue);
  }
```
## computed计算属性
```js
public get computedMsg(){
      return '这里是计算属性' + this.message;
 }
public set computedMsg(message:string){
 }
```
# 完整代码案例
```js
<template>
  <div class="test-container">
    {{message}}
    <input type="button" value="点击触发父级方法" @click="bindSend"/>
    <input type="button" value="点击触发父级方法" @click="handleSend"/>
    <input type="button" value="点击触发父级方法" @click="bindSend2"/>
    <!-- <Hello></Hello> -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch, Emit } from "vue-property-decorator";
import Hello from "./HelloWorld.vue";
// 注明此类为一个vue组件
@Component({
  components: {
    Hello
  }
})
export default class Test extends Vue {
  // 原有data中的数据在这里展开编写
 public message: string = "asd";
  //原有props中的数据展开编写
  @Prop({
    type: Number,
    default: 1,
    required: false
  })
  propA?: number
  @Prop()
  propB:string
  //原有computed
  public get computedMsg(){
      return '这里是计算属性' + this.message;
  }
  public set computedMsg(message:string){
  }
  //原有的watch属性
  @Watch('propA',{
      deep:true
  })
  public test(newValue:string,oldValue:string){
      console.log('propA值改变了' + newValue);
  }
  // 以前需要给父级传值的时候直接方法中使用emit就行了，当前需要通过emit来处理
  @Emit()
  private bindSend():string{
      return this.message
  }
  @Emit()
  private bindSend1(msg:string,love:string){
      // 如果不处理可以不写下面的，会自动将参数回传
    //   msg += 'love';
    //   return msg;
  }
  //原有放在methods中的方法平铺出来
  public handleSend():void {
      this.bindSend1(this.message,'love');
  }
  // 这里的emit中的参数是表明父级通过什么接受，类似以前的$emit('父级定义的方法')
  @Emit('test')
  private bindSend2(){
      return '这个可以用test接受';
  }
}
</script>
```