// 观察者 判断新值和旧值是否有变化，有变化则更新视图0
class Watch{
    constructor(expr,vm,cb){
        this.expr = expr
        this.vm = vm
        this.cb = cb // 回调函数
        this.oldValue = this.getOldValue()
    }
    getOldValue(){
        Dep.target = this
        const oldValue = compileUtil.getVal(this.expr,this.vm)
        Dep.target = null
        return oldValue
    }
    update(){
        const newVal = compileUtil.getVal(this.expr,this.vm)
        if(newVal !== this.oldValue){
            this.cb(newVal)
        }
    }
}
class Dep{
    constructor(){
        this.subs = []
    }
    // 收集观察者
    addSub(watch){
        this.subs.push(watch)
    }
    // 通知观察者去更新
    notify(){
        console.log('通知了观察者！');
        this.subs.forEach(w=>w.update())
    }
}

class Observer{
    constructor(data){
        this.observer(data)
    }
    observer(data){
        // 对象
        if(data && typeof data === 'object'){
            Object.keys(data).forEach(key=>{
                this.defineReactive(data,key,data[key])
            })
        }
    }
    // 对值改变进行监听
    defineReactive(obj,key,value){
        // value还可能是对象，需递归遍历
        this.observer(value)
        const that = this
        const dep = new Dep()
        Object.defineProperty(obj,key,{
            configurable:true, // 可配置
            enumerable:true,   // 可枚举
            get(){
                // 订阅数据变化时，往Dep中添加观察者
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            // 直接给数据赋值为一个对象，这个对象里面的属性无法被监听，所以当更新值时，再进行遍历监听一下
            set(newVal){
                that.observer(newVal)
                if(newVal !== value){
                    value = newVal
                }
                // 有新值时，让dep通知观察者
                dep.notify()
            }
        })
    }
}