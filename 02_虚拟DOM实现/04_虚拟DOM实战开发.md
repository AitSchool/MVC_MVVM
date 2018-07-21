# 虚拟DOM实战开发

- 打包与环境配置
- 输入输出事件配置
- diff 更新实验

操作流程：

1. 定义虚拟 DOM 状态为 A
2. 将 A 渲染到真实 DOM 上
3. 更新虚拟 DOM 状态为 B
4. 验证是否仅有 A 与 B 不同的节点得到更新

## 创建 index.js

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>vdom</title>
</head>
<body>
  <button id="btn">Change</button>
  <div id="root"></div>
  <script src="./vdom.js"></script>
</body>
</html>
```

## 创建 vdom.js

**vdom.js**

```js
function dom (type, props, ...children) {
  return { type, props, children }
}

function createElement (node) {
  if (typeof node === 'string') {
    return document.createTextNode(node)
  } else {
    const $el = document.createElement(node.type)
    node.children
      .map(createElement)
      .forEach($el.appendChild.bind($el))
    return $el
  }
}

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

const a = dom(
  'div',
  null,
  dom('span', null, '123'),
  dom('span', null, '456'),
  dom('span', null, '789'),
)

const b = dom(
  'div',
  null,
  dom('span', null, '123'),
  dom('span', null, '456'),
  dom('span', null, '666')
)

const $root = document.getElementById('root')
const $btn = document.getElementById('btn')
updateElement($root, a)
$btn.addEventListener('click', () => {
  updateElement($root, b, a)
})
```