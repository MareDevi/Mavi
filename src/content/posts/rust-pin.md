---
title: Rust 中的 Pin
date: 2025-12-24
description: "详解 Rust 异步编程中的 Pin 概念。通过分析自引用结构体的内存安全问题，阐述为什么我们需要 Pin，以及它是如何通过禁止移动来保证内存安全的。"
tags:
  - async
  - cpp
  - rust
image: https://static.maredevi.fun/piclist/20251224_184529.jpg
imageAlt: ""
imageOG: false
hideCoverImage: false
hideTOC: false
targetKeyword: ""
draft: false
---
## Why we need it?

在[Pull 与 Push 模式](posts/pull-push.md)中，我们说到了 Rust 是基于 Pull 模型的，也就是说，在Rust中，一个异步任务（Future）是不会自己运行的，必须由执行器去推（Pull）一下，它才会去执行。

比如下面这个简化版的`Future Trait` :

```rust
trait Future {
    type Output;
    // 注意这里：self 被 Pin 包裹着
    fn poll(self: Pin<&mut Self>, cx: &mut Context) -> Poll<Self::Output>;
}
```

当我们写一个 `async fn` 时，Rust 编译器会在背后悄悄把它编译成一个 **枚举（Enum）** 或者 **结构体（Struct）**，也就是我们常说的“状态机”。它必须把函数里的**所有局部变量**都打包存起来，以便下次 `poll` 恢复执行时还能找到它们。

假设我们写了这样一段代码：

```rust
async fn my_task() {
    let mut buffer = [0u8; 1024];
    let reader = MyAsyncReader::new();
    
    reader.read(&mut buffer).await; 
}
```

编译器就会把他转换成下面这种类似的结构体：

```rust
struct MyTaskState {
    buffer: [0u8; 1024],
    reader: MyAsyncReader,
    
    // 阶段 1：正在等待 read 完成
}
```

我们可以注意到，`reader.read `接受的是 `buffer` 的引用 (`&mut buffer`)，所以在这个状态下，`reader` 内部持有一个指向 `buffer` 的指针。

而这就是**自引用（Self-Reference）**：结构体里的一个字段，指向了结构体里的另一个字段。

那么让我们现在回到 `Poll` 模型。Rust 的特点是默认**栈分配**且**随意移动（Move）**。

如果不加限制，执行器在两次 `poll` 之间，完全有权利把这个 `MyTaskState` 从内存地址 A 搬运到 内存地址 B（比如为了重新排列任务队列，或者从栈上通过 `Box::new` 移到堆上）。

那么如果发生了移动，会产生什么后果呢？（我们假设原来结构体的内存地址在`0x1000`）

1. 整个结构体被拷贝到了新地址 `0x2000`。
2. `buffer` 现在位于 `0x2000`。
3. `reader` 也被拷贝到了 `0x2000`。
4. **但是** `reader` 里面的那个指针，原本存储的是 `0x1000`（旧 buffer 的地址）。简单的 `memcpy` 不会自动更新这个指针。
5. 结果：`reader` 现在指向的是 `0x1000`，而那个地方可能已经被回收、覆盖或者是垃圾数据。
6. **后果：** 下次你再 `poll` 它时，`reader` 往 `0x1000` 写入数据，导致程序崩溃或严重的数据损坏。

正是这种冲突， Rust 引入了 `Pin` 。

## What is Pin ?
正如它的名字一样， `Pin` 其实是一个锁：**对于那些也是自引用的类型（实现了 `!Unpin` 的类型），一旦被 `Pin` 包裹，就永远不能通过 Safe Rust 拿到它的 `&mut T`。**

为什么不能拿 `&mut T`？ 因为只有拿到了 `&mut T`，你才能使用 `std::mem::swap` 或者 `std::mem::replace` 把里面的值移走。

### Pin 如何工作？

`Pin<P>` 是一个包裹指针 `P`（如 `&mut T`, `Box<T>`）的包装器。它的作用是**限制**对被包裹值 `T` 的访问权限：
- **对于绝大多数类型 (`Unpin`)：** 像 `i32`, `String` 这种普通类型，移动它们是安全的。它们实现了 `Unpin` trait。对于这些类型，`Pin` 没有任何限制，你可以随意拿到 `&mut T` 并移动它。
- **对于特殊类型 (`!Unpin`)：** 像 `async` 生成的 `Future` 或者是自引用结构体，它们没有实现 `Unpin`。 当这种类型被 `Pin` 包裹时（`Pin<&mut T>`），Rust **禁止**你拿到原始的 `&mut T`。
    - 为什么禁止？因为有了 `&mut T`，你就可以用 `std::mem::swap` 或 `std::mem::replace` 把里面的值移走（Move out）。
    - `Pin` 就像给数据加了一个笼子，你可以透过笼子操作它（调用 `poll`），但不能把它拿出来换个位置。

`Pin` 的逻辑是：
1. 当你第一次 `poll` 一个 Future 时，必须先把它 `Pin` 住（比如 `Box::pin(future)`）。
2. 这相当于告诉编译器：“这个 Future 已经在内存里安家了（无论是栈上还是堆上）。”
3. 从此以后，你只能通过 `Pin<&mut T>` 来操作它。
4. 因为你拿不到原始的 `&mut T`，你就**物理上无法**把它移动到别的地方。
5. 既然它不会动，那么它内部的自引用指针（`reader` 指向 `buffer`）就永远是安全的、有效的。

### Example

让我们依旧演示来对比 No Pin 与 Pin 的区别,使用的代码你依旧可以在[这里](https://github.com/MareDevi/study_utils)找到。

#### No Pin

运行结果：  

![no pin 运行结果](https://static.maredevi.fun/piclist/20251224211601389.png)

#### With Pin

运行结果：  

![with pin 运行结果](https://static.maredevi.fun/piclist/20251224212006062.png)

## About C++

什么？ 还有C++ 的事？  
是的，虽然并没有像rust一样在标准库中存在，而是以一种概念的形式出现。而这恰好又与我们在[C++中的右值引用与移动语义](posts/c.md)提到的移动语义相关：Cpp 中的 Pin 主要通过**禁用移动语义**来实现。

### 实现方式

在 C++ 中，如果你想让一个对象 "Pinned"（地址不可变），通常有以下做法：
1. **删除移动构造函数和移动赋值操作符：** 这是最明确的方式。如果一个类不能被移动，编译器会强制它只能呆在原地（或者被拷贝，如果你允许的话）。
2. **C++20 Coroutines (协程)：** C++20 的协程与 Rust 的 Future 类似，都需要保存状态。C++ 编译器通常会在**堆上**为协程帧（Coroutine Frame）分配内存。因为是在堆上分配的，只要你不手动 delete，它的地址就是固定的，天然就是 "Pinned" 的。
3. **库级别的实现 (如 Folly)：** Facebook 的 Folly 库等有一些辅助类可能叫 `Pinned`，或者利用 `std::unique_ptr` 等智能指针的特性（指向堆内存，对象本身不移动，只是指针的所有权在移动）来实现地址固定。

### Example:


```cpp
class PinnedClass {
public:
    PinnedClass() = default;
    // 禁止移动
    PinnedClass(PinnedClass&&) = delete;
    PinnedClass& operator=(PinnedClass&&) = delete;

    // 通常也要小心拷贝，因为拷贝后的自引用指针可能需要重定向
    PinnedClass(const PinnedClass&) = delete; 
    PinnedClass& operator=(const PinnedClass&) = delete;
};
```



