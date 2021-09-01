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
 emits: ['update:firstName', 'update:lastName']
 ```js
 const UserName = {
  props: {
    firstName: String,
    lastName: String
  },
  template: `
    <input 
      type="text"
      :value="firstName"
      @input="$emit('update:firstName', $event.target.value)">

    <input
      type="text"
      :value="lastName"
      @input="$emit('update:lastName', $event.target.value)">
  `
};

const HelloVueApp = {
  components: {
    UserName,
  },
  data() {
    return {
      firstName: 'John',
      lastName: 'Doe',
    };
  },
};

Vue.createApp(HelloVueApp).mount('#v-model-example')
 ```

### 处理 v-model 修饰符
v-model 有内置修饰符——.trim、.number 和 .lazy。但是，在某些情况下，你可能还需要添加自己的自定义修饰符。
示例：
自定义修饰符 capitalize，它将 v-model 绑定提供的字符串的第一个字母大写。
添加到组件 v-model 的修饰符将通过 modelModifiers prop 提供给组件。在下面的示例中，我们创建了一个组件，其中包含默认为空对象的 modelModifiers prop。

请注意，当组件的 created 生命周期钩子触发时，modelModifiers prop 会包含 capitalize，且其值为 true——因为 capitalize 被设置在了写为 v-model.capitalize="myText" 的 v-model 绑定上。
现在我们已经设置了 prop，我们可以检查 modelModifiers 对象键并编写一个处理器来更改发出的值。在下面的代码中，每当 <input/> 元素触发 input 事件时，我们都将字符串大写。
```html
<div id="app">
  <my-component v-model.capitalize="myText"></my-component>
  {{ myText }}
</div>
```
```js
const app = Vue.createApp({
  data() {
    return {
      myText: ''
    }
  }
})

app.component('my-component', {
  props: {
    modelValue: String,
    modelModifiers: {
      default: () => ({})
    }
  },
  emits: ['update:modelValue'],
  methods: {
    emitValue(e) {
      let value = e.target.value
      if (this.modelModifiers.capitalize) {
        value = value.charAt(0).toUpperCase() + value.slice(1)
      }
      this.$emit('update:modelValue', value)
    }
  },
  template: `<input
    type="text"
    :value="modelValue"
    @input="emitValue">`
})

app.mount('#app')
```
对于带参数的 v-model 绑定，生成的 prop 名称将为 arg + "Modifiers"：
```js
<my-component v-model:description.capitalize="myText"></my-component>

app.component('my-component', {
  props: ['description', 'descriptionModifiers'],
  emits: ['update:description'],
  template: `
    <input type="text"
      :value="description"
      @input="$emit('update:description', $event.target.value)">
  `,
  created() {
    console.log(this.descriptionModifiers) // { capitalize: true }
  }
})

```

## 来自 @vue/runtime-core 的 createRenderer API 创建自定义渲染器


## 单文件组件组合式 API 语法糖 (<script setup>) 实验性
## 单文件组件状态驱动的 CSS 变量 (<style> 中的 v-bind) 实验性
## SFC <style scoped> 现在可以包含全局规则或只针对插槽内容的规则
## Suspense 实验性

# 非兼容的变更
下面列出了从 2.x 开始的重大更改：

## 全局 API
### 全局 Vue API 已更改为使用应用程序实例
v2.0问题：
从同一个 Vue 构造函数创建的每个根实例共享相同的全局配置，
#### 一个新的全局 API：createApp
```js
import { createApp } from 'vue'
const app = createApp({})
```
####  config.productionTip 移除
#### config.ignoredElements 替换为 config.isCustomElement
#### Vue.prototype 替换为 config.globalProperties
#### Vue.extend 移除
#### 插件使用者须知
由于 use 全局 API 在 Vue 3 中不再使用，此方法将停止工作并停止调用 Vue.use() 现在将触发警告，于是，开发者必须在应用程序实例上显式指定使用此插件：
```js
const app = createApp(MyApp)
app.use(VueRouter)
```
#### 挂载 App 实例
使用 createApp(/* options */) 初始化后，应用实例 app 可用 app.mount(domTarget) 挂载根组件实例：
```js
import { createApp } from 'vue'
import MyApp from './MyApp.vue'

const app = createApp(MyApp)
app.mount('#app')
```
组件和指令将被改写为如下内容
```js
const app = createApp(MyApp)

app.component('button-counter', {
  data: () => ({
    count: 0
  }),
  template: '<button @click="count++">Clicked {{ count }} times.</button>'
})

app.directive('focus', {
  mounted: el => el.focus()
})

// 现在，所有通过 `app.mount()` 挂载的应用实例及其组件树，将具有相同的 “button-counter” 组件和 “focus” 指令，而不会污染全局环境
app.mount('#app')
```
#### Provide / Inject
与在 2.x 根实例中使用 provide 选项类似，Vue 3 应用实例也提供了可被应用内任意组件注入的依赖项：
```js
// 在入口
app.provide('guide', 'Vue 3 Guide')

// 在子组件
export default {
  inject: {
    book: {
      from: 'guide'
    }
  },
  template: `<div>{{ book }}</div>`
}
```
#### 在应用之间共享配置
在应用之间共享配置 (如组件或指令) 的一种方法是创建工厂函数，如下所示：
```js
import { createApp } from 'vue'
import Foo from './Foo.vue'
import Bar from './Bar.vue'

const createMyApp = options => {
  const app = createApp(options)
  app.directive('focus' /* ... */)

  return app
}

createMyApp(Foo).mount('#foo')
createMyApp(Bar).mount('#bar')
```

### 全局和内部 API 已经被重构可tree-shakable
 webpack 这样的模块打包工具支持 tree-shaking，这是表达“死代码消除”的一个花哨术语
#### 受影响的 API
Vue 2.x 中的这些全局 API 受此更改的影响：

- Vue.nextTick
- Vue.observable (用 Vue.reactive 替换)
- Vue.version
- Vue.compile (仅完整构建版本)
- Vue.set (仅兼容构建版本)
- Vue.delete (仅兼容构建版本)

#### 内部帮助器
#### 插件中的用法
vue2.0
```js
const plugin = {
  install: Vue => {
    Vue.nextTick(() => {
      // ...
    })
  }
}
```
vue3.0
```js
import { nextTick } from 'vue'

const plugin = {
  install: app => {
    nextTick(() => {
      // ...
    })
  }
}
```
如果使用 webpack 这样的模块打包工具，这可能会导致 Vue 的源代码输出打包到插件中，而且通常情况下，这并不是你所期望的。防止这种情况发生的一种常见做法是配置模块打包工具以将 Vue 从最终的打包产物中排除。对于 webpack，你可以使用 `externals` 配置选项：
这将告诉 webpack 将 Vue 模块视为一个外部库，而不将它打包进来。
```js
// webpack.config.js
module.exports = {
  /*...*/
  externals: {
    vue: 'Vue'
  }
}
```

## 模板指令
### 组件上 v-model 用法已更改，替换 v-bind.sync
- 非兼容：用于自定义组件时，v-model prop 和事件默认名称已更改：
- prop：value -> modelValue；
- event：input -> update:modelValue；
- 非兼容：v-bind 的 .sync 修饰符和组件的 model 选项已移除，可用 v-model 作为代替；
- 新增：现在可以在同一个组件上使用多个 v-model 进行双向绑定；
- 新增：现在可以自定义 v-model 修饰符。

在 2.x 中，在组件上使用 v-model 相当于绑定 value prop 和 input 事件
#### 使用 v-bind.sync
在某些情况下，我们可能需要对某一个 prop 进行“双向绑定”(除了前面用 v-model 绑定 prop 的情况)。为此，我们建议使用 update:myPropName 抛出事件。 


### <template v-for> 和非 v-for 节点上 key 用法已更改
#### 结合 <template v-for>
在 Vue 2.x 中 <template> 标签不能拥有 key。不过你可以为其每个子节点分别设置 key。
在 Vue 3.x 中 key 则应该被设置在 <template> 标签上。

### 在同一元素上使用的 v-if 和 v-for 优先级已更改
3.x 版本中 v-if 总是优先于 v-for 生效。

### v-bind="object" 现在排序敏感
#### 概览
不兼容：v-bind 的绑定顺序会影响渲染结果。
#### 介绍
在元素上动态绑定 attribute 时，常见的场景是在一个元素中同时使用 v-bind="object" 语法和单独的 property。然而，这就引出了关于合并的优先级的问题。

### v-on:event.native 修饰符已移除
v-on 的 .native 修饰符已被移除
#### 2.x 语法
默认情况下，传递给带有 v-on 的组件的事件监听器只有通过 this.$emit 才能触发。要将原生 DOM 监听器添加到子组件的根元素中，可以使用 .native 修饰符
#### 3.x 语法
v-on 的 .native 修饰符已被移除。同时，新增的 emits 选项允许子组件定义真正会被触发的事件。
```html
<my-component
  v-on:close="handleComponentEvent"
  v-on:click="handleNativeClickEvent"
/>
```
```html
<script>
  export default {
    emits: ['close']
  }
</script>
```
#### 迁移策略
删除 .native 修饰符的所有实例。
确保所有组件都使用 emits 选项记录其事件。

### v-for 中的 ref 不再注册 ref 数组
在 Vue 2 中，在 v-for 里使用的 ref attribute 会用 ref 数组填充相应的 $refs property。当存在嵌套的 v-for 时，这种行为会变得不明确且效率低下。

在 Vue 3 中，这样的用法将不再在 $ref 中自动创建数组。要从单个绑定获取多个 ref，请将 ref 绑定到一个更灵活的函数上 (这是一个新特性)
```html
<div v-for="item in list" :ref="setItemRef"></div>
```
结合选项式 API:
```js
export default {
  data() {
    return {
      itemRefs: []
    }
  },
  methods: {
    setItemRef(el) {
      if (el) {
        this.itemRefs.push(el)
      }
    }
  },
  beforeUpdate() {
    this.itemRefs = []
  },
  updated() {
    console.log(this.itemRefs)
  }
}
```
结合组合式 API:
```js
import { onBeforeUpdate, onUpdated } from 'vue'

export default {
  setup() {
    let itemRefs = []
    const setItemRef = el => {
      if (el) {
        itemRefs.push(el)
      }
    }
    onBeforeUpdate(() => {
      itemRefs = []
    })
    onUpdated(() => {
      console.log(itemRefs)
    })
    return {
      setItemRef
    }
  }
}
```
注意：

itemRefs 不必是数组：它也可以是一个对象，其 ref 会通过迭代的 key 被设置。

如果需要，itemRef 也可以是响应式的且可以被监听。

## 组件
### 只能使用普通函数创建功能组件
在 3.x 中，函数式组件 2.x 的性能提升可以忽略不计，因此我们建议只使用有状态的组件
函数式组件只能使用接收 props 和 context 的普通函数创建 (即：slots，attrs，emit)。
`非兼容变更`：functional attribute 在单文件组件 (SFC) <template> 已被移除
`非兼容变更`：{ functional: true } 选项在通过函数创建组件已被移除

### functional 属性在单文件组件 (SFC) <template> 和 functional组件选项被抛弃
- v2.x
```js
<!-- Vue 2 函数式组件示例使用 <template> -->
<template functional>
  <component
    :is="`h${props.level}`"
    v-bind="attrs"
    v-on="listeners"
  />
</template>

<script>
export default {
  props: ['level']
}
</script>
```
- v3.x
```js
<template>
  <component
    v-bind:is="`h${$props.level}`"
    v-bind="$attrs"
  />
</template>

<script>
export default {
  props: ['level']
}
</script>
```
主要的区别在于：

- functional attribute 在 <template> 中移除
- listeners 现在作为 $attrs 的一部分传递，可以将其删除


### 异步组件现在需要 defineAsyncComponent 方法来创建
#### 异步组件（新增）
- 新的 defineAsyncComponent 助手方法，用于显式地定义异步组件
- component 选项被重命名为 loader
- Loader 函数本身不再接收 resolve 和 reject 参数，且必须返回一个 Promise
##### 介绍
以前，异步组件是通过将组件定义为返回 Promise 的函数来创建的，例如：
```js
const asyncModal = () => import('./Modal.vue')
```
或者，对于带有选项的更高阶的组件语法：
```js
const asyncModal = {
  component: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  error: ErrorComponent,
  loading: LoadingComponent
}
```
##### 3.x语法
现在，在 Vue 3 中，由于函数式组件被定义为纯函数，因此异步组件需要通过将其包裹在新的 defineAsyncComponent 助手方法中来显式地定义：
```js
import { defineAsyncComponent } from 'vue'
import ErrorComponent from './components/ErrorComponent.vue'
import LoadingComponent from './components/LoadingComponent.vue'

// 不带选项的异步组件
const asyncModal = defineAsyncComponent(() => import('./Modal.vue'))

// 带选项的异步组件
const asyncModalWithOptions = defineAsyncComponent({
  loader: () => import('./Modal.vue'),
  delay: 200,
  timeout: 3000,
  errorComponent: ErrorComponent,
  loadingComponent: LoadingComponent
})
```
> 注意： Vue Router 支持一个类似的机制来异步加载路由组件，也就是俗称的懒加载。尽管类似，但是这个功能和 Vue 所支持的异步组件是不同的。`当用 Vue Router 配置路由组件时，你不应该使用 defineAsyncComponent`。你可以在 Vue Router 文档的懒加载路由章节阅读更多相关内容。

- component 选项现在被重命名为 loader，以明确组件定义不能直接被提供。
- 与 2.x 不同，loader 函数不再接收 resolve 和 reject 参数，且必须始终返回 Promise。
```js
// 2.x 版本
const oldAsyncComponent = (resolve, reject) => {
  /* ... */
}

// 3.x 版本
const asyncComponent = defineAsyncComponent(
  () =>
    new Promise((resolve, reject) => {
      /* ... */
    })
)
```

### 组件事件现在需要在 emits 选项中声明
#### emits (新增)
##### 概述
Vue 3 目前提供一个 `emits` 选项，`和现有的 props 选项类似`。这个选项可以用来定义组件可以向其父组件触发的事件。
##### 2.x 的行为
在 Vue 2 中，你可以定义一个组件可接收的 prop，但是你无法声明它可以触发哪些事件：
```js
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text']
  }
</script>
```
##### 3.x 的行为
和 prop 类似，组件可触发的事件可以通过 emits 选项被定义：
```js
<template>
  <div>
    <p>{{ text }}</p>
    <button v-on:click="$emit('accepted')">OK</button>
  </div>
</template>
<script>
  export default {
    props: ['text'],
    emits: ['accepted']
  }
</script>
```
该选项也可以接收一个对象，该对象允许开发者定义传入事件参数的验证器，和 props 定义里的验证器类似。
##### 迁移策略
强烈建议使用 emits 记录每个组件所触发的所有事件。

这尤为重要，因为我们`移除`了 v-on.native `修饰符`。任何未声明 emits 的事件监听器都会被算入组件的 $attrs 并绑定在组件的根节点上

##### 示例
对于向父组件重复触发原生事件的组件来说，这会导致两个事件被触发：
```js
<template>
  <button v-on:click="$emit('click', $event)">OK</button>
</template>
<script>
export default {
  emits: [] // 不声明事件
}
</script>
```
当一个父级组件拥有 `click` 事件的监听器时：
```js
<my-button v-on:click="handleClick"></my-button>
```
该事件会被触发两次:
- 一次来自 $emit()。
- 另一次来自应用在根元素上的原生事件监听器。

现在你有两个选项：
1. 合理声明 click 事件。如果你真的在 <my-button> 的事件处理器上加入了一些逻辑，这会很有用。
2. 移除重复触发的事件，因为父组件可以很容易地监听原生事件而不需要添加 .native。适用于你只想重新触发这个事件。


## 渲染函数
### 渲染函数 API 改变
此更改不会影响 <template> 用户。

以下是更改的简要总结：
- h 现在是全局导入，而不是作为参数传递给渲染函数
- 更改渲染函数参数，使其在有状态组件和函数组件的表现更加一致
- VNode 现在有一个扁平的 prop 结构
#### 渲染函数参数
- 2.x语法
在 2.x 中，render 函数会自动接收 h 函数 (它是 createElement 的惯用别名) 作为参数：
```js
// Vue 2 渲染函数示例
export default {
  render(h) {
    return h('div')
  }
}
```
- 3.x语法
在 3.x 中，h 函数现在是全局导入的，而不是作为参数自动传递。
```js
// Vue 3 渲染函数示例
import { h } from 'vue'

export default {
  render() {
    return h('div')
  }
}
```

#### 渲染函数签名更改
- 2.x语法
在 2.x 中，render 函数自动接收参数，如 h 函数。
```js
// Vue 2 渲染函数示例
export default {
  render(h) {
    return h('div')
  }
}
```
- 3.x语法
在 3.x 中，由于 render 函数不再接收任何参数，它将主要在 setup() 函数内部使用。这还有一个好处：可以访问在作用域中声明的响应式状态和函数，以及传递给 setup() 的参数。
```js
import { h, reactive } from 'vue'

export default {
  setup(props, { slots, attrs, emit }) {
    const state = reactive({
      count: 0
    })

    function increment() {
      state.count++
    }

    // 返回渲染函数
    return () =>
      h(
        'div',
        {
          onClick: increment
        },
        state.count
      )
  }
}
```
#### VNode Prop 格式化
- 2.x 语法
在 2.x 中，domProps 包含 VNode prop 中的嵌套列表：
```js
// 2.x
{
  staticClass: 'button',
  class: { 'is-outlined': isOutlined },
  staticStyle: { color: '#34495E' },
  style: { backgroundColor: buttonColor },
  attrs: { id: 'submit' },
  domProps: { innerHTML: '' },
  on: { click: submitForm },
  key: 'submit-button'
}
```
- 3.x语法
在 3.x 中，整个 VNode prop 的结构都是扁平的。使用上面的例子，来看看它现在的样子。
```js
// 3.x 语法
{
  class: ['button', { 'is-outlined': isOutlined }],
  style: [{ color: '#34495E' }, { backgroundColor: buttonColor }],
  id: 'submit',
  innerHTML: '',
  onClick: submitForm,
  key: 'submit-button'
}
```
#### 注册组件
- 2.x 语法
在 2.x 中，注册一个组件后，把组件名作为字符串传给渲染函数的第一个参数，渲染函数可以正常的工作：
```js
// 2.x
Vue.component('button-counter', {
  data() {
    return {
      count: 0
    }
  }
  template: `
    <button @click="count++">
      Clicked {{ count }} times.
    </button>
  `
})

export default {
  render(h) {
    return h('button-counter')
  }
}
```
- 3.x 语法
在 3.x 中，由于 VNode 是上下文无关的，不能再用字符串 ID 隐式查找已注册组件。相反地，需要使用一个导入的 resolveComponent 方法：
```js
// 3.x
import { h, resolveComponent } from 'vue'

export default {
  setup() {
    const ButtonCounter = resolveComponent('button-counter')
    return () => h(ButtonCounter)
  }
}
```
#### 工具库作者
全局导入 h 意味着任何包含 Vue 组件的库都将在某处包含 import { h } from 'vue'。这会带来一些开销，因为它需要库作者在其构建设置中正确配置 Vue 的外部化：

- Vue 不应绑定到库中
- 对于模块构建，导入应该保持独立，由最终用户的打包器处理
- 对于 UMD / browser 构建版本，应该首先尝试全局 Vue.h，不存在时再使用 require 调用

### $scopedSlots property 已删除，所有插槽都通过 $slots 作为函数暴露
#### 插槽统一
##### 概览
此更改统一了 3.x 中的普通插槽和作用域插槽。

以下是变化的变更总结：
- this.$slots 现在将插槽作为函数公开
- 非兼容：移除 this.$scopedSlots

##### 2.x语法
当使用渲染函数时，即 h，2.x 用于在内容节点上定义 slot 数据 property。
```js
// 2.x 语法
h(LayoutComponent, [
  h('div', { slot: 'header' }, this.header),
  h('div', { slot: 'content' }, this.content)
])
```
此外，在引用作用域插槽时，可以使用以下方法引用它们：
```js
// 2.x 语法
this.$scopedSlots.header
```
##### 3.x语法
在 3.x 中，将插槽定义为当前节点的子对象：
```js
// 3.x Syntax
h(LayoutComponent, {}, {
  header: () => h('div', this.header),
  content: () => h('div', this.content)
})
```
当你需要以编程方式引用作用域插槽时，它们现在被统一到 $slots 选项中。
```js
// 2.x 语法
this.$scopedSlots.header

// 3.x 语法
this.$slots.header()
```
#### 迁移策略
大部分更改已经在 2.6 中发布。因此，迁移可以一步到位：

- 在 3.x 中，将所有 this.$scopedSlots 替换为 this.$slots。
- 将所有 this.$slots.mySlot 替换为 this.$slots.mySlot()。

### $listeners 被移除或整合到 $attrs
在 Vue 3 的虚拟 DOM 中，事件监听器现在只是以 on 为前缀的 attribute，这样就成了 $attrs 对象的一部分，因此 $listeners 被移除了
```js
<template>
  <label>
    <input type="text" v-bind="$attrs" />
  </label>
</template>
<script>
export default {
  inheritAttrs: false
}
</script>
```
如果这个组件接收一个 id attribute 和一个 v-on:close 监听器，那么 $attrs 对象现在将如下所示:
```js
{
  id: 'my-input',
  onClose: () => console.log('close Event triggered')
} 
```

### $attrs 现在包含 class and style attribute
$attrs 现在包含了所有传递给组件的 attribute，包括 class 和 style


## 自定义元素
### 自定义元素检测现在已经在编译时执行
- `非兼容`：检测并确定哪些标签应该被视为自定义元素的过程，现在会在模板编译期间执行，且应该通过编译器选项而不是运行时配置来配置。
- `非兼容`：特定 is prop 用法仅限于保留的 <component> 标记。
- `新增`：为了支持 2.x 在原生元素上使用 is 的用例来处理原生 HTML 解析限制，我们用 vue: 前缀来解析一个 Vue 组件。
#### 自主定制元素
如果我们想在 Vue 外部定义添加自定义元素 (例如使用 Web 组件 API)，我们需要“指示”Vue 将其视为自定义元素。让我们以下面的模板为例。
```html
<plastic-button></plastic-button>
```
- 2.x语法
在 Vue 2.x 中，通过 Vue.config.ignoredElements 配置自定义元素
```js
// 这将使Vue忽略在Vue外部定义的自定义元素
// (例如：使用 Web Components API)

Vue.config.ignoredElements = ['plastic-button']
```

- 3.x语法
`在 Vue 3.0 中，此检查在模板编译期间执行`指示编译器将 <plastic-button> 视为自定义元素：

- 如果使用生成步骤：将 isCustomElement 传递给 Vue 模板编译器，如果使用 vue-loader，则应通过 vue-loader 的 compilerOptions 选项传递：
```js
// webpack 中的配置
rules: [
  {
    test: /\.vue$/,
    use: 'vue-loader',
    options: {
      compilerOptions: {
        isCustomElement: tag => tag === 'plastic-button'
      }
    }
  }
  // ...
]
```
- 如果使用动态模板编译，请通过 app.config.isCustomElement 传递：
```js
const app = Vue.createApp({})
app.config.isCustomElement = tag => tag === 'plastic-button'
```
需要注意的是，运行时配置只会影响运行时模板编译——它不会影响预编译的模板


### 对特殊的 is prop 的使用只严格限制在被保留的 <component> 标记中

#### 定制内置元素
自定义元素规范提供了一种将自定义元素作为`自定义内置模板`的方法，方法是向内置元素添加 is 属性：
```html
<button is="plastic-button">点击我!</button>
```
Vue 对 is 特殊 prop 的使用是在模拟 native attribute 在浏览器中普遍可用之前的作用。但是，`在 2.x 中，它被解释为渲染一个名为 plastic-button 的 Vue 组件`，这将阻止上面提到的自定义内置元素的原生使用。
在 3.0 中，我们仅将 Vue 对 is 属性的特殊处理限制到 <component> tag。
- 在保留的 <component> tag 上使用时，它的行为将与 2.x 中完全相同；
- 在普通组件上使用时，它的行为将类似于普通 prop：
```html
<foo is="bar" />
```
  - 2.x 行为：渲染 bar 组件。
  - 3.x 行为：通过 is prop 渲染 foo 组件。

在普通元素上使用时，它将作为 is prop 传递给 createElement 调用，并作为原生 attribute 渲染，这支持使用自定义的内置元素。
```html
<button is="plastic-button">点击我！</button>
```
  - 2.x 行为：渲染 plastic-button 组件。
  - 3.x 行为：通过回调渲染原生的 button。
  ```js
  document.createElement('button', { is: 'plastic-button' })
  ```
#### vue: 用于 DOM 内模板解析解决方案
> 提示：本节仅影响直接在页面的 HTML 中写入 Vue 模板的情况。 在 DOM 模板中使用时，模板受原生 HTML 解析规则的约束。一些 HTML 元素，例如 <ul>，<ol>，<table> 和 <select> 对它们内部可以出现的元素有限制，和一些像 <li>，<tr>，和 <option> 只能出现在某些其他元素中。

- 2.x 语法
在 Vue 2 中，我们建议在原生 tag 上使用 is prop 来解决这些限制：
```html
<table>
  <tr is="blog-post-row"></tr>
</table>
```
- 3.x 语法
随着 is 的行为变化，现在将元素解析为一个 Vue 组件需要 vue: 前缀：
```html
<table>
  <tr is="vue:blog-post-row"></tr>
</table>

```


## 其他小改变
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