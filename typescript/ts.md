# 安装typescript
>  npm install -g typescript
# 编译代码
> tsc test.ts
# 类型注解
为函数或变量添加约束的方式
```ts
// person参数为string类型
function greeter(person:string) {
  return 'Hello,' + person
}
```

# 接口
使用接口来描述一个拥有firstName和lastName字段的对象
```js
interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };
document.body.innerHTML = greeter(user);
```

## 可索引接口
```ts
var arr:[]number =  [1,2,3];

var arr1:Array<number>= [1,2,3];

//可索引接口 对数组的约束
interface UseArr{
    [index:number]:number
}
var arr2:UseArr = [1,2,3];

//可索引接口 对对象的约束
interface UseObj{
    [index:string]:number
}
var arr2:UseObj = {age:20};

```
## 类类型接口（和抽象类有点相似）
```ts
interface Animal{
    name:string;
    eat(str:string):void;
}
class Dag implements Animal{
    name:string;
    constructor(name:string){
        this.name = name;
    }
    eat(){

    }
}
var d = new Dog('小狗')
```


# 类
创建一个Student类，它带有一个构造函数和一些公共字段
类和接口可以一起共作，程序员可以自行决定抽象的级别。
在构造函数的参数上使用public等同于创建了同名的成员变量。
在构造函数的参数上使用protect，类里面及子类可以访问，在类外面不能访问。
在构造函数的参数上使用private，类里面可以访问，在类外面及子类不能访问。
```ts
class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
    }
    run():void{
        alert(this.fullName);
    }
}

interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person : Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.innerHTML = greeter(user);
```

## 类继承 extends super
```js
class Person{
    name:string;
    constructor(name:string){
        this.name = name;
    }
}

class man extends Person{
    contructor(name:string){
        super(name);//super表示调用父类的构造函数，初始化父类的构造函数
    }
}

```

## 静态属性 静态方法 抽象类 多态
### 静态属性 静态方法
```js
class Person{
    public name:string;
    public age:number=20;

    // 静态属性
    static sex = '男';
    constructor(name:string){
        this.name = name;
    }

    run(){//实例方法

    }
    // 静态方法， 里面没法直接调用类里面的属性
    static print(){
        console.log('这将会打印出undefined',this.age);
        console.log(this.name);
    }
}

//调用静态方法
Person.print();
//调用实例方法
var per = new Person('张三');
per.run()
```
### 多态
>多态：父类定义一个方法不去实现，让继承它的子类去实现，每一个子类有不同的表现。（子类重写父类方法）
> 多态属于继承。
```js
class Animal{
    name:string;
    constructor(name:string){
        this.name =  name;
    }

    eat(){//具体吃什么不知道，让每一个自留具体去实现

    }
}

class Dog extends Animal{
    constructor(name:string){
        super(name);
    }
    eat(){
        return this.name + '吃东西'
    }
}

```
### 抽象类（定义标准）
>typescript中的抽象类，它是提供其他类继承的基类，**不能直接被实例化**。
>用abstract关键字定义抽象类和抽象方法，抽象类中的抽象方法不包含具体实现并且**必须在派生类中实现**,不是抽象方法，可以不再派生类中实现。
> abstract抽象方法必须放在抽象类中里面。
```js
abstract class Animal{
    name:string;
    constructor(name:string){
        this.name =  name;
    }
    abstract eat():any;
}

class Dog extends Animal{
    constructor(name:string){
        super(name);
    }
    eat(){
        return this.name + '吃东西'
    }
}

//  这种将会报错，因为其没有实现抽象方法eat
// class Cat extends Animal{
//     constructor(name:string){
//         super(name);
//     }
//     othEat(){}
// }
// var a = new Animal()  //错误，抽象类不能直接被实例化

var dog = new Dog('小狗');
d.eat();
```

# 泛型 <T>
> 泛型就是解决  类 接口 方法的复用性、以及对不特定数据类型的支持。
> 泛型，可以支持不特定的数据类型；
```ts
//要求，传入的参数类型和返回的参数类型一致。
//1、T表示泛型，具体什么类型是调用这个方法的时候决定的。
function getData<T>(value:T):T{
    return value;
}


//类的泛型
class MinClass<T>{
    public list:T[]=[];
    add(value:T):void{
        this.list.push(value);
    }
    min():T{
        var minNum= this.list[0];
        for(var i=0;i<this.list.length;i++){
            if(minNum>this.list[i]){
                minNum= this.list[i];
            }
        }
        return minNum;
    }
}

//实例化，并且指定了类的T代表的类型是number
var m1 = new MinClass<number>();
m1.add(1)
m1.add(2)
m1.min();

//实例化，并且指定了类的T代表的类型是number
var m2 = new MinClass<string>();
me.add('a')
me.add('b')
me.min()
```

## 泛型接口
### 写法1
```ts
//传入两个参数为string类型，返回的也是string类型
// interface ConfigFn{
//     (val1:string,val2:string):string;
// }

interface ConfigFn{
    <T>(val:T):T;
}

var getDate:ConfigFn = function<T>(val:T):T{
    return val;
}
```
### 写法2
```ts
interface ConfigFn<T{
    (val:T):T;
}

function getData<T>(val:T):T{
    return val;
}

var myGetData:ConfigFn<string> = getData;

myGetData('1');
```

## 泛型类 把类作为参数类型的泛型类
```ts
//案例一：对传入类型进行校验
class MysqlDb<T>{
    add(info:T):boolean{
        return true;
    }
}
//想给User表增加数据
//1、定义一个User类和数据库进行映射
class User{
    username:string|undefined;
    password:string|undefined;
}
var u = new User();
u.username = '张三';
u.password  = '123';
var db = new MysqlDb<User>();
db.add(u);

//想给Article表增加数据
//1、定义一个Article类和数据库进行映射
class Article{
    name:string|undefined;
}
var  a = new Article();
a.name = 'article1';
var db1 = new MysqlDb<Article>();
db1.add(a);
```

# 命名空间 nampspace
```ts
namespace A{
    export class Cat{

    }
}

var cat = new a.Cat()
```

# 装饰器
> 装饰器是一种特别类型的声明，它能够被附加到类声明、方法、属性或参数上，可以修改类的行为。
> 通俗的讲，装饰器就是一个方法，可以注入到类，方法，属性参数来扩展类，属性，方法，参数的功能。
>常见的装饰器有：类装饰器，属性装饰器，方法装饰器，参数装饰器。
>装饰器的写法：普通装饰器（无法传参），装饰器工厂（可传参）。
>es7标准特性之一.
## 类装饰器
### 普通装饰器
```ts
function logClass(param:any){
    //param 就是当前类
    params.prototype.apiUrl = '动态扩展的属性'
}

@logClass
class HttpClient{
    constructor(){

    }
    getData(){

    }
}

var http:any = new HttpClient();
console.log(http.apiUrl)
```
### 装饰器工厂，可传参
```ts
function logClass(param:string){
    //param 为参数，target为当前类
    return function(target:any){
        console.log(param);
        console.log(target);
        target.prototype.apiUrl = param;
    }
}

@logClass('http://www.baidu.com')
class HttpClient{
    constructor(){

    }
    getData(){

    }
}

var http:any = new HttpClient();
console.log(http.apiUrl)
```
### 装饰器重载方法
```ts
function logClass(target:any){
    return class extends  target{
        apiUrl:any = '我是修改后的';
        getData(){
            this.apiUrl=this.apiUrl+'11';
            console.log(this.apiUrl);
        }
    }
}

@logClass
class HttpClient{
    public  apiUrl:string|undefined;
    constructor(){
        this.apiUrl = '我是构造函数里的apiUrl';
    }
    getData(){

    }
}

var http:any = new HttpClient();
console.log(http.apiUrl)
```
## 属性装饰器
> 属性装饰器表达式会在运行时当做函数被调用，传入下列两个参数：
>1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象；
>2、成员的名字；
```ts
function logProperty(param:any){
    return function(target:any,attr:any){
        target.attr = param;
    }
}

class HttpClient{
    //属性装饰器后面不能用 ;
    @logProperty('http://www.123.com')
    public  apiUrl:string|undefined;
    constructor(){
        this.apiUrl = '我是构造函数里的apiUrl';
    }
    getData(){
        console.log(this.apiUrl);
    }
}
```
## 方法装饰器
> 他会被应用到方法的 属性描述上，可以用来监视，修改或者替换方法定义。
> 方法装饰器会在运行时传入下列3分参数：
>1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象；
>2、成员的名字；
>3、成员的属性描述符。
### 方法装饰器一
```ts
function logMethod(param:any){
    return function(target:any,methodName:any,desc:any){
        target.apiUrl= 'xxx';
        target.run = function(){
            
        }
    }
}

class HttpClient{
    public  apiUrl:string|undefined;
    constructor(){
        this.apiUrl = '我是构造函数里的apiUrl';
    }
    @logMethod('http://www.123.com')
    getData(){
        console.log(this.apiUrl);
    }
}
```

### 参数装饰器二
```ts
function logMethod(param:any){
    return function(target:any,methodName:any,desc:any){
        //保存当前方法
        var oMethod = desc.value;
        desc.value =  function(..args:any[]){
            args  = args.map(value=>{
                return String(value);
            })
        }
        oMethod.apply(this,args);
    }
}

class HttpClient{
    public  apiUrl:string|undefined;
    constructor(){
        this.apiUrl = '我是构造函数里的apiUrl';
    }
    @logMethod('http://www.123.com')
    getData(..args:any[]){
        console.log(args);
        console.log('我是getdata里面的方法');
    }
}

var http = new HttpClient();

http.getData(123,'xxx');
```

## 方法参数装饰器
> 参数装饰器表达式会在运行时当做函数被调用，可以使用参数装饰器为类的原型增加一些元素数据，传入下列3分参数：
>1、对于静态成员来说是类的构造函数，对于实例成员是类的原型对象；
>2、方法的名字；
>3、参数的函数参数列表中的索引。
```ts
function logParams(param:any){
    return function(target:any,methodName:any,paramIndex:any){
        target.apiUrl = param;
    }
}

class HttpClient{
    public  apiUrl:string|undefined;
    constructor(){
        this.apiUrl = '我是构造函数里的apiUrl';
    }
    
    getData(@logParams('xxx') uuid:any){
        console.log(uuid);
    }
}

var http:any = new HttpClient();

http.getData('uuid1');
console.log(http.apiUrl);//打印出： xxx
```

## 装饰器的执行顺序
属性
方法
方法参数
类装饰器

同一种装饰器，会从后向前开始执行。