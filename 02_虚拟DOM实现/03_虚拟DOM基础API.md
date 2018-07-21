# 虚拟DOM基础API

- 基于 JSX 表达虚拟 DOM
- 绑定虚拟 DOM 到真实 DOM
- 虚拟 DOM 更新算法


## 表达虚拟 DOM
实际上我们所编写的 JSX 的标签，都会创建一个 React.createElement 的函数，在我们考虑如何实现自己的虚拟DOM时候，我们就要考虑怎么实现一个我们自己的函数。使用自己的 dom 函数，把 React.createElement 替代。这时候我们就要考量，这个函数的输入是什么，输出应该是什么？

- 如何实现替代 React.createElement 的 dom 函数？
- 函数输入？
- 函数输出？

在一个 DOM 元素中的表现结构,主要由标签、参数、子元素 组成。

```html
<div>
  <span></span>
  <span></span>
</div>
```

因此，我们转化还书的输入参数主要为： 标签、参数、子结构。


- type 标签名
- porps 各种属性 class/style/width/height ...
- children 子结构数组

```js
function dom (type, props, ...children) {
  return { type, props, children }
}
```

这时候我们的函数的输出，是一个有对应关系的 JSON 树结构。

```js
{ 
  type: 'div',
  props: null,
  children: 
   [ { type: 'span', props: null, children: [Object] },
     { type: 'span', props: null, children: [Object] } ] 
}
```

尝试使用一下

```js
function dom (type, props, ...children) {
  return { type, props, children }
}

const vdom = dom(
  'div',
  null,
  dom('span', null, '123'),
  dom('span', null, '456')
)

console.log(vdom);

{
  "type":"div",
  "props":null,
  "children":[{
    "type":"span",
    "props":null,
    "children":["123"]},
  {
    "type":"span",
    "props":null,
    "children":["456"]}
  ]
}
```

## 绑定真实 DOM
接下来我们要考虑的是，我们已经拿到了 JSON 结构，通过调用 DOM 的 API 操作，渲染到真实的 DOM 上去。核心在于调用真实 DOM 的 API，比如说 **document.createElement** 、**document.createTextNode** ，把 JSON 结构变成真实 DOM。

这时候我们就要设计一个函数，实现这个功能。

1. 输入一个虚拟 DOM 节点，返回对应的真实 DOM 节点
2. 节点内容为纯文本时，表示节点该节点为叶子节点
3. 节点内容为非叶子节点时，递归对所有子节点调用本函数

```js
// 输入一个虚拟 DOM 节点，返回对应的真实 DOM 节点
function createElement (node) {
  // 节点内容为纯文本时，表示节点该节点为叶子节点
  if (typeof node === 'string') {
    return document.createTextNode(node)
  } else {
    // 节点内容为非叶子节点时，递归对所有子节点调用本函数
    const $el = document.createElement(node.type)
    node.children
      .map(createElement)
      .forEach($el.appendChild.bind($el))
    return $el
  }
}
```

## 虚拟 DOM 更新算法
接下来我们要思考虚拟DOM的跟新算法，我们可以把这个算法封装成一个函数 **updateElement**。我们在进行一些全量的 render 的时候，会把完全全新的数据模型结构丢给框架。这时候，我们就会调用函数 **updateElement**，对 DOM 进行差量的更新。因此这个函数的输入是两个虚拟DOM，用于对比，在对比过程中需要发现哪些节点发生改变，然后对改变的节点调用真实DOM操作，把改变了的节点进行更新，没有改变的节点继续保留。这个时候或许我们还需要一个辅助函数 函数 **isChanged** ，这个函数用于比较两个虚拟DOM的元素是否相等。函数 **isChanged** 输入应该为两个比较的元素，输出 true/false 。


1. 比较节点是否改变的 isChanged 函数
2. 输入 DOM 与新旧节点，执行更新的 updateElement 函数
3. 使用 updateElement 来差量更新 DOM

- updateElement 函数
  - 函数输入？
  - 函数输出？
- isChanged 函数
  - 函数输入？
  - 函数输出？


### updateElement 设计

- 输入 $parent / newNode / oldNode / index
  - $parent 父节点
  - newNode 新的虚拟DOM的JSON树
  - oldNode 原来的虚拟DOM的JSON树
  - index   用来指名当前更新到第几个标
- 根据 Diff 结果，更新 $parent 并递归向下
- 递归过程中，通过副作用按需更新 DOM，无显式输出


### Diff 可能情形
在 updateElement 过程中，会遇到哪些情形

- 不存在旧节点
- 不存在新节点
- 新旧节点均存在
  - 节点状态未改变
  - 节点状态改变

#### 不存在旧节点
直接把新节点插入真实DOM

```js
function updateElement ($parent, newNode, oldNode, index = 0) {
  // 不存在旧节点
  if (!oldNode) {
    $parent.appendChild(
      createElement(newNode)
    )
  }
}
```

#### 不存在新节点
直接把旧节点从真实DOM移除

```js
function updateElement ($parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    $parent.appendChild(
      createElement(newNode)
    )
  // 不存在新节点
  } else if (!newNode) {
    $parent.removeChild(
      $parent.childNodes[index]
    )
  }
}
```

#### 新旧节点均存在，但节点类型发生改变
例如一个原来 div 标签 突然变成了 p 标签，这时候我们通过 replaceChild 把原有的节点通过 createElement 创建的新节点。

```js
function updateElement ($parent, newNode, oldNode, index = 0) {
  // …
  // 新旧节点均存在，但节点类型发生改变
  else if (isChanged(newNode, oldNode)) {
    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    )
  }
}

function isChanged (node1, node2) {
  return (
    (typeof node1 !== typeof node2) ||
    (typeof node1 === 'string' && node1 !== node2) ||
    (node1.type !== node2.type)
  )
}
```

#### 新旧节点均存在，且节点类型不变
原有节点是 div ，下面有 三个 span 子元素，现在节点也是 div ，下面有 四个 span 子元素。这时候我们取最大的长度，然后依次的进行判断和更新。

```js
function updateElement ($parent, newNode, oldNode, index = 0) {
  // …
  // 新旧节点类型相同
  else if (newNode.type) {
    const newLen = Math.max(
      newNode.children.length,
      oldNode.children.length
    )
    for (let i = 0; i < newLen; i++) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }
}
```

#### 完整的更新函数

```js
function isChanged (node1, node2) {
  return (
    (typeof node1 !== typeof node2) ||
    (typeof node1 === 'string' && node1 !== node2) ||
    (node1.type !== node2.type)
  )
}

function updateElement ($parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    $parent.appendChild(
      createElement(newNode)
    )
  } else if (!newNode) {
    $parent.removeChild(
      $parent.childNodes[index]
    )
  } else if (isChanged(newNode, oldNode)) {
    $parent.replaceChild(
      createElement(newNode),
      $parent.childNodes[index]
    )
  } else if (newNode.type) {
    const newLen = Math.max(
      newNode.children.length,
      oldNode.children.length
    )
    for (let i = 0; i < newLen; i++) {
      updateElement(
        $parent.childNodes[index],
        newNode.children[i],
        oldNode.children[i],
        i
      )
    }
  }
}
```















