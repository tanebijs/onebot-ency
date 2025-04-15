# API 分类标准

本文档中，我们根据 API 定义的时期，将 API 分为如下四种类型：

## 🟢 原生 API

这一部分 API 是在 [OneBot 11 标准](https://github.com/botuniverse/onebot-11/blob/master/api/public.md)中定义的，属于 OneBot 的核心 API。它们是 OneBot 11 标准的基础，理论上讲，所有协议端实现都必须支持这些 API。

## 🔵 GoCQ API

这一部分 API 不存在于 OneBot 11 标准中，而是在 go-cqhttp 中定义的。go-cqhttp 是基于旧版 QQ 协议的协议端实现，具有重要的历史地位，其提供的扩展 API 也被广泛使用。虽然这些 API 不属于 OneBot 11 标准的一部分，但它们在实际使用中非常常见，因此我们将它们归类为 GoCQ 扩展 API。

## 🟡 扩展 API

这一部分 API 所对应的特性有的在制定 OneBot 11 和 go-cqhttp 开发时并没有被考虑在内，有的则是专属于 NTQQ 的新特性，它们并没有统一的标准。本文档将总结目前尚在维护的协议端所提供的扩展 API。

## 🔴 过时 API

这一部分 API 是在 OneBot 11 标准中定义的，但由于种种原因，它们所对应的 QQ 特性已不复存在，因此这些 API 已经过时，协议端也无从支持它们。

## 最佳实践

::: details 看我看我~
- 对于 GoCQ API：建议所有协议端实现支持这些 API。
- 对于扩展 API：新的协议端实现者可以选择支持这些 API，并且建议在支持这些 API 时参考本文档的描述；而现有的协议端实现者，如果 API 的实现与本文档描述不一致，也建议修改实现，以便于用户使用。
- 对于过时 API：建议协议端实现者在文档中标明这些 API 已经过时，用户不应使用它们。
:::
