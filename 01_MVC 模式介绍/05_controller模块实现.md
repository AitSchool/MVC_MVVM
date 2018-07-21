# Controller模块实现

- Controller 核心功能点
- 事件捕获 API 设计
- DOM 操作 API 封装
- render API 的设计

> 思考：如果我们想要使用这个 Controller 模块的时候，我们希望用什么 Api 来调用 ？,思考在业务里面，Controller 会包含哪些内容 ？

例如在 todo 这个增删改查的 App，会有添加按钮、删除按钮、编辑按钮及其相关的业务操作，这些操作怎么在 Controller 中封装。

1. 传入和这个 Controller 相关的 model 和 view 
2. 传入这个 Controller 会挂载到哪个 DOM 元素上
3. 传入某种按钮（元素）点击时候，要触发哪些事件

```js
class Controller {
  // ...
}

const todoController = new Controller({
  model,
  view,
  el: '#app',
  onClick: {
    '.btn-add' (e) {
      // ...
    },
    '.btn-update' (e) {
      // ...
    },
    '.btn-delete' (e) {
      // ...
    }
  }
})
```

## 实现后的 Controller

```js
class Controller {
  constructor (conf){
    // 获取参数赋值到私有属性中
    this.el = document.querySelector(conf.el)
    this.model = conf.model
    this.view = conf.view
    this.render = this.render.bind(this)

    // 为 conf.onClick 的元素绑定事件
    this.el.addEventListener('click', (e) => {
      e.stopPropagation()
      // 取出 conf.onClick 对象中所有的函数名（元素选择器）
      const rules = Object.keys(conf.onClick || {})
      rules.forEach((rule) => {
        // 如果点击的事件的元素匹配上我们的选择器
        if( e.path[0].matches(rule)){
          // 执行 conf.onClick 中，其选择器中的方法
          // 并使用保证 this 的上下文时在当前指向
          conf.onClick[rule].call(this.e)
        }
      })
    })
  }


  // 框架的好处在于你可以把各类的 Api 封装一次，按照自己方便的来提供数据
  getTargetArr (e, attr) {
    return e.path[0].getAttribute(attr)
  }

  getChild (selector) {
    return this.el.querySelector(selector)
  }

  // 用于绑定数据的变化和视图的渲染
  render () {
    this.el.innerHTML = this.view(this.model)
  }
}
```

## 继承 Controller 的使用事例

```js
class TodoController extends Controller {
    constructor (model, view) {
      super({
        model,
        view,
        el: '#app',
        onClick: {
          '.btn-add' () {
            // 新增 Todo 时对数据全量赋值
            this.model.todos = this.model.todos.concat([{
              id: new Date().getTime().toString(),
              // 使用 getter 获取绑定至 DOM 元素的数据
              text: this.addInputText
            }])
          },
          '.btn-delete' (e) {
            const id = this.getTargetAttr(e, 'data-id')
            // 根据 id 过滤掉待删除元素
            this.model.todos = this.model.todos.filter(
              todo => todo.id !== id
            )
          },
          '.btn-update' (e) {
            const id = this.getTargetAttr(e, 'data-id')
            const text = this.getUpdateText(id)
            // 根据 id 更新元素
            this.model.todos = this.model.todos.map(
              todo => ({
                id: todo.id,
                text: todo.id === id ? text : todo.text
              })
            )
          }
        }
      })
      // 订阅 Model 更新事件
      this.model.subscribers.push(this.render)
    }
    getUpdateText (id) {
      return super.getChild(`input[data-id="${id}"]`).value
    }
    get addInputText () {
      return super.getChild('.input-add').value
    }
  }
```





