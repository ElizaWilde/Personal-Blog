---
title: 'Annotations'

publishDate: 2026-4-23

updateDate: 2026-4-23

draft: false

excerpt: '' # 摘抄

category: 'Backend'

author: 'QYep'

metadata: {}
---

In Java backend, most annotations belong to one of these groups:

## 1. Web Layer (API entry)

These annotations define **how requests enter your system**.

## `@RestController`

```java
@RestController = @Controller + @ResponseBody
```

- Marks this class as a **web API controller**
- All methods return **JSON directly**, not HTML

**Example**

```java
@RestController
@RequestMapping("/coupon")
public class CouponController {

    @GetMapping("/{id}")
    public Coupon getCoupon(@PathVariable Long id) {
        return couponService.getById(id);
    }
}
```

**Runtime behavior**

1. HTTP request → Spring DispatcherServlet
2. Finds this controller
3. Executes method
4. Automatically converts return value → JSON

**Common bug**

- Forget `@RestController` → returns view instead of JSON

---

## `@RequestMapping`

**Defines base URL path**

```java
@RequestMapping("/coupon")
```

All methods inside become:

```
/coupon/xxx
```

Can also define method type:

```java
@RequestMapping(value = "/test", method = RequestMethod.GET)
```

But usually replaced by `@GetMapping`, `@PostMapping`.

---

## `@GetMapping` / `@PostMapping`

Shortcut annotations:

```java
@GetMapping("/list")
@PostMapping("/create")
```

**Meaning**

- GET → query data
- POST → create/change data

**Real flow**

```java
@PostMapping("/claim")
public void claim(@RequestBody ClaimRequest req) {
    couponService.claim(req);
}
```

---

## `@RequestBody`

**Convert JSON → Java object**

Frontend sends:

```json
{
  "userId": 1,
  "campaignId": 100
}
```

Backend:

```java
public void claim(@RequestBody ClaimRequest req)
```

Spring automatically:

- parse JSON
- map fields → object

**Common bug**

- field name mismatch → null value
- missing setter/getter

---

## `@PathVariable`

Used for URL path parameters:

```java
@GetMapping("/coupon/{id}")
public Coupon get(@PathVariable Long id)
```

Request:

```
GET /coupon/10
```

→ id = 10

**Common bug**

- name mismatch:

```java
@GetMapping("/coupon/{id}")
public Coupon get(@PathVariable("couponId") Long id) // wrong
```

## 2. Service / Bean Management (Spring IOC core)

Spring manages objects for you.

## `@Component`

Basic annotation:

```java
@Component
public class MyUtil {}
```

→ Spring creates this object automatically.

---

## `@Service`

Same as `@Component`, but **semantic meaning**:

```java
@Service
public class CouponService {}
```

Meaning:

- this class contains business logic

---

## `@Autowired`

**Inject dependency automatically**

```java
@Autowired
private CouponService couponService;
```

Spring:

- finds matching bean
- injects it

---

## `@Resource`

Similar to `@Autowired`, but different rule:

```java
@Resource
private CouponService couponService;
```

**Difference**

| Annotation   | Match rule    |
| ------------ | ------------- |
| `@Autowired` | by type       |
| `@Resource`  | by name first |

**Real bug**

If multiple beans exist:

```java
@Autowired // may fail
@Resource  // works if name matches
```

## 3. Transaction

## `@Transactional`

This is **very important for business correctness**

```java
@Transactional
public void claimCoupon() {
    deductStock();
    insertUserCoupon();
}
```

**Meaning**

- All DB operations = one unit
- If one fails → all rollback

---

### Example problem

Without transaction:

```java
deductStock(); // success
insertUserCoupon(); // fail
```

→ stock reduced but no coupon → **data inconsistency**

With `@Transactional`:

→ both rollback

---

### Common bugs

1. **Transaction not working**

```java
this.claimCoupon(); // self-call → transaction NOT effective
```

1. Wrong propagation
2. Exception swallowed → no rollback

## 4. Validation

Used to validate input automatically.

## `@Valid`

```java
public void create(@Valid @RequestBody CouponDTO dto)
```

→ triggers validation

---

## `@NotNull`

```java
@NotNull
private Long userId;
```

→ must not be null

---

## `@NotBlank`

```java
@NotBlank
private String name;
```

→ must not be:

- null
- ""
- " "

---

### Real flow

If invalid:

```json
{
  "name": ""
}
```

→ Spring throws exception BEFORE entering service

---

### Common bug

- Forgot `@Valid` → validation not triggered

## 5. Persistence (DB mapping)

## `@Table`

```java
@Table(name = "coupon")
```

→ maps class → DB table

---

## `@Column`

```java
@Column(name = "coupon_name")
private String name;
```

→ field → column

---

## `@Id`

```java
@Id
private Long id;
```

→ primary key

---

## MyBatis mapper

Example:

```xml
<insert id="insert">
  INSERT INTO coupon(name) VALUES(#{name})
</insert>
```

or

```java
@Insert("INSERT INTO coupon(name) VALUES(#{name})")
```

---

### Real bug sources

- field mismatch
- SQL syntax error
- parameter not passed correctly
- batch insert error (you saw this before)

## 6. Async / Scheduling / Messaging

These are **non-request entry points**

## `@Scheduled`

Runs automatically:

```java
@Scheduled(cron = "0 0 0 * * ?")
public void expireCoupons() {}
```

→ runs every day

Used for:

- expire coupons
- cleanup jobs

---

## `@Async`

```java
@Async
public void sendNotification() {}
```

→ runs in another thread

Used for:

- sending email
- logging
- slow operations

**Common bug**

- no thread pool config → not working

---

## `@KafkaListener`

```java
@KafkaListener(topics = "payment-success")
public void handlePayment(String msg) {}
```

→ listens to Kafka message

---

## `@RabbitListener`

Same idea for RabbitMQ.

---

### Real business example (from your coupon system)

Payment success:

1. Payment system → send message
2. Your system receives:

```java
@KafkaListener(topics = "payment-success")
public void onPaymentSuccess(...) {
    couponService.useCoupon(...);
}
```

---

### Common bugs here

- message duplicated → must be idempotent
- order arrives late → coupon already unlocked
- consumer fails → retry issues

## 7. How all of them connect (VERY IMPORTANT)

A full real flow looks like this:

```
HTTP Request
   ↓
@RestController
   ↓
@RequestMapping / @PostMapping
   ↓
@RequestBody / @PathVariable
   ↓
@Service
   ↓
@Transactional
   ↓
Mapper / DB (@Table / SQL)
   ↓
Return JSON
```

OR async flow:

```
Message Queue
   ↓
@KafkaListener
   ↓
@Service
   ↓
@Transactional
   ↓
DB update
```

## 8. One mental model to remember everything

Think like this:

| Layer       | Responsibility                 |
| ----------- | ------------------------------ |
| Controller  | receive request                |
| Service     | business logic                 |
| Transaction | ensure consistency             |
| Mapper      | DB operation                   |
| Validation  | protect input                  |
| Async/MQ    | background or external trigger |

---
