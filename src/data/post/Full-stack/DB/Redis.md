---
title: 'Redis'

publishDate: 2026-4-23

updateDate: 2026-4-23

draft: true

excerpt: '' # 摘抄

category: 'DB'

author: 'QYep'

metadata: {}
---

# 基础原理

Key-Value 模型
e.g. user:100:name → Jack

# 数据结构

- String:Redis 最基础的键值类型，适合缓存、计数器、Token 等简单值
  e.g. user:100 → '{"id":100,"name":"Jack","age":22}'
- Hash:适合存一个对象的多个字段(e.g.用户对象、配置对象)
  e.g.user:100
  ├── name → Jack
  ├── age → 22
  └── city → Shanghai
- List:有顺序的数据集合，可以从两端插入和弹出元素。可用于简单任务列表、消息序列
- Set:无序、元素不重复的集合。适合去重、标签、共同好友、集合运算
- Sorted Set / ZSet:ZSet 是带 score 的有序集合，元素唯一，并按照 score 排序(e.g.排行榜)

# 缓存Cache

## Cache Aside

- 应用写主数据源，并使对应缓存失效；读取时先查缓存，未命中后再从主数据源获取
  ```plain
  读取：
  Request
  ↓
  Redis
  /    \
  Hit   Miss
  |      |
  返回    查 DB
          ↓
      写 Redis
          ↓
          返回
  更新：
  Update Database
      ↓
  Delete Cache
  ```
- 不直接更新缓存的原因是DB和Redis是两个系统，同时更新存在一个成功一个失败的问题，不如直接删除缓存更简单。

## Cache Miss

## 缓存穿透--查不存在的数据

> 查询一个数据库里根本**不存在**的数据，导致每次 Redis 都 miss，然后请求一直打到数据库。

```plain
e.g.attack
GET /user/-1
GET /user/-2
GET /user/-3
每次：Redis miss->DB miss
```

解决办法：缓存空值、Bloom Filter、参数校验、限流

## 缓存击穿--一个热点 Key 失效

> 一个非常**热门的 Key** 突然失效，大量请求同时穿过缓存访问数据库。
> 解决办法：互斥重建、逻辑过期、提前刷新、热点预热

## 缓存雪崩--大量 Key 同时失效

> **大量 Key** 同时过期，或者 Redis 整体不可用，导致大量请求同时进入数据库。
> 解决办法：TTL 加随机值、高可用 Redis、限流、降级、缓存预热

## Hot Key

> Hot Key 是访问量远高于其他 Key 的热点数据，它可能让某个 Redis 节点或某个 Key 成为性能瓶颈。
> 解决办法：本地缓存、多级缓存、Key 拆分、请求合并、限流

## DB + Cache 一致性

# 过期淘汰

# 持久化

# 并发与分布式锁

> 分布式锁是为了保证在多个进程、多个机器、多个服务实例之间，同一时刻只有一个执行者能进入临界区。
> `plain

    Service A ─┐
    Service B ─┼─> 抢同一把 Redis 锁，谁抢到锁谁执行
    Service C ─┘
    `

# 高可用

## Replication

## Sentinel

## Cluster

# 工程场景

## 1. Cache

## 2. Distributed Lock

## 3. Idempotency

## 4. Rate Limiting

## 5. Counter

## 6. Real-time Statistics

---
