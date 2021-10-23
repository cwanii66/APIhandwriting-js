// 1. 作为对象的方法调用
let obj = {
    a: 1,
    getA() {
        alert (this === obj);
        alert (this.a);
    }
}

obj.getA();

//2. 作为普通函数调用

window.name = 'globalName';

let getName = function() {
    return this.name;
}
console.log(getName());
// contrast
window.name = 'globalName';

let myObj = {
    name: 'name',
    getName() {
        return this.name;
    }
};

let getName = myObj.getName;
console.log( getName() ); // globalName


//3. 构造器调用(new binding)

class myClass {
    constructor() {
        this.name = 'sven';
    }
}

let obj1 = new myClass();
alert(obj1.name); // sven

let ClassA = function() {
    this.name = 'sven';
    return {
        name: 'anne'
    }
};
let obj2 = new ClassA();
alert(obj2.name); // anne

//4. Function.prototype.call 或 Function.prototype.apply调用, change this passed to function dynamically

const obj3 = {
    name: 'sven',
    getName() {
        return this.name;
    }
};
const obj4 = {
    name: 'anne'
};

console.log( obj3.getName() ); // sven
console.log( obj3.getName.call( obj2 )); // anne

// 2.1.2 this 的丢失问题

document.getElementById = (function (func) {
    return function() {
        return func.apply( document, arguments );
    }
})(document.getElementById);

var getId = document.getElementById;
var div = getId( 'div1' );
alert (div.id); // 输出： div1

