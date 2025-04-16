# 消息 ID

OneBot 11 规定消息 ID 是一个 32 位整数，**这也是最为协议端开发者所诟病的一点**。为了明白为什么这样的规定给开发者带来了如此大的麻烦，我们需要先了解一下 QQ 是如何标识消息的。

## QQ 标识消息的方式

一般来说，在 QQ 中定位一个消息需要三个参数：

- 联系人类型（Peer Type）：群聊或私聊。
- 联系人 ID（Uin）：群聊的群号或好友的 QQ 号。
- 消息序列号（Seq）：一个递增的数字，表示这条消息是建群 / 加好友以来的第几条消息。

此外，在私聊场景下，还有一些意义尚不明确但仍然会被使用的参数：

- `clientSequence`：对于私聊双方来说不同，并且**有可能重复**，但都是递增的数字。在撤回和回复私聊消息时会用到。
- `messageUid`：一个 64 位整数，在所有消息中都是唯一的，但不能直接用于获取消息。需要在回复消息时传入，以便 QQ 客户端定位消息。

## 实现难点

按照上面所说的三个参数：

- Peer Type 只有私聊和群聊两种，因此可以只用 1 个比特位来表示；
- Uin 是 32 位无符号整数，因此可以用 32 位来表示；
- Seq 一般不会超过 2147483647，因此可以用 31 位来表示。

这样一来，消息 ID 就可以用 1 + 32 + 31 = 64 位整数来表示了。而问题是，OneBot 11 规定消息 ID 是一个 32 位整数，这就意味着高 32 位不得不被丢弃。这样一来，用这种表达方式根本无法保证消息 ID 的唯一性，也无法直接从这样的消息 ID 中还原出定位具体消息所需的参数。

不得不说，32 位整数消息 ID 是一个**巨大的设计失误**。很显然，OneBot 11 在做出这一规定时，完全没有考虑协议端应当如何编码消息 ID，当然也没有给出编码方式的规定。不同的协议端在实现时也都各自采用了不同的方式来确定消息 ID，这就造成消息 ID 在不同的协议端之间不能互通，在一个协议端上发送的消息在另一个协议端可能无法被识别。

## 不同协议端的实现

### [go-cqhttp](https://github.com/Mrs4s/go-cqhttp/blob/a5923f179b360331786a6509eb33481e775a7bd1/db/database.go#L102)

go-cqhttp 构造了 `${code}-${msgID}` 的字符串，然后对其进行 CRC32 校验，得到的值作为消息 ID。代码如下：

```go
func ToGlobalID(code int64, msgID int32) int32 {
	return int32(crc32.ChecksumIEEE([]byte(fmt.Sprintf("%d-%d", code, msgID))))
}
```

### [Lagrange.OneBot](https://github.com/LagrangeDev/Lagrange.Core/blob/0f3b9cae21321f7fd41d0346ce827d85c6c99361/Lagrange.OneBot/Database/MessageRecord.cs#L70)

Lagrange.OneBot 取 `messageUid` 和 `seq` 各自的低 16 位拼接在一起，作为消息 ID。代码如下：

```csharp
public static int CalcMessageHash(ulong msgId, uint seq)
{
    return ((ushort)seq << 16) | (ushort)msgId;
}
```

### [NapCatQQ](https://github.com/NapNeko/NapCatQQ/blob/cc30b51d58233db02b48862ecca2c1aa24ce1535/src/common/message-unique.ts#L99)

NapCatQQ 构造了 `${msgId}|${peerType}|${peerUid}` 的字符串，然后对其进行 MD5 哈希，将其第一个字节修改为 0x7f 以保证消息 ID 为正数，最后取前 4 个字节作为消息 ID。核心代码如下：

```typescript
createUniqueMsgId(peer: Peer, msgId: string) {
    const key = `${msgId}|${peer.chatType}|${peer.peerUid}`;
    const hash = crypto.createHash('md5').update(key).digest();
    if (hash[0]) {
        hash[0] &= 0x7f;
    }
    const shortId = hash.readInt32BE(0);
    return shortId;
}
```

### [LLOneBot](https://github.com/LLOneBot/LLOneBot/blob/f1af0d3a3db7031b82717ac44c892cf7656bcabe/src/main/store.ts#L64)

LLOneBot 使用了 NapCatQQ 的逻辑。

### [tanebi](https://github.com/tanebijs/tanebi/blob/98c1b36ec200fdb27a7f5d05c7adebcfaf741185/packages/app/src/storage/database/schema.ts#L4)

tanebi 完全没有计算消息 ID，而是在存储的时候设置了自增字段，将其作为消息 ID。
