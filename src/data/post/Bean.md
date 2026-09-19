---
title: 'Bean'

publishDate: 2026-4-23

updateDate: 2026-4-23

draft: false

excerpt: '' # 摘抄

category: 'Backend'

author: 'QYep'

metadata: {}
---

- **Bean 本质就是“被 Spring 容器(IOC container)管理的对象”。** Bean = 普通 Java 对象 + 交给 Spring 管理生命周期和依赖关系
- Spring creates it, manages it, injects it where needed

```jsx
//Spring 自动把 UserService 注入进来,不需要手动传参或 new
@Service
public class OrderService {
    @Autowired
    private UserService userService;
	}
```

### IOC(Spring Container)—called Bean

- The container is like a **factory + warehouse of objects**.
- Spring scans your code, Finds classes with annotations, Creates objects, Stores them in a map (Bean container)
  ```jsx
  Example internal structure:
  BeanContainer:
  "couponService" -> CouponService instance
  "orderService"  -> OrderService instance
  ```

### How a Bean is created

1. Annotation-based (most common)

Spring scans and registers them as Beans.

```jsx
@Service
@Component
@Controller
@Repository
```

2. Configuration class

Manually define the Bean.

```jsx
@Configuration
public class AppConfig {
	@Bean
	public CouponService couponService() {
	    return new CouponService();
	}
}
```

3.Third-party libraries

Spring Boot auto-config creates Beans for you:

- DataSource
- RedisTemplate
- KafkaTemplate

### What Bean really gives you (core value)

1. Dependency Injection (DI)

Instead of:

```jsx
CouponService service = new CouponService();
```

You write:

```jsx
@Autowired
private CouponService service;
```

Spring injects dependencies automatically.

2. Loose coupling

```jsx
@Autowired
private PaymentService paymentService;
```

You don’t care which implementation is used.

3. Lifecycle management

full lifecycle:

1. Bean definition loaded
2. Bean instantiated实例化 (new)
3. Dependency injection
4. Initialization (@PostConstruct)
5. Ready for use
6. Destroy (@PreDestroy)

7. AOP support (very important)

Because Spring controls Beans, it can add:

- transactions (`@Transactional`)
- logging
- security

Without Beans → these don’t work

### Bean Scope

1. Default is **singleton**

   ```
   @Service
   ```

   - only ONE instance in the container
   - shared everywhere

2. Prototype

   ```
   	@Scope("prototype")
   ```

   - new object every time you request

3. Other scopes (web)
   - request
   - session

### Bean Injection methods

1. Field字段 injection

   ```jsx
   @Autowired
   private CouponService service;
   ```

2. Constructor injection (recommended in real projects)—easier testing, immutable

   ```jsx
   private final CouponService service;
   public OrderService(CouponService service) {
   this.service = service;
   }
   ```

3. Setter injection (rare)

---
