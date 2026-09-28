# 简介
原生并发：Goroutine 与 Channel
静态类型语言（所有变量类型在编译时即确定）但支持类型推断
内置垃圾回收（GC）：使用并发三色标记-清扫算法
易部署：编译器支持交叉编译（跨平台编译）
应用领域：云原生与基础设施、微服务与 API 开发、CLI 工具开发、网络编程与分布式系统、区块链、AI 与机器学习（新兴领域）

## 变量、常量 与 Arr, Slice, Map    
- 变量
    ``` go
    var b, c int = 1, 2
    # 短变量声明是局部变量的初始化声明-仅限函数内部，且必须在该代码块中使用，未使用会编译错误）但全局变量允许声明但不使用
    a := 10 //短变量声明
    # 全局变量与局部变量名称可以相同，但是函数内的局部变量会被优先考虑 
    # 类型转换
    //数值
    var a int = 10
    var b float64 = float64(a)
    //字符串
    var str string = "10"
    var num int
    num, _ = strconv.Atoi(str)//该函数返回两个值(转换后的值，可能的错误),使用_ 来忽略这个错误
    ```
- 常量（组）
    ```go
    const a [int] = 10 //常量定义,可选类型
    const (
        Unknown = 0
        Female  = 1
        Male    = 2
    )//常量组定义（实现enum）
    const (
        a = iota   // 0
        b          // 1（省略值，默认使用上一行的 iota）
        c          // 2
        d = "ha"   // 独立值，iota += 1
    )//iota(常量计数器,const的行索引) 从 0 开始，每行加 1
    # iota可以参与位移运算：j = 3 << iota  // 3 << 1 = 6
    ```
- 数组
    ```go 
    //初始化一维数组：指定元素类型及个数
    var numbers [5]int
    var numbers = [5]int{1, 2, 3, 4, 5}
    balance := [5]float32{1:2.0,3:7.0}//指定下标初始化元素
    numbers := [...]int{1, 2, 3, 4, 5}//不确定长度的数组用...代替长度
    //多维数组
    a := [3][4]int{  //三行四列
    {0, 1, 2, 3} ,   /*  第一行索引为 0 */
    {4, 5, 6, 7} ,   /*  第二行索引为 1 */
    {8, 9, 10, 11},   /* 第三行索引为 2 */
    }
    b := [2][3][4]int{ //两个（三行四列的平面）
        { // 第一个平面
                {1, 2, 3, 4},
                {5, 6, 7, 8},
                {9, 10, 11, 12},
            },
            { // 第二个平面
                {13, 14, 15, 16},
                {17, 18, 19, 20},
                {21, 22, 23, 24},
            },
    }
    //数组的遍历
    # _是 Go 语言的空白标识符，意思是：“忽略此值”, 避免未使用变量警告
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
- 切片slice(动态数组)
    - new(T) 为类型 T 分配零值存储空间，并返回 *T
    - make 专门用于初始化 slice、map 和 channel，返回初始化后的type
    ```go
    //定义
    var slice1 []type
    var slice2 []type = make([]type, len)
    slice1 := make([]int, len, cap)//len长度，cap容量
    //初始化
    s :=[] int {1,2,3 } // cap=len=3
    s := arr[startIndex:endIndex] //数组的引用：所以说如果两个slice可以共享一个底层数组
    ```
- 集合
    - 哈希表结构，通过 key 的 hash 来快速定位数据。当多个 key 产生哈希冲突时，runtime 需要进一步进行冲突处理和 key 比较。
    ```go
    # 引用类型；无序；键不存在，返回该类型的零值
    //定义：make(map[KeyType]ValueType, initialCapacity)
    m := make(map[string]int, 10)
    m := map[string]int{
        "apple": 1,
        "banana": 2,
        "orange": 3,
    }
    //删除
    delete(m,"apple")
    ```
    - 普通 Go map 不应该在没有同步机制的情况下进行并发读写，这可能产生**数据竞争**，并且 runtime 还可能直接检测到并报 fatal error，例如 concurrent map read and map write。
    - 如果多个 goroutine 需要读写同一个 map，需要通过 Mutex、RWMutex 等方式同步，或者在适合的场景使用 sync.Map。
        - 通用方案：map + Mutex/RWMutex，数据结构和锁策略都由开发者自己控制，可读性也比较直接。
        - sync.Map 是标准库提供的并发 Map，但它针对特定并发访问模式进行了优化（例如某些读多写少或者不同 goroutine 操作不同 key 的缓存场景），并不是所有场景都应该使用。
## 流程、函数、结构体
- 流程、指针
    ```go 
    # 控制流程：if、for 和 switch 三种，没有 while 关键字
    # Go 没有三目运算符，所以不支持 ?: 形式的条件判断
    // 指针（空指针为nil）
    package main
    import "fmt"
    func main() {
        var a int= 20   /* 声明实际变量 */
        var ip *int        /* 声明指针变量 */

        ip = &a  /* 指针变量的存储地址 */

        fmt.Printf("a 变量的地址是: %x\n", &a  )

        /* 指针变量的存储地址 */
        fmt.Printf("ip 变量储存的指针地址: %x\n", ip )

        /* 使用指针访问值 */
        fmt.Printf("*ip 变量的值: %d\n", *ip )
    }
    ```
- 函数
    ``` go
    //函数使用 func 关键字声明，支持多返回值（Go 错误处理机制的基础）
    func swap(x, y string) (string, string) {
        return y, x
    }
    # 递归:函数调用自身, 迭代:循环结构重复执行代码块
    ```
- 结构体
    ``` go
    //没有类的概念，使用 struct（结构体）组织数据，可以为struct类型定义方法
    type Books struct {
        title string
        author string
    }
    Book1 := Books{title: "Go", "Eliza"}
    PrintBook(&Book1)
    ```
    - Go Struct 和 Java Class
        - Java class 把字段、方法以及传统面向对象机制结合在一起，并**支持类继承**
        - Go 没有 class，而是使用 struct 表示数据结构，通过给类型定义 method 来添加行为；**不支持类继承**，更倾向于**组合**；抽象通常通过 interface 实现--好处：减少复杂的继承层次，让类型之间更多通过组合和接口建立关系
        ```java 
        class User {
            String name;
            void sayHello() {}
        }
        ```
        ``` go
            type Logger struct{}

            func (Logger) Log(msg string) {}

            type Service struct {
                Logger
            }
        ```
## 继承、接口、泛型
- 接口
    - Interface 描述的是一组行为，也就是 method set
    - **隐式实现**：只要一个类型实现了接口中所有方法，它就自动满足该接口，无需显式声明 implements
    ``` go
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
    - 实现解耦(-> Java's DI)：Interface 让上层业务依赖抽象行为，而不是依赖具体实现。同时提高可测试性和可替换性。
    ```plain
        Service
        ↓
        Storage Interface
        ↓
        ┌───────────┬───────────┐
        PostgreSQL   Redis       Mock
    ```
- 泛型
- 继承 
## 错误处理、文件处理
- 错误处理
- 文件处理
## 并发
通过 goroutines 和 channels实现并发：
- Goroutines:轻量级线程，调度由Golang运行时管理
    ```plain
    大量 Goroutine
        ↓
    Go Scheduler
        ↓
    OS Threads
        ↓
        CPU
    ```
- Channel:Go 提供的 Goroutine 之间**数据通信(Communication) + 同步(Sync)**的机制，而不是所有 Goroutine 都直接修改同一份共享状态。
- Scheduler:基于 **GMP** 模型，调度器会将 Goroutine 分配到系统线程中执行，并通过 M 和 P 的配合高效管理并发
    - G：Goroutine
    - M：系统线程（Machine）
    - P：逻辑处理器（Processor）
    ```plain
        G G G G G
         \|/ \|/
          P   P
          |   |
          M   M
          |   |
         CPU CPU
    ```
    - Goroutine 怎么被调度到 OS Thread？
        - 新创建的 Goroutine 会进入可运行状态，并被放入调度队列。与 P 关联的 M 会从可运行队列获取 G 执行。
        - **P**：Go Scheduler 还会进行**任务窃取(Work Stealing)**等调度，使不同 P 之间的工作量更加均衡。
        - **G**：如果 Goroutine 因为某些阻塞操作无法继续执行，Runtime 会尽量调度其他可运行 Goroutine，提高线程利用率。
### Goroutine
> 解决excution，让多个任务并发执行
- vs **Thread**：Goroutine适合大量I/O并发任务
    - 它的初始栈比较小，而且栈可以动态增长
    - 大量 Goroutine 可以被 multiplex 到较少的 OS Thread 上
    - 调度主要由 Go Runtime 完成，不需要每次都依赖操作系统进行线程级调度
-使用 go 关键字就可以启动一个 Goroutine：```go doSomething(x,y,z)```
- 同一个程序中的所有 goroutine 共享同一个地址空间
- **Select** 语句：使得一个 goroutine 可以等待多个channel，哪个 channel 先准备好，就执行哪个 case。类似于if/else if
    ``` go
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
    - 典型用途：Timeout，常用于HTTP请求、数据库查询
        ``` 
            //任务完成 vs 2秒超时，谁先发生执行谁
           select {
            case result := <-resultCh:
                fmt.Println(result)
            case <-time.After(2 * time.Second):
                fmt.Println("timeout")
            }
        ``` 
    - select + default：non-blocking operation
        ```go
            //如果 channel 当前没有数据不会等待，直接走default
            select {
            case value := <-ch:
                fmt.Println(value)

            default:
                fmt.Println("no data")
            }
        ```
- sync.WaitGroup 用于等待多个 Goroutine 完成
### Channel
> 解决goroutine 之间怎么传递数据和同步
- Unbuffered Channel(默认)：强调**同步**，发送端发送数据，必须同时有接收端相应的接收数据
- Buffered Channel：允许发送端的数据发送和接收端的数据获取处于**异步**状态
    ``` go
    //声明
    chan int 
    # 使用 make 函数创建，使用 <- 操作符发送和接收数据。如果未指定方向，则为双向通道
    //默认创建
    ch := make(chan int)
    //带缓冲区创建
    ch := make(chan int, 100)
    ```
- close：发送方负责告诉接收方，不会再发送数据
    ```go
        ch := make(chan int)

        go func() {
            for i := 0; i < 3; i++ {
                ch <- i
            }

            close(ch)
        }()
    ```
    - 判断Channel是否关闭
        ```go
            value, ok := <-ch
            //ok == false时，表示Channel已关闭且缓存数据也读完
            if !ok {
                fmt.Println("channel closed")
            }
        ```
### Sync
> 解决多个 goroutine 访问共享内存时，怎么保证数据正确
#### Mutex(Mutual Exclusion互斥锁)

#### RWMutex
#### Once
#### Atomic

## 类型断言、类型比较
- 类型比较
    - == or != 
        bool
        整数
        浮点数
        复数
        string
        pointer
        channel
        interface（动态值必须可比较）
        array（元素可比较）
        struct（所有字段可比较）
    - 不可以用于Slice/Map的内容，只能和 nil 比较