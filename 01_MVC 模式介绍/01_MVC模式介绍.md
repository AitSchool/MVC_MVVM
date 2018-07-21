# MVC 模式介绍
知识点

- 基础概念
- why MVC
- 现有的 MVC 框架
- MVC 使用实例

## 基础概念
MVC 实际上是一种设计模式，在这个设计模式中区分了三个核心的概念：

- Model 模型 ： 用于存储数据
- View 视图：用于展示渲染数据
- Controller 控制器：用于编写业务逻辑

  MVC 的三个概念组合而成就能够形成一个完整的应用图形界面（GUI 编程），在后台的开发中 MVC 的框架也在非常广泛的使用。

## why MVC
在很久以前 jQuery 非常流行的时代，我们从后端获取到接口的数据，并对数据进行处理，然后把数据渲染到页面上。

1. 为按钮绑定点击事件
2. 从后台获取数据
3. 拼接模版
4. 渲染到页面上

```js
// 为按钮绑定点击事件
$('.ele-btn').on('click',function(){
  // 从后台获取数据
  $.get('/xx-api', (data) => {
    // 拼接模版
    const template = `<div>${data.message}</div>`
    // 渲染到页面上
    $('#xx-container').html(template)
  })
})
```

引发的问题：

1. 输入的事件与渲染逻辑紧密耦合
2. 字符串拼接难以维护
3. 状态变化难以跟踪

MVC 的解决办法：

数据模型 + 页面模版 + 业务逻辑 = App

- 数据模型：封装数据 -> Model
- 页面模版：渲染页面 -> View
- 业务逻辑：操作数据 -> Controller

数据模型解决整个数据变化状态难以追踪和维护，用于存储和后端取到的数据，封装自定义数据的操作。页面模版用于抽离字符串拼接的 HTML 模块，并且渲染到页面上。控制器是连接数据模型和视图模版的一个中间层，把我们的业务逻辑放在里面，控制具体数据与页面直接的交互和行为。

## 现有的 MVC 框架

- Backbone（ MV ）
- Angular（ MVVM ）
- Vue （ MVVM ）
- React （ V ）

## MVC 使用实例
之后我们会带领大家实现一个自己的 MVC 框架，一下是实现后的使用方式。

```js
// 依次导入 MVC 的三个模块
import { TodoModel } from './model'
import { TodoController } from './controller'
import { view } from './view'

// 实力化各个模块，并连接在一起
const model = new TodoModel();
const controller = new TodoController(model, view)

// 通过手动调用 render 方法，初始化页面
controller.render()
```






