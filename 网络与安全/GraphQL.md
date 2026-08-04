# GraphQL

## 核心概念

- **是什么**：Facebook 开源的 API 查询语言，客户端精确指定字段，服务端返回恰好那么多。解决 REST 的 over-fetching / under-fetching。
- **三种操作**：Query（读，字段并行执行）、Mutation（写，字段串行执行）、Subscription（实时推送，WebSocket/SSE）。
- **强类型 Schema**：前后端共享的契约，所有查询参数和返回值都有类型约束。

```graphql
# 基本语法
query GetUser($id: ID!) {
  user(id: $id) {
    name
    posts(limit: 5) { title }   # 一次请求拿多层嵌套数据
  }
}
```

| 语法要素 | 用途 |
|---|---|
| 变量 `$id: ID!` | 参数化查询，客户端以 JSON 附带 |
| 别名 `admin: user(id: "1")` | 同一字段查多次 |
| Fragment `...UserFields` | 复用字段组；Apollo 中用于协同缓存更新 |
| `@include(if: $x)` / `@skip(if: $x)` | 条件包含/跳过字段 |
| 内联 Fragment `... on User { name }` | 联合类型/接口按类型取字段 |

---

## Apollo Client 核心 API

```typescript
// Query
const { loading, error, data, refetch } = useQuery(GET_USER, {
  variables: { id },
  fetchPolicy: 'cache-first',  // 六种策略，见下表
});

// Mutation
const [createUser, { loading }] = useMutation(CREATE_USER, {
  refetchQueries: ['GetUsers'],   // 方式1：自动重查
  update(cache, { data }) {       // 方式2：手动写缓存（更精细）
    cache.modify({ fields: { users: (...) => [...] } });
  },
});

// Subscription
const { data } = useSubscription(ON_MESSAGE, { variables: { roomId } });
```

### fetchPolicy 六种策略（必背）

| 策略 | 行为 |
|---|---|
| `cache-first` | 默认。有缓存用缓存，不发请求。 |
| `cache-only` | 只读缓存，不发请求。 |
| `cache-and-network` | 先返回缓存，同时发请求刷新（快速展示 + 后台更新）。 |
| `network-only` | 始终发请求，结果写入缓存。 |
| `no-cache` | 发请求，不写缓存。 |
| `standby` | 不主动请求，仅手动 refetch。 |

---

## 缓存（重点）

### key 生成规则

默认 `${__typename}:${id}`，如 `User:1`。同名同 id 的多个查询结果会被自动合并（规范化 Normalization）。

```typescript
// 自定义 key（当 id 字段不叫 id 时）
typePolicies: {
  User: { keyFields: ['userId'] },
}
```

### 手动操作缓存

```typescript
cache.writeFragment({ id: 'User:1', fragment: ..., data: { name: '新名' } });
cache.readFragment({ id: 'User:1', fragment: ... });
cache.modify({ id: 'User:1', fields: { likes: (n = 0) => n + 1 } }); // 修改
cache.evict({ id: 'User:1' });  // 清除
```

### typePolicies 分页合并

```typescript
fields: {
  users: {
    merge(existing = [], incoming, { args }) {
      return args?.offset ? [...existing, ...incoming] : incoming;
    },
  },
}
```

---

## Optimistic UI（乐观更新）

先更新 UI，再等服务端确认，失败自动回滚：

```typescript
const [addTodo] = useMutation(ADD_TODO, {
  optimisticResponse: {
    addTodo: { __typename: 'Todo', id: 'temp-xxx', text: '新待办', completed: false },
  },
  update(cache, { data }) { /* 写入真实数据，替换临时 ID */ },
});
// 成功 → update 覆盖临时数据；失败 → 自动回滚
```

---

## 错误处理

- GraphQL 始终返回 HTTP 200，错误在 `errors` 数组，非抛出异常。
- 前端区分 `error.graphQLErrors`（业务错误）和 `error.networkError`（网络故障）。
- `extensions.code` 用于结构化错误分类（NOT_FOUND / UNAUTHORIZED / FORBIDDEN）。
- 用 Apollo Link 的 `onError` 做统一拦截（如 401 跳转登录）。

---

## Fragment 协同定位（Colocation）

每个组件声明自己的 Fragment，父组件组合。好处：组件与数据需求内聚，删组件即知要删哪些字段；GraphQL Codegen 为每个 Fragment 生成对应 TS 类型。

```typescript
// PostTitle.tsx
PostTitle.fragments = { post: gql`fragment PostTitle on Post { id title }` };

// PostPage.tsx 父组件组合
const QUERY = gql`query PostPage($id: ID!) {
  post(id: $id) { ...PostTitle ...PostAuthor }
} ${PostTitle.fragments.post} ${PostAuthor.fragments.post}`;
```

---

## GraphQL Codegen

Schema + Query/Fragment → 自动生成 TS 类型 + 类型安全的 Hooks。前端无需手动维护接口类型。

---

## 常见坑

1. **data 初始为 undefined** → 用 `data?.user?.name` 安全访问
2. **缓存 key 不匹配** → id 不叫 `id` 时需自定义 `keyFields`
3. **Mutation 后列表不更新** → refetchQueries / update / cache.evict 三种解法
4. **文件上传** → GraphQL 不原生支持，需 `graphql-upload` 或 REST 端点
5. **深层嵌套被拒** → 后端通常有查询深度限制

---

## 面试速查表

| # | 题目 | 答案要点 |
|---|---|---|
| 1 | GraphQL 解决什么？ | over-fetching / under-fetching，客户端精确控制字段 |
| 2 | Query/Mutation/Subscription 区别？ | 读（并行）/写（串行）/实时推送 |
| 3 | Fragment 有什么用？ | 复用字段；Apollo 协同缓存更新 |
| 4 | fetchPolicy 有哪些？ | cache-first / cache-and-network / network-only / no-cache / cache-only / standby |
| 5 | 缓存 key 怎么生成？ | `${__typename}:${id}`，可自定义 keyFields |
| 6 | Mutation 后怎么更新列表？ | refetchQueries / update 手动写缓存 / cache.evict |
| 7 | Optimistic UI 怎么实现？ | optimisticResponse → 请求 → 成功覆盖 / 失败回滚 |
| 8 | 错误怎么处理？ | HTTP 200 + errors 数组；graphQLErrors / networkError 区分 |
| 9 | Colocation 是什么？ | 组件声明 Fragment，父组件组合；组件与数据需求内聚 |
| 10 | Codegen 的价值？ | Schema → TS 类型 + 类型安全 Hooks 自动生成 |
| 11 | N+1 问题是什么？ | 查 N 个用户 + N 次各自查文章；后端 DataLoader 合并批处理（概念了解） |
