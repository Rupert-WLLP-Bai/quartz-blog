---
title: LaTeX
date: 2021-11-28T11:16:01.000Z
tags: [Academic, Writing, ProgrammingLanguage, LaTeX, Tables, Mathematics, Formulas, Typesetting]
---

# LaTeX基础
## documentclass的设置
1. documentclass
   - IEEEtran
   - article
   - book
   - ctexart

2. 设置纸张大小，字体大小，单面或者双面
    - a4paper
    - 10pt,11pt,12pt
    - oneside

## 导言区
### 引入宏包(\\usepackage)
常用的宏包
1. ctex 支持中文
   
   > 中英混排可以重新设置各个部分标题的输出
   
2. bookmark
3. listing 代码排版

## 踩坑集合
### 表格跨页和长度问题
> 2021年12月2日22:40:44

查了一堆资料，最后还是在官方文档里面找到了解决办法
![](https://laobai1230-1251583803.cos.ap-shanghai.myqcloud.com/img/202112271920783.jpg)

附上一段代码
```latex
\begin{longtable} {|c|c|c|}
    % Appear table header at the first page as well
    \hline
    Option                                               & Subtotal & Proportion \\
    \hline
    \endfirsthead

    % Appear the table header at the top of every page
    \hline
    Option                                               & Subtotal & Proportion \\
    \hline
    \endhead

    % % Appear \hline at the bottom of every page
    % \endfoot

    % data begins here
    \multirow{2}{*}{} Unwilling to take the initiative   &          &            \\
    to express their views in class                      & 46       & 65.71\%    \\ \hline
    \multirow{2}{*}{} Speeches can be very stressful and &          &            \\
    language organization plummets                       & 52       & 74.29\%    \\ \hline
    \multirow{2}{*}{}Fear and anxiety are                &          &            \\
    often felt when you are not alone                    & 47       & 67.14\%    \\ \hline
    Afraid of being noticed                              & 54       & 77.14\%    \\ \hline
    \multirow{2}{*}{}Afraid of being laughed at and      &          &            \\
    negatively evaluated                                 & 41       & 58.57\%    \\ \hline
    \multirow{2}{*}{}Eat alone, attend classes alone,    &          &            \\
    and often stay alone                                 & 31       & 44.29\%    \\ \hline
    Personality sensitive, suspicious                    & 37       & 52.86\%    \\ \hline
    Others                                               & 1        & 1.43\%     \\ \hline
    Valid entries                                        & 70       & ~          \\ \hline
    % more data here
    \caption{Which of the following behaviors do you think indicates that a person may have social phobia?}
    \label{Question 2}                                                           \\
\end{longtable}
```

最终的效果:
![](https://laobai1230-1251583803.cos.ap-shanghai.myqcloud.com/img/202112271920784.jpg)
实现了跨页和表格长度的调整

### tabular整体调整大小
   > 2021年12月2日22:47:55

使用resizebox进行整体调整，对table有效，longtable不适用
```latex
\begin{table}[!ht]
    \centering
    \resizebox{.95\columnwidth}{!}{
        \begin{tabular}{|l|l|l|}
            \hline
            Option                                                            & Subtotal & Proportion \\ \hline
            Unwilling to take the initiative to express their views in class  & 46       & 65.71\%    \\ \hline
            Speeches can be very stressful and language organization plummets & 52       & 74.29\%    \\ \hline
            Fear and anxiety are often felt when you are not alone            & 47       & 67.14\%    \\ \hline
            Afraid of being noticed                                           & 54       & 77.14\%    \\ \hline
            Afraid of being laughed at and negatively evaluated               & 41       & 58.57\%    \\ \hline
            Eat alone, attend classes alone, and often be alone               & 31       & 44.29\%    \\ \hline
            Personality sensitive, suspicious                                 & 37       & 52.86\%    \\ \hline
            Others                                                            & 1        & 1.43\%     \\ \hline
            Valid entries                                                     & 70       & ~          \\ \hline
        \end{tabular}
    }
    \caption{Which of the following behaviors do you think indicates that a person may have social phobia? [Multiple choice question}
    \label{Question 2}
\end{table}
```

总之就是调表格不是一件容易的事情

### tasks设置label_width
![](https://laobai1230-1251583803.cos.ap-shanghai.myqcloud.com/img/202112271920785.jpg)
不设置可能会报label_width过小的警告

## 常用公式

![img](https://laobai1230-1251583803.cos.ap-shanghai.myqcloud.com/img/202112271920786.png)

![img](https://laobai1230-1251583803.cos.ap-shanghai.myqcloud.com/img/202112271920787.png)

![img](https://laobai1230-1251583803.cos.ap-shanghai.myqcloud.com/img/202112271920788.png)

![](https://laobai1230-1251583803.cos.ap-shanghai.myqcloud.com/img/202112271920789.png)

![img](https://laobai1230-1251583803.cos.ap-shanghai.myqcloud.com/img/202112271920790.png)
