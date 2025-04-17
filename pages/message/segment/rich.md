# 富文本消息段

富文本消息段指出现在 QQ 的聊天气泡内，可以混合发送的消息段。

## `text`

表示一段纯文本。

### 参数

| 参数名 | 类型   | 描述     |
| ------ | ------ | -------- |
| text   | string | 文本内容 |

### 说明

`text` 消息段不需要用 CQ 码格式（`[CQ:text,text=内容]`）表示，直接用字符串表示即可。

## `face`

表示一个 QQ 表情或 QQ 支持的 Emoji 表情。

### 参数

| 参数名 | 类型   | 描述    |
| ------ | ------ | ------- |
| id     | string | 表情 ID |

### 说明

表情 ID 有以下几个参考页面：

- [QQ 机器人文档的表情对象](https://bot.q.qq.com/wiki/develop/api-v2/openapi/emoji/model.html)
- [表情 CQ 码 ID 表](https://github.com/kyubotics/coolq-http-api/wiki/%E8%A1%A8%E6%83%85-CQ-%E7%A0%81-ID-%E8%A1%A8)
- [Koishi QFace](https://koishi.js.org/QFace/#/qqnt)

[Lagrange.OneBot](https://github.com/LagrangeDev/Lagrange.Core/blob/946f845f1fe394fbe38c2db70d3b20304142501e/Lagrange.OneBot/Message/Entity/FaceSegment.cs#L14) 的实现中包含扩展字段 `large` (boolean)，表示是否为“大表情”。这一字段适用于 QQ 的“超级表情”分类，当这一字段为 `true` 时，这一表情作为大表情发送；当这一字段为 `false` 时，这一表情作为小表情发送，会出现在文本框中。

[NapCatQQ](https://github.com/NapNeko/NapCatQQ/blob/c509a01d7d5fbbf3c20bac2f7d59a2637902320f/src/onebot/types/message.ts#L164) 的实现中包含扩展字段 `resultId` (string) 和 `chainCount` (number)，这两个字段用于“接龙表情”，这是 2024 年年初 QQ 新增的功能。`resultId` 表示接龙表情的不同变种，`chainCount` 表示接龙表情到这条消息为止的接龙数量。

## `at`

表示一条消息中提及某人（会通知被提及的人），**只能在群聊中使用**。

::: details 一点碎碎念
你猜我为什么要加最后半句呢，就是因为有小天才在私聊中使用了这个功能，而当时的 NapCatQQ 也没有做限制，于是——Boom！
:::

### 参数

| 参数名 | 类型            | 描述                                   |
| ------ | --------------- | -------------------------------------- |
| qq     | number 或 `all` | 被 at 的 QQ 号；`all` 表示 at 全体成员 |

### 说明

[go-cqhttp](https://docs.go-cqhttp.org/cqcode/#%E6%9F%90%E4%BA%BA) 的实现中包含扩展字段 `name` (string)，仅在发送时使用，表示如果找不到 `qq` 对应的 QQ 号，则使用这个字段作为 at 的名称。

Lagrange.OneBot、NapCatQQ、LLOneBot、tanebi 不约而同地支持了这个字段。

## `reply`

表示引用某条消息。

### 参数

| 参数名 | 类型   | 描述            |
| ------ | ------ | --------------- |
| id     | number | 被引用消息的 ID |

### 说明

[go-cqhttp](https://docs.go-cqhttp.org/cqcode/#%E5%9B%9E%E5%A4%8D) 的实现增加了如下字段，以提高回复的可自定义性：

| 参数名 | 类型   | 描述                     |
| ------ | ------ | ------------------------ |
| text   | string | 回复的文本内容           |
| qq     | number | 被回复消息的发送者 QQ 号 |
| time   | number | 被回复消息的发送时间     |
| seq    | number | 被回复消息的序列号       |

当 `id` 和以上字段都存在时，会优先使用 `id` 字段；当无法找到 `id` 对应的消息时，则会使用扩展字段。

## `image`

这一消息段比较特殊，它既可以作为富文本消息段，也可以作为媒体消息段，具体定义见媒体消息段。
