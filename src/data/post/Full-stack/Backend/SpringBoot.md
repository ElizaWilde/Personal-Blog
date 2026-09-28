---
title: 'Spring Boot'

publishDate: 2026-4-23

updateDate: 2026-4-23

draft: false

excerpt: '' # 摘抄

category: 'Backend'

author: 'Eliza'

metadata: {}
---

### Spring Boot (built on Spring) — full car

- **Spring Boot is a framework — a framework built on top of the Spring framework to simplify building applications**
- Uses Spring internally, adds:
  - auto-configuration
  - embedded嵌入式 server (Tomcat) — No need to install Tomcat manually, run app → server starts automatically.
  - starter dependencies — don’t add many dependencies, just use `spring-boot-starter-web`
  - default conventions

With Spring Boot:

```jsx
@SpringBootApplication
public class App {
    public static void main(String[] args) {
        SpringApplication.run(App.class, args);
    }
}
```

Spring Boot starts everything, and you just define components.

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
   - Detect: Web app (Spring MVC)? Reactive app?
   - Prepare environment

2. Load configuration

   Spring loads:
   - `application.yml` / `application.properties`
   - environment variables
   - JVM parameters

3. Create IoC Container — this is where all Beans live
4. Component Scan (VERY IMPORTANT)

   Triggered by `@SpringBootApplication`, which includes `@ComponentScan`. Finds annotations and creates Beans for them.

5. Auto Configuration (Spring Boot magic)

   Triggered by `@EnableAutoConfiguration`. Spring Boot checks dependencies.

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

What `@SpringBootApplication` really is = `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`
