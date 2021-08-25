# 值得注意的新特性
> https://v3.cn.vuejs.org/guide/migration/introduction.html#%E5%80%BC%E5%BE%97%E6%B3%A8%E6%84%8F%E7%9A%84%E6%96%B0%E7%89%B9%E6%80%A7
## 组合式 API
### setup 组件选项
新的 setup 选项在组件创建之前执行，一旦 props 被解析，就将作为组合式 API 的入口。
注意：
`在 setup 中你应该避免使用 this，因为它不会找到组件实例。setup 的调用发生在 data property、computed property 或 methods 被解析之前，所以它们无法在 setup 中被获取。`
### 带 ref 的响应式变量
作用：ref 为我们的值创建了一个`响应式引用`。在整个组合式 API 中会经常使用`引用`的概念。

```js
import { ref } from 'vue'
const counter = ref(0)
console.log(counter) // { value: 0 }
console.log(counter.value) // 0

counter.value++
console.log(counter.value) // 1
```
将值封装在一个对象中，看似没有必要，但为了保持 JavaScript 中不同数据类型的行为统一，这是必须的。这是因为在 JavaScript 中，Number 或 String 等基本类型是通过值而非引用传递的：
### 在 setup 内注册生命周期钩子
组合式 API 上的生命周期钩子与选项式 API 的名称相同，但前缀为 on：即 mounted 看起来会像 onMounted。
### watch 响应式更改
它接受 3 个参数：
- 一个想要侦听的响应式引用或 getter 函数
- 一个回调
- 可选的配置选项
```js
import { ref, watch } from 'vue'

const counter = ref(0)
watch(counter, (newValue, oldValue) => {
  console.log('The new counter value is: ' + counter.value)
})
```
### 独立的 computed 属性
为了访问新创建的计算变量的 value，我们需要像 ref 一样使用 .value property。
```js
import { ref, computed } from 'vue'

const counter = ref(0)
const twiceTheCounter = computed(() => counter.value * 2)

counter.value++
console.log(counter.value) // 1
console.log(twiceTheCounter.value) // 2
```


## Teleport
Teleport 提供了一种干净的方法，允许我们控制在 DOM 中哪个父节点下渲染了 HTML，而不必求助于全局状态或将其拆分为两个组件。
```js
//挂载到body下
<teleport to="body">
// 组件内容
</teleport>
```
### 与 Vue components 一起使用
如果 <teleport> 包含 Vue 组件，则它仍将是 <teleport> 父组件的逻辑子组件：
```js
// 子组件将嵌套在父组件parent-component之下，而不是放在实际内容移动到的位置。
app.component('parent-component', {
  template: `
    <h2>This is a parent component</h2>
    <teleport to="#endofbody">
      <child-component name="John" />
    </teleport>
  `
})
```
### 在同一目标上使用多个 teleport
多个 <teleport> 组件可以将其内容挂载到同一个目标元素。顺序将是一个简单的追加——稍后挂载将位于目标元素中较早的挂载之后。
```js
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>

<!-- result-->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

## 片段
Vue 3 现在正式支持了多根节点的组件，也就是片段!
但是，这要求开发者显式定义 attribute 应该分布在哪里。
> 非 Prop 的 Attribute: https://v3.cn.vuejs.org/guide/component-attrs.html#attribute-%E7%BB%A7%E6%89%BF
```js
<!-- Layout.vue -->
<template>
  <header>...</header>
  <main v-bind="$attrs">...</main>
  <footer>...</footer>
</template>
```

## 触发组件选项
### 事件名
与组件和 prop 一样，事件名提供了自动的大小写转换。如果用驼峰命名的子组件中触发一个事件，你将可以在父组件中添加一个 kebab-case (短横线分隔命名) 的监听器。
```js
this.$emit('myEvent')
```
```js
<my-component @my-event="doSomething"></my-component>
```
与 props 的命名一样，当你使用 DOM 模板时，我们建议使用 kebab-case 事件监听器。如果你使用的是字符串模板，这个限制就不适用。

### 定义自定义事件
可以通过 emits 选项在组件上定义发出的事件。
```js
app.component('custom-form', {
  emits: ['inFocus', 'submit']
})
```
当在 emits 选项中定义了原生事件 (如 click) 时，将使用组件中的事件替代原生事件侦听器。
`TIP`
建议定义所有发出的事件，以便更好地记录组件应该如何工作。

### 验证抛出的事件
使用`对象语法`而不是数组语法定义发出的事件，则可以验证它。
要添加验证，将为事件分配一个函数，该函数接收传递给 $emit 调用的参数，并返回一个布尔值以指示事件是否有效。
```js
app.component('custom-form', {
  emits: {
    // 没有验证
    click: null,

    // 验证submit 事件
    submit: ({ email, password }) => {
      if (email && password) {
        return true
      } else {
        console.warn('Invalid submit event payload!')
        return false
      }
    }
  },
  methods: {
    submitForm(email, password) {
      this.$emit('submit', { email, password })
    }
  }
})
```
### v-model 参数
emits: ['update:title'],
```js
app.component('my-component', {
  props: {
    title: String
  },
  emits: ['update:title'],
  template: `
    <input
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)">
  `
})
```

### 多个 v-model 绑定
 emits: ['update:firstName', 'update:lastName'],

## 来自 @vue/runtime-core 的 createRenderer API 创建## 自定义渲染器
## 单文件组件组合式 API 语法糖 (<script setup>) 实验性
## 单文件组件状态驱动的 CSS 变量 (<style> 中的 v-bind) 实验性
## SFC <style scoped> 现在可以包含全局规则或只针对插槽内容的规则
## Suspense 实验性

# 非兼容的变更
下面列出了从 2.x 开始的重大更改：

## 全局 API
### 全局 Vue API 已更改为使用应用程序实例

### 全局和内部 API 已经被重构可tree-shakable

## 模板指令
### 组件上 v-model 用法已更改，替换 v-bind.sync
### <template v-for> 和非 v-for 节点上 key 用法已更改
### 在同一元素上使用的 v-if 和 v-for 优先级已更改
### v-bind="object" 现在排序敏感
### v-on:event.native 修饰符已移除
### v-for 中的 ref 不再注册 ref 数组

## 组件
### 只能使用普通函数创建功能组件
### functional 属性在单文件组件 (SFC) <template> 和 functional ## 组件选项被抛弃
### 异步组件现在需要 defineAsyncComponent 方法来创建
### 组件事件现在需要在 emits 选项中声明

## 渲染函数
### 渲染函数 API 改变
### $scopedSlots property 已删除，所有插槽都通过 $slots 作为函数暴露
### $listeners 被移除或整合到 $attrs
### $attrs 现在包含 class and style attribute

## 自定义元素
### 自定义元素检测现在已经在编译时执行
### 对特殊的 is prop 的使用只严格限制在被保留的 <component> 标记中
### #其他小改变
### destroyed 生命周期选项被重命名为 unmounted
### beforeDestroy 生命周期选项被重命名为 beforeUnmount
### default prop 工厂函数不再可以访问 this 上下文
### 自定义指令 API 已更改为与组件生命周期一致且 binding.expression 已移除
### data 选项应始终被声明为一个函数
### 来自 mixin 的 data 选项现在为浅合并
### Attribute 强制策略已更改
### 一些过渡 class 被重命名
### <TransitionGroup> 不再默认渲染包裹元素
### 当侦听一个数组时，只有当数组被替换时，回调才会触发，如果需要在变更时触发，则需要指定 deep 选项
### 没有特殊指令的标记 (v-if/else-if/else、v-for 或 v-slot) 的 <template> 现在被视为普通元素，并将生成原生的 ## #<template> 元素，而不是渲染其内部内容。
### 已挂载的应用不会取代它所挂载的元素
### 生命周期 hook: 事件前缀改为 vnode-

## 移除 API
### keyCode 支持作为 v-on 的修饰符
### $on、$off 和 $once 实例方法
### 过滤
### 内联模板 attribute
### $children 实例 property
### propsData 选项
### $destroy 实例方法。用户不应再手动管理单个 Vue 组件的生命周期。
### 全局函数 set 和 delete 以及实例方法 $set 和 $delete。基于代理的变化检测不再需要它们了。