---
title: Rust中的迭代器
date: 2026-01-06
description: ""
tags:
  - rust
  - cs
image: https://static.maredevi.fun/piclist/20260106215340277.png
imageAlt: ""
imageOG: false
hideCoverImage: false
hideTOC: false
targetKeyword: ""
draft: false
---
## 什么是迭代器

在 Rust 中，迭代器是一个实现了 `Iterator` trait 的类型。它的核心任务是**按需**生成序列中的项。

**关键特性：惰性 (Lazy)** 是 Rust 迭代器最重要的特性。当创建一个迭代器（例如调用 `.iter()`）或链式调用函数（例如 `.map()`）时，**实际上什么都没有发生**。只有当你调用一个“消费者”方法（如 `.collect()` 或在 `for` 循环中使用）时，迭代器才会真正开始工作。

更简单的说， 实现`Iterator` trait只需要一个方法：

```rust
pub trait Iterator {
    type Item;

    fn next(&mut self) -> Option<Self::Item>;
}
```

![](https://static.maredevi.fun/piclist/20260106210858679.png)

### 迭代器的三种形态

由于rust中所有权系统的存在，迭代器也伴随着三种存在形态：

|方法|获取类型|说明|场景|
|---|---|---|---|
|`iter()`|`&T`|借用（只读引用）|想读取数据，但不改变它，也不想移交所有权。|
|`iter_mut()`|`&mut T`|可变借用（可变引用）|想在遍历过程中修改集合里的数据。|
|`into_iter()`|`T`|获取所有权（值）|遍历后，原集合被“消耗”掉，无法再被使用。|

## 消费者与适配器

使用迭代器就像搭建一条流水线，方法分为两类：**适配器 (Adapters)** 和 **消费者 (Consumers)**。

### 适配器-惰性的转换者

这些方法接收一个迭代器，返回一个新的迭代器。它们不会立刻执行！ 就像我们在 Shell 里写 `cat file | grep text`，如果没有按回车（即没有消费者），什么都不会发生。

例如：
- `map()`: 转换每个元素。
- `filter()`: 过滤元素。
- `take(n)`: 只取前 n 个。
- `zip()`: 把两个迭代器“拉链”在一起。
- `enumerate()`: 给元素加上索引 `(index, item)`。
### 消费者-触发执行

这些方法会调用 `next()`，驱动迭代器执行，并产生最终结果。

例如：
- `collect()`: 将结果收集回一个集合（如 `Vec` 或 `HashMap`）。
- `sum()`, `product()`: 数学运算。
- `find()`: 查找符合条件的元素。
- `for` 循环: 本质上也是一种消费者。

### Tip

看完上面，你应该就能明白，如果在适配器的后面没有加消费者，整个迭代器实际上就永远不会被执行（当然你尝试编译的时候也会有对应的警告）。

这就是 Rust 迭代器最核心的惰性求值（Lazy Evaluation）特性。
你可以把适配器（Adapters，如 `map`, `filter`）想象成是在铺设水管，而消费者（Consumers，如 `collect`, `for`）是打开水龙头。
如果你把水管接得再复杂（经过十层过滤、加热、加压），只要最后没人打开水龙头，水根本就不会流进管子里，连第一滴水都不会动。


#### 为什么迭代器比 `for` 循环好？
1. **性能 (Performance)**： Rust 的编译器 (LLVM) 极其擅长优化迭代器。像 `filter` 和 `map` 这样的链式调用通常会被编译成极其紧凑的汇编代码，往往比手写的 `for` 循环更快，因为编译器可以消除边界检查 (Bounds Check Elimination)。
2. **安全性 (Safety)**： 使用迭代器可以避免常见的“越界错误”或“索引错误”，因为你根本不需要手动管理索引变量。
3. **可读性 (Readability)**： 迭代器清晰地表达了“要做什么”（Map, Filter, Fold），而不是“怎么做”（维护索引 `i`，增加 `i`，检查 `i < len`）。

## 一些常用方法

Rust 的 `Iterator` trait 虽然提供了通用的方法（如 `map`, `filter`），但某些功能需要额外的状态或特殊的逻辑来支持。为了不让所有迭代器都背负沉重的包袱，Rust 采用了按需增强的策略：当你调用特定方法时，会将基础迭代器包装成一个更高级的结构体，从而赋予它新的超能力。

### Peekable

标准的 `next()` 方法是“不可逆”的——你看了一眼，数据就被“消费”（吃掉）了。而当你调用`peekable()`方法后，迭代器会变成 `Peekable<T>` 类型，它内部多了一个“缓存槽”，用来存放被“偷看”的数据。

for an example:

```rust
fn main() {
    let nums = vec![1, 10, 20];
    // 转为 Peekable 迭代器
    // 注意：我们需要 mut，因为 peek() 可能会尝试从底层迭代器拉取数据并缓存
    let mut iter = nums.into_iter().peekable();

    // 第一次 peek
    if let Some(&n) = iter.peek() {
        println!("偷看到了: {}", n); // 输出 1
    }
    // 再次 peek，数据还在！
    println!("还在: {:?}", iter.peek()); // Some(1)

    // 正式消费
    println!("吃掉了: {:?}", iter.next()); // Some(1)
    
    // 再次 peek 下一个
    println!("下一个是: {:?}", iter.peek()); // Some(10)
}

```

### Enumerate

`enumerate()` 方法会为迭代器加入索引。

for an example:

```rust
let tasks = vec!["作业", "自修"];
// 变成 (usize, &str)
for (i, task) in tasks.iter().enumerate() {
    println!("{}: {}", i, task); 
    // 输出:
    // 0: 作业
    // 1: 自修
}

```

### Rev

`rev()` 会将迭代器反向输出。

> 限制：只有实现了 DoubleEndedIterator 的迭代器才能用（比如 Vec 可以，但来自 TCP 流的迭代器就不行，因为你不能预知流的结尾）。

```rust
let nums = vec![1, 2, 3];
for n in nums.iter().rev() {
    println!("{}", n); // 输出 3, 2, 1
}
```

### Cycle

无限循环，必须搭配`take`或`break`一起食用。

```rust
let pattern = vec!["A", "B"];
// 输出: A, B, A, B, A
for x in pattern.iter().cycle().take(5) {
    print!("{}, ", x); 
}

```

### Fuse

熔断器，标准迭代器规定：一旦 `next()` 返回 `None`，理论上后续调用也应该返回 `None`，但 Rust 为了性能并不强制所有实现都遵守这点。 `fuse()` 强制加了一层保险：一旦遇到第一个 `None`，后续永远返回 `None`。当你编写复杂的底层逻辑，不确定数据源是否行为良好时使用。

## 一些高级用法？

### 1. 带有“内部状态”的迭代 (`scan` & `fold`)

普通的 `map` 是无状态的（Stateless），它只关心当前元素。但如果需要**在这个元素处理时知道上一个元素的结果**怎么办？

#### A. `scan`: 迭代过程中的累加器

`scan` 就像是持有状态的 `map`。它维护一个可变的内部状态 `state`，每次迭代都可以修改它。

```rust
fn main() {
    let a = [1, 2, 3, 4];

    // state 初始值为 0
    // 闭包接收：(&mut state, item)
    let running_totals: Vec<i32> = a.iter()
        .scan(0, |state, &x| {
            *state += x; // 修改内部状态
            Some(*state) // 返回想要生成的值
            // 如果返回 None，迭代就会在这里终止（像 fuse 一样）
        })
        .collect();

    println!("{:?}", running_totals); 
    // 输出: [1, 3, 6, 10] (即 1, 1+2, 1+2+3...)
}
```

#### B. `fold`: 最终的大一统
`collect` 其实是 `fold` 的一种特化。`fold` 把迭代器里的所有东西“折叠”成单一的一个值。

```rust
// 假设我们要把一堆日志行变成一个长字符串
let lines = vec!["Error: A", "Warning: B", "Info: C"];

let report = lines.iter().fold(String::from("Log Report:\n"), |mut acc, &line| {
    acc.push_str(" - ");
    acc.push_str(line);
    acc.push_str("\n");
    acc
});
// 结果是一个完整的 String，这种写法比多次 String + String 分配内存效率高得多
```

### 2. 切片 (`windows` & `chunks`)

这实际上是 slice（切片）的方法，但它们返回的是迭代器。对于处理数据流、信号处理或文本分析极度有用。

#### A. `windows(n)`: 滑动窗口
它会生成重叠的子切片。

```rust
let data = [10, 20, 15, 30, 40];

// 窗口大小为 2，每次向右滑一格
for slice in data.windows(2) {
    println!("Prev: {}, Curr: {}", slice[0], slice[1]);
}
// 输出:
// Prev: 10, Curr: 20
// Prev: 20, Curr: 15 ...
```

#### B. `chunks(n)`: 批量处理
不重叠的切块。

### 3. `by_ref`: 借用一下，不拿走

这是一个非常微妙但极其重要的高级技巧。
当对一个迭代器调用 `take()`, `collect()` 等方法时，通常会**消耗**掉这个迭代器变量的所有权。如果只想**消耗一部分**，然后继续用同一个迭代器怎么办？


```rust
fn main() {
    let mut lines = vec!["Header1", "Header2", "---", "Body1", "Body2"].into_iter();

    // 1. 读取头部，直到遇到 "---"
    // 关键点：使用 by_ref()！
    // 如果不用 by_ref()，take_while 会拿走 lines 的所有权，下面就没法用了
    let headers: Vec<_> = lines.by_ref()
        .take_while(|line| *line != "---")
        .collect();

    println!("Headers: {:?}", headers);

    // 2. 继续使用同一个 lines 迭代器读取剩下的 Body
    println!("Body start:");
    for line in lines {
        println!("{}", line); // 输出 Body1, Body2
    }
}
```

### 4. `iter::from_fn`: 凭空创造迭代器

不需要为了创建一个简单的自定义迭代器而去写一个新的 `struct` 并实现 `Iterator trait`。可以直接用闭包造一个。


```rust
use std::iter;

fn main() {
    let mut count = 0;
    
    // 创建一个只要 next 返回 Some 就一直运行的迭代器
    let counter = iter::from_fn(move || {
        count += 1;
        if count < 5 {
            Some(count)
        } else {
            None
        }
    });

    for num in counter {
        println!("{}", num);
    }
}
```

### 5. 并行迭代器 (`Rayon`)

虽然这属于第三方库（`rayon`），但这几乎是 Rust 迭代器生态不可或缺的一部分。

如果有一个处理大量数据的迭代器链（比如处理数百万条日志），只需要修改两行代码，就能让它自动利用 CPU 的所有核心并行处理。

```rust
// Cargo.toml: rayon = "1.8"
use rayon::prelude::*; // 引入并行特性

fn main() {
    let numbers: Vec<i64> = (0..1_000_000).collect();

    let sum: i64 = numbers
        .par_iter() // 注意：这里把 iter() 换成了 par_iter()
        .map(|&x| x * 2) // 这个 map 会在多个线程上并行执行
        .sum();
        
    println!("{}", sum);
}
```

> [!tip]
>你不需要写任何线程创建、锁、消息传递的代码。Rust 的所有权系统保证了这种并行是**绝对数据安全**的。








