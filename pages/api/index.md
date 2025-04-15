# API

API 是 OneBot 向用户提供的操作接口，用户可通过 HTTP 请求或 WebSocket 消息等方式调用 API。API 调用需要指定 action（要进行的动作）名称和动作所需的参数，协议端在执行相应的操作后按照一定格式返回执行结果。

## 参数

参数的传入遵循键-值对的形式，参数值可以是基本数据类型（如字符串、数字、布尔值等），也可以是复杂数据类型（如数组、对象等）；而参数的传入方式也分 urlencoded 和 JSON 两种格式。

对于不同的数据类型和传入方式，协议端需要进行相应的解析和处理。特别是对于 **urlencoded 格式**的传入数据，由于 urlencoded 只支持字符串一种类型，但 API 接收的基本数据类型却有很多种，因此协议端需要将字符串解析为对应的基本数据类型，例如，当 action 接受数字类型时，需要将字符串解析为数字再传入。此外，urlencoded 是平面化的，无法传递嵌套的对象和数组，因此对于需要接收复杂数据类型的 API，urlencoded 无能为力，只能使用 JSON 格式传递参数。

此外，OneBot 11 标准对于布尔值的规定也不清晰。我们可以看到，在[公开 API 页面](https://github.com/botuniverse/onebot-11/blob/master/api/public.md)，布尔值是用 `true` 和 `false` 来表示的；而在[消息段类型页面](https://github.com/botuniverse/onebot-11/blob/master/message/segment.md)，则用 `0` 和 `1` 来表示布尔值。

::: details 最佳实践
基于此，笔者建议协议端实现者同时接受 `true` 和 `false` 以及 `0` 和 `1` 以及对应的字符串字面量 `"true"` `"false` `"0"` `"1"` 来表示布尔值，以提高兼容性。
:::

## 响应

响应以 JSON 格式返回，包含的字段如下：
- `status` (string)：表示处理状态，可能值：
  - `ok`：表示处理成功；
  - `failed`：表示处理失败；
  - `async`：表示请求被异步处理，无法获知处理结果。
- `retcode` (number)：简要的状态码，可能值：
  - `0`：表示处理成功，只会在 `status` 为 `ok` 时返回；
  - `1`：表示异步处理，只会在 `status` 为 `async` 时返回；
  - 其余值：表示处理失败，只会在 `status` 为 `failed` 时返回，含义由协议端实现者自行定义。
- `data` (object)：处理结果，只会在 `status` 为 `ok` 时返回。
- `message` (string)：错误信息，只会在 `status` 为 `failed` 时返回。

OneBot 11 建议 `message` 字段只包含有关错误的简要信息，具体错误信息应当查阅日志。而 go-cqhttp 则额外包含 `wording` 字段，内容是用中文描述的详细错误信息。

::: details 最佳实践
笔者建议协议端实现者在 `message` 字段中包含简要的错误信息，并同时在日志和 `wording` 字段中包含详细的错误信息，以便用户调试。
:::

## 异步调用

OneBot 11 规定，所有 API 都可以通过给 action 附加后缀 `_async` 来进行异步调用，例如 `send_private_msg_async`、`send_msg_async`、`clean_data_dir_async`。

异步调用的响应中，`status` 字段为 `async`。

需要注意的是，虽然说以 `get_` 开头的那些接口也可以进行异步调用，但实际上客户端没有办法得知最终的调用结果，所以对这部分接口进行异步调用是没有意义的；另外，有一些接口本身就是异步执行的（返回的 `status` 为 `async`），此时使用 `_async` 后缀来调用不会产生本质上的区别。

**实际上，现在很少有协议端实现支持异步调用。** 例如，Lagrange.OneBot 和 NapCatQQ 都不支持异步调用，对于这些协议端实现来说，使用后缀 `_async` 调用 API 会导致 404 错误。

## 限速调用

所有 API 都可以通过给 action 附加后缀 `_rate_limited` 来进行限速调用，例如 `send_private_msg_rate_limited`、`send_msg_rate_limited`，不过主要还是用在发送消息接口上，以避免消息频率过快导致腾讯封号。所有限速调用将会以指定速度**排队执行**，这个速度可在配置中指定。

限速调用的响应中，`status` 字段为 `async`。

**实际上，现在很少有协议端实现支持限速调用。** 例如，Lagrange.OneBot 和 NapCatQQ 都不支持限速调用，对于这些协议端实现来说，使用后缀 `_rate_limited` 调用 API 会导致 404 错误。
