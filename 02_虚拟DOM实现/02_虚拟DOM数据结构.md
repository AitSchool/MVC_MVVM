# 虚拟DOM数据结构

- 树形结构简介
- 对树的递归遍历
- 树形结构操作实战
- JSX 转译配置

## 树形结构简介
在我们和后端进行对接的时候，经常会用到 JSON 的结构，但其可能是普通的 key / value 就可以拿到我们想要的数据。对于树形结构，我们可以用省市区的方式来理解。在选择了不同的省份之后，其下有不同的市，在选择其中的市之后，市其下又有不同的区。另外的例子是公司的架构，在不同的组织下又不同的部门，在不同的部门又不同的组，不同的组再对应找到不同的人员。虽然选择的种种不同，但是结构是一致的。

- case - 省市区联动选择器
- case - 公司组织结构接口

举个例子：

```js
const data = {
  '福建': {
    '厦门': {
      '思明区': 123
    }
  },
}
// 数据结构 sucks
data['福建']['厦门']['思明区']
```

这种数据结构虽然容易表达，也能呈现出树的关系，但是在我们获取到厦门时候，我们并不知道厦门是单独的一个省，还是一个区，他是在哪个位置。因此我们需要更多的信息，及其相关的信息。

- 统一各层级数据结构
- 添加 id / children / value 等属性

```js
const data = {
  name: '中国',  id: 0, value: null
  children: [
    {
      name: '福建', id: 1, value: null
      children: [
        {
          name: '厦门',  id: 2, value: null
          children: [
            {
              name: '思明区',
              id: 3,
              value: 123
              children: []
            },
            // ...
          ]
        },
        // ...
      ]
    },
    // ...
  ]
}
```

## 对树的递归遍历
并且为了方便查询，在不同的节点上都应该是统一的查询方法。这个方法会在查询子层级时，需要必要时候调用自己（递归）。我们只要传入数结构，和id 就可以找到对应的数据。

```js
function getValueById (node, id) {
  if (node.id === id) return node.value
  for (let i = 0; i < node.children.length; i++) {
    const childValue = getValueById(node.children[i], id)
    if (childValue) return childValue
  }
  return null
}
```


## JSX 转译配置

- 如何快速构建出 DOM 树的 JSON 结构？
- 为什么写 JSX 时一定要导入 React？

### 如何快速构建出 DOM 树的 JSON 结构？
通过 JSX ，JSX 是Javascript和XML结合的一种格式。React发明了JSX，利用HTML语法来创建虚拟DOM。当遇到<，JSX就当HTML解析，遇到{就当JavaScript解析。

### 为什么写 JSX 时一定要导入 React？
在 React 项目中使用 JSX时候，在书写一下代码：

```js
function demo(){
  return <div>123</div>
}
```

通过 JSX 模版转译之后，实际上等同于

```js
function demo(){
  return React.createElement('div',123);
}
```

如果忘记导入 React 却调用了 React 就会发生缺少 React 的错误。

同时，createElement 比较长，我们可以通过一下方法修改 createElement 的方法

1. 导入 babel-transform-react-jsx 插件
2. 其默认转译函数为 React.createElement
3. 配置 .babelrc 中插件 prama 参数为 dom 即可

例如：

```js
const vdom = (
  <div>
    <span>123</span>
    <span>456</span>
  </div>
)
```

将会被转化为：

```js
const vdom = dom(
  'div',
  null,
  dom('span', null, '123'),
  dom('span', null, '456')
)
```

## 资料

- [JSX](https://facebook.github.io/jsx/)

