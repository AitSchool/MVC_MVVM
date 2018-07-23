# Reactive 基础

- 数据绑定概念
- Reactive 概念
- Object.defineProperty 介绍
- Reactive 实现


## 数据绑定概念
- 数据 → HTML 模板
- 如何简化流程？
- data = newData

在一般情况下我们要把数据插入到模版上，我们需要请求数据，然后拼接字符串，在调用jQuery的方法来把模版插入到DOM中。有时候会将涉及到比较多的业务代码，在手动拼接的维护上甚至对展示结构的完整性有一定的风险。

```js
$.get('/xx-api', (data) => {
  // 拼接模板
  const template = `<div>${data}</div>`
  // 渲染到页面上
  $('#xx-table').html(template)
})
```

## Reactive 概念
我们只需要为对数据赋予新的值，所有和这个数据相关的内容都会得到响应。例如我对一个列表的数据进行 push 操作，那么这个列表数据所绑定的DOM当中也会发生动态的更新。

- 一种特殊类型的对象
- 支持响应式更新
- 基于 Accessor 设计模式（访问者）

我们具有一个特殊类型的数据，对这个数据进行存取，都会引起一些状态的变更，所有订阅了他的事件或者绑定了和他相关的数据，都会在这个数据被访问的时候进行响应式的更新。

## Object.defineProperty 介绍
Object.defineProperty(obj, prop, descriptor) 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性， 并返回这个对象。

- ES5 标准特性
- 参数
 - obj 要在其上定义属性的对象
 - prop 要定义或修改的属性的名称
 - descriptor 将被定义或修改的属性描述符
- 读写对象属性值时，触发事件钩子
  - get ()
  - set ()
- 局限
  - 仅支持 Object，不支持 Array 与 primitive 类型
  - 动态为对象添加属性时无法触发

## Reactive 实现

- 基于 defineProperty，实现 defineReactive 函数

```js
function defineReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    get () {
      return val
    },
    set (newValue) {
      val = newValue
    }
  })
}

const demo = {}
defineReactive(demo, 'foo', 123)
console.log(demo.foo)
```

## 参考

- [Object.defineProperty](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/defineProperty)