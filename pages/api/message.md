# 消息 API

## 🟢 `send_private_msg`

发送私聊消息。

### 参数

| 键名        | 类型    | 描述                                                                            |
| ----------- | ------- | ------------------------------------------------------------------------------- |
| user_id     | number  | 接收消息的用户 QQ 号                                                            |
| message     | message | 消息内容                                                                        |
| auto_escape | boolean | 默认 false，是否不解析 message，直接作为文本发送，仅在 message 是 string 时有效 |

### 响应数据

| 键名       | 类型   | 描述    |
| ---------- | ------ | ------- |
| message_id | number | 消息 ID |

## 🟢 `send_group_msg`

发送群消息。

### 参数

| 键名        | 类型    | 描述                                                                            |
| ----------- | ------- | ------------------------------------------------------------------------------- |
| group_id    | number  | 接收消息的群号                                                                  |
| message     | message | 消息内容                                                                        |
| auto_escape | boolean | 默认 false，是否不解析 message，直接作为文本发送，仅在 message 是 string 时有效 |

### 响应数据

| 键名       | 类型   | 描述    |
| ---------- | ------ | ------- |
| message_id | number | 消息 ID |

## 🟢 `send_msg`

发送消息。

### 参数

| 键名         | 类型    | 描述                                                                            |
| ------------ | ------- | ------------------------------------------------------------------------------- |
| message_type | string  | 消息类型，可能值：`private`、`group`                                            |
| user_id      | number  | 接收消息的用户 QQ 号                                                            |
| group_id     | number  | 接收消息的群号                                                                  |
| message      | message | 消息内容                                                                        |
| auto_escape  | boolean | 默认 false，是否不解析 message，直接作为文本发送，仅在 message 是 string 时有效 |

### 响应数据

| 键名       | 类型   | 描述    |
| ---------- | ------ | ------- |
| message_id | number | 消息 ID |

### 说明

OneBot 11 标准规定，当 message_type 未传入时，则根据 user_id 和 group_id 分别是否存在来判断消息类型，但没有规定二者冲突时的行为。各个协议端的实现细节如下：

- [go-cqhttp](https://github.com/Mrs4s/go-cqhttp/blob/a5923f179b360331786a6509eb33481e775a7bd1/coolq/api.go#L701) 先判断 message_type 是否为 group，如果是则按群聊处理；否则判断 user_id 是否存在，若存在则按私聊处理；若冲突，可能会出现未定义的行为。
- [Lagrange.OneBot](https://github.com/LagrangeDev/Lagrange.Core/blob/2ab0c9213fd9ca7155ba5b88376160832bbaa977/Lagrange.OneBot/Core/Operation/Message/MessageCommon.cs#L65) 先判断 message_type 是否为 private，如果是则按私聊处理；否则判断 group_id 是否存在，若存在则按群聊处理；若冲突，可能会出现未定义的行为。
- [NapCatQQ](https://github.com/NapNeko/NapCatQQ/blob/cc30b51d58233db02b48862ecca2c1aa24ce1535/src/onebot/action/msg/SendMsg.ts#L39) 和 [LLOneBot](https://github.com/LLOneBot/LLOneBot/blob/f1af0d3a3db7031b82717ac44c892cf7656bcabe/src/onebot11/helper/createMessage.ts#L307) 会判断 message_type 和 user_id / group_id 的对应关系是否存在冲突，若存在冲突则返回错误；否则按 user_id 和 group_id 的存在性来判断消息类型。
- [tanebi](https://github.com/tanebijs/tanebi/blob/98c1b36ec200fdb27a7f5d05c7adebcfaf741185/packages/app/src/action/message/send_msg.ts#L10) 不校验冲突，直接按 user_id 和 group_id 的存在性来判断消息类型，若二者均不存在则报错。

## 🟢 `delete_msg`

撤回消息。

### 参数

| 键名       | 类型   | 描述    |
| ---------- | ------ | ------- |
| message_id | number | 消息 ID |

本 API 无响应数据。

## 🟢 `get_msg`

获取消息。

### 参数

| 键名       | 类型   | 描述    |
| ---------- | ------ | ------- |
| message_id | number | 消息 ID |

### 响应数据

| 键名         | 类型    | 描述                                 |
| ------------ | ------- | ------------------------------------ |
| time         | number  | 消息发送时间                         |
| message_type | string  | 消息类型，可能值：`private`、`group` |
| message_id   | number  | 消息 ID                              |
| real_id      | number  | 消息的“真实”ID                       |
| sender       | object  | 消息发送者信息，见消息事件           |
| message      | message | 消息内容                             |

### 说明

OneBot 11 标准制定时 “真实” ID 的原本含义已经不得而知，各个协议端的实现细节如下：

- [go-cqhttp](https://github.com/Mrs4s/go-cqhttp/blob/a5923f179b360331786a6509eb33481e775a7bd1/coolq/api.go#L1689) 和 [LLOneBot](https://github.com/LLOneBot/LLOneBot/blob/f1af0d3a3db7031b82717ac44c892cf7656bcabe/src/onebot11/action/msg/GetMsg.ts#L33) 将消息的 seq 作为 real_id 返回。
- [Lagrange.OneBot](https://github.com/LagrangeDev/Lagrange.Core/blob/2ab0c9213fd9ca7155ba5b88376160832bbaa977/Lagrange.OneBot/Core/Entity/Action/Response/OneBotGetMessageResponse.cs#L15)、[NapCatQQ](https://github.com/NapNeko/NapCatQQ/blob/cc30b51d58233db02b48862ecca2c1aa24ce1535/src/onebot/action/msg/GetMsg.ts#L44) 和 [tanebi](https://github.com/tanebijs/tanebi/blob/98c1b36ec200fdb27a7f5d05c7adebcfaf741185/packages/app/src/action/message/get_msg.ts#L25) 直接将 message_id 作为 real_id 返回。

## 🟢 `get_forward_msg`

获取合并转发消息的内容。

### 参数

| 键名 | 类型   | 描述            |
| ---- | ------ | --------------- |
| id   | string | 合并转发资源 ID |

### 响应数据

| 键名    | 类型    | 描述                                                         |
| ------- | ------- | ------------------------------------------------------------ |
| message | message | 消息内容，使用数组格式表示，数组中的消息段全部为 node 消息段 |

### 说明

在这一 API 上，[OneBot 11 的定义](https://github.com/botuniverse/onebot-11/blob/master/api/public.md#get_forward_msg-%E8%8E%B7%E5%8F%96%E5%90%88%E5%B9%B6%E8%BD%AC%E5%8F%91%E6%B6%88%E6%81%AF)和 [go-cqhttp 的实现](https://docs.go-cqhttp.org/api/#%E8%8E%B7%E5%8F%96%E5%90%88%E5%B9%B6%E8%BD%AC%E5%8F%91%E5%86%85%E5%AE%B9)完全不同。前者接受的参数及响应数据如上所述；后者接受 `message_id`（这个参数名具有误导性，实际上对应的是合并转发资源 ID 而非消息 ID，在文档中也已说明）作为参数，返回值的键名为 `messages`。其余协议端的实现细节如下：

- Lagrange.OneBot ([Payload](https://github.com/LagrangeDev/Lagrange.Core/blob/master/Lagrange.OneBot/Core/Entity/Action/OneBotGetForwardMsg.cs), [Response](https://github.com/LagrangeDev/Lagrange.Core/blob/master/Lagrange.OneBot/Core/Entity/Action/OneBotGetForwardMsg.cs)) 的实现与 OneBot 11 的定义一致，接受 `id` 作为参数，返回值的键名为 `message`。
- [NapCatQQ](https://github.com/NapNeko/NapCatQQ/blob/main/src/onebot/action/go-cqhttp/GetForwardMsg.ts)、[LLOneBot](https://github.com/LLOneBot/LLOneBot/blob/main/src/onebot11/action/go-cqhttp/GetForwardMsg.ts) 同时接受两个版本的参数，但返回值的键名恒为 `messages`。
- [tanebi](https://github.com/tanebijs/tanebi/blob/main/packages/app/src/action/message/get_forward_msg.ts) 同时接受两个版本的参数，并且根据参数名来判断使用哪个版本的返回键名。

## 🔵 `send_group_forward_msg`

发送群聊合并转发消息。

### 参数

| 键名     | 类型    | 描述                                  |
| -------- | ------- | ------------------------------------- |
| group_id | number  | 接收消息的群号                        |
| messages | message | 消息内容，每个消息段必须 type 为 node |

### 响应数据

| 键名       | 类型   | 描述            |
| ---------- | ------ | --------------- |
| message_id | number | 消息 ID         |
| forward_id | string | 合并转发资源 ID |

## 🔵 `send_private_forward_msg`

发送私聊合并转发消息。

### 参数

| 键名     | 类型    | 描述                                  |
| -------- | ------- | ------------------------------------- |
| user_id  | number  | 接收消息的用户 QQ 号                  |
| messages | message | 消息内容，每个消息段必须 type 为 node |

### 响应数据

| 键名       | 类型   | 描述            |
| ---------- | ------ | --------------- |
| message_id | number | 消息 ID         |
| forward_id | string | 合并转发资源 ID |

## 🟡 `send_forward_msg`

这是一个扩展 API，在不同协议端的实现不同：

- [go-cqhttp](https://github.com/Mrs4s/go-cqhttp/blob/a5923f179b360331786a6509eb33481e775a7bd1/coolq/api.go#L719) 将其实现为**发送合并转发消息**，但未在 API 文档中列出，参数如下：

  | 键名         | 类型    | 描述                                  |
  | ------------ | ------- | ------------------------------------- |
  | message_type | string  | 消息类型，可能值：`private`、`group`  |
  | user_id      | number  | 接收消息的用户 QQ 号                  |
  | group_id     | number  | 接收消息的群号                        |
  | messages     | message | 消息内容，每个消息段必须 type 为 node |

  返回值与 [`send_group_forward_msg`](#🔵-send-group-forward-msg)、[`send_private_forward_msg`](#🔵-send-private-forward-msg) 相同。

- [tanebi](https://github.com/tanebijs/tanebi/blob/main/packages/app/src/action/message/send_forward_msg.ts) 的实现与 go-cqhttp 相同。

- [Lagrange.OneBot](https://lagrange-onebot.apifox.cn/236981861e0) 将其实现为**构造合并转发消息**，参数如下：

  | 键名     | 类型    | 描述                                  |
  | -------- | ------- | ------------------------------------- |
  | messages | message | 消息内容，每个消息段必须 type 为 node |

  返回值是一个字符串（而非 JSON object），为合并转发资源 ID，可直接用于发送，但只能用于向群聊发送合并转发消息。

- [NapCatQQ](https://napcat.apifox.cn/226659136e0) 将其实现为**发送合并转发消息**，相较于 go-cqhttp 的实现多出了一些可配置的参数，具体如下：

  | 键名     | 类型    | 描述                                                                          |
  | -------- | ------- | ----------------------------------------------------------------------------- |
  | user_id  | number  | 接收消息的用户 QQ 号，和 group_id 二选一                                      |
  | group_id | number  | 接收消息的群号，和 user_id 二选一                                             |
  | messages | message | 消息内容，每个消息段必须 type 为 node                                         |
  | prompt   | string  | 收到消息，显示在文字预览的提示文本，例如 "[聊天记录]"                         |
  | source   | string  | 合并转发的标题，例如 "群聊的聊天记录"                                         |
  | news     | array   | 合并转发的内容预览，格式为 `{ text: string }` 的数组，例如 "某人: [动画表情]" |
  | summary  | string  | 合并转发的脚注，例如 "查看 10 条转发消息"                                     |

  返回值同 [`send_msg`](#🟢-send-msg)。

- [LLOneBot](https://github.com/LLOneBot/LLOneBot/blob/main/src/onebot11/action/go-cqhttp/SendForwardMsg.ts) 将其实现为**发送合并转发消息**，参数如下：

  | 键名         | 类型    | 描述                                  |
  | ------------ | ------- | ------------------------------------- |
  | message_type | string  | 消息类型，可能值：`private`、`group`  |
  | user_id      | number  | 接收消息的用户 QQ 号                  |
  | group_id     | number  | 接收消息的群号                        |
  | message      | message | 消息内容，每个消息段必须 type 为 node |
  | messages     | message | 定义和 message 相同，二选一           |

  参数与 go-cqhttp 的实现接近，但保留了 `messages` 字段以保证更好的兼容性

  返回值与 [`send_group_forward_msg`](#🔵-send-group-forward-msg)、[`send_private_forward_msg`](#🔵-send-private-forward-msg) 相同。
