import{_ as o,c as d,o as c,ae as a}from"./chunks/framework.Dh1jimFm.js";const _=JSON.parse('{"title":"API","description":"","frontmatter":{},"headers":[],"relativePath":"api/index.md","filePath":"api/index.md"}'),t={name:"api/index.md"};function s(r,e,i,n,l,u){return c(),d("div",null,e[0]||(e[0]=[a('<h1 id="api" tabindex="-1">API <a class="header-anchor" href="#api" aria-label="Permalink to &quot;API&quot;">​</a></h1><p>API 是 OneBot 向用户提供的操作接口，用户可通过 HTTP 请求或 WebSocket 消息等方式调用 API。API 调用需要指定 action（要进行的动作）名称和动作所需的参数，协议端在执行相应的操作后按照一定格式返回执行结果。</p><h2 id="参数" tabindex="-1">参数 <a class="header-anchor" href="#参数" aria-label="Permalink to &quot;参数&quot;">​</a></h2><p>参数的传入遵循键-值对的形式，参数值可以是基本数据类型（如字符串、数字、布尔值等），也可以是复杂数据类型（如数组、对象等）；而参数的传入方式也分 urlencoded 和 JSON 两种格式。</p><p>对于不同的数据类型和传入方式，协议端需要进行相应的解析和处理。特别是对于 <strong>urlencoded 格式</strong>的传入数据，由于 urlencoded 只支持字符串一种类型，但 API 接收的基本数据类型却有很多种，因此协议端需要将字符串解析为对应的基本数据类型，例如，当 action 接受数字类型时，需要将字符串解析为数字再传入。此外，urlencoded 是平面化的，无法传递嵌套的对象和数组，因此对于需要接收复杂数据类型的 API，urlencoded 无能为力，只能使用 JSON 格式传递参数。</p><p>此外，OneBot 11 标准对于布尔值的规定也不清晰。我们可以看到，在<a href="https://github.com/botuniverse/onebot-11/blob/master/api/public.md" target="_blank" rel="noreferrer">公开 API 页面</a>，布尔值是用 <code>true</code> 和 <code>false</code> 来表示的；而在<a href="https://github.com/botuniverse/onebot-11/blob/master/message/segment.md" target="_blank" rel="noreferrer">消息段类型页面</a>，则用 <code>0</code> 和 <code>1</code> 来表示布尔值。</p><details class="details custom-block"><summary>最佳实践</summary><p>基于此，笔者建议协议端实现者同时接受 <code>true</code> 和 <code>false</code> 以及 <code>0</code> 和 <code>1</code> 以及对应的字符串字面量 <code>&quot;true&quot;</code> <code>&quot;false</code> <code>&quot;0&quot;</code> <code>&quot;1&quot;</code> 来表示布尔值，以提高兼容性。</p></details><h2 id="响应" tabindex="-1">响应 <a class="header-anchor" href="#响应" aria-label="Permalink to &quot;响应&quot;">​</a></h2><p>响应以 JSON 格式返回，包含的字段如下：</p><ul><li><code>status</code> (string)：表示处理状态，可能值： <ul><li><code>ok</code>：表示处理成功；</li><li><code>failed</code>：表示处理失败；</li><li><code>async</code>：表示请求被异步处理，无法获知处理结果。</li></ul></li><li><code>retcode</code> (number)：简要的状态码，可能值： <ul><li><code>0</code>：表示处理成功，只会在 <code>status</code> 为 <code>ok</code> 时返回；</li><li><code>1</code>：表示异步处理，只会在 <code>status</code> 为 <code>async</code> 时返回；</li><li>其余值：表示处理失败，只会在 <code>status</code> 为 <code>failed</code> 时返回，含义由协议端实现者自行定义。</li></ul></li><li><code>data</code> (object)：处理结果，只会在 <code>status</code> 为 <code>ok</code> 时返回。</li><li><code>message</code> (string)：错误信息，只会在 <code>status</code> 为 <code>failed</code> 时返回。</li></ul><p>OneBot 11 建议 <code>message</code> 字段只包含有关错误的简要信息，具体错误信息应当查阅日志。而 go-cqhttp 则额外包含 <code>wording</code> 字段，内容是用中文描述的详细错误信息。</p><details class="details custom-block"><summary>夹私货</summary><p>笔者建议协议端实现者在 <code>message</code> 字段中包含简要的错误信息，并同时在日志和 <code>wording</code> 字段中包含详细的错误信息，以便用户调试。</p></details><h2 id="异步调用" tabindex="-1">异步调用 <a class="header-anchor" href="#异步调用" aria-label="Permalink to &quot;异步调用&quot;">​</a></h2><p>OneBot 11 规定，所有 API 都可以通过给 action 附加后缀 <code>_async</code> 来进行异步调用，例如 <code>send_private_msg_async</code>、<code>send_msg_async</code>、<code>clean_data_dir_async</code>。</p><p>异步调用的响应中，<code>status</code> 字段为 <code>async</code>。</p><p>需要注意的是，虽然说以 <code>get_</code> 开头的那些接口也可以进行异步调用，但实际上客户端没有办法得知最终的调用结果，所以对这部分接口进行异步调用是没有意义的；另外，有一些接口本身就是异步执行的（返回的 <code>status</code> 为 <code>async</code>），此时使用 <code>_async</code> 后缀来调用不会产生本质上的区别。</p><p><strong>实际上，现在很少有协议端实现支持异步调用。</strong> 例如，Lagrange.OneBot 和 NapCatQQ 都不支持异步调用，对于这些协议端实现来说，使用后缀 <code>_async</code> 调用 API 会导致 404 错误。</p><h2 id="限速调用" tabindex="-1">限速调用 <a class="header-anchor" href="#限速调用" aria-label="Permalink to &quot;限速调用&quot;">​</a></h2><p>所有 API 都可以通过给 action 附加后缀 <code>_rate_limited</code> 来进行限速调用，例如 <code>send_private_msg_rate_limited</code>、<code>send_msg_rate_limited</code>，不过主要还是用在发送消息接口上，以避免消息频率过快导致腾讯封号。所有限速调用将会以指定速度<strong>排队执行</strong>，这个速度可在配置中指定。</p><p>限速调用的响应中，<code>status</code> 字段为 <code>async</code>。</p><p><strong>实际上，现在很少有协议端实现支持限速调用。</strong> 例如，Lagrange.OneBot 和 NapCatQQ 都不支持限速调用，对于这些协议端实现来说，使用后缀 <code>_rate_limited</code> 调用 API 会导致 404 错误。</p>',21)]))}const m=o(t,[["render",s]]);export{_ as __pageData,m as default};
