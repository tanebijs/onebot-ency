---
# https://vitepress.dev/reference/default-theme-home-page
layout: home

hero:
  name: "OneBot 大典"
  # text: "A VitePress Site"
  tagline: 沟槽的 OneBot 11 百科全书
  actions:
    - theme: brand
      text: 开始阅读
      link: /
    - theme: alt
      text: GitHub
      link: https://github.com/tanebijs/onebot-ency
features:
  - title: 兼容并包
    details: GoCQ？拉格兰？瞌睡猫？LLOB？你想要的这都有
  - title: 保持最新
    details: 及时跟进 NTQQ 协议和各框架新特性
  - title: 全面详尽
    details: 立足当下，细数不同实现之间的差异，言前人所未言
---

## Q&A

### 你是谁？凭什么由你来定义 OneBot？

我是尚未完善的一个协议端——[tanebi](https://github.com/tanebijs/tanebi) 的开发者，同时也或多或少参与过 [Lagrange.Core](https://github.com/LagrangeDev/Lagrange.Core) 和 [NapCatQQ](https://github.com/NapNeko/NapCatQQ) 的开发。为了编写 tanebi 的 [OneBot 11 实现部分](https://github.com/tanebijs/tanebi/tree/main/packages/app)，我参考了[OneBot 11 的官方文档](https://11.onebot.dev/)、[go-cqhttp 帮助中心](https://docs.go-cqhttp.org/)，以及 [Lagrange.OneBot](https://lagrange-onebot.apifox.cn/) 和 [NapCatQQ](https://napcat.apifox.cn/) 在 Apifox 发布的文档。

没有人能真正定义 OneBot，包括我自己，抑或是每个人都是 OneBot 的定义者。OneBot 是一个开放的协议，任何人都可以实现它。我们能做的，也只是将已有的实现进行整理和剖析。

### 都有那么多文档了，那做这个的意义何在？

如你所见，OneBot 11 有很多不同的协议端实现，也产生了丰富的 API 文档。虽然它们都声称是 OneBot 11 的实现，但实际上它们之间有着很大的差异，而这些差异却鲜有专门的文章进行讨论。比如说，go-cqhttp 和 OneBot 11 本身的 API 文档就有很多不同之处，甚至在一些地方是**互斥**的！此外，原本的 OneBot 11 协议也有着诸多缺陷和过时之处，在这里也将一一列出。

尽管我们不能否认 OneBot 11 作为从无到有的协议的伟大之处，也很难撼动它在今日的地位，但必须承认，OneBot 11 远非完美。我们希望通过这个文档，对 OneBot 11 的现状进行一个全面的梳理和总结，帮助更多人了解 OneBot 11 并且编写兼容性更好的 OneBot 实现，同时也鞭策未来的协议设计者设计出更加友好的协议。
