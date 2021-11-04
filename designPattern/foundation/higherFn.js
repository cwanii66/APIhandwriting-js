// 3.2
// fn could be passed by args(函数可以作为参数被传递)
// fn could be output as return（函数可以作为返回输出）

// 3.2.1 函数作为参数传递

//1. 回调函数
let getUserInfo = function (userId, callback) {
    // jquery
    $.ajax('http://..../getUserInfo?' + userId, function( data ) {
        if (typeof callback === 'function') {
            callback(data);
        }
    });
}
getUserInfo(13157, function( data ) {
    alert(data.userName);
}) 

// 当一个函数不适合执行一些请求时，我们也可以把这些请求封装成一个函数，
// 并把它作为参数传递给另外一个函数，“委托”给另外一个函数来执行。

let appendDiv = function() {
    for (let i = 0; i < 100; i++) {
        let div = document.createElement( 'div' );
        div.innerHTML = i;
        document.body.appendChild( div );
        div.style.display = 'none'; 
    }
}; // create one hundred node and hide them
appendDiv();

/**
 * 把 div.style.display = 'none'的逻辑硬编码在 appendDiv 里显然是不合理的，
 * appendDiv 未免有点个性化，成为了一个难以复用的函数，
 * 并不是每个人创建了节点之后就希望它们立刻被隐藏。
 * 于是我们把 div.style.display = 'none'这行代码抽出来，
 * 用回调函数的形式传入 appendDiv方法：
 */

let appendDiv = function( callback ) {
    for (let i = 0; i < 100; i++) {
        let div = document.createElement('div');
        div.innerHTML = i;
        document.appendChild(div);
        if (typeof callback === 'function') {
            callback( div );
        }
    }
};

appendDiv(function( node ){
    node.style.display = 'none';
});
// hide div 委托 给 appendDiv方法

// 2. Array.prototype.sort

/**
 * 我们的目的是对数组进行排序，这是不变的部分；
 * 而使用什么规则去排序，则是可变的部分。
 * 把可变的部分封装在函数参数里，动态传入Array.prototype.sort
 */

[1, 4, 3].sort( function(a, b) {
    return a - b;
})
[1, 4, 3].sort( function(a, b) {
    return b - a;
})

// 3.2.2 函数作为返回值输出

// 1. 判断数据的类型
let isType = function( type ) {
    return function( obj ) {
        return Object.prototype.toString.call( obj ) === '[object ' + type + ']';
    }
};

let isArray = isType('Array');
console.log( isArray( [1, 2, 3] ) );

// 批量注册
let Type = {};

for (var i = 0, type; type = ['String', 'Array', 'Number'][i++]; ) {
    (function(type) {
        Type[ 'is' + type ] = function(obj) {
            return Object.prototype.toString.call(obj) === '[object ' + type + ']';
        }
    })(type)
};

Type.isArray( [] );


//2. getSingle
let getSingle = function( fn ) {
    let ret;
    return function() {
        return ret || (ret = fn.apply(this, arguments));
    };
};

//这个高阶函数的例子，既把函数当作参数传递，又让函数执行后返回了另外一个函数。


//3.2.3 高阶函数实现AOP（面向切面编程）

/**
 * AOP（面向切面编程）的主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来，
 * 这些跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。
 * 把这些功能抽离出来之后，再通过“动态织入”的方式掺入业务逻辑模块中。
 */

// javaScript 中的AOP通常都是指把一个函数“动态织入”到另一个函数中
// 扩展Function.prototype 实现

Function.prototype.before = function ( beforefn ) {
    let __self = this; // 保存原函数的引用
    return function() { // 返回包含了原函数和新函数的“代理”函数
        beforefn.apply(this, arguments); // 执行新函数，修正this
        return __self.apply(this, arguments); // 执行原函数
    }
}; 

Function.prototype.after = function (afterfn) {
    let __self = this;
    return function() {
        let ret = __self.apply(this, arguments);
        afterfn.apply(this, arguments);
        return ret;
    }
};

let func = function() {
    console.log(2);
};
func = func.before(function() {
    console.log(1);
}).after(function() {
    console.log(3);
});

func();

//这种使用 AOP 的方式来给函数添加职责，也是 JavaScript 语言中一种非常特别和巧妙的装饰者模式实现。

//3.2.4 高阶函数的其他应用

//1. currying

/**
 * currying 又称部分求值。一个 currying 的函数首先会接受一些参数，接受了这些参数之后，
 * 该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保存起来。
 * 待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值。
 */

let cost = (function() {
    let args = [];
    
    return function() {
        if (arguments.length === 0) {
            let money = 0;
            for (let i = 0, l = args.length; i < l; i++) {
                money += args[i];
            }
            return money;
        } else {
            [].push.apply(args, arguments);
        }
    }
})();

cost(100);
cost(200);

console.log(cost());

//接下来我们编写一个通用的 function currying(){}，function currying(){}接受一个参数，即将要被 currying 的函数。

let currying = function(fn) {
    let args = [];
    return function() {
        if (arguments.length === 0) {
            return fn.apply(this, args);
        } else {
            [].push.apply(args, arguments);
            return arguments.callee;
        }
    }
};

let cost = (function() {
    let money = 0;
    return function() {
        for (let i = 0, l = arguments.length; i < l; i++) {
            money += arguments[i];
        }
        return money;
    }
})();

let cost = currying(cost); // transform to currying function

cost( 100 ); // 未真正求值
cost( 200 ); // 未真正求值
cost( 300 ); // 未真正求值
alert ( cost() ); // 求值并输出：600 


// 2. uncurry
