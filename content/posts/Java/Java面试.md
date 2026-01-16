---
title: Java面试
date: 2023-05-21T00:07:12.000Z
tags: [Java, Spring, SpringBoot, Database, Backend, Algorithm, ComputerNetwork, OperatingSystem, DataStructure, LeetCode]
---


# Java后端摆烂

## 1. Java基础

### 1.1 Java异常体系

Java异常体系是Java语言中用来描述程序运行期间发生的错误情况的一套机制。异常分为受检异常和非受检异常两种，其中受检异常必须在代码中显式地进行处理，而非受检异常则可以不处理。

常见的异常类型包括`NullPointerException`、`ArrayIndexOutOfBoundsException`、`ClassCastException`、`ArithmeticException`等。

### 1.2 怎么获取class对象

获取Class对象的方式有三种：

1. 使用类名.class语法获取
2. 调用对象的getClass()方法获取
3. 使用Class.forName()方法获取

### 1.3 反射是什么，有什么优缺点，有哪些应用场景

反射是指在运行时动态地获取类的信息，包括类的属性、方法、接口等，并且可以在运行时通过反射调用对象的方法或修改对象的属性值。它可以让我们在编写代码时不需要预先知道要操作的类的具体信息，从而实现更加灵活的编程。

反射的优点是提高了程序的灵活性和可扩展性，缺点是会降低程序的性能并增加了代码的复杂度。应用场景包括：动态代理、依赖注入、序列化、框架开发等。

### 1.4 HashMap、TreeMap、LinkedHashMap

HashMap、TreeMap和LinkedHashMap都是Java中常用的Map实现类。

HashMap是基于哈希表实现的，可以提供O(1)时间复杂度的插入、查找和删除操作，但是由于哈希冲突的存在，可能会出现O(n)的最坏情况。

TreeMap是基于红黑树实现的，可以保证元素有序，并且提供了一些特殊方法如firstKey()、lastKey()等，但是插入、查找和删除操作的时间复杂度为O(log n)。

LinkedHashMap继承自HashMap，并且通过双向链表维护了元素的顺序，因此可以保证元素的插入顺序或访问顺序。

### 1.5 HashMap的原理

HashMap的底层数据结构是数组+链表/红黑树。当元素数量超过阈值时，会进行扩容操作，同时也会将链表转换为红黑树以提高查询效率。

元素的插入过程是先计算出元素的哈希值，然后根据哈希值计算出在数组中的位置，如果该位置为空，则直接插入。如果该位置已经有元素了，则遍历链表或红黑树进行查找，如果找到了相同的key，则更新value，否则将新元素插入到链表的末尾或者红黑树中。

### 1.6 equals和hashCode方法

equals和hashCode方法都是Object类中的方法，用于实现对象的相等比较和哈希码计算。

equals方法默认实现是判断两个对象是否是同一个引用，如果要进行自定义实现，则需要满足如下几个条件：

1. 自反性：对于任意非空对象x，x.equals(x)必须返回true。

2. 对称性：对于任意非空对象x和y，如果x.equals(y)返回true，则y.equals(x)也必须返回true。

3. 传递性：对于任意非空对象x、y和z，如果x.equals(y)返回true，并且y.equals(z)也返回true，则x.equals(z)必须返回true。

4. 一致性：对于任意非空对象x和y，多次调用x.equals(y)

5. 的结果应该始终保持一致。

   5. 非空性：对于任意非空对象x，x.equals(null)必须返回false。

   hashCode方法用于计算对象的哈希码，其默认实现是将对象的内部地址转换为一个整数作为哈希码。如果要进行自定义实现，则需要满足如下几个条件：

   1. 在同一个程序执行期间，对同一个对象多次调用hashCode方法应该始终返回相同的整数。
   2. 如果两个对象的equals方法返回true，则它们的hashCode方法也必须返回相同的整数。
   3. 如果两个对象的equals方法返回false，则它们的hashCode方法不一定要返回不同的整数，但是不同的hashCode能够提高散列性能。

   在使用哈希表等数据结构时，如果没有正确地重写equals和hashCode方法，可能会导致元素无法被正确地查找和删除。

### 1.7 HashTable和HashMap的区别

HashTable和HashMap都是Java中常用的哈希表实现类，它们的主要区别在于线程安全性和null值的处理方式。

HashTable是线程安全的，而HashMap则不是，因此在并发情况下，推荐使用ConcurrentHashMap代替HashTable或者在使用HashMap时手动进行同步处理。

HashTable不允许存储null值，而HashMap则可以。

### 1.8 LinkedList和ArrayList的区别

LinkedList和ArrayList都是Java中常用的List实现类，它们的主要区别在于底层数据结构和性能特点。

LinkedList是基于双向链表实现的，可以快速地进行插入和删除操作，但是随机访问元素的时间复杂度较高，为O(n)。

ArrayList是基于动态数组实现的，可以提供O(1)时间复杂度的随机访问操作，但是插入和删除操作的时间复杂度较高，为O(n)。

因此，在需要频繁进行插入和删除操作的场景中，使用LinkedList比较合适；在需要频繁进行随机访问操作的场景中，使用ArrayList比较合适。

### 1.9 谈谈fail fast机制，ConcurrentModificationException是怎么抛出来的

fail-fast机制是指在迭代集合时，如果集合的结构发生了变化（如添加、删除元素），则会抛出ConcurrentModificationException异常，以避免在迭代过程中出现不可预料的行为。

这种机制通过记录一个modCount变量来实现，每当对集合进行结构性修改时（如添加、删除元素），modCount变量都会自增。而在迭代集合时，每次调用next方法时都会检查modCount变量的值是否与迭代器创建时的值相同，如果不同，则说明集合的结构发生了变化，迭代器会抛出ConcurrentModificationException异常。

### 1.10 String、StringBuilder、StringBuffer

String、StringBuilder和StringBuffer都是Java中常用的字符串类。它们之间的主要区别在于线程安全性和性能特点。

String是不可变的，每次对String进行修改操作都会生成一个新的String对象，因此在需要频繁进行修改操作时，使用String效率较低。

StringBuilder和StringBuffer都是可变的，可以进行插入、删除、替换等操作，并且提供了一些方便的方法来进行字符串操作。其中，StringBuilder是非线程安全的，而StringBuffer则是线程安全的。

因此，在单线程环境下，推荐使用StringBuilder；在多线程环境下，推荐使用StringBuffer。

### 1.11 String的不可变性，有什么好处

String的不可变性是指一旦一个String对象被创建，就不可以再改变它的值。这种设计决策带来了以下好处：

1. 线程安全：由于String对象不能被修改，因此可以在多线程环境中安全地共享。

2. 安全性：如果字符串是可变的，那么可能存在安全漏洞，如密码字符串被恶意程序篡改等。

3. 缓存hash值：由于String对象的值不变，因此可以在第一次计算它的哈希码之后将这个值缓存起来，以提高哈希表操作的性能。

4. 优化字符串拼接：由于String对象的不可变性，每次进行字符串拼接时都会生成一个新的String对象，因此在Java 5之后，引入了StringBuilder和StringBuffer两个类来优化字符串拼接操作。

### 1.12 Java怎么实现一个不可变类

要实现一个不可变类，需要满足以下条件：

1. 将类声明为final，以防止继承。
2. 将所有的属性声明为private final，并且不提供setter方法。
3. 如果有必要对属性进行修改，则必须通过构造函数或者工厂方法来实现。
4. 如果类中包含可变对象的引用，则需要进行保护性拷贝，以防止对象被外部修改。

例如，下面是一个简单的不可变类的示例：

```java
public final class ImmutableClass {
    private final int value;

    public ImmutableClass(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }
}
```

### 1.13 HashMap默认初始容量，怎么扩容的，为什么，指定大小后初始容量又是多少

HashMap的默认初始容量为16，负载因子为0.75。当元素数量超过阈值（容量 x 负载因子）时，会进行扩容操作，将容量扩大为原来的两倍，并且重新计算每个元素在数组中的位置。

扩容操作涉及到元素的重新哈希、数组的重新分配等操作，因此会比较耗时。但是通过设置合适的初始容量和负载因子可以减少扩容操作的次数，从而提高HashMap的性能。

如果在创建HashMap对象时指定了初始容量，则实际的初始容量会根据以下公式计算得出：

initialCapacity = (需要存储的元素个数 / 负载因子) + 1

例如，如果需要存储100个元素，负载因子为0.75，则实际的初始容量为(100/0.75)+1=134。

### 1.14 介绍一下public、private、protected、default访问修饰符

Java中有四种访问修饰符：public、private、protected和default。

public：可以被任何类访问，包括不同包中的类。

private：只能被本类访问，其他类无法访问。

protected：可以被本类、同一包中的其他类以及不同包中的子类访问。

default（也称为包访问或者缺省访问）：只能被本类和同一包中的其他类访问，不同包中的类无法访问。如果没有指定任何访问修饰符，则默认为default。

访问修饰符控制着类、接口、方法、变量等成员的可见性和访问权限，可以对代码的封装性和安全性产生重要影响。

### 1.15 Class.forName和ClassLoader的区别

Class.forName和ClassLoader都是Java中用于加载类的机制，它们之间的主要区别在于加载方式和使用场景。

Class.forName是一种动态加载类的机制，可以在运行时根据类名字符串来加载指定的类。它会从当前线程的ClassLoader、当前类的ClassLoader以及系统的ClassLoader中依次尝试加载指定的类，如果都失败了，则会抛出ClassNotFoundException异常。

ClassLoader是Java中用于加载类的基础设施，它是一个抽象类，提供了一系列方法来实现动态加载类的功能。ClassLoader通常被用于加载一些自定义的类或者第三方库中的类，它可以通过覆盖findClass方法来实现自定义的类加载逻辑。

在一般情况下，推荐使用ClassLoader来加载类，因为它比Class.forName更加灵活，可以实现自定义的类加载逻辑，并且不会强制进行初始化操作。而Class.forName则适合在需要动态加载某个类并立即进行初始化操作的场景中使用。

### 1.16 Java中的反射机制是什么

Java中的反射机制是指在运行时检查、获取和修改类的属性、方法、构造函数等信息的能力。它允许程序在运行时动态地加载、创建、调用和修改类的行为，从而增强了程序的灵活性和可扩展性。

反射机制通过Class对象来实现，每个类在JVM中都有一个与之对应的Class对象，该对象保存了类的名称、方法、属性等信息。程序可以通过调用Class的方法来获取和修改这些信息，例如：

```java
Class<?> clazz = Person.class;  // 获取Person类的Class对象
Field[] fields = clazz.getFields();  // 获取Person类的public属性
Method[] methods = clazz.getDeclaredMethods();  // 获取Person类声明的所有方法
Constructor<?> constructor = clazz.getConstructor(String.class, int.class);  // 获取Person类指定的构造函数
```

反射机制需要注意一些安全问题，如不当使用可能导致性能下降、类型安全性受到影响，甚至可能存在安全漏洞。因此，在使用反射机制时应该慎重考虑，并且只在必要的情况下使用。

### 1.17 泛型是什么，有什么好处

泛型是Java中的一种抽象类型，它可以将数据类型作为参数进行传递，从而使得代码更加灵活、可读性更强以及更容易维护。具体来说，泛型可以带来以下好处：

1. 类型安全：使用泛型可以让编译器检查类型是否匹配，减少类型转换错误的风险。

2. 代码复用：泛型可以适用于多种类型，从而减少了代码的重复书写和重构工作。

3. 可读性：使用泛型可以让代码更加清晰明了，降低代码的阅读难度和维护成本。

4. 性能优化：使用泛型可以减少装箱和拆箱操作，提高代码的执行效率。

例如，下面是一个使用泛型的示例：

```java
public class GenericClass<T> {
    private T value;

    public GenericClass(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}
```

在这个示例中，T表示泛型参数，在实例化时可以指定不同的类型，从而得到不同类型的GenericClass对象。

### 1.18 Java中什么是异常，常见的异常类型有哪些

Java中的异常是指在程序运行过程中出现的错误或者异常情况，例如输入不合法、空指针引用、数组越界等。当程序遇到异常时，会生成一个异常对象，并通过抛出异常来通知调用方处理异常。

Java中定义了一些标准的异常类，例如：

- RuntimeException：表示程序运行过程中出现的一般性异常，如空指针异常、数组越界异常等。
- IOException：表示输入输出操作过程中出现的异常，如文件不存在、读写失败等。
- SQLException：表示数据库操作过程中出现的异常，如连接失败、语法错误等。
- ClassNotFoundException：表示在动态加载类时找不到对应类的异常。

除了标准的异常类之外，程序员也可以自定义异常类来表达特定的异常情况。

在Java中，异常分为受检异常（Checked Exception）和非受检异常（Unchecked Exception）。受检异常是指需要在方法签名中声明和捕获的异常，例如IOException；而非受检异常则不需要在方法签名中声明和捕获，包括RuntimeException及其子类异常。

### 1.19 Java中的try-catch-finally结构是什么，有什么作用

Java中的try-catch-finally结构是一种异常处理机制，它用于捕获并处理Java程序中可能出现的异常情况。try语句块中包含需要被监视的代码，catch语句块用于捕获和处理异常，而finally语句块则用于执行一些清理工作，无论是否发生异常都会被执行。

try-catch-finally结构的基本语法如下：

```java
try {
    // 代码块
} catch (ExceptionType1 e1) {
    // 异常处理代码
} catch (ExceptionType2 e2) {
    // 异常处理代码
} finally {
    // 清理代码
}
```

其中，ExceptionType1和ExceptionType2表示需要捕获的异常类型，可以是任何Java异常类型或其子类。

try-catch-finally结构的作用在于使程序能够对异常情况进行恰当的处理，并且保证程序能够正常退出，避免发生资源泄漏等问题。finally语句块可以确保一些必要的清理工作能够得到执行，例如关闭数据库连接、释放文件句柄等。

### 1.20 Java中如何实现多线程

Java中有两种方式来实现多线程：继承Thread类和实现Runnable接口。其中，继承Thread类是比较简单的方式，只需要重写Thread的run方法即可；而实现Runnable接口则更加灵活，可以将任务与线程分离开来，从而降低了耦合度。

#### 继承Thread类

继承Thread类的方式需要创建一个新的类，并继承Thread类。在该类中重写run方法，该方法会在线程启动时被调用。然后创建一个该类的对象，调用start方法来启动线程。

```java
public class MyThread extends Thread {
    @Override
    public void run() {
        // 线程执行的代码
    }
}

// 启动线程
MyThread thread = new MyThread();
thread.start();
```

#### 实现Runnable接口

实现Runnable接口的方式需要创建一个新的类，实现Runnable接口，并在该类中实现run方法。然后创建一个Thread对象，将该类的对象传入Thread的构造函数中，调用start方法启动线程。

```java
public class MyRunnable implements Runnable {
    @Override
    public void run() {
        // 线程执行的代码
    }
}

// 启动线程
MyRunnable runnable = new MyRunnable();
Thread thread = new Thread(runnable);
thread.start();
```

实现Runnable接口的方式更加灵活，因为一个线程可以执行多个任务，而且多个线程可以共享同一个任务。

### 1.21 Java中如何实现同步和互斥

Java中提供了synchronized关键字来实现同步和互斥。使用synchronized可以保证在同一时间只有一个线程可以访问某个共享资源，从而避免了并发访问导致的问题。

#### 同步块

synchronized关键字可以用于方法或者代码块上。使用同步块可以将需要同步的代码块包裹起来，使得每次只能有一个线程进入该代码块。

```java
public class MyObject {
    private int count = 0;

    public void increment() {
        synchronized (this) {  // 使用同步块
            count++;
        }
    }

    public int getCount() {
        return count;
    }
}
```

在这个示例中，increment方法使用同步块来保证count变量的安全性，从而避免多个线程同时修改count导致计数出错的问题。

#### 同步方法

除了同步块之外，synchronized关键字还可以用于方法上。使用同步方法可以将整个方法都标记为同步，从而确保同一时刻只有一个线程可以访问该方法。

```java
public class MyObject {
    private int count = 0;

    public synchronized void increment() {  // 使用同步方法
        count++;
    }

    public int getCount() {
        return count;
    }
}
```

在这个示例中，increment方法使用同步方法来保证count变量的安全性。

#### 锁对象

synchronized关键字可以锁定任意一个对象。当使用同步块时，需要指定一个锁对象，只有获取到该锁对象的线程才能进入同步块执行代码。

```java
public class MyObject {
    private int count = 0;
    private final Object lock = new Object();

    public void increment() {
        synchronized (lock) {  // 使用锁对象
            count++;
        }
    }

    public int getCount() {
        return count;
    }
}
```

在这个示例中，lock对象被用作锁对象，只有获取到lock对象的线程才能进入increment方法的同步块。

### 1.22 Java中如何实现线程通信

Java中提供了wait、notify和notifyAll等方法来实现线程之间的通信。这些方法必须在synchronized块内部调用，并且要求调用者必须是锁对象的持有者。

#### wait方法

wait方法用于让当前线程等待，直到其他线程发出通知或者中断当前线程。当调用wait方法时，当前线程将释放锁对象并进入等待状态，直到其他线程调用notify或者notifyAll方法通知它，或者被中断。

```java
public class MyObject {
    private boolean flag = false;

    public synchronized void waitForFlag() throws InterruptedException {
        while (!flag) {
            wait();  // 等待通知
        }
        System.out.println("Flag is true now.");
    }

    public synchronized void setFlag(boolean value) {
        flag = value;
        notifyAll();  // 发送通知
    }
}
```

在这个示例中，waitForFlag方法使用wait方法来等待flag变为true，setFlag方法则使用notifyAll方法来发送通知。

#### notify和notifyAll方法

notify和notifyAll方法用于唤醒其他线程。当调用notify方法时，将随机唤醒一个等待该对象锁的线程；当调用notifyAll方法时，将唤醒所有等待该对象锁的线程。

```java
public class MyObject {
    private boolean flag = false;

    public synchronized void waitForFlag() throws InterruptedException {
        while (!flag) {
            wait();  // 等待通知
        }
        System.out.println("Flagis true now.");
    }

    public synchronized void setFlag(boolean value) {
        flag = value;
        notifyAll();  // 发送通知
    }
}
```

在这个示例中，waitForFlag方法使用wait方法来等待flag变为true，setFlag方法则使用notifyAll方法来发送通知。

### 1.23 Integer常量池

- Java中对于整型常量的优化措施，将数值在 -128~127 之间的整型常量缓存起来，在需要使用这些数值时直接返回已经缓存的引用，避免了频繁的创建和销毁过程。
- 使用Integer.valueOf方法可以从常量池中获取对应的整型对象。

### 1.24 String常量池

- String常量池是Java对于字符串字面量所做的优化措施，它是一个特殊的区域，存储着所有字符串字面量以及通过String类的intern方法加入池中的字符串。
- 可以通过调用String的intern方法将字符串加入到常量池中，避免重复创建相同字符串对象的问题，提高内存利用率。

### 1.25 final修饰变量、方法、类

- final修饰变量表示该变量只能被赋值一次，即为常量。常量在定义时必须进行初始化，并且不能再次赋值。
- final修饰方法表示该方法不能被子类重写，可以避免子类实现不符合设计要求的方法。
- final修饰类表示该类不能被继承，可以避免出现未知的副作用。

### 1.26 深拷贝和浅拷贝，怎么实现深拷贝

- 深拷贝和浅拷贝都是指在复制对象时的不同方式。浅拷贝只是对原对象的引用进行一份拷贝，而不是对对象本身进行拷贝；深拷贝则会对对象中的所有数据成员进行递归式拷贝。
- 实现深拷贝可以通过序列化和反序列化、使用clone方法或手动编写拷贝构造函数等方式。其中，手动编写拷贝构造函数需要对每个可变引用类型的成员变量进行递归式拷贝。

### 1.27 介绍一下Object的clone方法

- Object的clone方法是一个浅拷贝方法，用于复制当前对象并返回一个新的对象。该方法会调用本地方法clone()，需要注意的是，在使用Object的clone方法进行复制时，必须确保对象实现了Cloneable接口，并且重载了clone方法，否则会抛出CloneNotSupportedException异常。
- 如果要实现深拷贝，需要在重载的clone方法中将每个可变引用类型的成员变量进行深拷贝。

### 1.28 抽象类和接口的区别

抽象类和接口都是用于定义规范的方式，但是有以下几点不同：

- 抽象类可以包含方法实现，可以有抽象方法也可以没有，但不能被实例化；而接口只能包含抽象方法和常量。
- 抽象类可以有构造函数，而接口没有。
- 实现抽象类的子类只能继承一个父类，而实现接口的类可以实现多个接口，支持多重继承。
- 抽象类中可以定义成员变量，而接口中只能定义常量。

## 2. Java集合

![Java 集合框架概览](https://oss.javaguide.cn/github/javaguide/java/collection/java-collection-hierarchy.png)

### 2.1 说说 List, Set, Queue, Map 四者的区别？

- `List`(对付顺序的好帮手): 存储的元素是有序的、可重复的。
- `Set`(注重独一无二的性质): 存储的元素是无序的、不可重复的。
- `Queue`(实现排队功能的叫号机): 按特定的排队规则来确定先后顺序，存储的元素是有序的、可重复的。
- `Map`(用 key 来搜索的专家): 使用键值对（key-value）存储，类似于数学上的函数 y=f(x)，"x" 代表 key，"y" 代表 value，key 是无序的、不可重复的，value 是无序的、可重复的，每个键最多映射到一个值。

### 2.2 集合框架底层数据结构总结

先来看一下 `Collection` 接口下面的集合。

#### List

- `ArrayList`：`Object[]` 数组
- `Vector`：`Object[]` 数组
- `LinkedList`：双向链表(JDK1.6 之前为循环链表，JDK1.7 取消了循环)

#### Set

- `HashSet`(无序，唯一): 基于 `HashMap` 实现的，底层采用 `HashMap` 来保存元素
- `LinkedHashSet`: `LinkedHashSet` 是 `HashSet` 的子类，并且其内部是通过 `LinkedHashMap` 来实现的。有点类似于我们之前说的 `LinkedHashMap` 其内部是基于 `HashMap` 实现一样，不过还是有一点点区别的
- `TreeSet`(有序，唯一): 红黑树(自平衡的排序二叉树)

#### Queue

- `PriorityQueue`: `Object[]` 数组来实现二叉堆
- `ArrayQueue`: `Object[]` 数组 + 双指针

再来看看 `Map` 接口下面的集合。

#### Map

- `HashMap`：JDK1.8 之前 `HashMap` 由数组+链表组成的，数组是 `HashMap` 的主体，链表则是主要为了解决哈希冲突而存在的（“拉链法”解决冲突）。JDK1.8 以后在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）（将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树）时，将链表转化为红黑树，以减少搜索时间
- `LinkedHashMap`：`LinkedHashMap` 继承自 `HashMap`，所以它的底层仍然是基于拉链式散列结构即由数组和链表或红黑树组成。另外，`LinkedHashMap` 在上面结构的基础上，增加了一条双向链表，使得上面的结构可以保持键值对的插入顺序。同时通过对链表进行相应的操作，实现了访问顺序相关逻辑。详细可以查看：[《LinkedHashMap 源码详细分析（JDK1.8）》open in new window](https://www.imooc.com/article/22931)
- `Hashtable`：数组+链表组成的，数组是 `Hashtable` 的主体，链表则是主要为了解决哈希冲突而存在的
- `TreeMap`：红黑树（自平衡的排序二叉树）

### 2.3 ArrayList 插入和删除元素的时间复杂度？

对于插入：

- 头部插入：由于需要将所有元素都依次向后移动一个位置，因此时间复杂度是 O(n)。
- 尾部插入：当 `ArrayList` 的容量未达到极限时，往列表末尾插入元素的时间复杂度是 O(1)，因为它只需要在数组末尾添加一个元素即可；当容量已达到极限并且需要扩容时，则需要执行一次 O(n) 的操作将原数组复制到新的更大的数组中，然后再执行 O(1) 的操作添加元素。
- 指定位置插入：需要将目标位置之后的所有元素都向后移动一个位置，然后再把新元素放入指定位置。这个过程需要移动平均 n/2 个元素，因此时间复杂度为 O(n)。

对于删除：

- 头部删除：由于需要将所有元素依次向前移动一个位置，因此时间复杂度是 O(n)。
- 尾部删除：当删除的元素位于列表末尾时，时间复杂度为 O(1)。
- 指定位置删除：需要将目标元素之后的所有元素向前移动一个位置以填补被删除的空白位置，因此需要移动平均 n/2 个元素，时间复杂度为 O(n)。

### 2.4 LinkedList 插入和删除元素的时间复杂度？

- 头部插入/删除：只需要修改头结点的指针即可完成插入/删除操作，因此时间复杂度为 O(1)。
- 尾部插入/删除：只需要修改尾结点的指针即可完成插入/删除操作，因此时间复杂度为 O(1)。
- 指定位置插入/删除：需要先移动到指定位置，再修改指定节点的指针完成插入/删除，因此需要移动平均 n/2 个元素，时间复杂度为 O(n)。

### 2.5 LinkedList 为什么不能实现 RandomAccess 接口？

`RandomAccess` 是一个标记接口，用来表明实现该接口的类支持随机访问（即可以通过索引快速访问元素）。由于 `LinkedList` 底层数据结构是链表，内存地址不连续，只能通过指针来定位，不支持随机快速访问，所以不能实现 `RandomAccess` 接口。

### 2.6 ArrayList 与 LinkedList 区别?

- **是否保证线程安全：** `ArrayList` 和 `LinkedList` 都是不同步的，也就是不保证线程安全；
- **底层数据结构：** `ArrayList` 底层使用的是 **`Object` 数组**；`LinkedList` 底层使用的是 **双向链表** 数据结构（JDK1.6 之前为循环链表，JDK1.7 取消了循环。注意双向链表和双向循环链表的区别，下面有介绍到！）
- 插入和删除是否受元素位置的影响：
  - `ArrayList` 采用数组存储，所以插入和删除元素的时间复杂度受元素位置的影响。 比如：执行`add(E e)`方法的时候， `ArrayList` 会默认在将指定的元素追加到此列表的末尾，这种情况时间复杂度就是 O(1)。但是如果要在指定位置 i 插入和删除元素的话（`add(int index, E element)`），时间复杂度就为 O(n)。因为在进行上述操作的时候集合中第 i 和第 i 个元素之后的(n-i)个元素都要执行向后位/向前移一位的操作。
  - `LinkedList` 采用链表存储，所以在头尾插入或者删除元素不受元素位置的影响（`add(E e)`、`addFirst(E e)`、`addLast(E e)`、`removeFirst()`、 `removeLast()`），时间复杂度为 O(1)，如果是要在指定位置 `i` 插入和删除元素的话（`add(int index, E element)`，`remove(Object o)`,`remove(int index)`）， 时间复杂度为 O(n) ，因为需要先移动到指定位置再插入和删除。
- **是否支持快速随机访问：** `LinkedList` 不支持高效的随机元素访问，而 `ArrayList`（实现了 `RandomAccess` 接口） 支持。快速随机访问就是通过元素的序号快速获取元素对象(对应于`get(int index)`方法)。
- **内存空间占用：** `ArrayList` 的空间浪费主要体现在在 list 列表的结尾会预留一定的容量空间，而 LinkedList 的空间花费则体现在它的每一个元素都需要消耗比 ArrayList 更多的空间（因为要存放直接后继和直接前驱以及数据）。

### 2.7 Arraylist 和 Vector 的区别?

1. `ArrayList` 是 `List` 的主要实现类，底层使用 `Object[ ]`存储，适用于频繁的查找工作，线程不安全 ；
2. `Vector` 是 `List` 的古老实现类，底层使用 `Object[ ]`存储，线程安全的。

### 2.8 Comparable 和 Comparator 的区别

`Comparable` 接口和 `Comparator` 接口都是 Java 中用于排序的接口，它们在实现类对象之间比较大小、排序等方面发挥了重要作用：

- `Comparable` 接口实际上是出自`java.lang`包 它有一个 `compareTo(Object obj)`方法用来排序
- `Comparator`接口实际上是出自 `java.util` 包它有一个`compare(Object obj1, Object obj2)`方法用来排序

一般我们需要对一个集合使用自定义排序时，我们就要重写`compareTo()`方法或`compare()`方法，当我们需要对某一个集合实现两种排序方式，比如一个 `song` 对象中的歌名和歌手名分别采用一种排序方法的话，我们可以重写`compareTo()`方法和使用自制的`Comparator`方法或者以两个 `Comparator` 来实现歌名排序和歌星名排序，第二种代表我们只能使用两个参数版的 `Collections.sort()`.

### 2.9 无序性和不可重复性的含义是什么

- 无序性不等于随机性 ，无序性是指存储的数据在底层数组中并非按照数组索引的顺序添加 ，而是根据数据的哈希值决定的。
- 不可重复性是指添加的元素按照 `equals()` 判断时 ，返回 false，需要同时重写 `equals()` 方法和 `hashCode()` 方法。

### 2.10 比较 HashSet、LinkedHashSet 和 TreeSet 三者的异同

- `HashSet`、`LinkedHashSet` 和 `TreeSet` 都是 `Set` 接口的实现类，都能保证元素唯一，并且都不是线程安全的。
- `HashSet`、`LinkedHashSet` 和 `TreeSet` 的主要区别在于底层数据结构不同。`HashSet` 的底层数据结构是哈希表（基于 `HashMap` 实现）。`LinkedHashSet` 的底层数据结构是链表和哈希表，元素的插入和取出顺序满足 FIFO。`TreeSet` 底层数据结构是红黑树，元素是有序的，排序的方式有自然排序和定制排序。
- 底层数据结构不同又导致这三者的应用场景不同。`HashSet` 用于不需要保证元素插入和取出顺序的场景，`LinkedHashSet` 用于保证元素的插入和取出顺序满足 FIFO 的场景，`TreeSet` 用于支持对元素自定义排序规则的场景。

### 2.11 ArrayDeque 与 LinkedList 的区别

`ArrayDeque` 和 `LinkedList` 都实现了 `Deque` 接口，两者都具有队列的功能，但两者有什么区别呢？

- `ArrayDeque` 是基于可变长的数组和双指针来实现，而 `LinkedList` 则通过链表来实现。
- `ArrayDeque` 不支持存储 `NULL` 数据，但 `LinkedList` 支持。
- `ArrayDeque` 是在 JDK1.6 才被引入的，而`LinkedList` 早在 JDK1.2 时就已经存在。
- `ArrayDeque` 插入时可能存在扩容过程, 不过均摊后的插入操作依然为 O(1)。虽然 `LinkedList` 不需要扩容，但是每次插入数据时均需要申请新的堆空间，均摊性能相比更慢。

从性能的角度上，选用 `ArrayDeque` 来实现队列要比 `LinkedList` 更好。此外，`ArrayDeque` 也可以用于实现栈。

### 2.12 说一说 PriorityQueue

`PriorityQueue` 是在 JDK1.5 中被引入的, 其与 `Queue` 的区别在于元素出队顺序是与优先级相关的，即总是优先级最高的元素先出队。

这里列举其相关的一些要点：

- `PriorityQueue` 利用了二叉堆的数据结构来实现的，底层使用可变长的数组来存储数据
- `PriorityQueue` 通过堆元素的上浮和下沉，实现了在 O(logn) 的时间复杂度内插入元素和删除堆顶元素。
- `PriorityQueue` 是非线程安全的，且不支持存储 `NULL` 和 `non-comparable` 的对象。
- `PriorityQueue` 默认是小顶堆，但可以接收一个 `Comparator` 作为构造参数，从而来自定义元素优先级的先后。

`PriorityQueue` 在面试中可能更多的会出现在手撕算法的时候，典型例题包括堆排序、求第 K 大的数、带权图的遍历等，所以需要会熟练使用才行。

### 2.13 HashMap 和 Hashtable 的区别

- **线程是否安全：** `HashMap` 是非线程安全的，`Hashtable` 是线程安全的,因为 `Hashtable` 内部的方法基本都经过`synchronized` 修饰。（如果你要保证线程安全的话就使用 `ConcurrentHashMap` 吧！）；
- **效率：** 因为线程安全的问题，`HashMap` 要比 `Hashtable` 效率高一点。另外，`Hashtable` 基本被淘汰，不要在代码中使用它；
- **对 Null key 和 Null value 的支持：** `HashMap` 可以存储 null 的 key 和 value，但 null 作为键只能有一个，null 作为值可以有多个；Hashtable 不允许有 null 键和 null 值，否则会抛出 `NullPointerException`。
- **初始容量大小和每次扩充容量大小的不同：** ① 创建时如果不指定容量初始值，`Hashtable` 默认的初始大小为 11，之后每次扩充，容量变为原来的 2n+1。`HashMap` 默认的初始化大小为 16。之后每次扩充，容量变为原来的 2 倍。② 创建时如果给定了容量初始值，那么 `Hashtable` 会直接使用你给定的大小，而 `HashMap` 会将其扩充为 2 的幂次方大小（`HashMap` 中的`tableSizeFor()`方法保证，下面给出了源代码）。也就是说 `HashMap` 总是使用 2 的幂作为哈希表的大小,后面会介绍到为什么是 2 的幂次方。
- **底层数据结构：** JDK1.8 以后的 `HashMap` 在解决哈希冲突时有了较大的变化，当链表长度大于阈值（默认为 8）时，将链表转化为红黑树（将链表转换成红黑树前会判断，如果当前数组的长度小于 64，那么会选择先进行数组扩容，而不是转换为红黑树），以减少搜索时间（后文中我会结合源码对这一过程进行分析）。`Hashtable` 没有这样的机制。

**`HashMap` 中带有初始容量的构造函数：**

```java
    public HashMap(int initialCapacity, float loadFactor) {
        if (initialCapacity < 0)
            throw new IllegalArgumentException("Illegal initial capacity: " +
                                               initialCapacity);
        if (initialCapacity > MAXIMUM_CAPACITY)
            initialCapacity = MAXIMUM_CAPACITY;
        if (loadFactor <= 0 || Float.isNaN(loadFactor))
            throw new IllegalArgumentException("Illegal load factor: " +
                                               loadFactor);
        this.loadFactor = loadFactor;
        this.threshold = tableSizeFor(initialCapacity);
    }
     public HashMap(int initialCapacity) {
        this(initialCapacity, DEFAULT_LOAD_FACTOR);
    }
```

下面这个方法保证了 `HashMap` 总是使用 2 的幂作为哈希表的大小。

```java
    /**
     * Returns a power of two size for the given target capacity.
     */
    static final int tableSizeFor(int cap) {
        int n = cap - 1;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
    }
```

### 2.14 HashMap 和 HashSet 区别

如果你看过 `HashSet` 源码的话就应该知道：`HashSet` 底层就是基于 `HashMap` 实现的。（`HashSet` 的源码非常非常少，因为除了 `clone()`、`writeObject()`、`readObject()`是 `HashSet` 自己不得不实现之外，其他方法都是直接调用 `HashMap` 中的方法。

|               `HashMap`                |                          `HashSet`                           |
| :------------------------------------: | :----------------------------------------------------------: |
|           实现了 `Map` 接口            |                       实现 `Set` 接口                        |
|               存储键值对               |                          仅存储对象                          |
|     调用 `put()`向 map 中添加元素      |             调用 `add()`方法向 `Set` 中添加元素              |
| `HashMap` 使用键（Key）计算 `hashcode` | `HashSet` 使用成员对象来计算 `hashcode` 值，对于两个对象来说 `hashcode` 可能相同，所以`equals()`方法用来判断对象的相等性 |

### 2.15 HashMap 和 TreeMap 区别

`TreeMap` 和`HashMap` 都继承自`AbstractMap` ，但是需要注意的是`TreeMap`它还实现了`NavigableMap`接口和`SortedMap` 接口。

![TreeMap 继承关系图](https://oss.javaguide.cn/github/javaguide/java/collection/treemap_hierarchy.png)

实现 `NavigableMap` 接口让 `TreeMap` 有了对集合内元素的搜索的能力。

实现`SortedMap`接口让 `TreeMap` 有了对集合中的元素根据键排序的能力。默认是按 key 的升序排序，不过我们也可以指定排序的比较器。示例代码如下：

```java
/**
 * @author shuang.kou
 * @createTime 2020年06月15日 17:02:00
 */
public class Person {
    private Integer age;

    public Person(Integer age) {
        this.age = age;
    }

    public Integer getAge() {
        return age;
    }


    public static void main(String[] args) {
        TreeMap<Person, String> treeMap = new TreeMap<>(new Comparator<Person>() {
            @Override
            public int compare(Person person1, Person person2) {
                int num = person1.getAge() - person2.getAge();
                return Integer.compare(num, 0);
            }
        });
        treeMap.put(new Person(3), "person1");
        treeMap.put(new Person(18), "person2");
        treeMap.put(new Person(35), "person3");
        treeMap.put(new Person(16), "person4");
        treeMap.entrySet().stream().forEach(personStringEntry -> {
            System.out.println(personStringEntry.getValue());
        });
    }
}
```

输出:

```text
person1
person4
person2
person3
```

可以看出，`TreeMap` 中的元素已经是按照 `Person` 的 age 字段的升序来排列了。

上面，我们是通过传入匿名内部类的方式实现的，你可以将代码替换成 Lambda 表达式实现的方式：

```java
TreeMap<Person, String> treeMap = new TreeMap<>((person1, person2) -> {
  int num = person1.getAge() - person2.getAge();
  return Integer.compare(num, 0);
});
```

综上，相比于`HashMap`来说 `TreeMap` 主要多了对集合中的元素根据键排序的能力以及对集合内元素的搜索的能力。

### 2.16 HashMap的底层实现

JDK 1.8 的 hash 方法 相比于 JDK 1.7 hash 方法更加简化，但是原理不变。

```java
    static final int hash(Object key) {
      int h;
      // key.hashCode()：返回散列值也就是hashcode
      // ^：按位异或
      // >>>:无符号右移，忽略符号位，空位都以0补齐
      return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
  }
```

对比一下 JDK1.7 的 HashMap 的 hash 方法源码.

```java
static int hash(int h) {
    // This function ensures that hashCodes that differ only by
    // constant multiples at each bit position have a bounded
    // number of collisions (approximately 8 at default load factor).

    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}
```

相比于 JDK1.8 的 hash 方法 ，JDK 1.7 的 hash 方法的性能会稍差一点点，因为毕竟扰动了 4 次。

### 2.17 HashMap 的长度为什么是 2 的幂次方

为了能让 HashMap 存取高效，尽量较少碰撞，也就是要尽量把数据分配均匀。我们上面也讲到了过了，Hash 值的范围值-2147483648 到 2147483647，前后加起来大概 40 亿的映射空间，只要哈希函数映射得比较均匀松散，一般应用是很难出现碰撞的。但问题是一个 40 亿长度的数组，内存是放不下的。所以这个散列值是不能直接拿来用的。用之前还要先做对数组的长度取模运算，得到的余数才能用来要存放的位置也就是对应的数组下标。这个数组下标的计算方法是“ `(n - 1) & hash`”。（n 代表数组长度）。这也就解释了 HashMap 的长度为什么是 2 的幂次方。

**这个算法应该如何设计呢？**

我们首先可能会想到采用%取余的操作来实现。但是，重点来了：**“取余(%)操作中如果除数是 2 的幂次则等价于与其除数减一的与(&)操作（也就是说 hash%length==hash&(length-1)的前提是 length 是 2 的 n 次方；）。”** 并且 **采用二进制位操作 &，相对于%能够提高运算效率，这就解释了 HashMap 的长度为什么是 2 的幂次方。**

### 2.18 HashMap 多线程操作导致死循环问题

JDK1.7 及之前版本的 `HashMap` 在多线程环境下扩容操作可能存在死循环问题，这是由于当一个桶位中有多个元素需要进行扩容时，多个线程同时对链表进行操作，头插法可能会导致链表中的节点指向错误的位置，从而形成一个环形链表，进而使得查询元素的操作陷入死循环无法结束。

为了解决这个问题，JDK1.8 版本的 HashMap 采用了尾插法而不是头插法来避免链表倒置，使得插入的节点永远都是放在链表的末尾，避免了链表中的环形结构。但是还是不建议在多线程下使用 `HashMap`，因为多线程下使用 `HashMap` 还是会存在数据覆盖的问题。并发环境下，推荐使用 `ConcurrentHashMap`

### 2.19 HashMap 为什么线程不安全？

JDK1.7 及之前版本，在多线程环境下，`HashMap` 扩容时会造成死循环和数据丢失的问题。

数据丢失这个在 JDK1.7 和 JDK 1.8 中都存在，这里以 JDK 1.8 为例进行介绍。

JDK 1.8 后，在 `HashMap` 中，多个键值对可能会被分配到同一个桶（bucket），并以链表或红黑树的形式存储。多个线程对 `HashMap` 的 `put` 操作会导致线程不安全，具体来说会有数据覆盖的风险。

举个例子：

- 两个线程 1,2 同时进行 put 操作，并且发生了哈希冲突（hash 函数计算出的插入下标是相同的）。
- 不同的线程可能在不同的时间片获得 CPU 执行的机会，当前线程 1 执行完哈希冲突判断后，由于时间片耗尽挂起。线程 2 先完成了插入操作。
- 随后，线程 1 获得时间片，由于之前已经进行过 hash 碰撞的判断，所有此时会直接进行插入，这就导致线程 2 插入的数据被线程 1 覆盖了。

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
    // ...
    // 判断是否出现 hash 碰撞
    // (n - 1) & hash 确定元素存放在哪个桶中，桶为空，新生成结点放入桶中(此时，这个结点是放在数组中)
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    // 桶中已经存在元素（处理hash冲突）
    else {
    // ...
}
```

还有一种情况是这两个线程同时 `put` 操作导致 `size` 的值不正确，进而导致数据覆盖的问题：

1. 线程 1 执行 `if(++size > threshold)` 判断时，假设获得 `size` 的值为 10，由于时间片耗尽挂起。
2. 线程 2 也执行 `if(++size > threshold)` 判断，获得 `size` 的值也为 10，并将元素插入到该桶位中，并将 `size` 的值更新为 11。
3. 随后，线程 1 获得时间片，它也将元素放入桶位中，并将 size 的值更新为 11。
4. 线程 1、2 都执行了一次 `put` 操作，但是 `size` 的值只增加了 1，也就导致实际上只有一个元素被添加到了 `HashMap` 中。

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
    // ...
    // 实际大小大于阈值则扩容
    if (++size > threshold)
        resize();
    // 插入后回调
    afterNodeInsertion(evict);
    return null;
}
```

### 2.20 ConcurrentHashMap 和 Hashtable 的区别

`ConcurrentHashMap` 和 `Hashtable` 的区别主要体现在实现线程安全的方式上不同。

- **底层数据结构：** JDK1.7 的 `ConcurrentHashMap` 底层采用 **分段的数组+链表** 实现，JDK1.8 采用的数据结构跟 `HashMap1.8` 的结构一样，数组+链表/红黑二叉树。`Hashtable` 和 JDK1.8 之前的 `HashMap` 的底层数据结构类似都是采用 **数组+链表** 的形式，数组是 HashMap 的主体，链表则是主要为了解决哈希冲突而存在的；
- 实现线程安全的方式（重要）：
  - 在 JDK1.7 的时候，`ConcurrentHashMap` 对整个桶数组进行了分割分段(`Segment`，分段锁)，每一把锁只锁容器其中一部分数据（下面有示意图），多线程访问容器里不同数据段的数据，就不会存在锁竞争，提高并发访问率。
  - 到了 JDK1.8 的时候，`ConcurrentHashMap` 已经摒弃了 `Segment` 的概念，而是直接用 `Node` 数组+链表+红黑树的数据结构来实现，并发控制使用 `synchronized` 和 CAS 来操作。（JDK1.6 以后 `synchronized` 锁做了很多优化） 整个看起来就像是优化过且线程安全的 `HashMap`，虽然在 JDK1.8 中还能看到 `Segment` 的数据结构，但是已经简化了属性，只是为了兼容旧版本；
  - **`Hashtable`(同一把锁)** :使用 `synchronized` 来保证线程安全，效率非常低下。当一个线程访问同步方法时，其他线程也访问同步方法，可能会进入阻塞或轮询状态，如使用 put 添加元素，另一个线程不能使用 put 添加元素，也不能使用 get，竞争会越来越激烈效率越低。

## 3. Java并发

### 3.1 Java线程有哪些状态

Java线程有以下几种状态：

- 新建（New）：当线程对象被创建后，该线程处于新建状态。
- 运行（Runnable）：当调用了start()方法时，线程进入可运行状态。在可运行状态下，线程只是表示它可以运行，并没有开始运行。
- 阻塞（Blocked）：线程阻塞于锁，等待获取锁的时候，会进入阻塞状态。
- 等待（Waiting）：线程进入等待状态是因为调用了wait()方法或join()方法，并且没有设置超时时间。等待其他线程的通知或者等待被合并。
- 超时等待（Timed Waiting）：线程等待一定的时间后，会自动唤醒，例如sleep()方法。
- 终止（Terminated）：当run()方法执行完毕后，线程进入终止状态。

### 3.2 ConcurrentHashMap的实现原理

`ConcurrentHashMap` 的实现原理是基于分段锁的思想。它将一个大的哈希表分割成若干个小的哈希表，每个小的哈希表都由一个独立的锁来控制。这样，在多线程并发访问时，只需要锁住分配给该线程的那个小表，而不需要锁住整个哈希表，从而大大提高了并发性能。

具体来说，ConcurrentHashMap 将一个哈希表分成若干个段（Segment），每个段都是一个独立的哈希表，有自己的锁。每次对 ConcurrentHashMap 的操作只需要锁住当前需要操作的段，而不需要锁住整张表。这样就可以支持多线程同时操作 ConcurrentHashMap，从而提高并发访问速度。

### 3.3 synchronized怎么用，reentrantLock呢

`synchronized` 是 Java 中用于控制对象的同步访问的关键字。它可以用于代码块和方法上，它的使用方法如下：

- 对象锁：使用 `synchronized(object)` 代码块或者在实例方法上使用 `synchronized` 关键字，来获取该对象的锁，并执行同步代码块。

```java
public synchronized void method(){
    // 同步代码块
}
```

- 类锁： 在类方法中使用 `synchronized` 关键字来获取该类的锁，从而保证该类的所有实例对象在多线程环境下同步访问。

```java
public static synchronized void method(){
    // 同步代码块
}
```

`ReentrantLock` 是 Java 提供的一种高级同步机制，它可以代替传统的 synchronized 关键字来实现同步。使用 ReentrantLock 需要手动加锁和释放锁，使用方式如下：

```java
private Lock lock = new ReentrantLock();
public void method(){
    lock.lock(); // 加锁
    try{
        // 同步代码块
    }finally {
        lock.unlock(); // 释放锁
    }
}
```

### 3.4 线程间同步的方式

线程间同步的方式有多种，常见的有以下几种：

- `synchronized` 关键字：使用 synchronized 关键字来实现对象锁或类锁，从而控制并发访问。
- `ReentrantLock` 类：通过 ReentrantLock 类来实现加锁和解锁的操作，可重入性更强，功能更加灵活。
- `volatile` 关键字：使用 volatile 关键字来保证变量在线程之间的可见性，从而保证数据的正确性。
- `wait()` 和 `notify()` 方法：使用 Object 对象的 wait() 和 notify() 方法来实现线程等待和唤醒的操作，从而实现线程之间的协作。
- `CountDownLatch` 类：使用 CountDownLatch 类来实现线程之间的协作，可以让一个或多个线程等待其他线程完成操作后再执行。
- `Semaphore` 类：使用 Semaphore 类来控制同一时间内有限数量的线程并发执行。
- `CyclicBarrier` 类：使用 CyclicBarrier 类来实现线程之间的协作，可以让多个线程在某一个时刻相互等待，直到所有的线程都完成后再同时执行。

### 3.5 join原理

`join()` 方法是 Thread 类提供的一个方法，它的作用是让当前线程等待指定的线程终止后再继续执行。其原理是调用了指定线程的 `join()` 方法后，会使当前线程进入等待状态，并且释放当前线程所持有的锁，让给其他线程去执行，直到指定线程执行完毕后，会调用 `notifyAll()` 方法唤醒当前线程。

例如：

```java
Thread t = new Thread(() -> {
 // 子线程执行任务
});
t.start();
t.join(); // 主线程等待子线程执行完毕后再继续执行
```

### 3.6 ThreadLocal的原理，使用场景

`ThreadLocal` 是 Java 中一个特殊的变量类型，它的值只能被当前线程访问，其他线程无法访问。每个线程都会有一个独立的 ThreadLocal 变量副本，每个线程对 ThreadLocal 变量的修改不会影响到其他线程的副本值。ThreadLocal 的实现原理是，每个线程内部都有一个 ThreadLocalMap 类型的变量 threadLocals，它是一个以 ThreadLocal 对象为键，任意对象为值的映射表，用于存储当前线程的变量副本。

使用场景：当多个线程需要访问同一个变量时，可以使用 ThreadLocal 来保证数据的线程安全，从而避免加锁操作，提高程序的性能。

例如，以下代码创建了一个 ThreadLocal 变量，每个线程访问该变量时都会获得自己独立的副本：

```java
private static ThreadLocal<String> threadLocal = new ThreadLocal<>();

public static void main(String[] args) {
  threadLocal.set("main");
  new Thread(() -> {
      threadLocal.set("thread1");
      System.out.println(threadLocal.get()); // 输出 thread1
  }).start();
  System.out.println(threadLocal.get()); // 输出 main
}
```

### 3.7 什么是可重入锁，不可重入会有什么问题

可重入锁是指同一线程在获取锁的过程中可以重复获取已经持有的锁，而不会死锁。Java 中的 synchronized 和 ReentrantLock 都支持可重入锁。不可重入锁是指一个线程在获取锁之后，如果再次获取同一把锁会直接进入死锁状态。

如果没有可重入锁的机制，那么就需要在调用同一个对象的其他方法时重新获得锁，这样会导致程序的可读性和可维护性变得很差。而且，不可重入锁还容易导致死锁等问题。

### 3.8 synchronized和ReentrantLock的区别

`synchronized` 和 `ReentrantLock` 都是 Java 中用于实现线程同步的关键字/类，它们之间的区别如下：

- 实现方式：synchronized 是属于 JVM 实现的一种内置锁机制，而 ReentrantLock 则是 JDK 的一个类。synchronized 关键字无需手动释放锁，而 ReentrantLock 必须手动释放锁。
- 可中断性：ReentrantLock 支持可中断锁和非可中断锁，而 synchronized 关键字不支持可中断锁。
- 公平性：ReentrantLock 可以设置公平锁和非公平锁，而 synchronized 关键字只能是非公平锁。
- 锁的获取方式：ReentrantLock 可以通过 tryLock() 方法尝试获取锁，并返回是否成功；synchronized 关键字则需要一直等待获取锁。
- 可重入性：两者都支持可重入锁的机制，即同一个线程可以重复获取已经持有的锁。

总体来说，synchronized 使用起来更加简单方便，而 ReentrantLock 则提供了更多的高级特性，例如锁定的可中断性、公平性设置、超时等待、多个条件变量等，可以提供更灵活的控制。但是，由于 ReentrantLock 需要手动释放锁，如果使用不当容易导致死锁等问题，因此需要谨慎使用。

### 3.9 详细介绍一下锁升级

锁升级是指，当线程在使用某种类型的锁时，如果发现该锁不够高效，就会自动升级至另一种更加高效的锁。

Java 中的锁升级主要有以下三种：

1. 偏向锁 -> 轻量级锁：偏向锁是指在没有竞争的情况下，将对象头中的标志位设置为偏向模式，并将线程 ID 记录在对象头中。当另一个线程访问该对象时，会先检查对象头的标志位，如果是偏向模式且线程 ID 符合，则无需加锁即可获取对象，并将对象头中的状态改为轻量级锁。
2. 轻量级锁 -> 重量级锁：轻量级锁是指在竞争不激烈的情况下，线程为了避免使用重量级锁而采用的一种优化手段。当线程尝试获取轻量级锁失败时，会将对象头中的标志位设置为重量级锁，并阻塞当前线程，等待操作系统唤醒。
3. 自旋锁 -> 重量级锁：自旋锁是指线程在无法获取锁时，会不断地尝试获取锁，以避免进入阻塞状态。当自旋次数达到一定数量时，如果仍无法获取锁，则会将对象头中的标志位设置为重量级锁并阻塞线程。

### 3.10 AtomicInteger的原理

`AtomicInteger` 是 Java 中提供的一个原子性类，用于对整数类型进行原子操作。它的实现原理是通过使用 CPU 的 CAS（Compare and Swap）指令来完成原子操作，从而避免了多线程环境下可能出现的竞态条件问题。

具体来说，`AtomicInteger` 内部维护了一个 int 类型的变量 value，它可以通过 `get()` 方法获取当前值，通过 `set(int newValue)`、`getAndSet(int newValue)`、`compareAndSet(int expect, int update)` 等方法修改该值，在执行这些方法时，会使用 CAS 操作来保证原子性。

CAS 操作实际上是利用了 CPU 提供的一种原子性操作，它需要两个参数：要修改的内存地址和期望的值。当一个线程执行 CAS 操作时，如果内存地址中的值等于期望的值，就会将新的值写入该位置，否则就不做任何修改。由于 CAS 操作是原子性的，因此可以保证在多线程环境下进行原子操作时不会出现竞态条件问题。

### 3.11 线程池的创建方式

Java 中创建线程池有两种方式：

1. 通过 `Executors` 工厂类创建线程池：`Executors` 是一个工厂类，提供了一些静态方法用于创建不同类型的线程池。例如，可以通过 `Executors.newFixedThreadPool(int nThreads)` 方法创建一个固定大小的线程池，通过 `Executors.newCachedThreadPool()` 方法创建一个可缩放的、无界的线程池等。
2. 通过 `ThreadPoolExecutor` 类创建线程池：`ThreadPoolExecutor` 是 Java 中提供的线程池实现类，它提供了更加灵活的参数配置和自定义线程池的能力，可以通过构造函数或者 setter 方法来设置线程池的各个参数，如核心线程数、最大线程数、任务队列、线程工厂、拒绝策略等。

通常情况下，建议使用第二种方式

### 3.12 有序性、可见性、原子性，Java有哪些操作是原子的

在 Java 中，一些基本数据类型的读取和赋值操作是原子性的，例如 `int`、`long`、`boolean`、`float`、`double` 等。此外，Java 还提供了一些原子性类，如 `AtomicInteger`、`AtomicLong`、`AtomicBoolean` 等，可以保证对这些对象的操作都是原子性的。

除此之外，Java 还提供了 `synchronized` 关键字和 `java.util.concurrent.locks` 包中的锁机制来实现原子性操作。

### 3.13 创建线程池各种参数的含义

线程池中的主要参数及其含义如下：

1. `corePoolSize`：线程池中的核心线程数，用于执行长期存活的任务。
2. `maximumPoolSize`：线程池中允许的最大线程数，用于执行短期强并发的任务。
3. `keepAliveTime`：线程池中的线程空闲时间。默认情况下，当一个线程完成任务后，它会一直保持存活状态，等待下一个任务，如果在 `keepAliveTime` 时间内没有新的任务到达，则该线程会被销毁。
4. `workQueue`：用于存放等待执行的任务的阻塞队列。常见的有如下几种类型：
   - `SynchronousQueue`：同步队列，只能存放一个任务。
   - `LinkedBlockingQueue`：链表阻塞队列，可以无限制存放任务。
   - `ArrayBlockingQueue`：数组阻塞队列，有界队列，因此需要指定队列大小。
5. `threadFactory`：用于创建新线程的工厂类。
6. `handler`：用于处理线程池队列中的任务的拒绝策略。当线程池中的线程数已达到最大值，且队列已满时，如果再有新的任务到达，则根据设置的拒绝策略来处理该任务。

### 3.14 介绍一下CachedThreadPool工作机制，线程爆满会怎样

`CachedThreadPool` 是 Java 中提供的一种可缩放的、无界的线程池，它会根据需要自动创建和回收线程，适合执行一些生命周期短的异步任务。具体工作机制如下：

1. 如果当前线程池中的线程数量小于核心线程数（默认为 0），则创建一个新的线程来执行任务，并将该线程添加到线程池中；
2. 如果当前线程池中的线程数量等于或大于核心线程数，且当前队列中没有任务，则将该线程设置为非核心线程，并在指定时间内关闭该线程；
3. 如果当前线程池中的线程数量等于或大于核心线程数，且当前队列中有任务，则将该任务添加到队列中等待执行；
4. 如果当前线程池中的线程数量超过了最大线程数（默认为 Integer.MAX_VALUE），则使用拒绝策略来处理新的任务。

如果线程池中的线程爆满，即所有线程都在执行任务并且队列中还有未执行的任务时，`CachedThreadPool` 会不断地创建新的线程来处理任务，直至达到系统的处理能力极限。这会导致 CPU 占用率过高、内存资源消耗等问题，因此需要合理配置线程池中的参数，并对任务进行优化，尽量避免线程爆满的情况。

### 3.15 wait和sleep的区别

`wait()` 和 `sleep()` 都是 Java 中用于线程间同步的方法。它们之间的区别如下：

1. `wait()` 方法是 Object 类中的方法，必须在同步块或同步方法中调用。当一个线程执行了 `wait()` 方法后，会释放掉它所持有的锁，并进入等待状态，直到其他线程调用相应对象上的 `notify()` 或 `notifyAll()` 方法唤醒它；
2. `sleep()` 方法是 Thread 类中的方法，可以在任何地方使用。当一个线程执行了 `sleep()` 方法后，不会释放它所持有的锁，而是进入睡眠状态，直到指定的时间到达后才会被唤醒。

另外，`wait()`、`notify()` 和 `notifyAll()` 必须在同步块或者同步方法中使用，并且必须针对同一个对象进行调用。

### 3.16 CAS是什么，优缺点

CAS（Compare And Swap）是一种乐观锁技术，它利用 CPU 提供的原子性操作实现了无锁并发。具体来说，CAS 操作需要三个参数：要修改的内存地址、期望的值和新的值。当需要更新一个共享变量时，只有当该变量的当前值与期望的值相同时，才会将新的值写入内存，并返回更新成功；否则就不做任何修改，返回更新失败。

CAS 的优点在于能够避免多线程环境下的竞态条件问题，实现了无锁并发。但是，它也存在以下几个缺点：

1. 自旋次数过多会导致 CPU 占用率过高，影响性能；
2. ABA 问题可能会导致数据不一致；
3. 只能针对一个共享变量进行操作，不能支持复合操作。

因此，在使用 CAS 进行无锁编程时，需要考虑自旋次数和 ABA 问题等因素，谨慎选择适合业务场景的并发控制方案。

### 3.17 ABA问题

ABA 问题指的是在使用 CAS 操作时可能出现的一种数据不一致问题。具体来讲，当一个线程执行 CAS 操作时，如果内存地址中的值等于期望的值，则将新的值写入该位置。然而，如果在这个过程中，有另一条线程将该位置的值从 A 改为 B，再从 B 改回 A，那么即使 CAS 操作成功，仍然无法检测到这个过程，导致数据不一致。

解决 ABA 问题的方法有以下两种：

1. 使用版本号：在进行 CAS 操作时，除了比较值之外，还可以比较对象的版本号，在每次修改对象时，都将版本号加一。这样即使在某个值被改变后又改回原来的值，其版本号也会改变，从而保证了数据的一致性。
2. 使用 AtomicStampedReference 类：AtomicStampedReference 是 Java 中提供的一种带版本号的原子引用类，它可以解决 ABA 问题。该类维护了一个整数类型的版本号和一个引用类型的值，每次 CAS 操作时，需要同时比较引用类型的值和版本号。

以上两种方法都可以有效地解决 ABA 问题，在实际开发中需要根据业务场景选取适合的方案。

### 3.18 用锁手写一下生产者消费者

```c++
#include <pthread.h>
#include <stdio.h>

#define MAX 10

int buffer[MAX];
int fill = 0;
int use = 0;

void put(int value) {
    buffer[fill] = value;
    fill = (fill + 1) % MAX;
}

int get() {
    int tmp = buffer[use];
    use = (use + 1) % MAX;
    return tmp;
}

int count = 0;

pthread_mutex_t mutex = PTHREAD_MUTEX_INITIALIZER;
pthread_cond_t empty = PTHREAD_COND_INITIALIZER;
pthread_cond_t fill = PTHREAD_COND_INITIALIZER;

void *producer(void *arg) {
    for (int i = 0; i < 20; i++) {
        pthread_mutex_lock(&mutex);
        while (count == MAX) {
            pthread_cond_wait(&empty, &mutex);
        }
        put(i);
        count++;
        pthread_cond_signal(&fill);
        pthread_mutex_unlock(&mutex);
    }
    return NULL;
}

void *consumer(void *arg) {
    int tmp = 0;
    while (1) {
        pthread_mutex_lock(&mutex);
        while (count == 0) {
            pthread_cond_wait(&fill, &mutex);
        }
        tmp = get();
        count--;
        printf("%d\n", tmp);
        pthread_cond_signal(&empty);
        pthread_mutex_unlock(&mutex);
    }
}

int main() {
    pthread_t p, c;
    pthread_create(&p, NULL, producer, NULL);
    pthread_create(&c, NULL, consumer, NULL);
    pthread_join(p, NULL);
    pthread_join(c, NULL);
    return 0;
}
```

### 3.19 乐观锁和悲观锁

在并发编程中，为了保证数据的一致性和安全性，需要对共享资源进行加锁。在加锁的过程中，可以采用悲观锁或者乐观锁。

- 悲观锁：悲观锁假设并发访问冲突的概率很高，因此每次访问共享资源时都会先加锁，这样其他线程就无法访问该资源，直到解锁后才能继续访问。常见的悲观锁机制包括互斥锁、读写锁等。
- 乐观锁：乐观锁假设并发访问冲突的概率很低，因此不会立即加锁，而是先读取共享资源，并在修改前检查是否有其他线程修改了该资源，如果没有，则直接进行修改，如果有，则放弃本次修改。常见的乐观锁机制包括版本号机制、CAS（Compare and Swap）等。

### 3.20 为什么要用线程池

在并发编程中，创建线程的开销较大，因为每个线程都要分配独立的资源，包括堆栈、寄存器等。而且过多的线程会导致系统资源的浪费和线程切换的开销增加，因此需要使用线程池来管理线程。

线程池实际上就是一个线程集合，其中包括若干个线程和一个任务队列。当需要执行任务时，只需要将任务放入任务队列中，线程池中的线程就会自动去取出任务并执行。线程执行完任务后，可以继续待命或者返回线程池中等待执行下一个任务，从而避免了每次都需要创建新的线程和销毁线程的开销。

线程池的使用有以下几个好处：

1. 提高效率：线程池可以重复利用线程，避免了线程创建和销毁的开销，提高了系统的性能和效率。
2. 控制并发数：通过限定线程池中的线程数，可以有效控制并发数，避免系统因过多线程导致的资源浪费和性能下降。
3. 优化响应速度：线程池可以提高任务的响应速度，因为线程池中的线程已经准备就绪，可以立即开始执行任务。
4. 简化编程：线程池可以简化编程，使得程序员只需要关注任务的实现，而不需要关注线程的管理和调度。

总之，线程池是一种常见的并发编程技术，可以提高系统的性能和效率，同时也可以简化编程。

### 3.21 synchronized实现原理

synchronized是Java中的关键字，可以用于对代码块或方法进行同步控制。其实现原理基于Java中的内置锁（也称为监视器锁）。当线程进入被synchronized修饰的代码块或方法时，会先尝试获取锁，如果这个锁没有被其他线程占用，则当前线程可以顺利获得锁并执行相应的操作，当线程执行完毕后会释放这个锁。如果这个锁已经被其他线程占用，则当前线程会被阻塞，等待其他线程释放该锁后再次尝试获取锁。

### 3.22 volatile作用、特点和使用场景

volatile是Java中的关键字，用于确保变量在多线程之间的可见性和有序性。具体地，使用volatile修饰的变量会被存储于主内存中而不是线程本地内存中，每次访问该变量时都会从主内存中读取最新的值，同时也会将修改后的值立即刷新回主内存，以保证所有线程看到的都是最新的值。另外，volatile还可以禁止指令重排序优化，从而确保程序的正确性。

volatile通常用于以下场景：

- 作为状态标记：通过设置一个volatile boolean型变量来表示某个状态是否发生改变，从而通知其他线程进行相应的操作。
- 保证变量的可见性：在多线程之间共享变量时，使用volatile可以确保变量的修改能够及时地被其他线程感知，避免出现数据不一致的问题。

### 3.23 不可见问题的原因

不可见问题指的是某个线程对某个变量的修改没有被其他线程感知。这种问题往往是由于缓存一致性导致的。现代计算机中，每个CPU都有自己的缓存和寄存器，当一个线程修改了某个变量的值时，这个变量的值可能会被缓存在CPU的缓存中，而没有立即刷新回主内存中。如果另外一个线程对同一个变量进行访问，由于没有从主内存中获取最新的值，就会导致该变量的值不一致，从而产生不可见问题。

### 3.24 线程安全的集合类

Java中提供了多种线程安全的集合类，如下：

- ConcurrentHashMap：线程安全的哈希表，支持高并发读写操作。
- CopyOnWriteArrayList/CopyOnWriteArraySet：线程安全的动态数组/集合，每次修改都会创建一个新的副本，支持读多写少的场景。
- ConcurrentLinkedQueue/ConcurrentLinkedDeque：线程安全的链表队列/双端队列，支持高并发读写操作。
- BlockingQueue/BlockingDeque：阻塞队列/双端队列，实现了生产者消费者模型，提供了多种阻塞等待的方法。

### 3.25 线程池的饱和策略

线程池中的饱和策略是指当任务队列已满且线程池中线程数已达到最大值时，新提交的任务应该如何处理。Java中提供了以下四种饱和策略：

- AbortPolicy（默认）：直接抛出RejectedExecutionException异常。
- CallerRunsPolicy：用调用线程来执行任务。
- DiscardOldestPolicy：丢弃等待最久的任务，然后执行当前任务。
- DiscardPolicy：直接丢弃新提交的任务。

## 4. Java IO

### 4.1 有哪些常见的 IO 模型?

UNIX 系统下， IO 模型一共有 5 种：**同步阻塞 I/O**、**同步非阻塞 I/O**、**I/O 多路复用**、**信号驱动 I/O** 和**异步 I/O**。

这也是我们经常提到的 5 种 IO 模型

### 4.2 BIO

当我们开发网络应用时，IO（输入/输出）操作是必不可少的。在 Java 中，BIO 是最早的 IO API，但是这种模型对于高并发场景来说并不适用。因此在 Java 1.4 中，引入了 NIO API 来替代 BIO。

BIO 的全称为 Blocking I/O（阻塞式 IO），它是 Java 中最早的 IO API，通过阻塞式的方式来处理 IO 操作。在 BIO 中，每个连接都需要独立的线程来处理，当并发连接数增大时，线程数量也会增加，最终会导致系统资源耗尽。

BIO 的核心组件包括：

- InputStream 和 OutputStream：负责读取和写入数据。
- ServerSocket 和 Socket：用于建立网络连接。

### 4.3 NIO

NIO 的全称为 Non-blocking I/O（非阻塞式 IO），它将 IO 操作抽象成三个核心概念：缓冲区（Buffer）、通道（Channel）和选择器（Selector）。这些概念都是基于 Java NIO API 的一部分，并且都被用于处理 NIO 的数据。

在 NIO 中，所有的 IO 操作都是异步非阻塞的，这意味着一个线程可以同时处理多个连接或请求。相较于 BIO，NIO 可以提供更高效的 IO 操作，因为它支持基于缓冲区、选择器等技术，使得单个线程可以处理多个连接和请求。

NIO 主要有以下几个核心组件：

- Buffer：缓冲区，负责存储数据。
- Channel：通道，负责完成数据的传输。
- Selector：选择器，负责监听多个 Channel 上的事件，从而可以实现单线程处理多个 Channel 的功能。

### 4.4 AIO

AIO 的全称为 Asynchronous I/O（异步 IO），它是在 Java 7 中引入的一个新的 IO API，与 NIO 不同的是，AIO 提供完全异步的非阻塞 IO 操作。应用程序不需要关注 IO 操作的完成时间，而是通过回调函数来处理 IO 操作的结果。

AIO 可以让一个线程或者少量线程处理多个并发的 IO 操作，从而提高系统的吞吐量和响应性能。AIO 主要有以下几个核心组件：

- AsynchronousServerSocketChannel 和 AsynchronousSocketChannel：用于建立网络连接。
- CompletionHandler：处理 IO 操作的结果。

在 AIO 中，应用程序需要提供一个回调函数（CompletionHandler）来处理 IO 操作的结果。当 IO 操作完成时，操作系统会将结果回调给应用程序，并执行回调函数。因此，在 AIO 中，应用程序不需要关注 IO 操作的状态和完成时间，只需要处理回调函数即可。

AIO 的优点在于可以处理大量的并发连接，而且性能比 NIO 和 BIO 更加出色。但是，AIO 也有一些缺点，其中最明显的就是它的实现比较复杂，需要使用异步回调函数，这使得代码变得更加难以维护。

## 5. JVM

### 5.1 JVM内存模型

Java虚拟机(JVM)内存模型主要分为线程私有区域和线程共享区域。线程私有区域包括程序计数器、虚拟机栈和本地方法栈；线程共享区域包括堆、方法区和直接内存。

### 5.2 描述类加载的过程

类的加载过程分为：加载、链接和初始化。其中，加载阶段是指查找并加载类的二进制数据；链接阶段是指验证、准备和解析类中的符号引用；初始化阶段是指执行类构造器"<clinit>"()方法的过程。

### 5.3 了解哪些垃圾回收算法，介绍一下

常见的垃圾回收算法包括标记-清除、复制、标记-整理和分代收集等。其中，标记-清除算法的缺点是会产生大量不连续的内存碎片，而复制算法需要将存活对象复制到另一个空间，浪费一定的空间。标记-整理算法是在标记阶段后将存活对象向一端移动，但也存在内存碎片问题。分代收集算法则是根据对象的生命周期将内存分为不同的代，针对不同代采用不同的垃圾回收算法。

### 5.4 介绍一下双亲委派机制，怎么打破

双亲委派机制是指在类加载器中，子类加载器会优先委派给父类加载器来尝试加载某个类。如果父类加载器无法加载，则再交给子类加载器自行加载。这样可以确保类加载的顺序和一致性。

要打破双亲委派机制，可以通过在ClassLoader的loadClass方法中重写逻辑，让子类加载器可以先于父类加载器进行类加载。

### 5.5 分代回收算法的详细过程

分代回收算法将内存分为新生代和老年代两部分。新生代使用复制算法，将存活对象复制到另一个空间中，然后清除非存活对象。老年代采用标记-整理算法，标记存活对象，将它们向一端移动，释放未被占用的内存空间。

同时，分代回收算法还包括了针对长期存活的对象使用独立的老年代、对不同年龄段的对象采用不同的回收策略等优化措施。

### 5.6 了解哪些垃圾收集器

常见的垃圾收集器包括：串行收集器、并行收集器、并发收集器和G1收集器等。其中，串行收集器是单线程进行垃圾回收，适用于低配置的服务器或客户端机器；并行收集器采用多线程进行垃圾回收，提高了效率；并发收集器能够在垃圾回收过程中不阻塞应用程序的执行；G1收集器是一款面向服务端应用的垃圾收集器，具有高效的内存回收和可预测的停顿时间等特点。

### 5.7 哪些操作可能导致out of memory

常见的导致out of memory的操作包括：内存泄漏、创建大对象、频繁创建对象、数据量过大、持续运行时间过长等。

### 5.8 G1收集器回收垃圾的流程

G1收集器采用了分代和区域化的思想来管理堆内存。它将整个堆空间划分为多个大小相等的区域（Region），每个区域可能是Eden空间、Survivor空间或Old空间中的一个或多个。

G1的运作过程如下：

1. 初始标记阶段：暂停所有应用线程，标记出根对象和直接与之关联的对象，并记录整个老年代中有哪些区块是需要被扫描的；
2. 并发标记阶段：并发标记阶段开始后，应用线程和垃圾回收线程同时执行，垃圾回收线程从GC Roots出发遍历对象图，标记可达对象。在这个过程中，如果应用线程要访问某个已经被标记为垃圾的对象，则会重新标记该对象，使其不被回收；
3. 最终标记阶段：暂停所有应用线程，完成最后一次标记工作，确定哪些对象可以被回收；
4. 筛选回收阶段：根据回收价值和成本进行生成回收计划，选择合适的区块进行垃圾回收；
5. 混合模式：当堆空间使用率达到一定阈值时，G1收集器会在进行并发垃圾回收的同时，还会进行部分区块的整理和压缩，以尽可能减少内存碎片。

### 5.9 对象分代，及其在堆中是如何分布的

对象分代是指根据对象的生命周期将堆空间划分为不同的代。JVM中一般将堆空间分为新生代和老年代两个部分，其中新生代又分为Eden空间、Survivor空间From区和To区。具体分配如下：

1. Eden空间：新创建的对象首先被分配到Eden空间，当Eden空间满时触发Minor GC；
2. Survivor空间：当一个对象从Eden空间经过第一次Minor GC后仍然存活，则将其拷贝到Survivor空间From区，并清空Eden空间。在第二次Minor GC时，将Survivor空间From区中的存活对象拷贝至Survivor空间To区，同时清空Survivor空间From区。这个过程中，每个Survivor空间大小为整个新生代的1/3；
3. Old空间：当Survivor空间To区域内存满时，将其中的存活对象转移到老年代。老年代主要存放长生命周期的对象，当老年代满时就会触发Full GC。

### 5.10 怎么确定对象是垃圾

在Java中，判断对象是否为垃圾的依据是"GC Roots"到该对象是否有可达路径，如果没有，则该对象被视为垃圾。其中，GC Roots包括虚拟机栈中引用的对象、方法区中类静态属性引用的对象和常量引用的对象等。

### 5.11 三色标记法是什么

三色标记法是一种用于标记垃圾回收算法中对象可达性的技术。它将所有待回收的对象标记为白色，所有已经被扫描到但是还未确定是否存活的对象标记为灰色，所有已经确定存活的对象标记为黑色。在标记阶段完成后，只有白色对象被认定为垃圾并进行回收，而灰色和黑色对象则保留。

### 5.12 GC Roots包括哪些对象

GC Roots包括以下对象：

1. 虚拟机栈（栈帧中的本地变量表）中引用的对象；
2. 方法区中类静态属性引用的对象；
3. 方法区中常量引用的对象；
4. 本地方法栈中JNI(Java Native Interface)引用的对象。

### 5.13 什么情况下新生代会成为老年代

新生代对象在经过若干次垃圾回收后如果仍然存活，则会被转移到老年代中。具体来说，当Survivor空间无法容纳存活对象时，就会通过分配担保机制把这些对象直接晋升到老年代中。此外，大对象也可能被直接分配到老年代中，从而使新生代成为空闲状态，这种情况也会引起新生代被回收的触发条件改变。

## 6. 计算机网络

### 6.1 介绍一下TCP和UDP

TCP（Transmission Control Protocol）和UDP（User Datagram Protocol）都是计算机网络中的传输层协议，用于在不同设备之间传输数据。

TCP是一种面向连接、可靠的传输协议。它通过三次握手等方式建立连接，然后通过滑动窗口和确认应答等机制来保证数据的可靠传输。TCP适用于需要保证数据完整性和可靠性的场景，例如文件传输、电子邮件、网页浏览等。

UDP是一种无连接、不可靠的传输协议。它不需要建立连接和维护连接状态，直接将数据报发送到目标地址即可。由于不需要进行复杂的连接管理和流量控制，UDP传输速度更快，但也会存在数据损失或乱序等问题。UDP适用于实时性要求较高、传输速度优先的场景，例如视频会议、在线游戏等。

| 特性        | TCP                            | UDP                  |
| ----------- | ------------------------------ | -------------------- |
| 连接方式    | 面向连接                       | 无连接               |
| 可靠性      | 可靠传输                       | 不可靠传输           |
| 消息边界    | 有边界                         | 无边界               |
| 传输速度    | 慢                             | 快                   |
| 段/报文长度 | 可变                           | 固定                 |
| 应用场景    | 文件传输、电子邮件、网页浏览等 | 视频会议、在线游戏等 |

### 6.2 三次握手能不能两次，为什么？

三次握手是TCP协议中用于建立连接的过程。假设只有两次握手，由于无法确认客户端是否成功接收到了服务器发送的SYN+ACK包，因此服务器会在一个超时时间之后重新发送SYN+ACK包。如果还是不成功，服务器将再次尝试发送。这样会导致网络资源浪费和延迟。

因此，两次握手的方式没有办法保证可靠性，而三次握手则能够确保双方都能正常通信，同时也能够避免网络资源的浪费和延迟。

### 6.3 为什么握手是三次，挥手是四次？

在TCP协议中，握手和挥手分别涉及到连接的建立和断开。

握手需要三次是因为：

1. 第一次握手：客户端向服务器发送连接请求，其中包含一个同步序列号（SYN）。
2. 第二次握手：服务器接收到客户端的请求后，回复一个带有确认序号（ACK）和同步序列号（SYN）的数据包，表示已接收到请求并同意建立连接。
3. 第三次握手：客户端接收到服务器的确认信息后，回复一个带有确认序号（ACK）的数据包，表示已经接收到了服务器的确认信息。

三次握手确保了双方都同意建立连接，并且双方都能够正常通信。

而挥手需要四次是因为：

1. 第一次挥手：其中一方发送一个关闭连接请求（FIN）。
2. 第二次挥手：另一方接收到关闭请求后，向请求方发送一个ACK包，表示已经接收到了关闭请求。
3. 第三次挥手：另一方也发送一个关闭请求（FIN）。
4. 第四次挥手：请求方接收到关闭请求后，回复一个ACK包，表示已经接收到了关闭请求。

由于TCP是全双工的协议，所以在关闭连接时需要进行两个方向上的关闭，即每个方向上都需要发送一个FIN和对应的ACK。因此，挥手需要四次。

### 6.4 HTTPS的加密机制

HTTPS（Hypertext Transfer Protocol Secure）是基于HTTP的加密通信协议，它使用加密机制来保护数据在客户端和服务器之间的传输安全。以下是HTTPS的加密机制：

1. **SSL/TLS协议**：HTTPS使用SSL（Secure Sockets Layer）或其继任者TLS（Transport Layer Security）协议来建立加密连接。SSL/TLS协议提供了身份验证、密钥交换和加密等功能，确保通信的机密性和完整性。
2. **证书认证**：在HTTPS连接的建立过程中，服务器需要提供一个数字证书，用于验证服务器的身份。证书由受信任的第三方机构（称为证书颁发机构或CA）签发，其中包含了服务器的公钥和其他相关信息。
3. **公钥加密**：客户端和服务器在建立连接时使用公钥加密算法进行密钥交换。服务器将自己的公钥发送给客户端，客户端使用该公钥加密一个随机生成的对称密钥，并将其发送回服务器。
4. **对称加密**：一旦客户端和服务器都具有相同的对称密钥，它们就可以使用对称加密算法（如AES或DES）对传输的数据进行加密和解密。对称加密算法效率高，但需要确保密钥在传输过程中的安全性。
5. **数据完整性验证**：HTTPS使用消息摘要算法（如SHA）对数据进行哈希计算，生成摘要。摘要与数据一起传输到接收方，接收方使用相同的哈希算法对接收到的数据进行计算，并将计算得到的摘要与接收到的摘要进行比较，以验证数据的完整性。

通过以上加密机制，HTTPS保证了数据在传输过程中的机密性、完整性和身份验证，提供了更安全的通信方式。

### 6.5 TCP的粘包拆包

TCP（Transmission Control Protocol）是一种可靠的传输协议，它将数据划分为称为"段"（Segment）的较小单元进行传输。然而，在实际的网络通信中，由于网络传输的不确定性，可能会导致TCP的粘包和拆包问题。

**粘包**是指发送方在发送数据时，将多个数据包组合成一个较大的数据包发送，接收方在接收时无法准确判断每个数据包的边界，从而导致数据解析错误。

**拆包**是指发送方将一个较大的数据包拆分成多个较小的数据包发送，接收方在接收时需要将这些数据包重新组装成完整的数据。

TCP粘包和拆包问题通常由以下几个因素引起：

1. **Nagle算法**：Nagle算法是TCP默认启用的一种算法，它通过将小的数据包组合成更大的数据包进行发送，以提高网络传输效率。这可能导致粘包现象的发生。
2. **延迟确认**：TCP采用延迟确认机制，即接收方并不会立即发送确认消息，而是在一段时间内进行延迟，以便将多个确认消息组合成一个消息发送。这可能导致粘包现象的发生。
3. **网络拥塞**：在网络拥塞的情况下，TCP可能会将多个数据包合并成一个较大的数据包发送，从而导致粘包现象的发生。

为了解决TCP粘包和拆包问题，可以采取以下几种方法：

1. **消息长度固定**：发送方在每个数据包中添加固定长度的消息头，接收方根据消息头中指定的长度来切分数据包，从而确保每个数据包的边界。
2. **特殊字符分隔**：发送方在数据包之间添加特殊的分隔符，接收方根据分隔符来切分数据包，从而区分每个数据包。
3. **消息头中包含长度字段**：发送方在消息头中添加表示消息长度的字段，接收方首先读取长度字段，然后根据长度读取对应长度的数据，以确保数据包的完整性。

以上方法可以有效地解决TCP粘包和拆包问题，确保数据的正确传输。

### 6.6 浏览器输入一个网址后发生的过程

当在浏览器中输入一个网址后，会发生以下过程：

1. **URL解析**：浏览器首先解析输入的网址（URL），提取出协议（如HTTP、HTTPS）、主机名（如www.example.com）和路径（如/page）等信息。
2. **DNS解析**：浏览器向本地域名服务器（如ISP提供的DNS服务器）发送DNS解析请求，将主机名解析为对应的IP地址。如果本地DNS服务器没有缓存该域名的IP地址，则会向根域名服务器进行迭代查询，最终获得目标服务器的IP地址。
3. **建立TCP连接**：浏览器使用目标服务器的IP地址和默认端口号（HTTP为80，HTTPS为443），通过TCP三次握手建立与服务器的连接。
4. **发送HTTP请求**：一旦TCP连接建立，浏览器会发送HTTP请求，包括请求行（请求方法、路径等）、请求头部（如浏览器类型、支持的压缩算法等）和请求体（POST请求时携带的数据）。
5. **服务器处理请求**：服务器接收到HTTP请求后，根据请求的路径和参数等信息，进行相应的处理。处理的结果通常是生成一个HTTP响应。
6. **接收HTTP响应**：服务器将生成的HTTP响应发送回浏览器。HTTP响应包括状态行（状态码和状态描述）、响应头部（如服务器类型、内容类型等）和响应体（服务器返回的数据）。
7. **渲染页面**：浏览器接收到HTTP响应后，会解析响应头部和响应体。如果响应体是HTML文档，浏览器会根据HTML结构开始渲染页面，解析并加载其中的CSS、JavaScript等资源，并根据相应的规则进行布局和渲染。
8. **显示页面**：当页面渲染完成后，浏览器会将页面显示在用户界面上，用户可以看到网页内容并与之进行交互。

以上过程描述了用户在浏览器中输入网址后，浏览器与服务器之间进行的一系列交互和处理，最终将网页内容展示给用户的过程。

### 6.7 DNS原理

DNS（Domain Name System）是一个分布式的命名系统，用于将域名（如www.example.com）映射到对应的IP地址。DNS的工作原理如下：

1. **域名解析器**：当用户在浏览器中输入一个域名时，操作系统中的域名解析器会首先检查本地DNS缓存，如果缓存中存在对应的IP地址，则直接返回结果，否则会进入下一步。
2. **递归查询**：域名解析器向本地域名服务器（如ISP提供的DNS服务器）发送递归查询请求。本地域名服务器负责进行迭代查询，从根域名服务器开始，逐级向下查询，直到找到目标域名的IP地址，然后将结果返回给域名解析器。
3. **迭代查询**：本地域名服务器首先向根域名服务器发送查询请求，根域名服务器会返回顶级域名（如.com、.org）的权威域名服务器的地址。然后，本地域名服务器再向权威域名服务器发送查询请求，依此类推，直到找到目标域名的IP地址。
4. **DNS缓存**：在查询过程中，本地域名服务器会将查询的结果缓存一段时间。这样，当下次有相同的查询请求时，就可以直接返回缓存的结果，避免重复的查询过程。
5. **TTL（Time to Live）**：每个DNS记录都有一个TTL值，表示该记录在缓存中的有效时间。当缓存的TTL过期后，本地域名服务器会重新进行查询，以获取最新的IP地址。

通过以上步骤，DNS实现了域名到IP地址的映射。它采用分布式的结构，将查询请求分散到多个服务器上，提高了系统的可靠性和性能。

### 6.8 HTTP报文结构

HTTP（Hypertext Transfer Protocol）是一种用于在客户端和服务器之间传输数据的协议。HTTP报文是在HTTP通信中传输的数据块，由请求报文和响应报文组成，其结构如下：

1. **请求报文**：

   ![HTTP请求报文结构](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages/httpmsgstructure2.png)

   - **请求行**：包含请求方法（GET、POST等）、请求的URL和协议版本（如HTTP/1.1）。
   - **请求头部**：包含一系列的键值对，表示请求的附加信息。常见的头部字段包括Host（请求的主机名）、User-Agent（用户代理，通常是浏览器的标识）、Content-Type（请求体的类型）等。
   - **请求体**：对于某些请求，如POST请求，可以携带请求体，用于传输数据给服务器。

2. **响应报文**：

   ![HTTP响应报文结构](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages/http_response_headers3.png)

   - **状态行**：包含协议版本（如HTTP/1.1）、状态码（表示请求的处理结果）和状态描述（对状态码的简短描述）。
   - **响应头部**：包含一系列的键值对，表示响应的附加信息。常见的头部字段包括Content-Type（响应体的类型）、Content-Length（响应体的长度）等。
   - **响应体**：响应报文的主体部分，包含服务器返回的数据。

HTTP报文的结构清晰明确，请求报文和响应报文通过客户端和服务器之间的交互来传输数据。报文的头部和体部都是以纯文本的形式进行传输，使得HTTP协议具有可读性和可扩展性。

### 6.9 Keep Alive Time的作用

Keep Alive Time是指在无数据传输的情况下，保持TCP连接的时间。它用于检测处于空闲状态的连接是否仍然可用。如果在Keep Alive Time内没有数据传输，操作系统将发送心跳包给对方主机以确认连接的可靠性。如果对方主机未能正确响应心跳包，操作系统会认为连接已断开，并关闭该连接。

### 6.10 GET和POST

GET和POST是HTTP协议中最常见的两种请求方法。

GET用于从服务器获取资源，它将请求的参数附加在URL的末尾，以明文形式发送给服务器。GET请求是幂等的，即多次相同的GET请求会得到相同的结果，不会对服务器状态产生影响。

POST用于向服务器提交数据，它将请求的参数包含在请求体中，并以密文形式发送给服务器。POST请求对服务器状态可能产生影响，比如创建新资源、更新数据等操作。

### 6.11 Cookie和Session的作用和区别

Cookie和Session是用于在Web应用中跟踪和管理用户状态的机制。

Cookie是在客户端存储的小型文本文件，由服务器发送给浏览器，并保存在浏览器的本地文件中。它可以存储一些用户相关的信息，如登录凭证、用户偏好等。浏览器在后续请求中会自动将该Cookie发送给服务器，用于识别和验证用户身份。

Session是在服务器端维护的用户会话信息。服务器会为每个会话分配一个唯一的Session ID，并将该ID存储在Cookie中或通过URL重写传递给客户端。服务器使用Session ID来查找和恢复用户的会话状态，包括用户的登录状态、购物车内容等。

区别在于：

- Cookie存储在客户端，Session存储在服务器端。
- Cookie在每次请求中都会被发送给服务器，而Session ID可以通过不同的方式传递给服务器。
- Cookie可以在客户端被修改和删除，Session只能在服务器端被管理。

### 6.12 TCP保证可靠传输的各项措施及其作用

TCP通过以下措施来保证可靠传输：

- 序列号与确认应答：每个TCP报文段都有一个序列号，接收方通过发送确认应答（ACK）来确认已接收到的报文段，发送方根据确认应答来判断是否需要重传丢失的报文段。
- 超时重传：发送方在发送数据后会启动一个定时器，如果在超时时间内未收到确认应答，发送方会重新发送该数据。
- 滑动窗口：发送方和接收方都维护一个滑动窗口，用于控制发送和接收的数据量。滑动窗口机制允许发送方连续发送多个报文段，而不需要等待每个报文段的确认应答，从而提高传输效率。
- 流量控制：TCP使用滑动窗口来进行流量控制，接收方可以通过调整窗口大小来告知发送方自己的接收能力，从而控制发送速率，防止接收方被过多的数据淹没。
- 拥塞控制：TCP使用拥塞窗口来进行拥塞控制，发送方根据网络的拥塞程度来动态调整发送速率，以避免网络拥塞并保证整体的网络稳定性和公平性。

这些措施的作用是确保数据能够在不可靠的网络中可靠地传输，并避免网络拥塞导致的性能下降和数据丢失。

### 6.13 HTTP各版本的区别和目前主流版本

HTTP是超文本传输协议，各版本之间有以下区别：

- HTTP/1.0：最早的HTTP版本，每次请求都需要建立一个新的TCP连接，没有复用连接的机制。
- HTTP/1.1：引入了持久连接（Keep-Alive），可以在一个TCP连接上发送多个请求和响应，减少了连接建立的开销。还支持管道化（Pipeline），允许客户端发送多个请求而不需要等待每个请求的响应。
- HTTP/2：引入了二进制传输，将请求和响应消息分割为帧，并通过多路复用在单个TCP连接上并发发送多个请求和响应。还支持头部压缩、服务器推送等新特性，提高了性能和效率。
- HTTP/3：基于QUIC协议，通过UDP传输而不是TCP，具有更低的延迟和更好的拥塞控制。同时支持多路复用、头部压缩等HTTP/2的特性。

目前主流版本是HTTP/1.1和HTTP/2，而HTTP/3正在逐渐得到支持和采用。

### 6.14 三次握手和四次挥手的详细描述

三次握手（Three-way Handshake）是建立TCP连接的过程：

1. 客户端向服务器发送一个带有SYN（同步）标志的TCP报文段，请求建立连接。
2. 服务器收到请求后，回复一个带有SYN/ACK标志的TCP报文段，表示同意建立连接。
3. 客户端收到服务器的回复后，再发送一个带有ACK标志的TCP报文段，表示确认连接建立。

四次挥手（Four-way Handshake）是关闭TCP连接的过程：

1. 客户端向服务器发送一个带有FIN（结束）标志的TCP报文段，请求关闭连接。
2. 服务器收到请求后，回复一个带有ACK标志的TCP报文段，表示确认关闭请求。
3. 服务器完成自己的数据传输后，向客户端发送一个带有FIN标志的TCP报文段，请求关闭连接。
4. 客户端收到请求后，回复一个带有ACK标志的TCP报文段，表示确认关闭请求。

在四次挥手过程中，客户端和服务器都需要发送FIN和ACK标志，确保双方都完成了关闭操作，才能最终断开连接。

### 6.15 四次挥手中TIME_WAIT的作用和实际时长

在四次挥手的最后一步，即客户端发送ACK确认关闭请求后，客户端和服务器都会进入TIME_WAIT状态。TIME_WAIT状态的作用是确保网络中所有的报文段都被正常传输和处理完毕，以防止出现延迟的报文段导致连接混乱。

TIME_WAIT状态的实际时长是根据具体的实现和配置而定，通常为2倍的报文段最大生存时间（Maximum Segment Lifetime，MSL）。MSL是一个固定的时间，一般为2分钟，即TIME_WAIT状态的持续时间为4分钟。在此期间，处于TIME_WAIT状态的端口不能被再次使用，以避免可能的连接混乱和重复连接。完成TIME_WAIT状态后，端口释放并可供新的连接使用。

### 6.16 应用层和传输层有什么协议

应用层常见的协议有：

- HTTP（超文本传输协议）：用于在客户端和服务器之间传输超文本资源。
- FTP（文件传输协议）：用于在客户端和服务器之间传输文件。
- DNS（域名系统）：用于将域名解析为对应的IP地址。
- SMTP（简单邮件传输协议）：用于发送电子邮件。
- POP3（邮局协议版本3）：用于接收电子邮件。

传输层常见的协议有：

- TCP（传输控制协议）：提供可靠的、面向连接的数据传输。
- UDP（用户数据报协议）：提供不可靠的、面向无连接的数据传输。

这些协议在网络通信中扮演着重要的角色，实现了不同的功能和服务。

### 6.17 TCP拥塞控制、滑动窗口和确认号

TCP拥塞控制是一种防止网络拥塞的机制，通过动态调整发送速率来避免网络的过载。

滑动窗口是TCP的一种流量控制机制，用于控制发送方发送数据的速率。发送方和接收方各自维护一个滑动窗口，通过调整窗口大小来控制发送和接收的数据量，以适应网络的接收能力。

确认号（Acknowledgment Number）是TCP报文段中的一个字段，用于确认接收方已成功接收到的数据。发送方根据接收方发送的确认号来确定下一次发送数据的起始位置。

这些机制共同协作，通过动态调整发送速率、控制数据流量和确认数据接收，确保数据的可靠传输和网络的稳定性。

### 6.18 OSI七层模型

![OSI 七层模型](https://oss.javaguide.cn/github/javaguide/cs-basics/network/osi-7-model.png)

### 6.19 HTTP常见状态码总结

HTTP协议定义了多种状态码，用于表示请求的处理结果和服务器的响应状态。以下是一些常见的HTTP状态码及其含义：

- 200 OK：请求成功，服务器正常处理并返回请求的资源。
- 301 Moved Permanently：永久重定向，请求的资源已被永久移动到新的URL。
- 400 Bad Request：客户端发送的请求有错误，服务器无法理解。
- 401 Unauthorized：请求要求身份验证，客户端需要提供有效的身份凭证。
- 403 Forbidden：服务器拒绝请求，客户端没有访问请求资源的权限。
- 404 Not Found：请求的资源不存在。
- 500 Internal Server Error：服务器在处理请求时遇到了意外错误。
- 503 Service Unavailable：服务器暂时无法处理请求，通常是由于过载或维护等原因。

这些状态码提供了对请求处理结果和服务器状态的信息，方便客户端和服务器进行交互和错误处理。

### 6.20 ARP协议详解

ARP（Address Resolution Protocol）是用于将IP地址映射到MAC地址的网络协议。在局域网中，发送方通过ARP协议获取目标设备的MAC地址，以便将数据包正确地发送到目标设备。

具体的工作流程如下：

1. 发送方主机需要发送数据包给目标设备，但只知道目标设备的IP地址。
2. 发送方主机首先检查自己的ARP缓存表，查看是否有目标设备的IP地址对应的MAC地址。
3. 如果ARP缓存表中没有目标设备的MAC地址，则发送方主机发送一个ARP请求广播，请求目标设备的MAC地址。
4. 局域网中的所有设备都会收到ARP请求广播，但只有目标设备会响应，并将自己的MAC地址发送给发送方主机。
5. 发送方主机接收到目标设备的MAC地址后，将其存储在ARP缓存表中，并使用该MAC地址发送数据包给目标设备。

ARP协议在局域网中实现了IP地址到MAC地址的映射，使得发送方主机能够正确地将数据包发送到目标设备。

### 6.21 NAT协议详解

NAT（Network Address Translation）是一种网络协议，用于在网络设备之间转换和映射IP地址。它主要用于解决IPv4地址不足的问题，并实现多个设备共享一个公网IP地址的功能。

NAT协议的工作原理如下：

1. 内部设备发送请求到公网，请求中的源IP地址为内部设备的私有IP地址。
2. NAT设备接收到请求后，将源IP地址替换为NAT设备的公网IP地址，并记录映射关系。
3. NAT设备将修改后的请求发送到公网。
4. 公网服务器接收到请求后，将响应发送到NAT设备的公网IP地址。
5. NAT设备根据记录的映射关系，将响应中的目标IP地址替换为内部设备的私有IP地址，并将响应发送给内部设备。

通过NAT协议，内部设备可以使用私有IP地址与公网进行通信，而对外部网络来说，只能看到NAT设备的公网IP地址。这样可以有效地减少公网IP地址的使用量，提高网络的安全性，并实现多个设备共享一个公网IP地址的功能。

### 6.22 IP协议的作用

IP（Internet Protocol）协议是互联网中最基础的网络协议之一，它负责实现数据在网络中的传输和路由。IP协议定义了数据报的格式和传输规则，以确保数据能够在网络中正确地传递。

IP协议的主要作用包括：

1. 路由选择：IP协议通过使用路由表和路由算法，确定数据包在网络中的传输路径。它能够根据目标IP地址进行路由选择，使数据能够从发送方传输到目标设备。
2. 分组交换：IP协议将数据报划分为一组小的数据包（称为IP数据报或IP包），每个数据包都有源IP地址和目标IP地址。这些数据包独立传输，并通过网络中的路由器进行转发，最终到达目标设备。
3. 寻址和标识：IP协议使用IP地址对每个网络上的设备进行唯一标识。发送方将数据包中的目标IP地址设置为目标设备的IP地址，以便数据包能够正确地路由到目标设备。
4. 片段和重组：当数据包的大小超过网络的最大传输单元（MTU）时，IP协议将数据包分割成多个较小的片段进行传输，并在目标设备处重新组装。这确保了即使在网络中有限制的情况下，数据仍能够被传输和接收。

IP协议在互联网中扮演着关键的角色，提供了可靠的数据传输和路由功能。

### 6.23 IPv4和IPv6

IPv4（Internet Protocol version 4）和IPv6（Internet Protocol version 6）是IP协议的不同版本。

IPv4是最早和目前广泛使用的版本，它使用32位的地址空间，共有约42亿个可用的IP地址。IPv4地址由4个八位数字（0-255）组成，以点分十进制表示（例如192.168.0.1）。然而，由于IPv4地址空间的有限性，导致IPv4地址短缺的问题。

IPv6是为解决IPv4地址短缺问题而引入的新版本。IPv6使用128位的地址空间，拥有约340万亿亿亿亿（3.4 × 10^38）个可用的IP地址。IPv6地址采用8组四位十六进制数字（例如2001:0db8:85a3:0000:0000:8a2e:0370:7334），地址表示更为简洁且具有扩展性。

IPv6除了解决地址短缺问题外，还引入了一些新特性，如自动地址配置、改进的安全性和支持更多的服务类型。然而，由于IPv6的广泛采用需要网络设备和运营商的支持，目前IPv4仍然是互联网中最常用的协议版本。

### 6.24 常见的基于TCP的协议

TCP（Transmission Control Protocol）是一种面向连接的、可靠的传输协议，它提供了端到端的数据传输和流量控制功能。基于TCP协议衍生出了许多常见的协议，其中一些包括：

- HTTP（Hypertext Transfer Protocol）：用于在客户端和服务器之间传输超文本资源，是互联网上最常用的应用层协议。
- FTP（File Transfer Protocol）：用于在客户端和服务器之间传输文件，提供文件的上传和下载功能。
- SMTP（Simple Mail Transfer Protocol）：用于发送电子邮件，它定义了电子邮件的传输规则和交互过程。
- POP3（Post Office Protocol version 3）：用于接收电子邮件，客户端使用POP3协议从邮件服务器上下载邮件。
- IMAP（Internet Message Access Protocol）：也用于接收电子邮件，与POP3类似，但提供更丰富的功能，如邮件的同步和远程管理。

这些协议都建立在TCP协议之上，利用TCP的可靠性和连接性来实现数据的可靠传输和通信。

## 7. 操作系统

## 8. 数据库基础

### 8.1 ACID兼容性

#### 事务

事务是指一个或一组相关的数据库操作，作为一个逻辑单元进行执行，要么全部执行成功，要么全部回滚。一个事务通常包含一组数据库操作，这些操作要么全部执行成功并永久保存到数据库中，要么全部回滚并撤销之前所做的修改，恢复到事务开始时的状态。

事务是数据库中保证数据一致性和完整性的重要机制。通过事务，可以保证多个并发的数据库操作不会相互干扰，保证数据的正确性和一致性。在事务中，所有的数据库操作要么全部成功，要么全部失败，这样可以保证数据的完整性，避免了因为操作中途失败而导致的数据不一致性问题。

#### ACID

ACID是数据库事务的四个核心属性，它们分别是：

1. 原子性（Atomicity）：事务是一个不可分割的操作，要么全部执行成功，要么全部回滚。如果事务中的任何一个操作失败，整个事务都应该回滚，恢复到执行事务之前的状态。原子性保证了数据的完整性，即不会出现部分执行的情况。
2. 一致性（Consistency）：事务前后数据的完整性保持一致。当事务成功执行时，系统必须处于一致的状态。一致性保证了数据的正确性。
3. 隔离性（Isolation）：多个事务之间应该相互隔离，一个事务的执行不应该影响其他事务的执行。隔离性可以避免由并发访问引起的一些问题，例如脏读、不可重复读和幻读等。
4. 持久性（Durability）：一个事务一旦提交，它的结果应该永久保存下来，即使系统崩溃也不应该丢失。持久性保证了数据的可靠性。

如果一个DBMS遵循ACID属性，则可以保证数据的完整性、一致性和持久性。ACID兼容性是指数据库系统在处理事务时，能够满足这些属性，并且能够保证多个事务之间的相互隔离，即使多个事务同时执行也不会相互干扰。

ACID兼容性对于一些需要高度可靠性和数据完整性的应用非常重要，如金融和医疗等领域。在这些领域，数据的准确性和完整性至关重要，因此需要使用ACID兼容的DBMS来保证数据的正确性。

### 8.2 SQL 和 NoSQL 有什么区别？

|              | SQL 数据库                                                   | NoSQL 数据库                                                 |
| :----------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 数据存储模型 | 结构化存储，具有固定行和列的表格                             | 非结构化存储。文档：JSON 文档，键值：键值对，宽列：包含行和动态列的表，图：节点和边 |
| 发展历程     | 开发于 1970 年代，重点是减少数据重复                         | 开发于 2000 年代后期，重点是提升可扩展性，减少大规模数据的存储成本 |
| 例子         | Oracle、MySQL、Microsoft SQL Server、PostgreSQL              | 文档：MongoDB、CouchDB，键值：Redis、DynamoDB，宽列：Cassandra、 HBase，图表：Neo4j、 Amazon Neptune、Giraph |
| ACID 属性    | 提供原子性、一致性、隔离性和持久性 (ACID) 属性               | 通常不支持 ACID 事务，为了可扩展、高性能进行了权衡，少部分支持比如 MongoDB 。不过，MongoDB 对 ACID 事务 的支持和 MySQL 还是有所区别的。 |
| 性能         | 性能通常取决于磁盘子系统。要获得最佳性能，通常需要优化查询、索引和表结构。 | 性能通常由底层硬件集群大小、网络延迟以及调用应用程序来决定。 |
| 扩展         | 垂直（使用性能更强大的服务器进行扩展）、读写分离、分库分表   | 横向（增加服务器的方式横向扩展，通常是基于分片机制）         |
| 用途         | 普通企业级的项目的数据存储                                   | 用途广泛比如图数据库支持分析和遍历连接数据之间的关系、键值数据库可以处理大量数据扩展和极高的状态变化 |
| 查询语法     | 结构化查询语言 (SQL)                                         | 数据访问语法可能因数据库而异                                 |

## 9. MySQL & PostgreSQL

### 9.1 MySQL索引

https://javaguide.cn/database/mysql/mysql-index.html

## 10. Redis & MongoDB

#### 10.1 项目中哪里会用到Redis

在项目中，Redis（Remote Dictionary Server）可以应用于多个方面。以下是一些常见的使用场景：

1. 缓存：Redis作为缓存存储介质非常受欢迎。它可以将频繁访问的数据存储在内存中，以提高读取速度并减轻后端数据库的负载。常见的应用包括存储用户会话数据、页面片段、查询结果等。
2. 消息队列：Redis支持发布-订阅模型，可以用作轻量级的消息代理或消息队列。它可以在不同的组件之间传递消息，并提供消息的持久化和订阅者模式等功能。
3. 计数器和统计数据：Redis提供原子操作，可以用于实现计数器和统计数据的存储。它可以用于记录用户访问次数、网站流量、在线用户数等信息。
4. 分布式锁：Redis提供了基于原子操作的分布式锁实现。在分布式系统中，可以使用Redis的锁功能来确保在多个节点上的操作互斥性，避免资源竞争和数据不一致的问题。
5. 会话管理：Redis可以用于存储会话数据，特别是在负载均衡的环境下。通过将会话数据存储在Redis中，可以实现跨多个服务器的会话共享和管理。
6. 实时数据处理：由于Redis具有快速的读写性能和发布-订阅模型，它可以用于实时数据处理场景，例如实时分析、实时日志处理等。
7. 地理位置和地理索引：Redis提供了一些地理位置相关的数据结构和命令，可以用于存储和查询地理位置信息，如地理位置坐标、半径搜索等。

需要注意的是，Redis是一个内存数据库，数据存储在内存中，因此其容量受限于服务器的内存大小。此外，为了确保数据持久性，可以将Redis配置为定期将数据写入磁盘或使用持久化机制（如快照和日志追加）进行数据持久化。

#### 10.2 项目中哪里会用到MongoDB

在项目中，MongoDB（MongoDB）可以应用于多个方面。以下是一些常见的使用场景：

1. 数据存储：MongoDB是一个面向文档的数据库，可以存储结构灵活的文档数据。它适用于存储各种类型的数据，如用户配置信息、日志数据、产品目录等。
2. Web应用程序：MongoDB对于开发Web应用程序非常有用。它可以存储和检索与用户相关的数据，如用户配置文件、社交媒体帖子、评论等。
3. 日志处理：MongoDB可以用于存储和分析大量的日志数据。它可以处理高写入和高读取负载，并提供查询和聚合功能，以便进行日志数据分析和可视化。
4. 实时分析：由于MongoDB具有良好的读取性能和灵活的数据模型，它可以用于实时分析场景。可以将实时生成的数据存储在MongoDB中，并使用其查询和聚合功能进行实时数据分析。
5. 地理位置数据：MongoDB提供了地理空间索引和查询功能，适用于存储和查询地理位置相关的数据，如地理坐标、地理区域范围等。这使得它在位置服务和地理信息系统（GIS）应用程序中非常有用。
6. 缓存层：MongoDB可以用作缓存层，存储经常访问的数据以提高读取性能。可以将经常查询的数据存储在MongoDB中，并使用其快速的读取操作来提供缓存功能。
7. 分布式存储：MongoDB支持水平扩展，可以构建分布式存储系统。通过在多个节点上分片数据，可以实现数据的分布式存储和负载均衡。

需要注意的是，MongoDB是一个文档数据库，它使用BSON（Binary JSON）格式存储数据。它可以处理大量的写入和读取操作，并具有灵活的数据模型，适用于快速迭代和不断变化的数据需求。

## 11. Docker

## 12. Spring

### 12.1 Spring AOP 和 AspectJ AOP 有什么区别?

**Spring AOP 属于运行时增强，而 AspectJ 是编译时增强。** Spring AOP 基于代理(Proxying)，而 AspectJ 基于字节码操作(Bytecode Manipulation)。

Spring AOP 已经集成了 AspectJ ，AspectJ 应该算的上是 Java 生态系统中最完整的 AOP 框架了。AspectJ 相比于 Spring AOP 功能更加强大，但是 Spring AOP 相对来说更简单，

如果我们的切面比较少，那么两者性能差异不大。但是，当切面太多的话，最好选择 AspectJ ，它比 Spring AOP 快很多。

### 12.2 什么是Spring?

- Spring是**一个轻量级Java开发框架**，最早有**Rod Johnson**创建，目的是为了解决企业级应用开发的业务逻辑层和其他各层的耦合问题。它是一个分层的JavaSE/JavaEE full-stack（一站式）轻量级开源框架，为开发Java应用程序提供全面的基础架构支持。Spring负责基础架构，因此Java开发者可以专注于应用程序的开发。
- Spring最根本的使命是**解决企业级应用开发的复杂性，即简化Java开发**。
- Spring可以做很多事情，它为企业级开发提供给了丰富的功能，但是这些功能的底层都依赖于它的两个核心特性，也就是**依赖注入（dependency injection，DI）\**和\**面向切面编程（aspect-oriented programming，AOP）**。

**为了降低Java开发的复杂性，Spring采取了以下4种关键策略**

- 基于POJO的轻量级和最小侵入性编程；
- 通过依赖注入和面向接口实现松耦合；
- 基于切面和惯例进行声明式编程；
- 通过切面和模板减少样板式代码。

### 12.3 Spring的俩大核心概念

- IOC（控制翻转）：
  - 控制翻转，也叫依赖注入，他就是不会直接创建对象，只是把对象声明出来，在代码 中不直接与对象和服务进行连接，但是在配置文件中描述了哪一项组件需要哪一项服 务，容器将他们组件起来。在一般的IOC场景中容器创建了所有的对象，并设置了必 要的属性将他们联系在一起，等到需要使用的时候才把他们声明出来，使用注解就跟 方便了，容器会自动根据注解把对象组合起来
- AOP（面对切面编程）
  - 面对切面编程，这是一种编程模式，他允许程序员通过自定义的横切点进行模块 化，将那些影响多个类的行为封装到课重用的模块中。 例子：比如日志输出，不使用AOP的话就需要把日志的输出语句放在所有类中，方法 中，但是有了AOP就可以把日志输出语句封装一个可重用模块，在以声明的方式将他 们放在类中，每次使用类就自动完成了日志输出。

### 12.4 Spring框架的设计目标，设计理念，和核心是什么

- **Spring设计目标**：Spring为开发者提供一个一站式轻量级应用开发平台；
- **Spring设计理念**：在JavaEE开发中，支持POJO和JavaBean开发方式，使应用面向接口开发，充分支持OOP（面向对象）设计方法；Spring通过IOC容器实现对象耦合关系的管理，并实现依赖反转，将对象之间的依赖关系交给IOC容器，实现解耦；
- **Spring框架的核心**：IOC容器和AOP模块。通过IOC容器管理POJO对象以及他们之间的耦合关系；通过AOP以动态非侵入的方式增强服务。
- IOC让相互协作的组件保持松散的耦合，而AOP编程允许你把遍布于应用各层的功能分离出来形成可重用的功能组件。

### 12.5 Spring的优缺点是什么？

**优点**

- 方便解耦，简化开发

  Spring就是一个大工厂，可以将所有对象的创建和依赖关系的维护，交给Spring管理。

- AOP编程的支持

  Spring提供面向切面编程，可以方便的实现对程序进行权限拦截、运行监控等功能。

- 声明式事务的支持

  只需要通过配置就可以完成对事务的管理，而无需手动编程。

- 方便程序的测试

  Spring对Junit4支持，可以通过注解方便的测试Spring程序。

- 方便集成各种优秀框架

  Spring不排斥各种优秀的开源框架，其内部提供了对各种优秀框架的直接支持（如：Struts、Hibernate、MyBatis等）。

- 降低JavaEE API的使用难度

  Spring对JavaEE开发中非常难用的一些API（JDBC、JavaMail、远程调用等），都提供了封装，使这些API应用难度大大降低。

**缺点**

- Spring明明一个很轻量级的框架，却给人感觉大而全
- Spring依赖反射，反射影响性能
- 使用门槛升高，入门Spring需要较长时间

### 12.6 Spring有哪些应用场景

- **应用场景**：JavaEE企业应用开发，包括SSH、SSM等

**Spring价值**：

- Spring是非侵入式的框架，目标是使应用程序代码对框架依赖最小化；
- Spring提供一个一致的编程模型，使应用直接使用POJO开发，与运行环境隔离开来；
- Spring推动应用设计风格向面向对象和面向接口开发转变，提高了代码的重用性和可测试性；

### 12.7 Spring由哪些模块组成？

- Spring 总共大约有 20 个模块， 由 1300 多个不同的文件构成。 而这些组件被分别整合在`核心容器（Core Container）` 、 `AOP（Aspect Oriented Programming）和设备支持（Instrmentation）` 、`数据访问与集成（Data Access/Integeration）` 、 `Web`、 `消息（Messaging）` 、 `Test`等 6 个模块中。 以下是 Spring 5 的模块结构图： ![在这里插入图片描述](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/13/1717443eb25a3d9b~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

- spring core：提供了框架的基本组成部分，包括控制反转（Inversion of Control，IOC）和依赖注入（Dependency Injection，DI）功能。
- spring beans：提供了BeanFactory，是工厂模式的一个经典实现，Spring将管理对象称为Bean。
- spring context：构建于 core 封装包基础上的 context 封装包，提供了一种框架式的对象访问方法。
- spring jdbc：提供了一个JDBC的抽象层，消除了烦琐的JDBC编码和数据库厂商特有的错误代码解析， 用于简化JDBC。
- spring aop：提供了面向切面的编程实现，让你可以自定义拦截器、切点等。
- spring Web：提供了针对 Web 开发的集成特性，例如文件上传，利用 servlet listeners 进行 ioc 容器初始化和针对 Web 的 ApplicationContext。
- spring test：主要为测试提供支持的，支持使用JUnit或TestNG对Spring组件进行单元测试和集成测试。

### 12.8 Spring 框架中都用到了哪些设计模式？

1. 工厂模式：BeanFactory就是简单工厂模式的体现，用来创建对象的实例；
2. 单例模式：Bean默认为单例模式。
3. 代理模式：Spring的AOP功能用到了JDK的动态代理和CGLIB字节码生成技术；
4. 模板方法：用来解决代码重复的问题。比如. RestTemplate, JmsTemplate, JpaTemplate。
5. 观察者模式：定义对象键一种一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都会得到通知被制动更新，如Spring中listener的实现–ApplicationListener。

### 12.9 详细讲解一下核心容器（spring context应用上下文) 模块

- 这是基本的Spring模块，提供spring 框架的基础功能，BeanFactory 是 任何以spring为基础的应用的核心。Spring 框架建立在此模块之上，它使Spring成为一个容器。
- Bean 工厂是工厂模式的一个实现，提供了控制反转功能，用来把应用的配置和依赖从真正的应用代码中分离。最常用的就是org.springframework.beans.factory.xml.XmlBeanFactory ，它根据XML文件中的定义加载beans。该容器从XML 文件读取配置元数据并用它去创建一个完全配置的系统或应用。

### 12.10 Spring框架中有哪些不同类型的事件

- Spring 提供了以下5种标准的事件：
  1. 上下文更新事件（ContextRefreshedEvent）：在调用ConfigurableApplicationContext 接口中的refresh()方法时被触发。
  2. 上下文开始事件（ContextStartedEvent）：当容器调用ConfigurableApplicationContext的Start()方法开始/重新开始容器时触发该事件。
  3. 上下文停止事件（ContextStoppedEvent）：当容器调用ConfigurableApplicationContext的Stop()方法停止容器时触发该事件。
  4. 上下文关闭事件（ContextClosedEvent）：当ApplicationContext被关闭时触发该事件。容器被关闭时，其管理的所有单例Bean都被销毁。
  5. 请求处理事件（RequestHandledEvent）：在Web应用中，当一个http请求（request）结束触发该事件。如果一个bean实现了ApplicationListener接口，当一个ApplicationEvent 被发布以后，bean会自动被通知。

### 12.11 Spring 应用程序有哪些不同组件？

**Spring 应用一般有以下组件：**

- 接口 - 定义功能。
- Bean 类 - 它包含属性，setter 和 getter 方法，函数等。
- Bean 配置文件 - 包含类的信息以及如何配置它们。
- Spring 面向切面编程（AOP） - 提供面向切面编程的功能。
- 用户程序 - 它使用接口。

### 12.12 使用 Spring 有哪些方式？

**使用 Spring 有以下方式：**

- 作为一个成熟的 Spring Web 应用程序。
- 作为第三方 Web 框架，使用 Spring Frameworks 中间层。
- 作为企业级 Java Bean，它可以包装现有的 POJO（Plain Old Java Objects）。
- 用于远程使用。

### 12.13 什么是Spring IOC 容器？

- 控制反转即IOC (Inversion of Control)，它把传统上由程序代码直接操控的对象的调用权交给容器，通过容器来实现对象组件的装配和管理。所谓的“控制反转”概念就是对组件对象控制权的转移，从程序代码本身转移到了外部容器。
- Spring IOC 负责创建对象，管理对象（通过依赖注入（DI），装配对象，配置对象，并且管理这些对象的整个生命周期。

### 12.14 控制反转(IOC)有什么作用

- 管理对象的创建和依赖关系的维护。对象的创建并不是一件简单的事，在对象关系比较复杂时，如果依赖关系需要程序猿来维护的话，那是相当头疼的
- 解耦，由容器去维护具体的对象
- 托管了类的产生过程，比如我们需要在类的产生过程中做一些处理，最直接的例子就是代理，如果有容器程序可以把这部分处理交给容器，应用程序则无需去关心类是如何完成代理的

### 12.15 IOC的优点是什么？

- IOC 或 依赖注入把应用的代码量降到最低。
- 它使应用容易测试，单元测试不再需要单例和JNDI查找机制。
- 最小的代价和最小的侵入性使松散耦合得以实现。
- IOC容器支持加载服务时的饿汉式初始化和懒加载。

### 12.16 Spring IOC 的实现机制

- Spring 中的 IOC 的实现原理就是工厂模式加反射机制。
- 示例：

```java
interface Fruit {
   public abstract void eat();
 }

class Apple implements Fruit {
    public void eat(){
        System.out.println("Apple");
    }
}

class Orange implements Fruit {
    public void eat(){
        System.out.println("Orange");
    }
}

class Factory {
    public static Fruit getInstance(String ClassName) {
        Fruit f=null;
        try {
            f=(Fruit)Class.forName(ClassName).newInstance();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return f;
    }
}

class Client {
    public static void main(String[] a) {
        Fruit f=Factory.getInstance("io.github.dunwu.spring.Apple");
        if(f!=null){
            f.eat();
        }
    }
}
```

### 12.17 Spring 的 IOC支持哪些功能

- Spring 的 IOC 设计支持以下功能：
- 其中，最重要的就是依赖注入，从 XML 的配置上说，即 ref 标签。对应 Spring RuntimeBeanReference 对象。
- 对于 IOC 来说，最重要的就是容器。容器管理着 Bean 的生命周期，控制着 Bean 的依赖注入。

### 12.18 BeanFactory 和 ApplicationContext有什么区别？

- BeanFactory和ApplicationContext是Spring的两大核心接口，都可以当做Spring的容器。其中ApplicationContext是BeanFactory的子接口。
- 依赖关系
  - BeanFactory：是Spring里面最底层的接口，包含了各种Bean的定义，读取bean配置文档，管理bean的加载、实例化，控制bean的生命周期，维护bean之间的依赖关系。
- ApplicationContext接口作为BeanFactory的派生，除了提供BeanFactory所具有的功能外，还提供了更完整的框架功能：
  - 继承MessageSource，因此支持国际化。
  - 统一的资源文件访问方式。
  - 提供在监听器中注册bean的事件。
  - 同时加载多个配置文件。
  - 载入多个（有继承关系）上下文 ，使得每一个上下文都专注于一个特定的层次，比如应用的web层。
- 加载方式
  - BeanFactroy采用的是延迟加载形式来注入Bean的，即只有在使用到某个Bean时(调用getBean())，才对该Bean进行加载实例化。这样，我们就不能发现一些存在的Spring的配置问题。如果Bean的某一个属性没有注入，BeanFacotry加载后，直至第一次使用调用getBean方法才会抛出异常。
  - ApplicationContext，它是在容器启动时，一次性创建了所有的Bean。这样，在容器启动时，我们就可以发现Spring中存在的配置错误，这样有利于检查所依赖属性是否注入。 ApplicationContext启动后预载入所有的单实例Bean，通过预载入单实例bean ,确保当你需要的时候，你就不用等待，因为它们已经创建好了。

> 相对于基本的BeanFactory，ApplicationContext 唯一的不足是占用内存空间。当应用程序配置Bean较多时，程序启动较慢。


- 创建方式
  - BeanFactory通常以编程的方式被创建，ApplicationContext还能以声明的方式创建，如使用ContextLoader。
- 注册方式
  - BeanFactory和ApplicationContext都支持BeanPostProcessor、BeanFactoryPostProcessor的使用，但两者之间的区别是：BeanFactory需要手动注册，而ApplicationContext则是自动注册。

### 12.19 Spring 如何设计容器的，BeanFactory和ApplicationContext的关系详解

- Spring 作者 Rod Johnson 设计了两个接口用以表示容器。
  - BeanFactory
  - ApplicationContext
- BeanFactory 简单粗暴，可以理解为就是个 HashMap，Key 是 BeanName，Value 是 Bean 实例。通常只提供注册（put），获取（get）这两个功能。我们可以称之为 **“低级容器”**。
- ApplicationContext 可以称之为 **“高级容器”**。因为他比 BeanFactory 多了更多的功能。他继承了多个接口。因此具备了更多的功能。例如资源的获取，支持多种消息（例如 JSP tag 的支持），对 BeanFactory 多了工具级别的支持等待。所以你看他的名字，已经不是 BeanFactory 之类的工厂了，而是 “应用上下文”， 代表着整个大容器的所有功能。该接口定义了一个 refresh 方法，此方法是所有阅读 Spring 源码的人的最熟悉的方法，用于刷新整个容器，即重新加载/刷新所有的 bean。
- 当然，除了这两个大接口，还有其他的辅助接口，这里就不介绍他们了。
- BeanFactory和ApplicationContext的关系
- 为了更直观的展示 “低级容器” 和 “高级容器” 的关系，这里通过常用的 ClassPathXmlApplicationContext 类来展示整个容器的层级 UML 关系。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/13/1717443eb634549a~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

- 有点复杂？ 先不要慌，我来解释一下。
- 最上面的是 BeanFactory，下面的 3 个绿色的，都是功能扩展接口，这里就不展开讲。
- 看下面的隶属 ApplicationContext 粉红色的 “高级容器”，依赖着 “低级容器”，这里说的是依赖，不是继承哦。他依赖着 “低级容器” 的 getBean 功能。而高级容器有更多的功能：支持不同的信息源头，可以访问文件资源，支持应用事件（Observer 模式）。
- 通常用户看到的就是 “高级容器”。 但 BeanFactory 也非常够用啦！
- 左边灰色区域的是 “低级容器”， 只负载加载 Bean，获取 Bean。容器其他的高级功能是没有的。例如上图画的 refresh 刷新 Bean 工厂所有配置，生命周期事件回调等。

**小结**

- 说了这么多，不知道你有没有理解Spring IOC？ 这里小结一下：IOC 在 Spring 里，只需要低级容器就可以实现，2 个步骤：

1. 加载配置文件，解析成 BeanDefinition 放在 Map 里。
2. 调用 getBean 的时候，从 BeanDefinition 所属的 Map 里，拿出 Class 对象进行实例化，同时，如果有依赖关系，将递归调用 getBean 方法 —— 完成依赖注入。

- 上面就是 Spring 低级容器（BeanFactory）的 IOC。
- 至于高级容器 ApplicationContext，他包含了低级容器的功能，当他执行 refresh 模板方法的时候，将刷新整个容器的 Bean。同时其作为高级容器，包含了太多的功能。一句话，他不仅仅是 IOC。他支持不同信息源头，支持 BeanFactory 工具类，支持层级容器，支持访问文件资源，支持事件发布通知，支持接口回调等等。

### 12.20 ApplicationContext通常的实现是什么？

- **FileSystemXmlApplicationContext** ：此容器从一个XML文件中加载beans的定义，XML Bean 配置文件的全路径名必须提供给它的构造函数。
- **ClassPathXmlApplicationContext**：此容器也从一个XML文件中加载beans的定义，这里，你需要正确设置classpath因为这个容器将在classpath里找bean配置。
- **WebXmlApplicationContext**：此容器加载一个XML文件，此文件定义了一个WEB应用的所有bean。

### 12.21 什么是Spring的依赖注入？

- 控制反转IOC是一个很大的概念，可以用不同的方式来实现。其主要实现方式有两种：依赖注入和依赖查找依赖注入：相对于IOC而言，依赖注入(DI)更加准确地描述了IOC的设计理念。所谓依赖注入（Dependency Injection），即组件之间的依赖关系由容器在应用系统运行期来决定，也就是由容器动态地将某种依赖关系的目标对象实例注入到应用系统中的各个关联的组件之中。组件不做定位查询，只提供普通的Java方法让容器去决定依赖关系。

### 12.22 依赖注入的基本原则

- 依赖注入的基本原则是：应用组件不应该负责查找资源或者其他依赖的协作对象。配置对象的工作应该由IOC容器负责，“查找资源”的逻辑应该从应用组件的代码中抽取出来，交给IOC容器负责。容器全权负责组件的装配，它会把符合依赖关系的对象通过属性（JavaBean中的setter）或者是构造器传递给需要的对象。

### 12.23 依赖注入有什么优势

- 依赖注入之所以更流行是因为它是一种更可取的方式：让容器全权负责依赖查询，受管组件只需要暴露JavaBean的setter方法或者带参数的构造器或者接口，使容器可以在初始化时组装对象的依赖关系。其与依赖查找方式相比，主要优势为：
  - 查找定位操作与应用代码完全无关。
  - 不依赖于容器的API，可以很容易地在任何容器以外使用应用对象。
  - 不需要特殊的接口，绝大多数对象可以做到完全不必依赖容器。

### 12.23 有哪些不同类型的依赖注入实现方式？

- 依赖注入是时下最流行的IOC实现方式，依赖注入分为接口注入（Interface Injection），Setter方法注入（Setter Injection）和构造器注入（Constructor Injection）三种方式。其中接口注入由于在灵活性和易用性比较差，现在从Spring4开始已被废弃。
- **构造器依赖注入**：构造器依赖注入通过容器触发一个类的构造器来实现的，该类有一系列参数，每个参数代表一个对其他类的依赖。
- **Setter方法注入**：Setter方法注入是容器通过调用无参构造器或无参static工厂 方法实例化bean之后，调用该bean的setter方法，即实现了基于setter的依赖注入。

### 12.24 构造器依赖注入和 Setter方法注入的区别

| **构造函数注入**           | **setter** **注入**        |
| -------------------------- | -------------------------- |
| 没有部分注入               | 有部分注入                 |
| 不会覆盖 setter 属性       | 会覆盖 setter 属性         |
| 任意修改都会创建一个新实例 | 任意修改不会创建一个新实例 |
| 适用于设置很多属性         | 适用于设置少量属性         |

- 两种依赖方式都可以使用，构造器注入和Setter方法注入。最好的解决方案是用构造器参数实现强制依赖，setter方法实现可选依赖。

### 12.25 什么是Spring beans？

- Spring beans 是那些形成Spring应用的主干的java对象。它们被Spring IOC容器初始化，装配，和管理。这些beans通过容器中配置的元数据创建。比如，以XML文件中 的形式定义。

### 12.26 一个 Spring Bean 定义 包含什么？

- 一个Spring Bean 的定义包含容器必知的所有配置元数据，包括如何创建一个bean，它的生命周期详情及它的依赖。

### 12.27 如何给Spring 容器提供配置元数据？Spring有几种配置方式

- 这里有三种重要的方法给Spring 容器提供配置元数据。
  - XML配置文件。
  - 基于注解的配置。
  - 基于java的配置。

### 12.28 Spring配置文件包含了哪些信息

- Spring配置文件是个XML 文件，这个文件包含了类信息，描述了如何配置它们，以及如何相互调用。

### 12.29 Spring基于xml注入bean的几种方式

1. Set方法注入；
2. 构造器注入：
   1. 通过index设置参数的位置；
   2. 通过type设置参数类型；
3. 静态工厂注入；
4. 实例工厂；

### 12.30 你怎样定义类的作用域？

- 当定义一个 在Spring里，我们还能给这个bean声明一个作用域。它可以通过bean 定义中的scope属性来定义。如，当Spring要在需要的时候每次生产一个新的bean实例，bean的scope属性被指定为prototype。另一方面，一个bean每次使用的时候必须返回同一个实例，这个bean的scope 属性 必须设为 singleton。

### 12.31 解释Spring支持的几种bean的作用域

**Spring框架支持以下五种bean的作用域：**

- **singleton :** bean在每个Spring ioc 容器中只有一个实例。
- **prototype**：一个bean的定义可以有多个实例。
- **request**：每次http请求都会创建一个bean，该作用域仅在基于web的Spring ApplicationContext情形下有效。
- **session**：在一个HTTP Session中，一个bean定义对应一个实例。该作用域仅在基于web的Spring ApplicationContext情形下有效。
- **global-session**：在一个全局的HTTP Session中，一个bean定义对应一个实例。该作用域仅在基于web的Spring ApplicationContext情形下有效。

**注意：** 缺省的Spring bean 的作用域是Singleton。使用 prototype 作用域需要慎重的思考，因为频繁创建和销毁 bean 会带来很大的性能开销。

### 12.32 Spring框架中的单例bean是线程安全的吗？

- 不是，Spring框架中的单例bean不是线程安全的。
- spring 中的 bean 默认是单例模式，spring 框架并没有对单例 bean 进行多线程的封装处理。
- 实际上大部分时候 spring bean 无状态的（比如 dao 类），所有某种程度上来说 bean 也是安全的，但如果 bean 有状态的话（比如 view model 对象），那就要开发者自己去保证线程安全了，最简单的就是改变 bean 的作用域，把“singleton”变更为“prototype”，这样请求 bean 相当于 new Bean()了，所以就可以保证线程安全了。
  - 有状态就是有数据存储功能。
  - 无状态就是不会保存数据。

### 12.33 Spring如何处理线程并发问题？

- 在一般情况下，只有无状态的Bean才可以在多线程环境下共享，在Spring中，绝大部分Bean都可以声明为singleton作用域，因为Spring对一些Bean中非线程安全状态采用ThreadLocal进行处理，解决线程安全问题。
- ThreadLocal和线程同步机制都是为了解决多线程中相同变量的访问冲突问题。同步机制采用了“时间换空间”的方式，仅提供一份变量，不同的线程在访问前需要获取锁，没获得锁的线程则需要排队。而ThreadLocal采用了“空间换时间”的方式。
- ThreadLocal会为每一个线程提供一个独立的变量副本，从而隔离了多个线程对数据的访问冲突。因为每一个线程都拥有自己的变量副本，从而也就没有必要对该变量进行同步了。ThreadLocal提供了线程安全的共享对象，在编写多线程代码时，可以把不安全的变量封装进ThreadLocal。

### 12.34 解释Spring框架中bean的生命周期

- 在传统的Java应用中，bean的生命周期很简单。使用Java关键字new进行bean实例化，然后该bean就可以使用了。一旦该bean不再被使用，则由Java自动进行垃圾回收。相比之下，Spring容器中的bean的生命周期就显得相对复杂多了。正确理解Spring bean的生命周期非常重要，因为你或许要利用Spring提供的扩展点来自定义bean的创建过程。下图展示了bean装载到Spring应用上下文中的一个典型的生命周期过程。

![img](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/13/1717443ebe68c24f~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

- bean在Spring容器中从创建到销毁经历了若干阶段，每一阶段都可以针对Spring如何管理bean进行个性化定制。
- 正如你所见，在bean准备就绪之前，bean工厂执行了若干启动步骤。

**我们对上图进行详细描述：**

- Spring对bean进行实例化；
- Spring将值和bean的引用注入到bean对应的属性中；
- 如果bean实现了BeanNameAware接口，Spring将bean的ID传递给setBean-Name()方法；
- 如果bean实现了BeanFactoryAware接口，Spring将调用setBeanFactory()方法，将BeanFactory容器实例传入；
- 如果bean实现了ApplicationContextAware接口，Spring将调用setApplicationContext()方法，将bean所在的应用上下文的引用传入进来；
- 如果bean实现了BeanPostProcessor接口，Spring将调用它们的post-ProcessBeforeInitialization()方法；
- 如果bean实现了InitializingBean接口，Spring将调用它们的after-PropertiesSet()方法。类似地，如果bean使用initmethod声明了初始化方法，该方法也会被调用；
- 如果bean实现了BeanPostProcessor接口，Spring将调用它们的post-ProcessAfterInitialization()方法；
- 此时，bean已经准备就绪，可以被应用程序使用了，它们将一直驻留在应用上下文中，直到该应用上下文被销毁；
- 如果bean实现了DisposableBean接口，Spring将调用它的destroy()接口方法。同样，如果bean使用destroy-method声明了销毁方法，该方法也会被调用。

```
现在你已经了解了如何创建和加载一个Spring容器。但是一个空的容器并没有太大的价值，在你把东西放进去之前，它里面什么都没有。为了从Spring的DI(依赖注入)中受益，我们必须将应用对象装配进Spring容器中。
```

### 12.35 哪些是重要的bean生命周期方法？ 你能重载它们吗？

- 有两个重要的bean 生命周期方法，第一个是setup ， 它是在容器加载bean的时候被调用。第二个方法是 teardown 它是在容器卸载类的时候被调用。
- bean 标签有两个重要的属性（init-method和destroy-method）。用它们你可以自己定制初始化和注销方法。它们也有相应的注解（@PostConstruct和@PreDestroy）。

### 12.36 什么是Spring的内部bean？什么是Spring inner beans？

- 在Spring框架中，当一个bean仅被用作另一个bean的属性时，它能被声明为一个内部bean。内部bean可以用setter注入“属性”和构造方法注入“构造参数”的方式来实现，内部bean通常是匿名的，它们的Scope一般是prototype。

### 12.37 在 Spring中如何注入一个java集合？

- Spring提供了以下四种集合类的配置元素(配置标签)：

|      | 该标签用来装配可重复的list值。                 |
| ---- | ---------------------------------------------- |
|      | 该标签用来装配没有重复的set值。                |
|      | 该标签可用来注入键和值可以为任何类型的键值对。 |
|      | 该标签支持注入键和值都是字符串类型的键值对。   |

### 12.38 什么是bean装配？

- 装配，或bean 装配是指在Spring 容器中把bean组装到一起，前提是容器需要知道bean的依赖关系，如何通过依赖注入来把它们装配到一起。

### 12.39 什么是bean的自动装配？

- 在Spring框架中，在配置文件中设定bean的依赖关系是一个很好的机制，Spring 容器能够自动装配相互合作的bean，这意味着容器不需要和配置，能通过Bean工厂自动处理bean之间的协作。这意味着 Spring可以通过向Bean Factory中注入的方式自动搞定bean之间的依赖关系。自动装配可以设置在每个bean上，也可以设定在特定的bean上。

### 12.40 解释不同方式的自动装配，spring 自动装配 bean 有哪些方式？

- 在spring中，对象无需自己查找或创建与其关联的其他对象，由容器负责把需要相互协作的对象引用赋予各个对象，使用autowire来配置自动装载模式。
- 在Spring框架xml配置中共有5种自动装配：
  - no：默认的方式是不进行自动装配的，通过手工设置ref属性来进行装配bean。
  - byName：通过bean的名称进行自动装配，如果一个bean的 property 与另一bean 的name 相同，就进行自动装配。
  - byType：通过参数的数据类型进行自动装配。
  - constructor：利用构造函数进行装配，并且构造函数的参数通过byType进行装配。
  - autodetect：自动探测，如果有构造方法，通过 construct的方式自动装配，否则使用 byType的方式自动装配。

### 12.41 使用@Autowired注解自动装配的过程是怎样的？

- 使用@Autowired注解来自动装配指定的bean。在使用@Autowired注解之前需要在Spring配置文件进行配置，<context:annotation-config />。
- 在启动spring IOC时，容器自动装载了一个AutowiredAnnotationBeanPostProcessor后置处理器，当容器扫描到@Autowied、@Resource或@Inject时，就会在IOC容器自动查找需要的bean，并装配给该对象的属性。在使用@Autowired时，首先在容器中查询对应类型的bean：
  - 如果查询结果刚好为一个，就将该bean装配给@Autowired指定的数据；
  - 如果查询的结果不止一个，那么@Autowired会根据名称来查找；
  - 如果上述查找的结果为空，那么会抛出异常。解决方法时，使用required=false。

### 12.42 自动装配有哪些局限性？

- 自动装配的局限性是：
  - **重写**：你仍需用 和 配置来定义依赖，意味着总要重写自动装配。
  - **基本数据类型**：你不能自动装配简单的属性，如基本数据类型，String字符串，和类。
  - **模糊特性**：自动装配不如显式装配精确，如果有可能，建议使用显式装配。

### 12.43 你可以在Spring中注入一个null 和一个空字符串吗？

- 可以。

### 12.44 什么是基于Java的Spring注解配置? 给一些注解的例子

- 基于Java的配置，允许你在少量的Java注解的帮助下，进行你的大部分Spring配置而非通过XML文件。

- 以@Configuration 注解为例，它用来标记类可以当做一个bean的定义，被Spring IOC容器使用。

- 另一个例子是@Bean注解，它表示此方法将要返回一个对象，作为一个bean注册进Spring应用上下文。

  ```typescript
  typescript复制代码@Configuration
  public class StudentConfig {
      @Bean
      public StudentBean myStudent() {
          return new StudentBean();
      }
  }
  ```

### 12.45 怎样开启注解装配？

- 注解装配在默认情况下是不开启的，为了使用注解装配，我们必须在Spring配置文件中配置 `<context:annotation-config/>`元素。

### 12.46 @Component, @Controller, @Repository, @Service 有何区别？

- @Component：这将 java 类标记为 bean。它是任何 Spring 管理组件的通用构造型。spring 的组件扫描机制现在可以将其拾取并将其拉入应用程序环境中。
- @Controller：这将一个类标记为 Spring Web MVC 控制器。标有它的 Bean 会自动导入到 IOC 容器中。
- @Service：此注解是组件注解的特化。它不会对 @Component 注解提供任何其他行为。您可以在服务层类中使用 @Service 而不是 @Component，因为它以更好的方式指定了意图。
- @Repository：这个注解是具有类似用途和功能的 @Component 注解的特化。它为 DAO 提供了额外的好处。它将 DAO 导入 IOC 容器，并使未经检查的异常有资格转换为 Spring DataAccessException。

### 12.47 @Required 注解有什么作用

- 这个注解表明bean的属性必须在配置的时候设置，通过一个bean定义的显式的属性值或通过自动装配，若@Required注解的bean属性未被设置，容器将抛出BeanInitializationException。示例：

```typescript
typescript复制代码public class Employee {
    private String name;
    @Required
    public void setName(String name){
        this.name=name;
    }
    public string getName(){
        return name;
    }
}
```

### 12.48 @Autowired 注解有什么作用

- @Autowired默认是按照类型装配注入的，默认情况下它要求依赖对象必须存在（可以设置它required属性为false）。@Autowired 注解提供了更细粒度的控制，包括在何处以及如何完成自动装配。它的用法和@Required一样，修饰setter方法、构造器、属性或者具有任意名称和/或多个参数的PN方法。

```typescript
typescript复制代码public class Employee {
    private String name;
    @Autowired
    public void setName(String name) {
        this.name=name;
    }
    public string getName(){
        return name;
    }
}
```

### 12.49 @Autowired和@Resource之间的区别

- @Autowired和@Resource可用于：构造函数、成员变量、Setter方法
- @Autowired和@Resource之间的区别在于
  - @Autowired默认是按照类型装配注入的，默认情况下它要求依赖对象必须存在（可以设置它required属性为false）。
  - @Resource默认是按照名称来装配注入的，只有当找不到与名称匹配的bean才会按照类型来装配注入。

### 12.50 @Qualifier 注解有什么作用

- 当您创建多个相同类型的 bean 并希望仅使用属性装配其中一个 bean 时，您可以使用@Qualifier 注解和 @Autowired 通过指定应该装配哪个确切的 bean 来消除歧义。

### 12.51 @RequestMapping 注解有什么用？

- @RequestMapping 注解用于将特定 HTTP 请求方法映射到将处理相应请求的控制器中的特定类/方法。此注释可应用于两个级别：
  - 类级别：映射请求的 URL
  - 方法级别：映射 URL 以及 HTTP 请求方法

### 12.52 解释对象/关系映射集成模块

- Spring 通过提供ORM模块，支持我们在直接JDBC之上使用一个对象/关系映射映射(ORM)工具，Spring 支持集成主流的ORM框架，如Hiberate，JDO和 MyBatis，JPA，TopLink，JDO，OJB等待 。Spring的事务管理同样支持以上所有ORM框架及JDBC。

### 12.53 在Spring框架中如何更有效地使用JDBC？

- 使用Spring JDBC 框架，资源管理和错误处理的代价都会被减轻。所以开发者只需写statements 和 queries从数据存取数据，JDBC也可以在Spring框架提供的模板类的帮助下更有效地被使用，这个模板叫JdbcTemplate

### 12.54 解释JDBC抽象和DAO模块

- 通过使用JDBC抽象和DAO模块，保证数据库代码的简洁，并能避免数据库资源错误关闭导致的问题，它在各种不同的数据库的错误信息之上，提供了一个统一的异常访问层。它还利用Spring的AOP 模块给Spring应用中的对象提供事务管理服务。

### 12.55 spring DAO 有什么用？

- Spring DAO（数据访问对象） 使得 JDBC，Hibernate 或 JDO 这样的数据访问技术更容易以一种统一的方式工作。这使得用户容易在持久性技术之间切换。它还允许您在编写代码时，无需考虑捕获每种技术不同的异常。

### 12.56 spring JDBC API 中存在哪些类？

- JdbcTemplate
- SimpleJdbcTemplate
- NamedParameterJdbcTemplate
- SimpleJdbcInsert
- SimpleJdbcCall

### 12.57 JdbcTemplate是什么

- JdbcTemplate 类提供了很多便利的方法解决诸如把数据库数据转变成基本数据类型或对象，执行写好的或可调用的数据库操作语句，提供自定义的数据错误处理。

### 12.58 使用Spring通过什么方式访问Hibernate？使用 Spring 访问 Hibernate 的方法有哪些？

- 在Spring中有两种方式访问Hibernate：
  - 使用 Hibernate 模板和回调进行控制反转
  - 扩展 HibernateDAOSupport 并应用 AOP 拦截器节点

### 12.59 如何通过HibernateDaoSupport将Spring和Hibernate结合起来？

- 用Spring的 SessionFactory 调用 LocalSessionFactory。集成过程分三步：
  - 配置the Hibernate SessionFactory
  - 继承HibernateDaoSupport实现一个DAO
  - 在AOP支持的事务中装配

### 12.60 Spring支持的事务管理类型， spring 事务实现方式有哪些？

- Spring支持两种类型的事务管理：
  - **编程式事务管理**：这意味你通过编程的方式管理事务，给你带来极大的灵活性，但是难维护。
  - **声明式事务管理**：这意味着你可以将业务代码和事务管理分离，你只需用注解和XML配置来管理事务。

### 12.61 Spring事务的实现方式和实现原理

- Spring事务的本质其实就是数据库对事务的支持，没有数据库的事务支持，spring是无法提供事务功能的。真正的数据库层的事务提交和回滚是通过binlog或者redo log实现的。

### 12.62 说一下Spring的事务传播行为

spring事务的传播行为说的是，当多个事务同时存在的时候，spring如何处理这些事务的行为。

> ① PROPAGATION_REQUIRED：如果当前没有事务，就创建一个新事务，如果当前存在事务，就加入该事务，该设置是最常用的设置。
>
> ② PROPAGATION_SUPPORTS：支持当前事务，如果当前存在事务，就加入该事务，如果当前不存在事务，就以非事务执行。
>
> ③ PROPAGATION_MANDATORY：支持当前事务，如果当前存在事务，就加入该事务，如果当前不存在事务，就抛出异常。
>
> ④ PROPAGATION_REQUIRES_NEW：创建新事务，无论当前存不存在事务，都创建新事务。
>
> ⑤ PROPAGATION_NOT_SUPPORTED：以非事务方式执行操作，如果当前存在事务，就把当前事务挂起。
>
> ⑥ PROPAGATION_NEVER：以非事务方式执行，如果当前存在事务，则抛出异常。
>
> ⑦ PROPAGATION_NESTED：如果当前存在事务，则在嵌套事务内执行。如果当前没有事务，则按REQUIRED属性执行。

### 12.63 说一下 spring 的事务隔离？

- spring 有五大隔离级别，默认值为 ISOLATION_DEFAULT（使用数据库的设置），其他四个隔离级别和数据库的隔离级别一致：
  1. ISOLATION_DEFAULT：用底层数据库的设置隔离级别，数据库设置的是什么我就用什么；
  2. ISOLATION_READ_UNCOMMITTED：未提交读，最低隔离级别、事务未提交前，就可被其他事务读取（会出现幻读、脏读、不可重复读）；
  3. ISOLATION_READ_COMMITTED：提交读，一个事务提交后才能被其他事务读取到（会造成幻读、不可重复读），SQL server 的默认级别；
  4. ISOLATION_REPEATABLE_READ：可重复读，保证多次读取同一个数据时，其值都和事务开始时候的内容是一致，禁止读取到别的事务未提交的数据（会造成幻读），MySQL 的默认级别；
  5. ISOLATION_SERIALIZABLE：序列化，代价最高最可靠的隔离级别，该隔离级别能防止脏读、不可重复读、幻读。
- **脏读** ：表示一个事务能够读取另一个事务中还未提交的数据。比如，某个事务尝试插入记录 A，此时该事务还未提交，然后另一个事务尝试读取到了记录 A。
- **不可重复读** ：是指在一个事务内，多次读同一数据。
- **幻读** ：指同一个事务内多次查询返回的结果集不一样。比如同一个事务 A 第一次查询时候有 n 条记录，但是第二次同等条件下查询却有 n+1 条记录，这就好像产生了幻觉。发生幻读的原因也是另外一个事务新增或者删除或者修改了第一个事务结果集里面的数据，同一个记录的数据内容被修改了，所有数据行的记录就变多或者变少了。

### 12.64 Spring框架的事务管理有哪些优点？

- 为不同的事务API 如 JTA，JDBC，Hibernate，JPA 和JDO，提供一个不变的编程模式。
- 为编程式事务管理提供了一套简单的API而不是一些复杂的事务API
- 支持声明式事务管理。
- 和Spring各种数据访问抽象层很好得集成。

### 12.65 你更倾向用那种事务管理类型？

- 大多数Spring框架的用户选择声明式事务管理，因为它对应用代码的影响最小，因此更符合一个无侵入的轻量级容器的思想。声明式事务管理要优于编程式事务管理，虽然比编程式事务管理（这种方式允许你通过代码控制事务）少了一点灵活性。唯一不足地方是，最细粒度只能作用到方法级别，无法做到像编程式事务那样可以作用到代码块级别。

### 12.66 什么是AOP

- OOP(Object-Oriented Programming)面向对象编程，允许开发者定义纵向的关系，但并适用于定义横向的关系，导致了大量代码的重复，而不利于各个模块的重用。
- AOP(Aspect-Oriented Programming)，一般称为面向切面编程，作为面向对象的一种补充，用于将那些与业务无关，但却对多个对象产生影响的公共行为和逻辑，抽取并封装为一个可重用的模块，这个模块被命名为“切面”（Aspect），减少系统中的重复代码，降低了模块间的耦合度，同时提高了系统的可维护性。可用于权限认证、日志、事务处理等。

### 12.67 Spring AOP and AspectJ AOP 有什么区别？AOP 有哪些实现方式？

- AOP实现的关键在于 代理模式，AOP代理主要分为静态代理和动态代理。静态代理的代表为AspectJ；动态代理则以Spring AOP为代表。
  - （1）AspectJ是静态代理的增强，所谓静态代理，就是AOP框架会在编译阶段生成AOP代理类，因此也称为编译时增强，他会在编译阶段将AspectJ(切面)织入到Java字节码中，运行的时候就是增强之后的AOP对象。
  - （2）Spring AOP使用的动态代理，所谓的动态代理就是说AOP框架不会去修改字节码，而是每次运行时在内存中临时为方法生成一个AOP对象，这个AOP对象包含了目标对象的全部方法，并且在特定的切点做了增强处理，并回调原对象的方法。

### 12.68 JDK动态代理和CGLIB动态代理的区别

- Spring AOP中的动态代理主要有两种方式，JDK动态代理和CGLIB动态代理：
  - JDK动态代理只提供接口的代理，不支持类的代理。核心InvocationHandler接口和Proxy类，InvocationHandler 通过invoke()方法反射来调用目标类中的代码，动态地将横切逻辑和业务编织在一起；接着，Proxy利用 InvocationHandler动态创建一个符合某一接口的的实例, 生成目标类的代理对象。
  - 如果代理类没有实现 InvocationHandler 接口，那么Spring AOP会选择使用CGLIB来动态代理目标类。CGLIB（Code Generation Library），是一个代码生成的类库，可以在运行时动态的生成指定类的一个子类对象，并覆盖其中特定方法并添加增强代码，从而实现AOP。CGLIB是通过继承的方式做的动态代理，因此如果某个类被标记为final，那么它是无法使用CGLIB做动态代理的。
- 静态代理与动态代理区别在于生成AOP代理对象的时机不同，相对来说AspectJ的静态代理方式具有更好的性能，但是AspectJ需要特定的编译器进行处理，而Spring AOP则无需特定的编译器处理。

> InvocationHandler 的 invoke(Object proxy,Method method,Object[] args)：proxy是最终生成的代理实例; method 是被代理目标实例的某个具体方法; args 是被代理目标实例某个方法的具体入参, 在方法反射调用时使用。

### 12.69 解释一下Spring AOP里面的几个名词

- （1）切面（Aspect）：切面是通知和切点的结合。通知和切点共同定义了切面的全部内容。 在Spring AOP中，切面可以使用通用类（基于模式的风格） 或者在普通类中以 @AspectJ 注解来实现。
- （2）连接点（Join point）：指方法，在Spring AOP中，一个连接点 总是 代表一个方法的执行。 应用可能有数以千计的时机应用通知。这些时机被称为连接点。连接点是在应用执行过程中能够插入切面的一个点。这个点可以是调用方法时、抛出异常时、甚至修改一个字段时。切面代码可以利用这些点插入到应用的正常流程之中，并添加新的行为。
- （3）通知（Advice）：在AOP术语中，切面的工作被称为通知。
- （4）切入点（Pointcut）：切点的定义会匹配通知所要织入的一个或多个连接点。我们通常使用明确的类和方法名称，或是利用正则表达式定义所匹配的类和方法名称来指定这些切点。
- （5）引入（Introduction）：引入允许我们向现有类添加新方法或属性。
- （6）目标对象（Target Object）： 被一个或者多个切面（aspect）所通知（advise）的对象。它通常是一个代理对象。也有人把它叫做 被通知（adviced） 对象。 既然Spring AOP是通过运行时代理实现的，这个对象永远是一个 被代理（proxied） 对象。
- （7）织入（Weaving）：织入是把切面应用到目标对象并创建新的代理对象的过程。在目标对象的生命周期里有多少个点可以进行织入：
  - 编译期：切面在目标类编译时被织入。AspectJ的织入编译器是以这种方式织入切面的。
  - 类加载期：切面在目标类加载到JVM时被织入。需要特殊的类加载器，它可以在目标类被引入应用之前增强该目标类的字节码。AspectJ5的加载时织入就支持以这种方式织入切面。
  - 运行期：切面在应用运行的某个时刻被织入。一般情况下，在织入切面时，AOP容器会为目标对象动态地创建一个代理对象。SpringAOP就是以这种方式织入切面。

### 12.70 Spring在运行时通知对象

- 通过在代理类中包裹切面，Spring在运行期把切面织入到Spring管理的bean中。代理封装了目标类，并拦截被通知方法的调用，再把调用转发给真正的目标bean。当代理拦截到方法调用时，在调用目标bean方法之前，会执行切面逻辑。
- 直到应用需要被代理的bean时，Spring才创建代理对象。如果使用的是ApplicationContext的话，在ApplicationContext从BeanFactory中加载所有bean的时候，Spring才会创建被代理的对象。因为Spring运行时才创建代理对象，所以我们不需要特殊的编译器来织入SpringAOP的切面。

### 12.71 Spring只支持方法级别的连接点

- 因为Spring基于动态代理，所以Spring只支持方法连接点。Spring缺少对字段连接点的支持，而且它不支持构造器连接点。方法之外的连接点拦截功能，我们可以利用Aspect来补充。

### 12.72 在Spring AOP 中，关注点和横切关注的区别是什么？在 spring aop 中 concern 和 cross-cutting concern 的不同之处

- 关注点（concern）是应用中一个模块的行为，一个关注点可能会被定义成一个我们想实现的一个功能。
- 横切关注点（cross-cutting concern）是一个关注点，此关注点是整个应用都会使用的功能，并影响整个应用，比如日志，安全和数据传输，几乎应用的每个模块都需要的功能。因此这些都属于横切关注点。

### 12.73 Spring通知有哪些类型？

- 在AOP术语中，切面的工作被称为通知，实际上是程序执行时要通过SpringAOP框架触发的代码段。
- Spring切面可以应用5种类型的通知：
  1. 前置通知（Before）：在目标方法被调用之前调用通知功能；
  2. 后置通知（After）：在目标方法完成之后调用通知，此时不会关心方法的输出是什么；
  3. 返回通知（After-returning ）：在目标方法成功执行之后调用通知；
  4. 异常通知（After-throwing）：在目标方法抛出异常后调用通知；
  5. 环绕通知（Around）：通知包裹了被通知的方法，在被通知的方法调用之前和调用之后执行自定义的行为。

### 12.74 什么是切面 Aspect？

- aspect 由 pointcount 和 advice 组成，切面是通知和切点的结合。 它既包含了横切逻辑的定义, 也包括了连接点的定义. Spring AOP 就是负责实施切面的框架, 它将切面所定义的横切逻辑编织到切面所指定的连接点中.  AOP 的工作重心在于如何将增强编织目标对象的连接点上, 这里包含两个工作:
  - 如何通过 pointcut 和 advice 定位到特定的 joinpoint 上
  - 如何在 advice 中编写切面代码.
- 可以简单地认为, 使用 @Aspect 注解的类就是切面.

![在这里插入图片描述](https://p1-jj.byteimg.com/tos-cn-i-t2oaga2asx/gold-user-assets/2020/4/13/1717443ebe76a748~tplv-t2oaga2asx-zoom-in-crop-mark:3024:0:0:0.awebp)

### 12.75 解释基于XML Schema方式的切面实现

- 在这种情况下，切面由常规类以及基于XML的配置实现。

### 12.76 解释基于注解的切面实现

- 在这种情况下(基于@AspectJ的实现)，涉及到的切面声明的风格与带有java5标注的普通java类一致。

## 13. SpringBoot

## 14. MyBatis

### 14.1 Hibernate和MyBatis的区别

Hibernate和MyBatis Plus是两个不同的ORM（对象关系映射）框架，有以下不同之处：

1. 定位：Hibernate是一个全功能ORM框架，主要面向领域模型，可以自动完成对象与关系之间的映射、缓存、事务等操作。MyBatis Plus则更注重SQL和数据操作，提供了一组简单易用的增删改查API和代码生成器。
2. 编程风格：Hibernate采用基于JPA的标准API进行编程，以实体类和注解为主，使用XML文件配置映射关系，可以自动生成数据表和SQL语句。而MyBatis Plus则采用Mapper接口和XML文件进行配置，以SQL为中心，支持自定义SQL和高级查询，同时也提供了一些基于注解的开发方式。
3. 性能：Hibernate在大量数据处理时可能会出现性能瓶颈，因为它会在内存中维护一个缓存以提高性能，但是当数据量过大时，缓存可能会导致OutOfMemoryError等问题。相比之下，MyBatis Plus在性能方面更加出色，因为它不需要维护对象状态和缓存，可以直接执行SQL语句。
4. 学习成本：Hibernate作为一个全功能ORM框架，使用起来比较复杂，需要对其底层实现和映射机制有一定的了解。而MyBatis Plus则相对简单易用，只需要了解基本的SQL语句和Mapper接口的使用即可。

总的来说，Hibernate适用于领域模型比较复杂、对象之间关联比较多的场景，而MyBatis Plus则适用于数据量大、性能要求高、以SQL为中心的场景。选择哪个框架应该根据实际业务需求和技术团队的能力来决定。

## 15. 消息队列

## 16. SpringCloud

## 17. gRPC



# LeetCode速成记录

## LeetCode Hot 100

## 剑指OfferⅠ

### 字符串

#### [剑指 Offer 05. 替换空格](https://leetcode.cn/problems/ti-huan-kong-ge-lcof/)

#### [剑指 Offer 58 - II. 左旋转字符串](https://leetcode.cn/problems/zuo-xuan-zhuan-zi-fu-chuan-lcof/)

可以原地翻转节省空间

#### [剑指 Offer 20. 表示数值的字符串](https://leetcode.cn/problems/biao-shi-shu-zhi-de-zi-fu-chuan-lcof/)

分类讨论，有限状态自动机

#### [剑指 Offer 67. 把字符串转换成整数](https://leetcode.cn/problems/ba-zi-fu-chuan-zhuan-huan-cheng-zheng-shu-lcof/)

注意判断是否溢出的方法

```java
// 转换
int res = 0;
while (index < str.length()) {
    char c = str.charAt(index);
    if (c < '0' || c > '9') {
        break;
    }
    // 判断是否溢出
    if (res > Integer.MAX_VALUE / 10 || (res == Integer.MAX_VALUE / 10 && c > '7')) {
        return sign == 1 ? Integer.MAX_VALUE : Integer.MIN_VALUE;
    }
    res = res * 10 + (c - '0');
    index++;
}
```

### 链表

#### [剑指 Offer 06. 从尾到头打印链表](https://leetcode.cn/problems/cong-wei-dao-tou-da-yin-lian-biao-lcof/)

- 可以使用栈的FILO特性
- 可以先顺序遍历得到链表的长度，再遍历一次将其逆序放入数组中

#### [剑指 Offer 24. 反转链表](https://leetcode.cn/problems/fan-zhuan-lian-biao-lcof/)

有4种方法，参考http://c.biancheng.net/view/8105.html

- 头插法
- 迭代反转(三个指针)
- 递归反转
- 就地反转(两个指针)

迭代法的代码

```java
public ListNode reverseList(ListNode head) {
    // 如果ListNode节点为0个，返回null
    if (head == null){
        return null;
    }
    // 如果ListNode节点个数为1个, 返回当前的ListNode
    if(head.next == null){
        return head;
    }

    // 节点数大于2
    // 先定义三个指针
    // 将beg指向null，mid指向第一个位置, end指向mid的下一个位置
    ListNode beg = null;
    ListNode mid = head;
    ListNode end = head.next;
    // 循环
    while(true){
        // 修改mid的指向
        mid.next = beg;
        // 判断end是否指向null
        if(end == null){
            break;
        }
        // 向后移动
        beg = mid;
        mid = end;
        end = end.next;
    }
    // 最后将head指向mid的位置
    head = mid;
    return head;
}
```

#### [剑指 Offer 18. 删除链表的节点](https://leetcode.cn/problems/shan-chu-lian-biao-de-jie-dian-lcof/)

双指针法，注意**链表为空**和头结点需要删除两种特殊情况

#### [剑指 Offer 22. 链表中倒数第k个节点](https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/)

双指针(或者叫快慢指针)，简单

#### [剑指 Offer 25. 合并两个排序的链表](https://leetcode.cn/problems/he-bing-liang-ge-pai-xu-de-lian-biao-lcof/)

维护一个prev节点，依次放到prev之后，初始化为最小值

#### [剑指 Offer 52. 两个链表的第一个公共节点](https://leetcode.cn/problems/liang-ge-lian-biao-de-di-yi-ge-gong-gong-jie-dian-lcof/)

- 哈希集合法：先遍历一个链表，放入哈希集合中；再遍历另外一个链表，当找到相同的值时，从当前位置开始之后所有的节点都能在之前的哈希集合中找到
- 双指针法/差值法：让两个链表从离结尾相同长度的位置开始遍历；即先获取两个链表的长度

#### [剑指 Offer 21. 调整数组顺序使奇数位于偶数前面](https://leetcode.cn/problems/diao-zheng-shu-zu-shun-xu-shi-qi-shu-wei-yu-ou-shu-qian-mian-lcof/)

双向扫描，注意循环内部的条件

```java
while(left < right){
    // find the first even number from left
    while (left < right && nums[left] % 2 != 0) {
        left++;
    }
    // find the first odd number from right
    while (left < right && nums[right] % 2 == 0) {
        right--;
    }
    // swap
    if (left < right) {
        int temp = nums[left];
        nums[left] = nums[right];
        nums[right] = temp;
    }
}
```

#### [剑指 Offer 57. 和为s的两个数字](https://leetcode.cn/problems/he-wei-sde-liang-ge-shu-zi-lcof/)

经典的twoSum问题，由于数组已经排序，从两头使用双指针法

无序的情况下可以使用HashSet，也可以先排序之后使用双指针

```java
public int[] twoSum(int[] nums, int target) {
    // 使用HashSet
    Set<Integer> set = new HashSet<>();
    for (int num : nums) {
        if (set.contains(target - num)) {
            return new int[] {num, target - num};
        }
        set.add(num);
    }
    return new int[0];
}
```

#### [剑指 Offer 58 - I. 翻转单词顺序](https://leetcode.cn/problems/fan-zhuan-dan-ci-shun-xu-lcof/)

正则表达式的使用

```java
public String reverseWords(String s) {
    if (s == null) return null;
    String[] words = s.trim().split("\\s+"); // 以空格分割字符串
    Collections.reverse(Arrays.asList(words)); // 翻转单词顺序
    return String.join(" ", words); // 以空格连接单词
}
```

### 栈和队列

#### [剑指 Offer 09. 用两个栈实现队列](https://leetcode.cn/problems/yong-liang-ge-zhan-shi-xian-dui-lie-lcof/)

一个栈负责输入，一个栈负责输出；当输出栈为空且需要输出时，将输入栈的内容全部加入输出栈中(优化)

#### [剑指 Offer 30. 包含min函数的栈](https://leetcode.cn/problems/bao-han-minhan-shu-de-zhan-lcof/)

使用一个辅助栈

![fig1](https://assets.leetcode-cn.com/solution-static/jianzhi_30/jianzhi_30.gif)

#### [剑指 Offer 59 - I. 滑动窗口的最大值](https://leetcode.cn/problems/hua-dong-chuang-kou-de-zui-da-zhi-lcof/)

滑动窗口的最大值问题是指，在一个长度为 n 的整数数组中，长度为 k 的滑动窗口从左向右移动，每次移动一个位置，求出每个滑动窗口的最大值。

- 优先队列法(超时)，具体的做法是，先将数组的前 k 个元素放入优先队列中，并记录当前窗口的最大值。然后，从第 k+1 个元素开始遍历数组，每次取出优先队列中的最大元素，将其作为当前窗口的最大值，并将该元素从优先队列中删除。然后，将下一个元素加入优先队列中，并更新当前窗口的最大值。这样，我们就可以依次遍历整个数组，并记录每个滑动窗口的最大值。
- 维护一个双端队列
  - 定义一个双端队列 dq，用于维护窗口中的元素。队列中存储的是窗口中的元素在数组中的下标。
  - 遍历整个数组，依次将每个元素加入窗口中。
  - 每次加入一个新元素时，将队列中所有比它小的元素从队列末尾删除，因为它们已经不可能成为之后的最大值。
  - 如果队列头部的元素已经不在当前窗口内，就将它从队列中删除。
  - 如果当前窗口的大小已经达到 k，就记录队列头部元素对应的数组中的值，它是当前窗口的最大值。
  - 重复执行步骤 2-5，直到遍历完整个数组。

```java
public int[] maxSlidingWindow(int[] nums, int k) {
    Deque<Integer> dq = new ArrayDeque<>();
    int n = nums.length;
    int[] result = new int[n - k + 1];
    int ri = 0;
    for (int i = 0; i < n; i++) {
        while (!dq.isEmpty() && dq.peekLast() < nums[i]) {
            dq.pollLast();
        }
        dq.offer(nums[i]);
        if (i >= k && nums[i - k] == dq.peek()) {
            dq.poll();
        }
        if (i >= k - 1) {
            result[ri++] = dq.peek();
        }
    }
    return result;
}
```



#### [剑指 Offer 59 - II. 队列的最大值](https://leetcode.cn/problems/dui-lie-de-zui-da-zhi-lcof/)

**维护一个双端队列，记住这个思路**

![LeetCode题解](https://pic.leetcode-cn.com/9d038fc9bca6db656f81853d49caccae358a5630589df304fc24d8999777df98-fig3.gif)

### 模拟

#### [剑指 Offer 29. 顺时针打印矩阵](https://leetcode.cn/problems/shun-shi-zhen-da-yin-ju-zhen-lcof/)

模拟输出，使用direcitons定义方向`int[][] directions = {{0, 1}, {1, 0}, {0, -1}, {-1, 0}};`，使用boolean矩阵记录是否被访问过，使用`directionIndex = (directionIndex + 1) % 4;`依次进行方向上的遍历，直到遍历的次数等于矩阵的大小

#### [剑指 Offer 31. 栈的压入、弹出序列](https://leetcode.cn/problems/zhan-de-ya-ru-dan-chu-xu-lie-lcof/)

模拟该过程

1. 将num入栈
2. 判断num是否是popped[i]，即判断是否需要出栈，反复该过程
3. 最后栈如果是空的就说明是合理的序列

### 查找算法

#### [剑指 Offer 03. 数组中重复的数字](https://leetcode.cn/problems/shu-zu-zhong-zhong-fu-de-shu-zi-lcof/)

1. 使用哈希表
2. 原地交换：遍历中，第一次遇到数字 x 时，将其交换至索引 x 处；而当第二次遇到数字 x 时，一定有 nums[x]=x ，此时即可得到一组重复数字。

![Picture0.png](https://pic.leetcode-cn.com/1618146573-bOieFQ-Picture0.png)

#### [剑指 Offer 53 - I. 在排序数组中查找数字 I](https://leetcode.cn/problems/zai-pai-xu-shu-zu-zhong-cha-zhao-shu-zi-lcof/)

二分查找

![Picture1.png](https://pic.leetcode-cn.com/b4521d9ba346cad9e382017d1abd1db2304b4521d4f2d839c32d0ecff17a9c0d-Picture1.png)

```java
class Solution {
    public int search(int[] nums, int target) {
         if (nums == null || nums.length == 0 || target < nums[0] || target > nums[nums.length - 1]) {
            return 0;
        }
        // 使用二分查找
        int l = 0;
        int r = nums.length - 1;
        while (l <= r) {
            int mid = l + (r - l) / 2;
            if (nums[mid] > target) {
                r = mid - 1;
            } else if (nums[mid] < target) {
                l = mid + 1;
            } else {
                // 找到这个值，则不跳跃移动left和right
                // 判断nums[l]是否等于target。如果不相等，说明nums[l]的值太小，将l右移
                // nums[r]同理
                if (l == r) {
                    break;
                }
                if (nums[l] != target) {
                    l++;
                }
                if (nums[r] != target) {
                    r--;
                }
                if (nums[l] == target && nums[r] == target) {
                    break;
                }
            }
        }
        return l <= r ? r - l + 1 : 0;
    }
}
```

注意易错点是：

- r = mid - 1; l = mid + 1; **注意不要忘了要加减1**
- 注意二分查找的固定写法

#### [剑指 Offer 53 - II. 0～n-1中缺失的数字](https://leetcode.cn/problems/que-shi-de-shu-zi-lcof/)

注意：二分查找的while条件是`l<=r`

```java
class Solution {
    public int missingNumber(int[] nums) {
        // 使用二分查找, 检查nums[mid]和mid是否相等
        // 如果相等则说明left ~ mid区间是不缺数字的，移动l继续搜索
        int l = 0;
        int r = nums.length - 1;
        while(l <= r){	//!注意这个地方时l <= r 不要写错了
            int mid = l + (r - l) / 2;
            if(nums[mid] == mid){
                // 移动l
                l = mid + 1;
            } else {
                // 移动r
                r = mid - 1;
            }
        }
        // 最终只需要返回l的位置
        return l;
    }
}
```

#### [剑指 Offer 04. 二维数组中的查找](https://leetcode.cn/problems/er-wei-shu-zu-zhong-de-cha-zhao-lcof/)

类似二叉搜索树

#### [剑指 Offer 11. 旋转数组的最小数字](https://leetcode.cn/problems/xuan-zhuan-shu-zu-de-zui-xiao-shu-zi-lcof/)

注意最后一个else的移动high指针是怎么来的

```java
class Solution {
    public int minArray(int[] numbers) {
        // 旋转数组的最小数字
        int low = 0;
        int high = numbers.length - 1;
        while (low < high) {
            int pivot = low + (high - low) / 2;
            if (numbers[pivot] < numbers[high]) {
                // 说明在左半区间
                high = pivot;
            }
            else if (numbers[pivot] > numbers[high]) {
                low = pivot + 1;
            }
            else {
                // 在二分查找过程中，我们通过比较中间的元素和最右边的元素来进行判断。如果中间元素小于最右边元素，那么最小值一定在左半部分，否则一定在右半部分。
                // 但是，当出现中间元素等于最右边元素时，我们无法确定最小值在哪个区间里。此时，我们可以将最右边的指针减一，相当于去掉了一个可能重复的元素，再继续比较。
                // 因为删除的是一个可能重复的元素，并不会影响结果，所以这个处理方式是可行的。
                high -= 1;
            }
        }
        return numbers[low];
    }
}
```

#### [剑指 Offer 50. 第一个只出现一次的字符](https://leetcode.cn/problems/di-yi-ge-zhi-chu-xian-yi-ci-de-zi-fu-lcof/)

1. 使用哈希表记录
2. 遍历两次
3. 使用getOrDefault()

### 搜索与回溯算法

#### [剑指 Offer 32 - I. 从上到下打印二叉树](https://leetcode.cn/problems/cong-shang-dao-xia-da-yin-er-cha-shu-lcof/)

**二叉树的层序遍历**是一种广度优先搜索算法，可以按照从上到下、从左到右的顺序遍历二叉树节点。具体实现方法如下：

1. 若根节点为空，则返回空列表。
2. 定义一个队列，将根节点加入队列中。
3. 当队列不为空时，依次取出队列中的节点，并将其左右子节点加入队列中。
4. 将当前节点的值添加到结果列表中。
5. 重复步骤3和4，直到队列为空。

```java
public int[] levelOrder(TreeNode root) {
if (root == null) return new int[0];
    Queue<TreeNode> queue = new LinkedList<>() {{
        add(root);  // 加入根节点
    }};
    ArrayList<Integer> ans = new ArrayList<>();
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        ans.add(node.val);  // 列表中添加节点的值
        if (node.left != null) queue.add(node.left); // 左节点入队
        if (node.right != null) queue.add(node.right);  // 右节点入队
    }
    int[] res = new int[ans.size()];
    for (int i = 0; i < ans.size(); i++)
        res[i] = ans.get(i);
    return res;
}
```

#### [剑指 Offer 32 - II. 从上到下打印二叉树 II](https://leetcode.cn/problems/cong-shang-dao-xia-da-yin-er-cha-shu-ii-lcof/)

思路类似于上一题，注意如何分隔每一层，在计算完上一层之后，下一层的所有节点都在队列中，此时队列的size就是下一层的数量。

使用for循环一边弹出节点，将值加入list，一边将下一层的左子节点和右子节点加入队列。

```java
 // 循环
do {
    int size = deque.size();   // 获取队列的大小
    List<Integer> list = new ArrayList<>(); // 存储每一层的结果
    for (int i = 0; i < size; i++) {
        TreeNode node = deque.pop();
        // 放入左子节点
        if (node.left != null){
            deque.add(node.left);
        }
        // 放入右子节点
        if (node.right != null) {
            deque.add(node.right);
        }
        list.add(node.val);
    }
    // 将list加入res
    res.add(list);
} while (!deque.isEmpty());
```

#### [剑指 Offer 32 - III. 从上到下打印二叉树 III](https://leetcode.cn/problems/cong-shang-dao-xia-da-yin-er-cha-shu-iii-lcof/)

之字形打印，在上一题的基础上将偶数层的结果进行反转

#### [剑指 Offer 26. 树的子结构](https://leetcode.cn/problems/shu-de-zi-jie-gou-lcof/)

简单的DFS，背诵并且默写！

```java
/**
 * 判断树 B 是否是树 A 的子结构
 * @param A 待判断的树 A
 * @param B 待判断的树 B
 * @return 如果 B 是 A 的子结构返回 true，否则返回 false
 */
public boolean isSubStructure(TreeNode A, TreeNode B) {
    // 如果 A 或 B 为空，则 B 不能是 A 的子结构
    if(A == null || B == null) return false;
    // 如果 B 是 A 的子树，或者 B 是 A 左子树或右子树的子树，则 B 是 A 的子结构
    return dfs(A, B) || isSubStructure(A.left, B) || isSubStructure(A.right, B);
}

/**
 * 判断以 A 和 B 分别为根节点的两棵树是否相等
 * @param A 待判断的树 A
 * @param B 待判断的树 B
 * @return 如果 A 和 B 相等返回 true，否则返回 false
 */
public boolean dfs(TreeNode A, TreeNode B){
    // 如果 B 为空，则 B 必然为 A 的子结构
    if(B == null) return true;
    // 如果 A 为空，则 B 不能是 A 的子结构
    if(A == null) return false;
    // 如果 A 和 B 的值不相等，则 B 不是以 A 为根节点的子结构
    // 如果 A 和 B 的值相等，则继续递归判断 A 的左右子节点和 B 的左右子节点是否相等
    return A.val == B.val && dfs(A.left, B.left) && dfs(A.right, B.right);
}
```

这段代码是一种判断二叉树是否为另一个二叉树的子结构的实现。函数 `isSubStructure` 接收两个参数，表示两棵二叉树 A 和 B。如果 A 或 B 为空，则返回 false，否则进行如下操作：

- 对 A 进行深度优先搜索，并判断以 A 为根节点的子树是否和 B 相等（即 dfs(A, B)），如果相等则返回 true。
- 如果 1 不成立，则递归遍历 A 的左右子树，继续执行步骤 1。

其中，函数 `dfs` 是一个辅助函数，用于比较以 A 和 B 为根节点的两棵子树是否相同。具体地，如果 B 为空，则返回 true；如果 A 为空，则返回 false；如果 A 和 B 值不相等，或者以 A 和 B 为根节点的左右子树不相等，则返回 false，否则返回 true。

综上，这段代码的思路是利用深度优先搜索遍历二叉树 A 的所有子树，并将每个子树与二叉树 B 进行比较，判断是否存在与 B 相同的子树。

#### [剑指 Offer 27. 二叉树的镜像](https://leetcode.cn/problems/er-cha-shu-de-jing-xiang-lcof/)

注意递归的思路，考虑需不需要辅助函数

```java
public TreeNode mirrorTree(TreeNode root) {
    if(root == null) {
        return null;
    }

    // 从根节点开始左右交换
    TreeNode temp = root.left;
    root.left = mirrorTree(root.right); // 左子树是右子树的镜像
    root.right = mirrorTree(temp);  // 右子树是左子树的镜像

    return root;
}
```

#### [剑指 Offer 28. 对称的二叉树](https://leetcode.cn/problems/dui-cheng-de-er-cha-shu-lcof/)

做递归思考三步：

1. 递归的函数要干什么？

- 函数的作用是判断传入的两个树是否镜像。
- 输入：TreeNode left, TreeNode right
- 输出：是：true，不是：false

2. 递归停止的条件是什么？

- 左节点和右节点都为空 -> 倒底了都长得一样 ->true
- 左节点为空的时候右节点不为空，或反之 -> 长得不一样-> false
- 左右节点值不相等 -> 长得不一样 -> false

3. 从某层到下一层的关系是什么？

- 要想两棵树镜像，那么一棵树左边的左边要和二棵树右边的右边镜像，一棵树左边的右边要和二棵树右边的左边镜像
- 调用递归函数传入左左和右右
- 调用递归函数传入左右和右左
- 只有左左和右右镜像且左右和右左镜像的时候，我们才能说这两棵树是镜像的

4. 调用递归函数，我们想知道它的左右孩子是否镜像，传入的值是root的左孩子和右孩子。这之前记得判个root==null。

## 剑指OfferⅡ
