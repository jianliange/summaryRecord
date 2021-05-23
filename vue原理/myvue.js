const compileUtil = {
  getVal(expr, vm) {
    return expr.split('.').reduce((data, currentVal) => {
      // console.log('data', data);
      // console.log('currentVal', currentVal);
      // console.log('data[currentVal]',data[currentVal]);
      return data[currentVal];
    }, vm.$data);
  },
  setVal(expr, vm,inputVal) {
    return expr.split('.').reduce((data, currentVal) => {
      
      // console.log('data', data);
      // console.log('currentVal', currentVal);
      // console.log('data[currentVal]',data[currentVal]);
      data[currentVal] = inputVal
    }, vm.$data);
  },
  text(node, expr, vm) {
    let value
    //处理文本节点
    if (expr.indexOf('{{') !== -1) {
      // console.log('expr: ' + expr);
      value = expr.replace(/\{\{(.+?)\}\}/g,(...args)=> {
        // console.log('args',args);
        new Watch(args[1],vm ,(newVal)=>{
          this.updater.textUpdate(node,newVal)
        })
        return this.getVal(args[1],vm)
      });
    } else {
      // v-text 因为有些表达式是 person.name形式，所以得遍历获取值
      value = this.getVal(expr,vm) 
      new Watch(expr,vm ,(newVal)=>{
        this.updater.textUpdate(node,newVal)
      })
    }
    this.updater.textUpdate(node,value)
  },
  model(node, expr, vm) {
    const value = this.getVal(expr,vm)
    // 绑定更新函数，数据=》视图
    new Watch(expr,vm ,(newVal)=>{
      this.updater.modelUpdate(node,newVal)
    })
    // 视图=》数据=》视图
    node.addEventListener('input',(e)=>{      
      this.setVal(expr,vm,e.target.value)
    })    
    this.updater.modelUpdate(node,value)
  },
  on(node, expr, vm, eventName) {
    let fn = vm.$options.methods && vm.$options.methods[expr]
    node.addEventListener(eventName, fn.bind(vm),false)
  },
  bind(node, expr, vm, eventName) {
    let value = this.getVal(expr,vm)
    new Watch(expr,vm ,(newVal)=>{
      this.updater.modelUpdate(node,newVal)
    })
    node.setAttribute(eventName, value)
  },
  // 更新函数
  updater:{
    textUpdate(node, value) {
      node.textContent = value
    },
    modelUpdate(node, value) {
      node.value = value
    }
  },

}
// 编译模板模块
class Compile{
  constructor(el, vm) {
    // 判断根元素是否节点对象
    this.el = this.isElementNode(el) ? el : document.querySelector(el)
    this.vm = vm
    // 1.遍历根节点的所有节点，添加到文档碎片对象中，减少内存中的页面的回流和重绘
    const fragment = this.node2Fragment(this.el)
    // 2.编译文档碎片
    this.compile(fragment)
    // 3.将子元素追加到根元素中
    this.el.appendChild(fragment)
   
  }
  node2Fragment(el) {
    // ragment就把el.firstChild（el.children[0]）抽离了出来，这个操作是move dom， el.children[0]被抽出，在下次while循环执行firstChild = el.firstChild时读取的是相对本次循环的el.children[1]以此达到循环转移dom的目的
    const f = document.createDocumentFragment();
    let firstChild
    while (firstChild = el.firstChild) {
      f.appendChild(firstChild);
    }
    return f;
  }
  compile(fragment) {
    let childNodes = fragment.childNodes
    // console.log('childNodes',childNodes);
    childNodes.forEach(child => {
      if (this.isElementNode(child)) {
        // 元素节点
        // console.log('元素节点', child);
          // 进行编译元素节点
          this.compileElement(child)
      } else {
        // 文本节点
        // console.log('文本节点',child);
        // 进行文本节点的编译
        this.compileText(child)
      }
      // 需要将其子节点进行循环遍历
      if (child.childNodes && child.childNodes.length > 0) {
        this.compile(child); 
      } 
    })
  }
  compileElement(node) {
    // 进行指令编译 attribute
    let attributes = node.attributes
    attributes = [...attributes]
    attributes.forEach(attr => {
      const { name, value } = attr
      // console.log('attr',attr);
      if (this.isDirective(name)) { // v-bind:class='a'
        const [, directive] = name.split('-') // text model on:click
        const [dirName, eventName] = directive.split(':') // text model [on,click] [bind,class]
        compileUtil[dirName](node, value, this.vm, eventName)
        
        //删除 v- 指令
        node.removeAttribute('v-' + dirName)
      } else if (this.isEventName(name)) {
        const [, eventName] = name.split('@')
        compileUtil['on'](node, value, this.vm, eventName)
      } else if (this.isBind(name)) {
        const [, eventName] = name.split(':')
        compileUtil['bind'](node, value, this.vm, eventName)
      }
    })
  }
  compileText(node) {
    const content = node.textContent;
    if (/\{\{(.+?)\}\}/.test(content)) {
      compileUtil['text'](node, content,this.vm)
    }
  }
  isDirective(attr) {
    return attr.startsWith('v-')
  }
  isEventName(attr) {
    return attr.startsWith('@')
  }
  isBind(attr) {
    return attr.startsWith(':')
  }
  isElementNode(node) {
    return node.nodeType===1
  }
}
class MyVue {
  constructor(options){
    this.$el = options.el;
    this.$data = options.data;
    this.$options = options;
    if (this.$el) {
      //1.实现一个数据的观察者
      new Observer(this.$data)
      //2.实现一个指令解析器
      new Compile(this.$el,this)
      //实现代理
      this.proxyData(this.$data)
    }
  }
  proxyData(data){
    for(const key in data){
      Object.defineProperty(this,key,{
        get(){
          return data[key]
        },
        set(newVal){
          data[key] = newVal
        }
      })
    }
  }
}