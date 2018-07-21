# View 模块实现

- 纯函数概念
- 字符串模板
- 拼接我们所需要的 DOM 结构

## 纯函数
纯函数就是接收一些参数，根据参数返回新的结果。

```js
function demo(x,y){
  // ...
  return x + y
}
```

在之后我们书写的 view 中的模版，组件中的 view 模版，都是存函数的形式展示，举个例子：

```js
function getView(data) {
  return `<div>${data}</div>`
}
const tpl = getView(123);
```

其实就是纯粹的输入东西，输出东西，知识我们输出的是一个 HTML 模版，不对其他地方操作并造成影响。在任何地方都可以使用，不依赖任何的运行环境。


## 字符串模板
ES6的字符串模版大大增大了我们拼接字符串的效率。

在 ES5 中我们通过字符串的 += 方式拼接：例如

```js
let data = 123;
let tpl = "<div>"
    tpl += "<p>"
    tpl += data
    tpl += "</p>"
    tpl += "</div>"
```

或着

```js
let data = 123;
let tpl = "<div>" +
          "<p>" + data + "</p>" +
          "</div>";
```

ES6 的实现方法，变量可以通过 **${}** 设置在模版中，模版支持换行，不需要拼接。

```js
let data = 123;
let tpl = `
    <div>
      <p>${data}</p>
    </div>`
```

## 拼接我们所需要的 DOM 结构

### 构思 View 结构

我们在页面上需要准备渲染的HTML结构如下：

```html
<main>
  <input class="input-add"/>
  <button class="btn-add">Add</button>
  <div class="todo-list">
    <div class="todo-item">
      <span>ABC</span>
      <button data-id="1" class="btn-delete">Delete</button>
      <span>
        <input data-id="2"/>
        <button data-id="1" class="btn-update">Update</button>
      </span>
    </div>
    <div class="todo-item">
      <span>EFG</span>
      <button data-id="2" class="btn-delete">Delete</button>
      <span>
        <input data-id="2"/>
        <button data-id="2" class="btn-update">Update</button>
      </span>
    </div>
  </div>
</main>
```

### 把数据部分抽离出来，使用字符串拼接
我们可以发现 todo-list 的代码是可以通过循环生产，因此我们在函数中把这部分抽离出来。

```js
function TodoView ({ todos }) {
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

### 调用
这样我们通过调用函数 TodoView(data) 即可得到我们想要的模版

```js
let data = [{ id:1, text: 'ABC' },{ id:2, text: 'BCD' }];
let tmp = TodoView(data);
```




