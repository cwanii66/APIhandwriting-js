// variable scope
let func = function() {
    let a = 1;
    alert (a); // 1
}

func();
alert(a);  // uncaught referenceError: a is not defined

// we should get a scope chain
// 每个上下文都有一个关联的变量对象，上下文中定义的所有变量和函数都存在于这个对象上
// 上下文执行栈

let a = 1;
let func1 = function() {
    let b = 2;
    let func2 = function() {
        let c = 3;
        alert(b);
        alert(a);
    }
    func2();
    alert(c);
};
func1();

// 变量的生存周期

let func = function() {
    let a = 1; // 退出函数后，局部变量a将被销毁
    alert(a);
};

func();

////////////////

let Type = {};

for (var i = 0, type; type = ['String', 'Array', 'Number'][i++]; ) {
    (function(type) {
        Type['is' + type] = function( obj ) {
            return Object.prototype.toString.call(obj) === '[object '+ type +']';
        }
    })(type)
};

Type.isArray([]); // true
Type.isString('str') //true

//3.1.3 闭包的更多作用

//1. 封装变量
let mult = function() {
    let a = 1;
    for (let i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
    }
    return a;
};

//对于那些相同的参数来说，每次都进行计算是一种浪费，我们可以加入缓存机制来提高这个函数的性能：
let cache = {};

let mult = function() {
    let args = Array.prototype.join.call(arguments, ',');
    if (cache[ args ]) {   // 有的话直接读取缓存
        return cache[args];
    }

    let a = 1;
    for (let i = 0, l = arguments.length; i < l; i++) {
        a = a * arguments[i];
    }

    return cache [args] = a;
}
alert (mult(1, 2, 3));   // 6
alert (mult(1, 2, 3));  // 6


/**
 * 
 * 提炼函数是代码重构中的一种常见技巧。如果在一个大函数中有一些代码块能够独立出来，
 * 我们常常把这些代码块封装在独立的小函数里面。独立出来的小函数有助于代码复用，如果这些
 * 小函数有一个良好的命名，它们本身也起到了注释的作用。如果这些小函数不需要在程序的其他
 * 地方使用，最好是把它们用闭包封闭起来。代码如下：
 */

var mult = (function() {
    var cache = {};
    var calculate = function() {// 封闭calculate 函数
        var a = 1;
        for (var i = 0, len = arguments.length; i < len; i++) {
            a = a * arguments[i];
        }
        return a;
    };

    return function() {
        var args = Array.prototype.join.call( arguments, ',');
        if (args in cache) {
            return cache[ args ];
        }

        return cache[ args ] = calculate.apply(null, argument);
    }
})();

//2. 延续局部变量的寿命

var report = function( src ) {
    var img = new Image();
    img.src = src;
};
report('http://xxx.com/getUserInfo');

/**
 * report 函数并不是每一次都成功发起了 HTTP 请求。
 * 丢失数据的原因是 img 是 report 函数中的局部变量，
 * 当 report 函数的调用结束后，img 局部变量随即被销毁，
 * 而此时或许还没来得及发出 HTTP 请求，所以此次请求就会丢失掉。
 * 
 */

// 我们把img变量用闭包封闭起来
var report = (function() {
    var imgs = [];
    return function(src) {
        var img = new Image();
        imgs.push(img);
        img.src = src;
    }
})();


//3.1.4 闭包和面向对象设计

//closure

var extent = function() {
    var value = 0;
    return {
        call: function() {
            value++;
            console.log( value );
        }
    }
};
var extent = extent();
extent.call();
extent.call();
extent.call();

// 换成面向对象写法
var extent = {
    value: 0,
    call: function() {
        this.value++;
        console.log( this.value );
    }
};
//...
// 或者

class Extent {
    constructor() {
        this.value = 0;
    }
};
Extent.prototype.call = function() {
    this.value++;
    console.log(this.value);
};

var extent = new Extent();

//...

// 闭包和内存管理

// 手动讲这些变量设为null



//闭包实现模块模式
// 1. 必须有外部的封闭函数，该函数必须至少被调用一次（每次调用都会创建一个新的模块实例）
// 2. 封闭函数必须返回至少一个内部函数，这样内部函数才能在私有作用域中形成闭包，并且可以访问或者修改私有属性


let MyModules = (function() {
    let modules = {};

    function define(name, deps, impl) {
        for (let i = 0; i < deps.length; i++) {
            deps[i] = modules[deps[i]];
        }
        modules[name] = impl.apply(impl, deps);
    }

    function get(name) {
        return modules[name];
    }

    return {
        define,
        get
    }
})();

/**
 * 这段代码的核心是 modules[name] = impl.apply(impl, deps)。
 * 为了模块的定义引入了包装函数（可以传入任何依赖），
 * 并且将返回值，也就是模块的 API，储存在一个根据名字来管理的模块列表中。
 */

MyModules.define('bar', [], function() {
    function hello(who) {
        return 'Let me introduce: ' + who;
    }
    
    return {
        hello
    }
});

MyModules.define('foo', ["bar"], function(bar) {
    var hungry = 'hippo';

    function awesome() {
        console.log( bar.hello( hungry ).toUpperCase() );
    }

    return {
        awesome
    };
});

var bar = MyModules.get( "bar" );
var foo = MyModules.get( "foo" );
console.log(
    bar.hello( "hippo" )
); // Let me introduce: hippo
foo.awesome(); // LET ME INTRODUCE: HIPPO