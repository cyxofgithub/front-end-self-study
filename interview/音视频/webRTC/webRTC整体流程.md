## WebRTC 核心原理（面试高频）

### 整体流程

```mermaid
sequenceDiagram
    participant A as 发起方 (Peer A)
    participant S as 信令服务器 (Signaling Server)
    participant B as 接收方 (Peer B)

    Note over A,B: 阶段1：初始化与本地媒体采集
    A->>A: 1. getUserMedia 获取本地音视频流 (MediaStream)
    A->>A: 2. 创建 RTCPeerConnection 实例
    B->>B: 1. getUserMedia 获取本地音视频流 (MediaStream)
    B->>B: 2. 创建 RTCPeerConnection 实例

    Note over A,B: 阶段2：交换SDP（会话描述）
    A->>A: 3. createOffer() 生成 SDP Offer
    A->>A: 4. setLocalDescription(offer) 保存本地描述
    A->>S: 5. 发送 Offer 到信令服务器
    S->>B: 6. 转发 Offer 给 Peer B
    B->>B: 7. setRemoteDescription(offer) 保存A的描述
    B->>B: 8. createAnswer() 生成 SDP Answer
    B->>B: 9. setLocalDescription(answer) 保存本地描述
    B->>S: 10. 发送 Answer 到信令服务器
    S->>A: 11. 转发 Answer 给 Peer A
    A->>A: 12. setRemoteDescription(answer) 保存B的描述

    Note over A,B: 阶段3：交换ICE候选（网络地址）
    A->>A: 13. 触发 icecandidate 事件，收集ICE候选
    A->>S: 14. 发送ICE候选到信令服务器
    S->>B: 15. 转发ICE候选给 Peer B
    B->>B: 16. addIceCandidate() 添加A的ICE候选

    B->>B: 17. 触发 icecandidate 事件，收集ICE候选
    B->>S: 18. 发送ICE候选到信令服务器
    S->>A: 19. 转发ICE候选给 Peer A
    A->>A: 20. addIceCandidate() 添加B的ICE候选

    Note over A,B: 阶段4：建立端到端连接，传输音视频
    A->>B: 21. RTCPeerConnection 尝试直连（基于ICE候选）
    B->>A: 22. 直连成功，双向传输音视频流
    A->>A: 23. ontrack 事件渲染B的音视频
    B->>B: 24. ontrack 事件渲染A的音视频
```

### 各个流程的作用

| 阶段序号 | 阶段名称                  | 核心目标                                                               | 解决的核心问题       | 关键操作/API                                                                                                                                          | 涉及核心组件/服务                                         | 阶段核心价值                                                                                    |
| -------- | ------------------------- | ---------------------------------------------------------------------- | -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| 1        | 初始化与本地媒体采集      | 准备本地音视频数据源，创建端到端连接的核心处理载体，为后续连接打基础   | 有什么可传、用什么传 | 1. `getUserMedia` 获取 MediaStream<br>2. 创建 RTCPeerConnection 实例（配置 STUN/TURN）<br>3. `addTrack` 将媒体流添加到连接实例                        | MediaStream、RTCPeerConnection、STUN/TURN 服务器          | 完成通话的基础资源准备，确定音视频数据源和全流程的传输处理总控中心                              |
| 2        | 交换 SDP（会话描述）      | 让通话双方交换媒体能力配置，达成**通信格式共识**                       | 按什么格式传         | 发起方：`createOffer`、`setLocalDescription`<br>接收方：`setRemoteDescription`、`createAnswer`、`setLocalDescription`<br>双方：通过信令服务器转发 SDP | RTCPeerConnection、信令服务器、SDP 协议                   | 统一音视频编码/传输标准，避免“格式不兼容导致数据无法解码”，实现通信的“语言共识”                 |
| 3        | 交换 ICE 候选（网络地址） | 让双方获取彼此可用网络地址，完成 NAT 穿透，找到最优端到端连接路径      | 往哪个地址传         | 1. 触发`icecandidate`事件收集 ICE 候选<br>2. 信令服务器转发 ICE 候选<br>3. `addIceCandidate` 添加对方候选地址                                         | RTCPeerConnection、信令服务器、ICE 协议、STUN/TURN 服务器 | 解决内网 NAT 遮挡问题，获取彼此“可达网络门牌号”，为端到端直连提供地址基础，优先直连、失败则中继 |
| 4        | 建立端到端连接+音视频传输 | 完成最终连接建立，实现音视频数据**双向实时端到端传输**，渲染远端音视频 | 怎么实时传音视频     | 1. RTCPeerConnection 自动尝试 ICE 候选地址配对直连<br>2. 触发`ontrack`事件获取远端流<br>3. 绑定流到 video/audio 标签渲染                              | RTCPeerConnection、RTCDataChannel（可选，传非音视频数据） | 落地真正的实时音视频通话，前三个阶段的所有准备工作最终服务于该阶段；支持拓展非音视频数据传输    |

### candidate 收集流程

**候选地址收集：**

-   Host Candidate：本机内网 IP + 端口（优先尝试，同内网可直连）；
-   Server Reflexive：STUN 服务器返回的 NAT 公网映射地址（跨 NAT 时尝试）；
-   Relayed：TURN 服务器分配的中继地址（前两种失败时兜底）

```mermaid
graph TD
    A["1. 初始化WebRTC PeerConnection"] --> B["2. 配置ICE服务器(STUN/TURN)"]
    B --> C["3. 本地ICE代理开始收集候选地址"]

    %% 收集候选地址分支
    C --> C1["3.1 收集主机地址(Host Candidate)：本机内网IP+端口"]
    C --> C2["3.2 收集服务器反射地址(Server Reflexive)：通过STUN获取公网映射地址"]
    C --> C3["3.3 收集中继地址(Relayed)：通过TURN服务器分配的中继地址(备用)"]

    %% SDP交换
    C1 & C2 & C3 --> D["4. 生成包含所有候选地址的本地SDP"]
    D --> E["5. 通过信令服务器(如WebSocket)交换SDP：本地SDP发送给远端，接收远端SDP"]

    %% 连通性检查
    E --> F["6. ICE代理开始连通性检查(ICE Checking)"]
    F --> F1["6.1 优先尝试Host Candidate直连(同内网)"]
    F1 --> G{6.2 直连是否成功?}

    %% 分支1：直连成功
    G -->|是| H["7.1 选择最优直连候选对，完成NAT穿透"]
    H --> I["8. 建立P2P媒体通道，开始音视频传输"]

    %% 分支2：直连失败，尝试STUN反射地址
    G -->|否| J["7.2 尝试Server Reflexive Candidate(NAT映射公网地址)"]
    J --> K{7.3 反射地址连通?}

    %% 分支3：反射地址成功
    K -->|是| H

    %% 分支4：反射地址失败，降级到TURN中继
    K -->|否| L["7.4 启用Relayed Candidate，通过TURN服务器中继传输"]
    L --> I

    %% 最终状态
    I --> M["9. 维护ICE连接(网络变化时重新选路)"]
```

### stun 识别 nat 类型机制

```mermaid
graph LR
    A[第一步：基础探测] -->|终端→STUN-S1，获取映射地址M1| B[第二步：改变目标IP探测]
    B[终端→STUN-S2，获取映射地址M2] --> C{M1=M2?}
    C -->|是→非对称型NAT| D[第三步：改变目标端口探测]
    C -->|否→对称型NAT| E[识别完成：Symmetric NAT]
    D[终端→STUN-S1:3479，获取映射地址M3] --> F{M1=M3?}
    F -->|是→全锥型| G[识别完成：Full Cone]
    F -->|否| H[反向探测：STUN用不同端口发回包]
    H --> I{包是否能到达终端?}
    I -->|是→地址受限| J[识别完成：Address-Restricted]
    I -->|否→端口受限| K[识别完成：Port-Restricted]
```

### 不同 NAT 类型的差异

| **NAT 类型**                       | 核心映射规则（内网 → 公网）                              | 核心过滤规则（公网 → 内网）                                        | STUN 地址提取 | 映射地址复用性 | WebRTC STUN 穿透可行性 | 适用场景            | 关键特点                      |
| ---------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------ | ------------- | -------------- | ---------------------- | ------------------- | ----------------------------- |
| 全锥型（Full Cone）                | 访问**任意公网目标**，复用**同一个固定公网映射端口**     | 任意公网 IP:端口向映射端口发包，均转发至内网终端                   | ✅ 有效       | ✅ 永久复用    | ✅ 完全可行            | 早期路由器/小众场景 | 最宽松，穿透无任何限制        |
| 地址受限锥型（Address-Restricted） | 访问**任意公网目标**，复用**同一个固定公网映射端口**     | 仅**终端曾访问过的公网 IP**（不限端口）发包，才转发至内网终端      | ✅ 有效       | ✅ 永久复用    | ✅ 可行（需先建联）    | 部分企业路由器      | 仅限制 IP，端口无约束         |
| 端口受限锥型（Port-Restricted）    | 访问**任意公网目标**，复用**同一个固定公网映射端口**     | 仅**终端曾访问过的公网 IP:端口**发包，才转发至内网终端             | ✅ 有效       | ✅ 永久复用    | ✅ 可行（需先建联）    | **家用路由器主流**  | IP+端口双限制，最常见         |
| 对称型（Symmetric）                | 访问**不同公网 IP:端口**，分配**不同的专属公网映射端口** | 仅**终端曾访问过的公网 IP:端口**，向**对应专属映射端口**发包才转发 | ✅ 有效       | ❌ 无复用性    | ❌ 完全不可行          | **运营商/企业主流** | 最严格，STUN 仅能识别无法穿透 |
