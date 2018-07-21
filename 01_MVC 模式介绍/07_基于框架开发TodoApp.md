# 基于框架开发 Todo App

- 继承 Model 模块
- 实现 Controller 业务逻辑
- 编写自定义 View
- 业务整合与调试

## 开发环境搭建

### 1.创建开发目录
```bash
cd ~/Desktop && mkdir todoApp
```

### 2.进入开发目录并初始化NPM包管理

```bash
cd todoApp && npm init
```

### 3.下载依赖包

rollup

```bash
npm install --save-dev rollup
```

babel ES6转译

```bash
npm install --save-dev babel-core babel-preset-env babel-preset-es2015-rollup 
```

```bash
npm install --save-dev rollup-plugin-babel babel-plugin-external-helpers
```

uglify 压缩

```bash
npm install --save-dev rollup-plugin-uglify
```

env 环境变量

```bash
npm install --save-dev cross-env
```

### 4.配置 **.babelrc**

```bash
touch .babelrc && vim .babelrc
```

```json
{
  "presets": ["env"]
}
```

### 5.rollup.config.js

```bash
touch rollup.config.js && vim rollup.config.js
```

```js
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

const plugins = [babel()]
if (process.env.NODE_ENV === 'production') plugins.push(uglify())

export default({
  entry: 'src/app/index.js',
  dest: 'dist/bundle.js',
  format: 'iife',
  moduleName: 'todoApp',
  plugins
})
```

### 6.配置 package.script

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=dev rollup -c --watch",
    "build": "cross-env NODE_ENV=production rollup -c",
  }
}
```

### 7.创建开发入口文件

**src/app/index.js**

```js
let str = 'ok';
console.log(str);
```
### 8.创建测试文件

**examples/index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>todo MVC Demo</title>
  </head>
  <body>
    <div id="app"></div>
    <script src="../dist/bundle.js"></script>
  </body>
</html>
```

### 9.运行开发打包命名
运行后查看输出文件，并打开测试文件查看效果。

```bash
npm run dev
```

## 创建基类对象
公共的 Model 和 Controller，上述章节，已经具体描述过其实现的原理。现在就要引入使用啦！

**src/framework/index.js**

```js
export class Model {
  constructor (data) {
    this.data = data
    this.subscribers = []
  }
  publish (data) {
    this.subscribers.forEach(callback => callback(data))
  }
}

export class Controller {
  constructor (conf) {
    this.el = document.querySelector(conf.el)
    this.model = conf.model
    this.view = conf.view
    this.render = this.render.bind(this)
    this.el.addEventListener('click', (e) => {
      e.stopPropagation()
      const rules = Object.keys(conf.onClick || {})
      rules.forEach((rule) => {
        if (e.path[0].matches(rule)) conf.onClick[rule].call(this, e)
      })
    })
  }
  getTargetAttr (e, attr) {
    return e.path[0].getAttribute(attr)
  }
  getChild (selector) {
    return this.el.querySelector(selector)
  }
  render () {
    this.el.innerHTML = this.view(this.model)
  }
}
```

## 创建 View 视图

**src/app/view.js**

```js
export function TodoView ({ todos }) {
  const todosList = todos.map(todo => `
    <div>
      <span>${todo.text}</span>
      <button data-id="${todo.id}" class="btn-delete">
        Delete
      </button>

      <span>
        <input data-id="${todo.id}"/>
        <button data-id="${todo.id}" class="btn-update">
          Update
        </button>
      </span>
    </div>
  `).join('')

  return (`
    <main>
      <input class="input-add"/>
      <button class="btn-add">Add</button>
      <div>${todosList}</div>
    </main>
  `)
}
```

## 创建 TodoModel 数据模型
TodoModel 继承于基类的 Model，绑定 todos 的数据变化

**src/app/model.js**

```js
import { Model } from '../framework/index'

export class TodoModel extends Model {
  constructor () {
    super({ todos: [] })
  }
  get todos () {
    return this.data.todos
  }
  set todos (todos) {
    this.data.todos = todos
    this.publish(todos)
  }
}
```

## 创建 TodoController 控制器
TodoController 继承于基类的 Controller，并绑定视觉图的事件绑定及数据变化逻辑

- 新增数据
- 修改数据
- 删除数据

**src/app/controller.js**

```js
import { Controller } from '../framework/index'

export class TodoController extends Controller {
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

## 引用
在入口文件中引用各个自定义实例对象

**src/app/index.js**

```js
import { TodoModel } from './model'
import { TodoController } from './controller'
import { TodoView as view } from './view'

const model = new TodoModel()
const controller = new TodoController(model, view)
controller.render()
```

## 打包
使用生产环境压缩打包

```bash
npm run build
```






