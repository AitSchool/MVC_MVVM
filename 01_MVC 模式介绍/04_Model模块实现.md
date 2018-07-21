# Model模块实现

- 发布-订阅模式的实现
- Model 私有数据的实现
- 数据操作 API 的实现

> 思考：如果我们想要使用这个 Model 模块的时候，我们希望用什么 Api 来调用 ？

1. 初始化的时候把数据传入
2. 增加数据发生变化时候执行的回调函数
3. 让数据发生变化，执行我们所希望的回调函数

```js
class Model{
  // ...
}

// 初始化的时候把数据传入
const todoModel = new Model({ todo: 123 });
// 增加数据发生变化时候执行的回调函数
todoModel.subscribers.push( x => console.log(x));
// or,换一种写法, 暂时以上述 subscribers 写法为例子
todoModel.onChange( x => console.log(x));
// 尝试执行数据变化
todoModel.tode = 456;
```

### 创建实例对象及主要方法

```js
class Model {
  constructor (data){
    this.data = data;
    this.subscribers = [];
  }

  publish (data) {
    this.subscribers.forEach( callback => callback(data))
  }
}
```

### 数据操作 API 的实现

在调用 publish 拿到新的 data 的时候，我们会把 subscribers 订阅者的数组拿出来，订阅者数组每一项都是一个单独的回调函数，所有的回调函数在 publish 调用的时候，都会依次的执行一次。

这个就是最基本的执行流程，我们一般会在做 setter 和 getter 时候使用这个执行流程。已 todo 这个类型数据为例子：

```js
class Model {
  constructor (data){
    this.data = data
    this.subscribers = []
  }

  publish (data) {
    this.subscribers.forEach( callback => callback(data))
  }

  get todo (){
    return this.data.todo
  }

  set todo (todo){
    this.data.todo = todo
    this.publish(todo)
  }
}

const todoModel = new Model({ todo: 123})
todoModel.subscribers.push( x => console.log(x))
todoModel.subscribers.push( x => console.log(x + 1))
todoModel.subscribers.push( x => console.log(x + 2))
todoModel.todo = 456;
```

这样我们添加了三个订阅事件，在实现统一个事件回调用，不同的数据业务逻辑处理。在数据发生改变时，我们所订阅的三个事件，都会依次被执行。

> 问题：我们在 Model 里面写死了 todo 的 getter 和 setter ，我们怎么灵活相应其他数据呢 ？ 

这个时候我们可以使用一个新的 TodoModel 来继承 Model, 这样来扩展使用。例如：

### Model 私有数据的实现

```js
class Model {
  constructor (data){
    this.data = data
    this.subscribers = []
  }

  publish (data) {
    this.subscribers.forEach( callback => callback(data))
  }
}

class TodoModel extends Model {
  constructor (data){
    super(data)
  }

  get todo (){
    return this.data.todo
  }

  set todo (todo){
    this.data.todo = todo
    this.publish(todo)
  }
}

const todoModel = new TodoModel({ todo: 123})
todoModel.subscribers.push( x => console.log(x))
todoModel.subscribers.push( x => console.log(x + 1))
todoModel.subscribers.push( x => console.log(x + 2))
todoModel.todo = 456;
```

所有基础基类 Mode 的子model，都具有发布订阅的特性。















