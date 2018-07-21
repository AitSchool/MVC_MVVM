# 虚拟DOM概念介绍
虚拟DOM 在前端的框架中，被广泛的应用，了解虚拟DOM的原理，对前端框架的开发会有很大的帮助。

- 虚拟 DOM 是什么
- 为什么需要虚拟 DOM
- 虚拟 DOM 使用现状

## 虚拟 DOM 是什么
虚拟 DOM 的英文名字为 Virtual DOM，以 JSON 树形结构 来表示。我们能够用这种 JSON 结构通过函数的组织返回 HTML 的页面。通过 Diff 的操作，还能够按需更新发生变化的节点。虚拟 DOM 其实就是在 JavaScript 对象中增加一个中间层，能够支持各种平台的开发统一的 Layout 结构，这样就能够实现同一套 JS 代码在多个平台上复用。

- Virtual DOM
- 代表 DOM 节点的简化 JSON 树形结构
- 支持渲染真实 DOM、按需更新 DOM 等操作
- 多端同构的潜力

##  为什么需要虚拟 DOM
在上一节的 MVC 框架中，只要我们的 Model 发生改变，就会对 View 层进行一次全量的更新，虽然实现比较简单，但是代价非常大。Backbone 的render方法在数据模型更新的时候，对页面结构进行全量的更新。如何保持，这个简单的操作，又节省性能消耗呢？插入一层 Diff 算法。输入全部的新数据，输出我们需要更新的数据及DOM位置。最后只有发生变化的节点会发生 DOM 更新。

- 上节中 MVC 框架 render 方法
- Backbone 的 render 方法
- CS 定律之【如果有问题，那么就插入一层】
- 输入 - 全量新数据
- 输出 - 按需更新的 DOM

## 虚拟 DOM 使用现状
React 在实现的时候，非常大的程度使用虚拟DOM实现视图的更新，之后 ReactNative 使用其实现跨平台的表达。Vue 在 2 版本中引入了虚拟DOM的概念，但是其引入虚拟DOM是为了类似 RN 的跨平台统一开发，而不是优化性能。Vue 的数据更新并不需要依赖虚拟DOM，他也知道需要更新哪一行那一列的节点。同时虚拟DOM的应用还广泛在一些类似 React 的小众框架中，例如轻量级别的 preact。

- React / React Native
- Vue / Weex
- preact / inferno / mithral