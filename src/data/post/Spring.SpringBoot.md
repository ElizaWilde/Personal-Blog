---
title: 'Spring /SpringBoot'

publishDate: 2026-4-23

updateDate: 2026-4-23

draft: false

excerpt: '' # 摘抄

category: 'Backend'

author: 'QYep'

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

- A framework is : A reusable structure that controls how your application runs
  - you write business code,framework controls execution.
- This is called **Inversion of Control (IoC)**
- Without framework:
  ```jsx
  public static void main(String[] args) {
      // you create everything manually
  }
  ```
- With Spring Boot:

  ```jsx
  @SpringBootApplication
  public class App {
      public static void main(String[] args) {
          SpringApplication.run(App.class, args);
      }
  }
  ```

  - now : Spring Boot starts everything, you just define components.

### Spring — engine

- **Spring = a large Java framework that provides core infrastructure for building applications**
- It gives you fundamental capabilities :
  - **IoC container (Bean management)**
  - **DI (dependency injection)**
  - **AOP (transactions, logging, etc.)**
  - **Spring MVC (web framework)**
  - **data access support (JDBC, ORM integration)**
- But:
  - Configuration is complex
  - Need XML or lots of setup

### SpringBoot (built on Spring) — full car

- **Spring Boot is a framework — a framework built on top of the Spring framework to simplify building applications**
- Uses Spring internally, adds:
  - auto-configuration
  - embedded嵌入式 server (Tomcat) — No need to install Tomcat manually, run app → server starts automatically.
  - starter dependencies — don’t add many dependencies, just use `spring-boot-starter-web`
  - default conventions

### How Spring Boot starts internally

when you run:

```jsx
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```

This single line triggers a **full startup pipeline**.

1. Create Spring Application

   ```jsx
   SpringApplication.run(App.class, args);
   ```

   - Create a `SpringApplication` object
   - Detect:Web app(Spring MVC)? Reactive app?
   - Prepare environment

2. Load configuration

   Spring loads:
   - `application.yml` / `application.properties`
   - environment variables
   - JVM parameters

3. Create IOC Container — this is where all Beans live
4. Component Scan (VERY IMPORTANT)

   Triggered by `@SpringBootApplication` ,which includes `@ComponentScan`Finds annocations ,creates Beans for them

5. Auto Configuration (Spring Boot magic)

   Triggered by `@EnableAutoConfiguration` Spring Boot checks dependencies

6. Bean Creation & Injection

   Spring:
   1. Creates objects
   2. Injects dependencies (`@Autowired`)
   3. Applies AOP (transaction, async, etc.)

7. Start Embedded Server

   Spring Boot starts:
   - Tomcat (default)

   Now your app is listening on:

   ```
   http://localhost:8080
   ```

What `@SpringBootApplication` really is = @Configuration + @EnableAutoConfiguration+ @ComponentScan

---
