---
title: Spring5
date: 2021-12-07T15:40:17.000Z
tags: [Java, 框架]
---

# Spring5

该项目的代码仓库地址: https://gitee.com/laobai1230/spring_learning

## 1. 初始化配置

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans
        https://www.springframework.org/schema/beans/spring-beans.xsd">


    <!--使用Spring来创建对象，在Spring这些都称为Bean
    类型 变量名 = new 类型();
    Hello hello = new Hello();

    id = 变量名
    class = new的对象
    property 相当于给对象中的属性设置一个值！
        -->
    <bean id="hello" class="com.laobai.pojo.Hello">
        <property name="str" value="Spring"/>
    </bean>
</beans>

```

## 2. IoC(控制反转)

### 2.1 理解

1. 要实现不同的操作，不用在程序中进行改动，**修改配置文件即可**
2. 一句话概括就是，***对象由Spring 创建 管理 装配***

### 2.2 构造对象的方法

1. 下标赋值

   ```xml
       <!-- 第一种方式 下标赋值 -->
       <bean id="user1" class="com.laobai.pojo.User">
           <constructor-arg index="0" value="老白1230"/>
       </bean>
   ```

2. 类型

   ```xml
       <!-- 第二种方式 类型 -->
       <bean id="user2" class="com.laobai.pojo.User">
           <constructor-arg type="java.lang.String" value="老白2001"/>
       </bean>
   ```

3. 参数名

   ```xml
   <!-- 第三种方式 参数名 -->
       <bean id="user3" class="com.laobai.pojo.User">
           <constructor-arg name="name" value="老白011230"/>
       </bean>
   ```

   **在配置文件加载的时候，容器中管理的对象就已经初始化了**

## 3. DI依赖注入

### 3.1 构造器注入

### 3.2 set方式注入

1. 测试对象

```java
public class Student {
    private String name;
    private Address address;
    private String[] books;
    private List<String> hobbies;
    private Map<String,String>card;
    private Set<String>games;
    private String wife;
    private Properties info;
}
```

2. 完成注入

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <beans xmlns="http://www.springframework.org/schema/beans"
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
          xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
   
       <bean id="address" class="com.laobai.pojo.Address">
           <property name="actualAddress" value="重庆"/>
       </bean>
   
   
       <bean id="student" class="com.laobai.pojo.Student">
           <!-- 第一种 普通值注入 value -->
           <property name="name" value="老白"/>
           <!-- 第二种 Bean注入,ref-->
           <property name="address" ref="address"/>
           <!-- 数组注入 ref -->
           <property name="books">
               <array>
                   <value>A</value>
                   <value>B</value>
                   <value>C</value>
                   <value>D</value>
               </array>
           </property>
   
           <!-- List -->
           <property name="hobbies">
               <list>
                   <value>Football</value>
                   <value>Volleyball</value>
                   <value>Tabletennis</value>
               </list>
           </property>
   
           <!-- Map -->
           <property name="card">
               <map>
                   <entry key="身份证" value="500xxxyyyymmddabcd"/>
                   <entry key="生日" value="20011230"/>
               </map>
           </property>
   
           <!-- Set -->
           <property name="games">
               <set>
                   <value>LOL</value>
                   <value>DOTA</value>
                   <value>MC</value>
               </set>
           </property>
   
           <!-- null -->
           <property name="wife">
               <null/>
           </property>
   
           <!-- Properties -->
           <property name="info">
               <props>
                   <prop key="学号">2052526</prop>
                   <prop key="性别">男</prop>
                   <prop key="姓名">老白</prop>
               </props>
           </property>
       </bean>
   </beans>
   ```

### 3.3 扩展注入

#### 3.3.1 p命名空间和c命名空间注入

先在xml中加入标签

```xml
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
```



```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xmlns:p="http://www.springframework.org/schema/p"
       xmlns:c="http://www.springframework.org/schema/c"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <!-- 先导入p命名和c命名空间 -->

    <!-- p命名空间注入 properties set注入 -->
    <bean id="user" class="com.laobai.pojo.User" p:name="老白" p:age="20"/>

    <!-- c命名空间注入 constructor 有参构造器 -->
    <bean id="user2" class="com.laobai.pojo.User" c:name="小白" c:age="18"/>
</beans>

```

**c命名空间需要有参构造**

**User类中既有有参构造器也有无参构造器**

## 4. Bean的作用域

1. **单例模式 很重要！！！**

## 5. Bean的自动装配

- 自动装配是Spring满足bean依赖的一种方式
- Spring会在上下文中自动寻找，并自动给bean装配属性

在Spring中有三种装配的方式

1.  xml中显式配置
2. 在java显式配置
3. 隐式的自动装配**(重要)**

## 6. 注解实现自动装配

1. 添加context配置 导入约束支持

   

## 7. 静态代理



## 8. 动态代理

1. **利用反射生成代理类【重点理解】**
2. 动态代理的是**接口**

## 9. AOP

面向切面编程



## 附: IDEA中的一些快捷键操作

1. CPXAC -- ClassPathXmlApplicationContext(大写首字母匹配)
2. 后缀 .castvar -- 强制类型转换并声明变量
3. alt+insert 生成                                                                                                                                                                              
4. alt+enter 
5. ctrl+/ 注释
