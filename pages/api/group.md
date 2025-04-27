# 群聊 API

## 🟢 `set_group_kick`

踢出群成员。

### 参数

| 键名               | 类型    | 描述                                 |
| ------------------ | ------- | ------------------------------------ |
| group_id           | number  | 群号                                 |
| user_id            | number  | 需要踢出的 QQ 号                     |
| reject_add_request | boolean | 是否拒绝该成员再次加入，默认 `false` |

## 🟢 `set_group_ban`

设置群组禁言。

### 参数

| 键名     | 类型   | 描述                                         |
| -------- | ------ | -------------------------------------------- |
| group_id | number | 群号                                         |
| user_id  | number | 需要禁言的 QQ 号                             |
| duration | number | 禁言时长，默认 `30*60`，单位秒，0 为取消禁言 |

## 🟢 `set_group_whole_ban`

设置全员禁言。

### 参数

| 键名     | 类型    | 描述                          |
| -------- | ------- | ----------------------------- |
| group_id | number  | 群号                          |
| enable   | boolean | 是否开启全员禁言，默认 `true` |

## 🟢 `set_group_admin`

设置群管理员。

### 参数

| 键名     | 类型    | 描述                          |
| -------- | ------- | ----------------------------- |
| group_id | number  | 群号                          |
| user_id  | number  | 需要设置为管理员的 QQ 号      |
| enable   | boolean | 是否设置为管理员，默认 `true` |

## 🟢 `set_group_card`

设置群成员名片。

### 参数

| 键名     | 类型   | 描述                 |
| -------- | ------ | -------------------- |
| group_id | number | 群号                 |
| user_id  | number | 需要设置名片的 QQ 号 |
| card     | string | 名片内容             |

## 🟢 `set_group_name`

设置群名称。

### 参数

| 键名     | 类型   | 描述   |
| -------- | ------ | ------ |
| group_id | number | 群号   |
| name     | string | 群名称 |

## 🟢 `set_group_leave`

离开群聊。

### 参数

| 键名       | 类型    | 描述                                                         |
| ---------- | ------- | ------------------------------------------------------------ |
| group_id   | number  | 群号                                                         |
| is_dismiss | boolean | 是否解散群聊，如果登录号是群主，则仅在此项为 true 时能够解散 |

### 说明

所有的协议端似乎都并没有对 `is_dismiss` 的支持。

## 🟢 `set_group_special_title`

设置群成员专属头衔。

### 参数

| 键名          | 类型   | 描述                        |
| ------------- | ------ | --------------------------- |
| group_id      | number | 群号                        |
| user_id       | number | 需要设置头衔的 QQ 号        |
| special_title | string | 头衔内容，为空表示收回头衔  |
| duration      | number | 头衔时长，单位秒，-1 为永久 |

### 说明

截止目前（2025/4/27），NTQQ 并没有对 `duration` 的支持，所有的头衔都是永久的。

## 🔵 `set_group_portrait`

设置群头像。

### 参数

| 键名     | 类型    | 描述         |
| -------- | ------- | ------------ |
| group_id | number  | 群号         |
| file     | string  | 图片文件路径 |
| cache    | boolean | 是否使用缓存 |

### 说明

`file` 的具体格式说明见[文件类共同参数](/message/segment/media.html#%E5%8F%91%E9%80%81%E5%8F%82%E6%95%B0)。

## 🔵 `set_essence_msg`

设置群精华消息。

### 参数

| 键名       | 类型   | 描述    |
| ---------- | ------ | ------- |
| message_id | number | 消息 ID |

## 🔵 `delete_essence_msg`

删除群精华消息。

### 参数

| 键名       | 类型   | 描述    |
| ---------- | ------ | ------- |
| message_id | number | 消息 ID |


## 🔵 `set_group_sign`

进行群签到。

### 参数

| 键名     | 类型   | 描述 |
| -------- | ------ | ---- |
| group_id | number | 群号 |

## 🔵 `_send_group_notice`

发送群公告。

### 参数

| 键名     | 类型   | 描述           |
| -------- | ------ | -------------- |
| group_id | number | 群号           |
| content  | string | 公告内容       |
| image    | string | 图片路径，可选 |

## 🔵 `_get_group_notice`

### 参数

| 键名     | 类型   | 描述 |
| -------- | ------ | ---- |
| group_id | number | 群号 |

### 响应数据

| 键名         | 类型   | 描述         |
| ------------ | ------ | ------------ |
| sender_id    | number | 公告发表者   |
| publish_time | number | 公告发表时间 |
| message      | object | 公告内容     |

其中 `message` 字段的内容如下：

| 键名   | 类型   | 描述     |
| ------ | ------ | -------- |
| text   | string | 公告内容 |
| images | array  | 公告图片 |

其中 `images` 字段每个元素内容如下：

| 键名   | 类型   | 描述     |
| ------ | ------ | -------- |
| height | string | 图片高度 |
| width  | string | 图片宽度 |
| id     | string | 图片 ID  |

### 说明

- [NapCatQQ](https://github.com/NapNeko/NapCatQQ/blob/956b6cd172beeb70aa83cebcf279ad24a0f01a9a/src/onebot/action/group/GetGroupNotice.ts#L11) 的实现中，公告图片对应的字段为 `image` 而非 `images`。

## 🔵 `_del_group_notice`

删除群公告。

### 参数

| 键名     | 类型   | 描述           |
| -------- | ------ | -------------- |
| group_id | number | 群号           |
| notice_id | number | 公告 ID        |

## 🔴 `set_group_anonymous_ban`

设置匿名用户禁言。NTQQ 已经不再支持匿名消息，因此该功能已经过时。

## 🔴 `set_group_anonymous`

设置是否允许匿名用户发言。NTQQ 已经不再支持匿名消息，因此该功能已经过时。
