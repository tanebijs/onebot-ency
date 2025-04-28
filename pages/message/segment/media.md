# 媒体消息段

媒体消息段指单独作为一条消息，不能混合发送的消息段。

## 文件类共同参数

这类消息在发送时会被上传到服务器，包含 `image`、`record` 和 `video` 三种类型。它们有一些共同的参数。

### 发送参数

| 参数名  | 类型    | 描述                                      |
| ------- | ------- | ----------------------------------------- |
| file    | string  | 文件路径                                  |
| cache   | boolean | 是否使用缓存                              |
| proxy   | boolean | 是否使用代理                              |
| timeout | number  | 通过 URL 获取发送文件的超时时间，单位为秒 |

按照 OneBot 11 标准，发送文件类消息时应当通过 `file` 参数指定要发送的文件，可以传入的值有：

- `file://` 开头的本地文件路径，例如 `file://D:\test.jpg`，`file:///Users/someone/test.jpg`，`file://./test.jpg` 等。
- `http://` 或 `https://` 开头的 URL，例如 `http://example.com/test.jpg`，`https://example.com/test.jpg` 等。
- `base64://` 开头的 Base64 编码字符串，例如 `base64://iVBORw0KGgoAAAANSUhEUgAAAAUA...` 等。

在实际使用中，用户并不一定只通过 `file` 字段来传递文件路径，可能会使用其他字段来传递文件路径，部分协议端的适配如下：

- [NapCatQQ](https://github.com/NapNeko/NapCatQQ/blob/35f24eb8061c4934a3d9b6c5c335f5424516df9a/src/onebot/api/msg.ts#L1057) 检测了 `file`、`url` 和 `path` 三个字段。
- [LLOneBot](https://github.com/LLOneBot/LLOneBot/blob/2f4e5052d90f6fec03c65e745266ce6ec312d108/src/onebot11/helper/createMessage.ts#L326) 检测了 `file` 和 `url` 两个字段。

### 接收参数

| 参数名 | 类型   | 描述            |
| ------ | ------ | --------------- |
| file   | string | 文件路径        |
| url    | string | 文件的 URL 地址 |

OneBot 11 的本意是用 `url` 来直接表示文件资源的 URL，以便于应用端直接下载。但实际上，个别协议端（如 NapCatQQ）的早期实现并不能直接获取 `url`，而是拿到一个文件标识符，后续通过这个标识符再通过 `get_image` 之类的 API 获取文件本身内容。

::: details 有关 NTQQ 内部的资源处理
与旧版本 QQ 不同，新版本 QQ 已经无法在获取消息的时候同步获得资源 URL，而是转而使用了一个资源 ID 来标识这个资源。这个 ID 是一段 base64 编码的字符串，NTQQ 会再通过一次异步操作获取资源的 URL。OneBot 11 协议端实现普遍需要在收到每条媒体消息时都进行一次额外的异步操作，实际上这样造成了相当的性能损失。
:::

## `image`

表示一张图片。这个消息段比较特殊，既可以混合在富文本消息中发送，也可以单独发送。

### 参数

除上述共同参数外，`image` 消息段还有以下参数：

| 参数名 | 类型   | 描述                                                   |
| ------ | ------ | ------------------------------------------------------ |
| type   | string | 表示图片的类型，可选，唯一的非空值为 `flash`，表示闪照 |

### 说明

[go-cqhttp](https://docs.go-cqhttp.org/cqcode/#%E5%9B%BE%E7%89%87) 的实现中包含的扩展字段及解释如下：

| 参数名    | 类型   | 说明                                                      |
| --------- | ------ | --------------------------------------------------------- |
| `type`    | string | 图片类型，`flash` 表示闪照，`show` 表示秀图，默认普通图片 |
| `subType` | number | 图片子类型，只出现在群聊                                  |
| `id`      | number | 发送秀图时的特效 ID，默认为 40000                         |
| `c`       | number | 通过网络下载图片时的线程数，可选 `2` 或 `3`， 默认单线程  |

注意这里的 `subType` 不符合 OneBot 11 一贯的 `snake_case` 风格，可能是因为早期的实现中没有考虑到这个问题。`id` 和 `c` 字段在其他协议端实现中并不常见。

go-cqhttp 对于 `subType` 的解释如下：

- `0`：普通图片
- `1`：表情包，会被缩放显示

只有以上两种较为常用，并且在 NTQQ 收到的图片也普遍属于这两种类型。

::: details 其他奇奇怪怪的 `subType`

- 2：热图
- 3：斗图
- 4：智图？
- 7：贴图
- 8：自拍
- 9：贴图广告？
- 10：有待测试
- 13：热搜图

这些 `subType` 可能是一些过时的或未经测试的功能，不建议使用。
:::

其他协议端也跟进实现了 `subType` 字段。

此外，Lagrange.OneBot、NapCatQQ、LLOneBot 都不约而同地实现了 `summary` (string) 字段，该字段表示收到图片消息后显示的预览文本，对于 `subType` 为 0 默认显示为 `[图片]`，对于 `subType` 为 1 默认显示为 `[动画表情]`。

## `record`

表示一条语音。

### 参数

除上述共同参数外，`record` 消息段还有以下参数：

| 参数名 | 类型    | 描述                                          |
| ------ | ------- | --------------------------------------------- |
| magic  | boolean | 表示声音是否经过“变声”（QQ 的自带功能）处理。 |

### 说明

`magic` 字段普遍未实现（甚至包括 go-cqhttp），因为需求不足且变声包含多种类型，实现起来较为复杂。

NTQQ 只支持发送 Silk 格式的语音，而这一格式通常不易于直接使用，往往需要工具进行转换。各协议端使用的方案如下：

- [go-cqhttp](https://github.com/Mrs4s/go-cqhttp/blob/a5923f179b360331786a6509eb33481e775a7bd1/modules/silk/codec.go#L34)、[NapCatQQ](https://github.com/NapNeko/NapCatQQ/blob/88b86611a31318686be8e15b65ca19d99768d24d/src/common/audio.ts#L38)、[LLOneBot](https://github.com/LLOneBot/LLOneBot/blob/2f4e5052d90f6fec03c65e745266ce6ec312d108/src/common/utils/audio.ts#L55)：依赖 ffmpeg。
- [Lagrange.OneBot](https://github.com/LagrangeDev/Lagrange.Core/blob/master/Lagrange.OneBot/Message/Entity/RecordSegment.cs)：依赖 [Konata.Codec](https://github.com/KonataDev/Konata.Codec)。

## `video`

表示一条视频。

### 参数

除上述共同参数外，没有其他参数。

### 说明

- [go-cqhttp](https://docs.go-cqhttp.org/cqcode/#%E7%9F%AD%E8%A7%86%E9%A2%91) 的实现支持 `cover` (string) 字段，可以自定义视频封面。

## 魔法表情

表示 QQ 的一类特殊表情，发送后会随机出现不同的结果。包含 `rps`（石头剪刀布）、`dice`（掷骰子）、两种类型，均无参数。

### 说明

本消息段在协议端的支持情况不佳。

- go-cqhttp 不支持魔法表情。
- [NapCatQQ](https://github.com/NapNeko/NapCatQQ/blob/88b86611a31318686be8e15b65ca19d99768d24d/src/onebot/types/message.ts#L221) 和 [LLOneBot](https://github.com/LLOneBot/LLOneBot/blob/2f4e5052d90f6fec03c65e745266ce6ec312d108/src/onebot11/types.ts#L157) 的实现支持 `result` (number) 字段，表示结果。但这个字段只在接收时有效，发送时提供该字段并不能控制结果。

## `share`

表示链接分享卡片。

### 参数

| 参数名  | 类型   | 描述                           |
| ------- | ------ | ------------------------------ |
| url     | string | 分享链接的 URL 地址            |
| title   | string | 分享链接的标题                 |
| content | string | 分享链接的内容，发送时可选     |
| image   | string | 分享链接的图片 URL，发送时可选 |

### 说明

本消息段在协议端的支持情况不佳，仅在 [go-cqhttp](https://github.com/Mrs4s/go-cqhttp/blob/a5923f179b360331786a6509eb33481e775a7bd1/coolq/cqcode.go#L695) 中有实现。

## `contact`

表示推荐联系人。

### 参数

| 参数名 | 类型   | 描述                        |
| ------ | ------ | --------------------------- |
| type   | string | 联系人类型，`qq` 或 `group` |
| id     | number | 联系人 QQ 号或群号          |

### 说明

Lagrange.OneBot 不支持该消息段。

## `location`

表示位置卡片。

### 参数

| 参数名  | 类型   | 描述         |
| ------- | ------ | ------------ |
| lat     | number | 纬度         |
| lon     | number | 经度         |
| title   | string | 位置标题     |
| content | string | 位置内容描述 |

### 说明

该消息段在协议端的支持情况不佳，现已无法发送。

## `music`

表示音乐卡片。

### 参数

在 OneBot 11 标准中，音乐卡片分音乐平台和自定义两种类型。

#### 音乐平台

| 参数名 | 类型   | 描述                                 |
| ------ | ------ | ------------------------------------ |
| type   | string | 音乐平台类型，可能值有 `qq`、`163`、`xm` |
| id     | number | 音乐 ID                              |

#### 自定义

| 参数名  | 类型   | 描述                    |
| ------- | ------ | ----------------------- |
| type    | string | 唯一的可能值为 `custom` |
| url     | string | 点击后跳转的链接        |
| audio   | string | 音乐的 URL 地址         |
| title   | string | 音乐标题                |
| content | string | 音乐内容描述            |
| image   | string | 音乐封面图片的 URL 地址 |

### 说明

`xm` 对应的音乐平台虾米音乐，已于 2021 年 2 月 5 日停止服务。

该消息段在协议端的支持情况不佳，往往需要自行配置音乐卡片签名服务器使用。

## `xml`

表示 XML 格式的消息。

### 参数

| 参数名 | 类型   | 描述         |
| ------ | ------ | ------------ |
| data  | string | XML 格式的消息 |

## `json`

表示 JSON 格式的消息。

### 参数

| 参数名 | 类型   | 描述         |
| ------ | ------ | ------------ |
| data  | string | JSON 格式的消息 |
