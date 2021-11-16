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

(function() {
    Array.prototype.push.call(arguments, 4);
    console.log( arguments );   // output: [1, 2, 3, 4]
})(1, 2, 3);

/**
 * 在我们的预期中，Array.prototype 上的方法原本只能用来操作 array 对象。
 * 但用 call 和 apply可以把任意对象当作 this 传入某个方法，
 * 这样一来，方法中用到 this 的地方就不再局限于原来规定的对象，而是加以泛化并得到更广的适用性。 
 */

// 把泛化this的过程提取出来

Function.prototype.uncurrying = function() {
    let self = this;  // self 此时是 Array.prototype.push
    return function fn() {
        let obj = Array.prototype.shift.call( arguments );
        /**
         * obj 是 { 传入的对象， 即要绑定的this }
         */
        return self.apply(obj, arguments);
    };
};

// 把Array.prototype.push.call 转化为一个通用函数
let push = Array.prototype.push.uncurrying();

(function() {
    push(arguments, 4);
    console.log(arguments);
})(1, 2, 3);

/**
 * 我们还可以一次性地把 Array.prototype 上的方法“复制”到 array 对象上，
 * 同样这些方法可操作的对象也不仅仅只是 array 对象：
 */
for (let i = 0, fn, arr = ['push', 'shift', 'forEach']; fn = arr[i++]; ) {
    Array[ fn ] = Array.prototype[ fn ].uncurrying();
}

let obj = {
    length: 3,
    0: 1,
    1: 2,
    2: 3
}

Array.push(obj, 4);

let first = Array.shift( obj );
console.log( first ); // 1

Array.forEach( obj, (value, index) => {
    console.log(value);
})

// uncurrying另一种实现方式
Function.prototype.uncurrying = function() {
    let self = this;
    return function() {
        return Function.prototype.call.apply(self, arguments);
        // Function.prototype.call.apply  用于不确定参数长度时指定内部this
        // 1. 为call显式绑定self
        // 2. 对call而言，self是它的执行对象，即调用call的this，self.call()
        // 3. 执行apply后，讲可迭代对象传给apply的调用方，self.call(arguments[0], arguments[1], ...)
    }
}

// 3.函数节流

/**
 * 函数有可能被非常频繁地调用，而造成大的性能问题。下面将列举一些这样的场景。
 * 1. window.onresize 事件
 * 2. mousemove事件
 * 3. 上传进度
 * ...
 */

// 原理
// 这就需要我们按时间段来忽略掉一些事件请求，比如确保在 500ms 内只打印一次。很显然，我们可以借助 setTimeout 来完成这件事情。

/**
 * 关于函数节流的代码实现有许多种，下面的 throttle 函数的原理是，
 * 将即将被执行的函数用setTimeout 延迟一段时间执行。
 * 如果该次延迟执行还没有完成，则忽略接下来调用该函数的请求。
 * throttle 函数接受 2 个参数，第一个参数为需要被延迟执行的函数，
 * 第二个参数为延迟执行的时间。具体实现代码如下：
 */

let throttle = function(fn, interval) {
    let __self = fn, // 保存需要被延迟执行函数的引用
        timer, // 定时器
        firstTime = true; // 是否第一次调用

        return function() {
            let args = arguments;
            __me = this;

            if ( firstTime ) {  // 如果是第一次调用，不需要延迟执行
                __self.apply(__me, args);
                return firstTime = false;
            }
            if ( timer ) {  // 如果定时器还在，说明前一次延迟执行还没有完成
                return false;
            }

            timer = setTimeout(() => { // 延迟一段时间执行
                clearTimeout(timer);
                timer = null;
                __self.apply(__me, args);
            }, interval ?? 500);
        };
};

window.onresize = throttle(function() {
    console.log(1);
}, 500);


// 4. 分时函数
// 工作分批进行


//5. 惰性加载函数
// 在 Web 开发中，因为浏览器之间的实现差异，一些嗅探工作总是不可避免。比如我们需要一个在各个浏览器中能够通用的事件绑定函数 addEvent，



