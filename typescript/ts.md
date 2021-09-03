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

# 类
创建一个Student类，它带有一个构造函数和一些公共字段
类和接口可以一起共作，程序员可以自行决定抽象的级别。
在构造函数的参数上使用public等同于创建了同名的成员变量。
```ts
class Student {
    fullName: string;
    constructor(public firstName, public middleInitial, public lastName) {
        this.fullName = firstName + " " + middleInitial + " " + lastName;
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