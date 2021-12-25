/**
 * 很多时候我们不想去碰原函数，也许原函数是由其他同事编写的，
 * 里面的实现非常杂乱。甚至在一个古老的项目中，
 * 这个函数的源代码被隐藏在一个我们不愿碰触的阴暗角落里。
 * 现在需要一个办法，在不改变函数源代码的情况下，
 * 能给函数增加功能，这正是开放-封闭原则给我们指出的光明道路。
 */

// 保存原引用改写

const a = function() {
    alert('a');
};
const _a = a;

a = function() {
    _a();
    alert('_a');
};

a();

// 但是保存原引用的改写方法有些问题

/**
 *  必须维护_onload 这个中间变量，
 * 虽然看起来并不起眼，但如果函数的装饰链较长，
 * 或者需要装饰的函数变多，这些中间变量的数量也会越来越多。
 * 
 *  其实还遇到了 this 被劫持的问题，
 * 在 window.onload 的例子中没有这个烦恼，
 * 是因为调用普通函数_onload 时，this 也指向 window，
 * 跟调用 window.onload 时一样
 * （函数作为对象的方法被调用时，this 指向该对象，所以此处 this 也只指向 window）。
 * 现在把 window.onload换成 document.getElementById，
 */
const _getElementById = document.getElementById;
document.getElementById = function(id) {
    alert(1);
    return _getElementById(id); // (1)
};
const button = document.getElementById('button');
// 执行这段代码，我们看到在弹出 alert(1)之后，紧接着控制台抛出了异常：
// 输出： Uncaught TypeError: Illegal invocation 
/**
 * 此时_getElementById 是一个全局函数，当调用一个全局函数时，
 * this 是指向 window 的，而 document.getElementById 方法的内部实现需要使用 this 引用，
 * this 在这个方法内预期是指向 document，而不是 window, 这是错误发生的原因，
 * 所以使用现在的方式给函数增加功能并不保险。
 */

// 修改 => 手动将document 当做上下文this传入_getElementById:
document.getElementById = function() {
    alert();
    return _getElementById.apply(document, arguments);
};

