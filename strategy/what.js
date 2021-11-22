/**
 * 在程序设计中，我们也常常遇到类似的情况，要实现某一个功能有多种方案可以选择。
 * 比如一个压缩文件的程序，既可以选择 zip 算法，也可以选择 gzip 算法。
 * 这些算法灵活多样，而且可以随意互相替换。这种解决方案就是本章将要介绍的策略模式。
 * 策略模式的定义是：定义一系列的算法，把它们一个个封装起来，并且使它们可以相互替换。
 */

let calculateBonus = function(performanceLevel, salary) {
   if ( performanceLevel === 'S' ){
      return salary * 4;
   }
   if ( performanceLevel === 'A' ){
      return salary * 3;
   }
   if ( performanceLevel === 'B' ){
      return salary * 2;
   }
}
calculateBonus( 'B', 20000 ); // 输出：40000
calculateBonus( 'S', 6000 ); // 输出：24000 
// BAD !

// 2. 使用组合函数重构代码

/**
 * 一般最容易想到的办法就是使用组合函数来重构代码，
 * 我们把各种算法封装到一个个的小函数里面，
 * 这些小函数有着良好的命名，可以一目了然地知道它对应着哪种算法，
 * 它们也可以被复用在程序的其他地方。
 * */

let performanceS = function(salary) {
   return salary * 4;
}
// ...

let calculateBonus = function(performanceLevel, salary) {
   if ( performanceLevel === 'S' ){
      return performanceS( salary );
   }
   if ( performanceLevel === 'A' ){
      return performanceA( salary );
   }
   if ( performanceLevel === 'B' ){
      return performanceB( salary );
   } 
}
//calculateBonus 函数有可能越来越庞大，而且在系统变化的时候缺乏弹性。

// 3. 使用策略模式重构代码

/**
 * 一个基于策略模式的程序至少由两部分组成。
 * 第一个部分是一组策略类，
 * 策略类封装了具体的算法，并负责具体的计算过程。
 * 第二个部分是环境类 Context，
 * Context 接受客户的请求，随后把请求委托给某一个策略类。
 */

let strategies = {
   S(salary) {
      return salary * 4;
   },
   A(salary) {
      return salary * 3;
   },
   B(salary) {
      return salary * 2;
   }
};

let calculateBonus = function(level, salary) {
   return strategies[level](salary)
}

// 将解决问题的策略封装在一块声明的地方，当环境context变化，就可以从那块地方取出对应解决方案
// 封装算法为策略类内部的方法，context无所谓，因为context环境总是把请求为托到策略类内部

// 这也是对象多态性的体现

