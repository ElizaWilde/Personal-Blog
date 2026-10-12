---
title: 'GO'

publishDate: 2026-9-23

updateDate: 2026-10-12

draft: false

excerpt: '' # 摘  抄

category: 'Backend'

author: 'Eliza'

metadata: {}
---

# Introduction

- Native concurrency: Goroutines and Channels
  Statically typed language (all variable types are determined at compile time), but supports type inference
- Built-in garbage collection (GC): uses a concurrent tri-color mark-and-sweep algorithm
- Easy deployment: the compiler supports cross-compilation (compiling for different platforms)
- Application areas: cloud-native systems and infrastructure, microservices and API development, CLI tools, network programming and distributed systems, blockchain, AI and machine learning (emerging area)

## Variables, Constants, and Arrays, Slices, Maps

- Variables
  ```go
  var b, c int = 1, 2
  # Short variable declarations initialize local variables—only allowed inside functions, and the variables must be used within the code block; otherwise, compilation fails. Global variables may be declared without being used.
  a := 10 // Short variable declaration
  # Global and local variables can have the same name, but the local variable takes precedence inside the function.
  # Type conversion
  // Numeric
  var a int = 10
  var b float64 = float64(a)
  // String
  var str string = "10"
  var num int
  num, _ = strconv.Atoi(str)// This function returns two values (the converted value and a possible error); use _ to ignore the error.
  ```
- Constants (groups)
  ```go
  const a [int] = 10 // Constant declaration; type is optional
  const (
      Unknown = 0
      Female  = 1
      Male    = 2
  )// Constant group declaration (implements an enum-like pattern)
  const (
      a = iota   // 0
      b          // 1 (value omitted; uses iota from the previous line by default)
      c          // 2
      d = "ha"   // Independent value; iota += 1
  )// iota (constant counter, the line index within a const block) starts at 0 and increases by 1 on each line
  # iota can be used in bit-shift operations: j = 3 << iota  // 3 << 1 = 6
  ```
- Arrays

  ```go
  // Initialize a one-dimensional array: specify the element type and number of elements
  var numbers [5]int
  var numbers = [5]int{1, 2, 3, 4, 5}
  balance := [5]float32{1:2.0,3:7.0}// Initialize elements at specified indices
  numbers := [...]int{1, 2, 3, 4, 5}// Use ... instead of a length when the array length is inferred
  // Multidimensional arrays
  a := [3][4]int{  // Three rows and four columns
  {0, 1, 2, 3} ,   /* First row, index 0 */
  {4, 5, 6, 7} ,   /* Second row, index 1 */
  {8, 9, 10, 11},   /* Third row, index 2 */
  }
  b := [2][3][4]int{ // Two 3-row, 4-column planes
      { // First plane
              {1, 2, 3, 4},
              {5, 6, 7, 8},
              {9, 10, 11, 12},
          },
          { // Second plane
              {13, 14, 15, 16},
              {17, 18, 19, 20},
              {21, 22, 23, 24},
          },
  }
  // Iterating over arrays
  # _ is Go's blank identifier, meaning "ignore this value"; it avoids errors for unused variables.
  package main
  import "fmt"
  func main() {
      scores := []int{85, 90, 78, 92}

      // 1. Use both index and value
      fmt.Println("Use index and value:")
      for i, score := range scores {
          fmt.Printf("Course %d: score = %d\n", i+1, score)
      }

      fmt.Println()

      // 2. Only use value
      fmt.Println("Only use value:")
      for _, score := range scores {
          fmt.Printf("score = %d\n", score)
      }
  }

  ```

- Slices (dynamic arrays)
  - `new(T)` allocates zero-initialized storage for type T and returns \*T
  - `make` is specifically used to initialize slices, maps, and channels, returning the initialized type
  ```go
  // Declaration
  var slice1 []type
  var slice2 []type = make([]type, len)
  slice1 := make([]int, len, cap)// len: length; cap: capacity
  // Initialization
  s :=[] int {1,2,3 } // cap=len=3
  s := arr[startIndex:endIndex] // References an array: two slices can therefore share the same underlying array
  ```
- Maps
  - A hash-table structure that quickly locates data using a key's hash. When multiple keys cause hash collisions, the runtime must perform additional collision handling and key comparisons.

  ```go
  # Reference type; unordered; if a key does not exist, returns the zero value of the value type
  // Declaration: make(map[KeyType]ValueType, initialCapacity)
  m := make(map[string]int, 10)
  m := map[string]int{
      "apple": 1,
      "banana": 2,
      "orange": 3,
  }
  // Deletion
  delete(m,"apple")
  ```

  - Ordinary Go maps should not be read and written concurrently without synchronization. This can cause **data races**, and the runtime may directly detect the problem and raise a fatal error, such as `concurrent map read and map write`.
  - If multiple goroutines need to read and write the same map, synchronize access using `Mutex`, `RWMutex`, etc., or use `sync.Map` in appropriate scenarios.
    - General-purpose approach: `map` + `Mutex`/`RWMutex`. The developer controls both the data structure and locking strategy, which is also relatively straightforward to understand.
    - `sync.Map` is a concurrent map provided by the standard library, but it is optimized for specific concurrent access patterns (such as certain read-heavy caches or caches where different goroutines operate on different keys). It is not appropriate for every scenario.

## Control Flow, Functions, and Structs

- Control flow and pointers

  ```go
  # Control flow: three constructs—if, for, and switch; there is no while keyword
  # Go has no ternary operator, so ?: conditional expressions are not supported
  // Pointers (a nil pointer has the value nil)
  package main
  import "fmt"
  func main() {
      var a int= 20   /* Declare an ordinary variable */
      var ip *int        /* Declare a pointer variable */

      ip = &a  /* Store the address in the pointer variable */

      fmt.Printf("Address of variable a: %x\n", &a  )

      /* Address stored in the pointer variable */
      fmt.Printf("Pointer address stored in ip: %x\n", ip )

      /* Access the value through the pointer */
      fmt.Printf("Value of *ip: %d\n", *ip )
  }
  ```

- Functions
  ```go
  // Functions are declared using the func keyword and support multiple return values (the foundation of Go's error-handling mechanism)
  func swap(x, y string) (string, string) {
      return y, x
  }
  # Recursion: a function calls itself; iteration: a loop repeatedly executes a block of code
  ```
- Structs

  ```go
  // Go has no concept of classes; use structs to organize data, and define methods on struct types
  type Books struct {
      title string
      author string
  }
  Book1 := Books{title: "Go", "Eliza"}
  PrintBook(&Book1)
  ```

  - Go Struct vs. Java Class
    - A Java class combines fields, methods, and traditional object-oriented mechanisms, and **supports class inheritance**.
    - Go has no `class`. Instead, it uses `struct` to represent data structures and adds behavior by defining methods on types. It **does not support class inheritance** and favors **composition**. Abstraction is usually achieved through interfaces. Benefit: fewer complex inheritance hierarchies, with relationships between types built more through composition and interfaces.

    ```java
    class User {
        String name;
        void sayHello() {}
    }
    ```

    ```go
        type Logger struct{}

        func (Logger) Log(msg string) {}

        type Service struct {
            Logger
        }
    ```

## Inheritance, Interfaces, and Generics

- Interfaces
  - An interface describes a set of behaviors, also called a method set.
  - **Implicit implementation**: as long as a type implements all the methods in an interface, it automatically satisfies that interface; no explicit `implements` declaration is required.

  ```go
      //define
      type Storage interface {
          Save(data []byte) error
      }

      //inplement
      type PostgresStorage struct{}

      func (p *PostgresStorage) Save(data []byte) error {
          return nil
      }
  ```

  - Enables decoupling (-> Java's DI): interfaces let higher-level business logic depend on abstract behavior rather than concrete implementations. They also improve testability and replaceability.

  ```plain
      Service
      ↓
      Storage Interface
      ↓
      ┌───────────┬───────────┐
      PostgreSQL   Redis       Mock
  ```

- Generics
- Inheritance

## Error Handling and File Handling

- Error handling
- File handling

## Concurrency

Concurrency is implemented through goroutines and channels:

- Goroutines: lightweight threads scheduled by the Go runtime
  ```plain
  Many Goroutines
      ↓
  Go Scheduler
      ↓
  OS Threads
      ↓
      CPU
  ```
- Channels: Go provides a mechanism for **data communication + synchronization** between goroutines, rather than having every goroutine directly modify the same shared state.
- Scheduler: based on the **GMP** model, the scheduler assigns goroutines to OS threads and efficiently manages concurrency through coordination between M and P.
  - G: Goroutine
  - M: OS thread (Machine)
  - P: logical processor (Processor)

  ```plain
      G G G G G
       \|/ \|/
        P   P
        |   |
        M   M
        |   |
       CPU CPU
  ```

  - How is a goroutine scheduled onto an OS thread?
    - A newly created goroutine enters the runnable state and is placed in a run queue. An M associated with a P retrieves a G from the run queue and executes it.
    - **P**: The Go scheduler also uses **work stealing** and other scheduling techniques to balance workloads among different Ps.
    - **G**: If a goroutine cannot continue because of certain blocking operations, the runtime tries to schedule another runnable goroutine, improving thread utilization.

### Goroutine

> Addresses execution: allows multiple tasks to run concurrently.

- vs. **Thread**: Goroutines are suitable for large numbers of concurrent I/O tasks.
  - Their initial stacks are small and can grow dynamically.
  - Many goroutines can be multiplexed onto fewer OS threads.
  - Scheduling is mainly handled by the Go runtime, without requiring OS-level thread scheduling every time. Use the `go` keyword to start a goroutine: `go doSomething(x,y,z)`.
- All goroutines in the same program share the same address space.
- **Select** statement: allows a goroutine to wait on multiple channels; whichever channel is ready first determines which case runs. Similar to `if`/`else if`.

  ```go
      func main() {
          ch1 := make(chan string)
          ch2 := make(chan string)

          go func() {
              time.Sleep(time.Second)
              ch1 <- "from ch1"
          }()

          go func() {
              time.Sleep(2 * time.Second)
              ch2 <- "from ch2"
          }()

          select {
          case msg := <-ch1:
              fmt.Println(msg)

          case msg := <-ch2:
              fmt.Println(msg)
          }
      }
  ```

  - Typical use: timeouts, often for HTTP requests and database queries.
    ```
        // Task completion vs. a 2-second timeout: execute whichever occurs first
       select {
        case result := <-resultCh:
            fmt.Println(result)
        case <-time.After(2 * time.Second):
            fmt.Println("timeout")
        }
    ```
  - `select` + `default`: non-blocking operation

    ```go
        // If the channel has no data right now, do not wait; go directly to default
        select {
        case value := <-ch:
            fmt.Println(value)

        default:
            fmt.Println("no data")
        }
    ```

- `sync.WaitGroup` is used to wait for multiple goroutines to finish.

### Channel

> Addresses how data is passed and synchronized between goroutines.

- Unbuffered Channel (default): emphasizes **synchronization**; when a sender sends data, a receiver must be ready to receive it.
- Buffered Channel: allows the sender to send and the receiver to retrieve data **asynchronously**.
  ```go
  // Declaration
  chan int
  # Create using make, and use the <- operator to send and receive data. If no direction is specified, the channel is bidirectional.
  // Create an unbuffered channel (default)
  ch := make(chan int)
  // Create a buffered channel
  ch := make(chan int, 100)
  ```
- `close`: the sender is responsible for telling the receiver that no more data will be sent.

  ```go
      ch := make(chan int)

      go func() {
          for i := 0; i < 3; i++ {
              ch <- i
          }

          close(ch)
      }()
  ```

  - Check whether a channel is closed
    ```go
        value, ok := <-ch
        // When ok == false, the channel is closed and all buffered data has been read
        if !ok {
            fmt.Println("channel closed")
        }
    ```

### Sync

> Addresses how to ensure data correctness when multiple goroutines access shared memory.

#### Mutex (Mutual Exclusion Lock)

#### RWMutex

#### Once

#### Atomic

## Type Assertions and Type Comparisons

- Type comparisons
  - == or !=
    bool
    integer
    floating-point number
    complex number
    string
    pointer
    channel
    interface (the dynamic value must be comparable)
    array (its elements must be comparable)
    struct (all its fields must be comparable)
  - Cannot be used to compare the contents of slices/maps; these can only be compared with `nil`.

---
