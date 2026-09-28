---
title: 'Spring'

publishDate: 2026-4-23

updateDate: 2026-4-23

draft: false

excerpt: '' # 摘抄

category: 'Backend'

author: 'Eliza'

metadata: {}
---

> framework design concepts (Spring concepts)
>
> - **Inversion of Control (IoC)控制反转—Control of object creation is given to the framework (Spring)**
> - **Dependency Injection (DI)依赖注入—A way to implement IoC**
> - **AOP(Aspect-Oriented Programming)面向切片—Add extra behavior (like logging, transactions) without changing business code**
> - in Spring projects, you always see them together:
>   ```jsx
>   @Service           // Bean (IoC) → manage objects
>   @Autowired        // DI → inject dependencies
>   @Transactional    // AOP → enhance behavior
>   ```

### what is a framework

- A framework is: A reusable structure that controls how your application runs
  - you write business code, framework controls execution.
- This is called **Inversion of Control (IoC)**
- Without framework:
  ```jsx
  public static void main(String[] args) {
      // you create everything manually
  }
  ```

### Spring — engine

- **Spring = a large Java framework that provides core infrastructure for building applications**
- It gives you fundamental capabilities:
  - **IoC container (Bean management)**
  - **DI (dependency injection)**
  - **AOP (transactions, logging, etc.)**
  - **Spring MVC (web framework)**
  - **data access support (JDBC, ORM integration)**
- But:
  - Configuration is complex
  - Need XML or lots of setup
