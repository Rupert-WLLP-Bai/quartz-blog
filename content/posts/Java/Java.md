---
title: Java
date: 2021-10-27T11:06:20.000Z
tags: [Java, 后端]
---

# Java泛型

# Java异常

# Java反射

# Java并发
## 使用线程
**不要显式创建线程，使用线程池**

- 实现Runnable接口
  > 实现接口中的run方法
  > 用Runnable实例创建一个Thread实例,调用start方法

- 实现Callable接口
    > 可以有返回值
    > 使用FutureTask进行封装

测试(注意ft.get()可能抛出的异常)
```java
public static void main(String[] args) throws ExecutionException, InterruptedException {
    /**使用FutureTask进行封装 */
    MyCallable mc  = new MyCallable();
    FutureTask<Integer>ft = new FutureTask<>(mc);
    Thread thread = new Thread(ft);
    thread.start();
    System.out.println(ft.get());
}
```

- 继承Thread类(不推荐)
> - 实现接口会更好一些，因为：
> - Java 不支持多重继承，因此继承了 Thread 类就无法继承其它类，但是可以实现多个接口；类可能只要求可执行就行，继承整个 Thread 类开销过大


## 基础线程机制
### Executor
Executor 管理多个异步任务的执行，而无需程序员显式地管理线程的生命周期。这里的异步是指多个任务的执行互不干扰，不需要进行同步操作
> 三种Executor:
> - CachedThreadPool：一个任务创建一个线程；
> - FixedThreadPool：所有任务只能使用固定大小的线程；
> - SingleThreadExecutor：相当于大小为 1 的 FixedThreadPool。
```java
public static void main(String[] args) {
      ExecutorService executor = Executors.newCachedThreadPool();
      final int MAX = 5;
      for (int i = 0; i < MAX; ++i) {
          executor.execute(new MyRunnable());
      }
      executor.shutdown();
  }
```


### Daemon
　　Daemon程序是一直运行的服务端程序，又称为 守护进程。通常在系统后台运行，没有控制终端不与前台交互，Daemon程序一般作为 系统服务使用。Daemon是长时间运行的进程，通常在系统启动后就运行，在系统关闭时才结束。一般说Daemon程序在后台运行，是因为它没有控制终端，无法和前台的用户交互。Daemon程序一般都作为服务程序使用，等待客户端程序与它通信。我们也把运行的Daemon程序称作 守护进程。
- 守护线程是程序运行时在后台提供服务的线程，不属于程序中不可或缺的部分。
- 当所有非守护线程结束时，程序也就终止，同时会杀死所有守护线程。
- main() 属于非守护线程。
- 在线程启动之前使用 setDaemon() 方法可以将一个线程设置为守护线程。
```java
public static void main(String[] args) {
    Thread thread = new Thread(new MyRunnable());
    thread.setDaemon(true);
}
```


### sleep()
Thread.sleep(millisec) 方法会休眠当前正在执行的线程，millisec 单位为毫秒。
sleep() 可能会抛出 InterruptedException，因为异常不能跨线程传播回 main() 中，因此必须在本地进行处理。线程中抛出的其它异常也同样需要在本地进行处理。

```java
public void run() {
    try {
        Thread.sleep(3000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}
```

### yield()
对静态方法 Thread.yield() 的调用声明了当前线程已经完成了生命周期中最重要的部分，可以切换给其它线程来执行。该方法只是对线程调度器的一个建议，而且也只是建议具有相同优先级的其它线程可以运行。
```java
public void run() {
    Thread.yield();
}
```


## 中断
### InterruptedException
通过调用一个线程的 interrupt() 来中断该线程，如果该线程处于阻塞、限期等待或者无限期等待状态，那么就会抛出 InterruptedException，从而提前结束该线程。但是不能中断 I/O 阻塞和 synchronized 锁阻塞
### interrupted()
如果一个线程的 run() 方法执行一个无限循环，并且没有执行 sleep() 等会抛出 InterruptedException 的操作，那么调用线程的 interrupt() 方法就无法使线程提前结束。

但是调用 interrupt() 方法会设置线程的中断标记，此时调用 interrupted() 方法会返回 true。因此可以在循环体中使用 interrupted() 方法来判断线程是否处于中断状态，从而提前结束线程。

### Executor的中断操作
调用 Executor 的 shutdown() 方法会等待线程都执行完毕之后再关闭，但是如果调用的是 shutdownNow() 方法，则相当于调用每个线程的 interrupt() 方法。
#### submit()
如果只想中断 Executor 中的一个线程，可以通过使用 submit() 方法来提交一个线程，它会返回一个 Future<?> 对象，通过调用该对象的 cancel(true) 方法就可以中断线程。
```java
Future<?> future = executorService.submit(() -> {
    // ..
});
future.cancel(true);
```

## 互斥同步
Java 提供了两种锁机制来控制多个线程对共享资源的互斥访问，第一个是 JVM 实现的 synchronized，而另一个是 JDK 实现的 ReentrantLock
### synchronized
- 对于父类中的 synchronized 修饰方法，子类在覆盖该方法时，默认情- 况下不是同步的，必须显示的使用 synchronized 关键字修饰才行。
- 在定义接口方法时不能使用synchronized关键字。
- 构造方法不能使用synchronized关键字，但可以使用synchronized代码块来进行同步。
- 不同的线程可以访问一个带有synchronized方法的类其他方法
- 不同的线程可以访问一个带有synchronized代码的类其他操作

#### 同步一个代码块


### ReentrantLock
ReentrantLock 是 java.util.concurrent（J.U.C）包中的锁




## 例子
### 买火车票
```java
/**多个线程操作一个对象 */
/** 买火车票 */
public class Demo implements Runnable {
    // 票数
    private int ticketNums = 10;

    @Override
    public void run() {
        while (true) {
            if (ticketNums <= 0) {
                break;
            }
            // 模拟延时
            try {
                Thread.sleep(200);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println(Thread.currentThread().getName() + "-->拿到了第" + ticketNums-- + "张票");
        }
    }

    public static void main(String[] args){
        Demo demo = new Demo();
        /**线程不安全 */
        new Thread(demo,"A").start();
        new Thread(demo,"B").start();
        new Thread(demo,"C").start();
    }
}
```

### 龟兔赛跑
```java
public class Race implements Runnable {
    /**
     * 胜利者
     */
    private String winner;

    /**
     * 步数
     */
    private static final int STEP = 100;

    @Override
    public void run() {
        for (int i = 0; i <= STEP; i++) {
            if (gameOver(i)) {
                break;
            }
            System.out.println(Thread.currentThread().getName() + "-->跑了" + i + "步");
        }
    }

    /**
     * 判断是否完成比赛
     */
    private boolean gameOver(int steps) {
        if (winner != null) {
            return true;
        }
        if (steps >= STEP) {
            winner = Thread.currentThread().getName();
            System.out.println("Winner : " + winner);
            return true;
        }
        return false;
    }

    public static void main(String[] args) {
        Race race = new Race();
        new Thread(race, "兔子").start();
        new Thread(race, "乌龟").start();
    }

}
//还可以加入模拟兔子休息的内容
```



# Junit5
## 使用
1. 在Maven中添加依赖
```XML
 <dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter-engine</artifactId>
    <version>RELEASE</version>
</dependency>
```
2. 创建xxxTest类,至少加入一个assert

