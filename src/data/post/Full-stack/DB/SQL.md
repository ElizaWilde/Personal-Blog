---
title: 'SQL'

publishDate: 2026-4-23

updateDate: 2026-4-23

draft: false

excerpt: '' # 摘抄

category: 'DB'

author: 'Eliza'

metadata: {}
---

# 基础 SQL

WHERE→ 分组前过滤
HAVING→ GROUP BY 后过滤

INNER JOIN→ 只保留两边匹配的数据
LEFT JOIN→ 左表全部保留，右表没有则 NULL

# 索引

> 索引是数据库为了加快查询而维护的一种额外数据结构，本质上是用额外空间和写入维护成本，换取更快的读取。

```SQL
CREATE INDEX idx_users_email
ON users(email);
```

- 索引不是越多越好：当有过多索引时，INSERT / UPDATE / DELETE需要额外维护索引

## B+ Tree--DB索引结构

> B+ Tree 是一种多路平衡搜索树，树高较低、数据有序，适合**范围扫描**
> B+ Tree一个节点可以放多个key

## 主键索引

## 二级索引

## 联合索引

> 联合索引就是一个索引同时包含多个字段，并按照定义时的字段顺序组织，遵循最左前缀原则。

```sql
CREATE INDEX idx_order
ON orders(user_id, status, created_at);
```

- 最左前缀:查询从最左边的字段开始，因为索引首先按照最左列建立有序关系。
  - error:没有最左列就绝对不会使用索引。
  - 不能按照联合索引最左前缀进行高效定位，实际执行方式仍要看优化器和 EXPLAIN。

## 回表

> 先通过二级索引找到**主键**，再通过主键索引获取完整行数据，这个第二次查找过程就是回表。

## 覆盖索引

> 如果查询需要的所有字段都能直接从某个索引中拿到，就不需要回表，这叫覆盖索引。

```sql
//例如
CREATE INDEX idx_name_age
ON users(name, age);

//查询的字段已经包含在索引里，那么根据索引直接返回
SELECT name, age
FROM users
WHERE name = 'Tom';

```

## 索引失效/低效

## EXPLAIN

> EXPLAIN 用来查看数据库准备如何执行一条 SQL，是分析**慢 SQL 和索引使用情况**的重要**工具**

```sql
//例如
EXPLAIN
SELECT *
FROM users
WHERE email = 'a@test.com';
// 通过EXPALIN 看扫描范围->看索引->看 JOIN->看访问方式、排序成本...再决定如何优化
```

# 事务

> 事务把多个数据库操作作为一个逻辑整体执行，要么全部成功，要么失败时一起回滚。

## ACID

- A(Atomicity 原子性):事务中的操作要么全部成功，要么全部失败。
- C(Consistency 一致性):事务执行前后，数据库都应该满足业务和数据完整性约束。
- I(Isolation 隔离性):多个事务并发执行时，应根据隔离级别控制彼此影响。
- D(Durability 持久性):一旦事务成功提交，在数据库承诺的持久性范围内，即使系统故障，结果也应该能够恢复。

## 隔离级别

常见四种(隔离能力&并发限制和成本：低 ----------------→ 高)

- Read Uncommitted：可以读到其他事务还没提交的数据

  ```plain
  e.g. 事务 B 最后回滚了，但事务 A 已经读到了 0 --脏读
  事务 A                      事务 B

                              UPDATE balance = 0

  SELECT balance
  读到 0

                              ROLLBACK
  ```

- Read Committed(PostgreSQL默认)：一个事务只能读取其他事务已经提交的数据

  ```plain
  e.g.不可重复读 Non-repeatable Read
  事务 A                      事务 B

  SELECT balance
  → 100

                              UPDATE balance = 200
                              COMMIT

  SELECT balance
  → 200
  ```

- Repeatable Read(MySQL InnoDB默认)：同一个事务里，多次读取结果保持一致

  ```plain
  e.g.可重复读
  事务 A                      事务 B

  SELECT balance
  → 100

                              UPDATE balance = 200
                              COMMIT

  SELECT balance
  → 100
  ```

- Serializable：事务之间尽量按照串行方式执行

| 隔离级别 | 脏读 | 不可重复读 | 幻读 | 并发能力 |
| Read Uncommitted | 可能 | 可能 | 可能 | 最高 |
| Read Committed | 不会 | 可能 | 可能 | 较高 |
| Repeatable Read | 不会 | 不会 | 视数据库实现而定 | 中等 |
| Serializable | 不会 | 不会 | 不会 | 最低 |

## 脏读

> 一个事务读到了另一个事务还没有提交的数据

## 不可重复读

> 同一个事务中，对同一行数据读取两次，结果不同

## 幻读

> 同一个事务中，用相同条件查询两次，结果集中的记录数量或集合发生变化。

## Commit / Rollback

## 事务边界

# 锁与并发

## 行锁

## 表锁

## 共享锁 / 排他锁

## 悲观锁

## 乐观锁

## 死锁

> 两个或多个事务互相等待对方持有的资源，形成循环等待。

- 怎么减少？
  1. 统一加锁顺序：例如永远先锁 ID 小的，再锁 ID 大的
  2. 缩短事务
  3. 减少锁范围
  4. 避免长时间持锁
  5. 死锁失败后合理重试

## 锁顺序

# MVCC

# SQL 性能优化

## EXPLAIN

## 索引

## 扫描行数

## JOIN

## ORDER BY

## GROUP BY

## N+1

## 大分页

## 锁等待

## DB 连接池

# 工程实践

## 基础原理

## 数据结构

## 缓存Cache

### Cache Aside

### Cache Miss

### TTL

### 缓存穿透

### 缓存击穿

### 缓存雪崩

### Hot Key

### DB + Cache 一致性

## 过期淘汰

## 持久化

## 并发与分布式锁

## 高可用

### Replication

### Sentinel

### Cluster

## 工程场景

---
