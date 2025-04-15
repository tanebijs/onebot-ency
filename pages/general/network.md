# 通信

[OneBot 11 的文档](https://github.com/botuniverse/onebot-11/blob/master/communication/README.md)中规定了四种通信方式：

- **HTTP**：OneBot 作为 HTTP 服务端，提供 API 调用服务
- **HTTP POST**：OneBot 作为 HTTP 客户端，向用户配置的 URL 推送事件，并处理用户返回的响应
- **正向 WebSocket**：OneBot 作为 WebSocket 服务端，接受用户连接，提供 API 调用和事件推送服务
- **反向 WebSocket**：OneBot 作为 WebSocket 客户端，主动连接用户配置的 URL，提供 API 调用和事件推送服务

所有通信方式传输的数据都使用 UTF-8 编码。

## HTTP

OneBot 在启动时开启一个 HTTP 服务器，监听配置文件指定的 IP 和端口，接受路径为 `/:action` 的 API 请求，请求可以使用 GET 或 POST 方法，可以通过 query 参数、urlencoded 表单或 JSON 传递参数。实际使用中，用户通常选择 POST 方法传递 JSON 格式的参数，在调试环境下有时也使用 GET 方法传递 query 参数。而协议端实现中，开发者也很少考虑 POST urlencoded 表单的情况（例如 NapCatQQ 就没有处理这种情况）。

参数可能有不同的类型，当用户通过 query 参数或 urlencoded 表单传参，或在 JSON 中使用字符串作为参数值时，协议规定 OneBot 实现需要从字符串解析出对应类型的数据，例如，如果 urlencoded 表单中的某个字段符合 JSON 格式，则需要将其解析为 JSON 对象，这对于协议端来说是巨大的挑战，因此几乎没有协议端考虑过这种情况。

收到 API 请求并处理后，OneBot 会返回一个 HTTP 响应，根据具体错误类型不同，HTTP 状态码不同：
- `401`：鉴权凭据未提供。
- `403`：鉴权凭据不匹配。
- `406`：POST 请求的 Content-Type 不支持。
- `400`：参数格式不正确。
- `404`：请求的 Action 不存在。

剩下的所有情况，无论操作实际成功与否，状态码都是 200 (OK)，同时返回 JSON 格式的响应，具体格式见 [API 页面](/api/#响应)。

## HTTP POST

OneBot 在收到事件后，向配置指定的事件上报 URL 通过 POST 请求发送事件数据，事件数据以 JSON 格式表示。请求结束后，OneBot 处理用户返回的响应中的「快速操作」，如快速回复、快速禁言等。

每个 POST 请求都会携带 `X-Self-ID` 的请求头，内容是 Bot 自身的 QQ 号。

当用户配置了 `secret`，即签名密钥，则会在每次上报的请求头包含 `X-Signature` 头，内容是 HMAC 签名。用户在接收侧可以用相同的密钥和算法计算出签名，并与请求头中的签名进行对比，来验证请求的合法性。

POST 请求可以返回 JSON 格式的响应，如果上报的是消息事件，可以进行对消息的回复、对消息发送者禁言等操作；如果上报的是好友或者入群请求，则可以同意或拒绝。这些响应统称为“快速操作”。

## 正向 WebSocket

OneBot 在启动时开启一个 WebSocket 服务器，监听配置文件指定的 IP 和端口，接受路径为 `/api`、`/event`、`/` 的连接请求。连接建立后，将一直保持连接（用户可主动断开连接），并根据路径的不同，提供 API 调用或事件推送服务。通过 WebSocket 消息发送的数据全部使用 JSON 格式。

- `/api`：只用于接收 API 调用请求，传入格式如下：

  | 键名   | 类型   | 描述                                                      |
  | ------ | ------ | --------------------------------------------------------- |
  | action | string | 要调用的 Action 名称                                      |
  | params | object | 要调用的 Action 的参数，包含不同字段                      |
  | echo   | string | 可选，用于区分不同调用，用户可以自定义，OneBot 会原样返回 |

  返回格式与 [HTTP](#http) 的 200 返回格式相近，多出了 `echo` 字段，内容是请求中传入的 `echo` 字段。

  此外，由于 WebSocket 的返回数据并不包含 HTTP 状态码，因此 OneBot 需要用 `retcode` 字段来表示一些特定的错误类型：
  - `1400`：表示请求参数错误；
  - `1404`：表示请求的 Action 不存在。

- `/event`：只用于主动推送事件，格式同事件格式。

- `/`：既可以接收 API 调用请求，也可以主动推送事件。

## 反向 WebSocket

OneBot 启动后，作为客户端向用户配置的反向 WebSocket URL 建立连接。连接建立后，将一直保持连接，并根据连接的 URL 不同，提供 API 调用或事件推送服务。通过 WebSocket 消息发送的数据全部使用 JSON 格式，各个传入和返回格式与正向 WebSocket 一致。

OneBot 服务要求协议端提供的 URL 的客户端有三种：
- API 客户端：提供 API 调用服务。
- Event 客户端：提供事件推送服务。
- Universal 客户端：在一条连接上同时提供两种服务。

实际上，协议实现并不一定会区分 API 或者 Event 客户端，而是完全作为 Universal 客户端来实现。
