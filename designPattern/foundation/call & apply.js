// difference
// apply 第二个参数是带下标的集合

let func = function(a, b, c) {
    alert([a,b,c]);  // [1,2,3]
};

func.apply(null, [1,2,3]);

//es6 直接用扩展运算符

// call 船夫的参数数量不固定，第 2+ 个参数都会传入函数

let func = function(a,b) {
    alert (this === window);
};
func.apply(null, [1, 2]);

/**
 * 有时候我们使用 call 或者 apply 的目的不在于指定 this 指向，
 * 而是另有用途，比如借用其他对象的方法。那么我们可以传入 null 来代替某个具体的对象：
 * Math.max.apply( null, [ 1, 2, 5, 3, 4 ] ) // 输出：5 
 * 
 */

// call 和 apply 的用途

//1. 改变this指向

document.getElementById('div1').onclick = function() {
    alert( this.id ); // div1

    let func = function() {
        alert (this.id); // div1
    }
    func.call(this);
    func(); // this.id ==> undefined
}

//2. Function.prototype.bind

Function.prototype.bind = function( context ) {
    let self = this; // 保存原函数
    return function() {
        return self.apply(context, arguments);       //context as this
    }
};

Function.prototype.bind = function() {
    let self = this,
        context = [].shift.call(arguments); // 需要绑定的this上下文
        args = [].slice.call(arguments); //剩余参数转成数组
    return function() {
        return self.apply(context, [].concat.call( args, [].slice.call(arguments) ));
        // 执行新函数，会把context当做新函数体内的this
        // 并且组合两次分别传入的参数，作为新函数的参数
    }
}

let obj5 = {
    name: 'sven'
}

let func = function(a, b, c, d) {
    alert(this.name);
    alert( [a, b, c, d] );
}.bind(obj5, 1, 2);

func(3, 4);

//3. 借用其他对象的方法

// 01=> 借用构造函数
var A = function( name ){
    this.name = name;
   };

   var B = function(){
    A.apply( this, arguments );
   };
   B.prototype.getName = function(){
    return this.name;
   };
   var b = new B( 'sven' );
   console.log( b.getName() ); // 输出： 'sven'

//02=> 在操作 arguments 的时候，我们经常非常频繁地找 Array.prototype 对象借用方法。
// 想把 arguments 转成真正的数组的时候，可以借用 Array.prototype.slice 方法；
// 想截去arguments 列表中的头一个元素时，又可以借用 Array.prototype.shift 方法。
(function() {
    Array.prototype.push.call(arguments, 3);
    console.log(arguments); //output: [1,2,3]
})(1, 2);

// Array.prototype.push 实际上是一个属性复制的过程，把参数按照
// 下标依次添加到被 push 的对象上面，顺便修改了这个对象的 length 属性。至于被修改的对象是
// 谁，到底是数组还是类数组对象，这一点并不重要。

var a = {
    length: 0
};
Array.prototype.push.call( a, 'first' );
alert ( a.length ); // 输出：1
alert ( a[ 0 ] ); // first

//  对象本身要可以存取属性；
//  对象的 length 属性可读写。

let func = function() {};
Array.prototype.push.call(func, 'first');
alert(func.length);

// error: cannot assign to read only property 'length' of function() {}
// 函数的 length 属性就是一个只读的属性，表示形参的个数