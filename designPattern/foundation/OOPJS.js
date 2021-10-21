// find changes at your program, and encapsulate the changes

// Chapter one, object oriented js

//1.1 duck typing
// if it walks like a duck, looks like a duck, and quacks like a duck, it is a duck.
// So, we just need to focus on HAS-A, but not IS-A.

let duck = {
    duckSinging() {
        console.log('gagaga');
    }
};

let chicken = {
    duckSinging() {
        console.log('gagaga');
    }
};

const choir = [];

let joinChoir = function(animal) {
    if (animal && typeof animal.duckSing === 'function') {
        choir.push(animal);
        console.log('congrat! welcome our choir');
        console.log("members' length: " + choir.length);
    }
};

joinChoir(duck); //congrat! welcome our choir
joinChoir(chicken); //congrat! welcome our choir
// Principle: Interface oriented, rather than achievement oriented

//1.2 polymorphism

let makeSound = function(animal) {
    if (animal instanceof duck) {
        console.log('gagaga');
    } else if (animal instanceof chicken) {
        console.log('gegege');
    }
};

//let Duck = function() {};
class Duck {
    constructor() { }
    sound() {
        console.log('gagaga');
    }
}
//let Chicken = function() {};
class Chicken {
        constructor() {    
            this.sound = () => console.log('gegege');
    }

}

makeSound(new Duck());
makeSound(new Chicken());
// 多态背后的思想是将是将“不变的事物”与 “可能改变的事物”分离开来
// 不变的隔离，可变的部分封装起来---复合开放-封闭原则

// 1.2.2对象的多态性


// 我们将不变的部分隔离出来=>所有动物都会发出叫声
// 不变的部分总是让它抽象
let makeSound = function(animal) {
    animal.sound();
};

// 将可变的部分各自封装
let Duck = function() {};
Duck.prototype.sound() = function() {
    console.log('gagaga');
};

let Chicken = function() {};
Chicken.prototype.sound = function() {
    console.log('gegege');
};

makeSound(new Chicken());  // gegege
makeSound(new Duck()); //gagaga

//如果增加了一只狗狗，我们不需要改变发出声音的行为
let Dog = function() {};

Dog.prototype.sound = function() {
    console.log('wangwangwang');
};
makeSound(new Dog()); //wangwangwang


//1.2.3 类型检查和多态


/*多态在面向对象程序设计中的作用*/
// 多态最根本的好处在于不必再像对象询问“你是什么类型”而后根据得到的答案调用某个行为————我们只管调用该兴文，其他的一切多态机制都会为你安排妥当。

`实际上，多态最根本的作用就是通过把过程化的条件分支语句转化为对象的多态性，
从而消除这些条件分支语句`

/**
 * Martin Fowler 的话可以用下面这个例子很好地诠释：
    在电影的拍摄现场，当导演喊出“action”时，主角开始背台词，照明师负责打灯
    光，后面的群众演员假装中枪倒地，道具师往镜头里撒上雪花。在得到同一个消息时，
    每个对象都知道自己应该做什么。如果不利用对象的多态性，而是用面向过程的方式来
    编写这一段代码，那么相当于在电影开始拍摄之后，导演每次都要走到每个人的面前，
    确认它们的职业分工（类型），然后告诉他们要做什么。如果映射到程序中，那么程序
    中将充斥着条件分支语句。
 */


/**
 * 假设我们要编写一个地图应用，现在有两家可选的地图 API 提供商供我们接入自己的应用。
 * 目前我们选择的是谷歌地图，谷歌地图的 API 中提供了 show 方法，负责在页面上展示整个地图。
 * 示例代码如下：
 */


let googleMap = {
    show() {
        console.log('start rendering google map');
    }
};

let renderMap = function() {
    googleMap.show();
};
renderMap();
// 来因为某些原因，要把谷歌地图换成百度地图，
// 为了让 renderMap 函数保持一定的弹性，我们用一些条件分支来让 renderMap 函数同时支持谷歌地图和百度地图：

let baiduMap = {
    show() {
        console.log('start rendering baidu map');
    }
};

let renderMap = function(type) {
    if (type === 'google') {
        googleMap.show();
    } else if (type === 'baidu') {
        baiduMap.show();
    }
};

renderMap('google');
renderMap('baidu');

/**
 * 可以看到，虽然 renderMap 函数目前保持了一定的弹性，但这种弹性是很脆弱的，一旦需要
 * 替换成搜搜地图，那无疑必须得改动 renderMap 函数，继续往里面堆砌条件分支语句。
 * 
 * 我们还是先把程序中相同的部分抽象出来，那就是显示某个地图：
 */

let renderMap = function(map) {
    if (map.show instanceof Function) { //有show这个行为就ok
        map.show();
    } // 倘若没有抽象，那就必须进行类型检查，就像java舍弃了抽象类
};

renderMap( googleMap );
renderMap( baiduMap );

let sosoMap = {
    show() {
        console.log('start rendering soso Map');
    }
}
renderMap( sosoMap );


// 1.2.7 设计模式与多态

/********************************************************* */


// 1.3 封装

// 封装的目的是将信息隐藏。一般而言，我们讨论的封装是封装数据和封装实现。这一节将讨论更广义的封装，不仅包括封装数据和封装实现，还包括封装类型和封装变化。


// 1.3.1 封装数据

// 通过函数创建作用域
var myObject = (function() {
    var __name = 'sven'; // private 变量
    return {
        getName() {
            return __name;  //  公开方法
        }
    }
})();

console.log(myObject.getName()); // sven
console.log(myObject.__name); // undefined
// es6 还可以用Symbol创建私有属性

// 1.3.2封装实现

/**
 * 拿迭代器来说明，迭代器的作用是在不暴露一个聚合对象的内部表示的前提下，
 * 提供一种方式来顺序访问这个聚合对象。我们编写了一个 each 函数，
 * 它的作用就是遍历一个聚合对象，使用这个 each 函数的人不用关心它的内部是怎样实现的，
 * 只要它提供的功能正确便可以。即使 each 函数修改了内部源代码，
 * 只要对外的接口或者调用方式没有变化，用户就不用关心它内部实现的改变。
 */


// 1.3.3 封装类型

// 1.3.4 封装变化  !对于设计模式异常重要


// 1.4 原型模式和基于原型继承的JavaScript对象系统

// 1.4.1 use clone

// 原型模式通过克隆创建对象

class Plane {
    constructor() {
        this.blood = 100;
        this.attackLevel = 1;
        this.defenseLevel = 1;
    }
}

let plane = new Plane();

plane.blood = 500;
plane.attackLevel = 10;
plane.defenseLevel = 10;

let planeBro = Object.create(plane, {
    'name': {
        get() {
            return 'planeBro'
        },
    }
});

console.log(planeBro);

// 不支持的浏览器
Object.create = Object.create || function(obj) {
    let F = function() {};
    F.prototype = obj;

    return new F();
}


// 1.4.2 克隆是创建对象的手段

// 1.4.4 原型编程范型的一些规则
/**
 * 所有数据都是对象。
 * 要得到一个对象，并不是通过实例化类，而是找到一个对象作为原型并克隆它。
 * 对象会记住它的原型。
 * 如果对象无法响应某个请求，它会吧这个请求委托给自己的原型。
 */


// 1.4.5 JavaScript中的原型继承

//1. 所有数据都是对象

const obj1 = new Object();
const obj2 = {};

console.log(Object.getPrototypeOf(obj1) === Object.prototype) // true
console.log(Object.getPrototypeOf(obj2) === Object.prototype) // true

//2. 要得到一个对象，并不是通过实例化类，而是找到一个对象作为原型并克隆它。

function Person(name) {
    this.name = name;
};

Person.prototype.getName = function() {
    return this.name;
};

let a = new Person( 'sven' );

console.log( a.name ); // 输出：sven
console.log( a.getName() ); // 输出：sven
console.log( Object.getPrototypeOf( a ) === Person.prototype ); // 输出：true

/**在这里 Person 并不是类，而是函数构造器，JavaScript 的函数既可以作为普通函数被调用，
 * 也可以作为构造器被调用。当使用 new 运算符来调用函数时，此时的函数就是一个构造器。 用
 * new 运算符来创建对象的过程，实际上也只是先克隆 Object.prototype 对象，
 * 再进行一些其他额外操作的过程。 */

//理解 new运算过程
let objectFactory = function() {
    let obj = new Object(), //从Object.prototype上克隆一个空的对象
        Constructor = [].shift.call(arguments); //取得外部传入的构造器

        obj.__proto__ = Constructor.prototype; // 指向正确原型
        let ret = Constructor.apply(obj, arguments); //借用外部传入的构造器给obj设置属性
        
        return typeof ret === 'object' ? ret : obj; //确保构造器总是返回一个对象
};

let a = objectFactory(Person, 'sven');

console.log(a.name);
console.log(a.getName());
console.log(Object.getPrototypeOf(a) === Person.prototype); // true

//下面两行等价
let a = objectFactory(A, 'sven');
let a = new A('sven');


//3.对象会记住它的原型

let a = new Object();
console.log(a.__proto__ === Object.prototype);  //true

/**
 * 实际上，__proto__就是对象跟“对象构造器的原型”联系起来的纽带。
 */

//4. 如果对象无法响应某个请求，他会把这个请求委托给它的构造器原型--> 形成天然的继承链

let obj = {
    name: 'sven'
}
let A = function() {};
A.prototype = obj;

let a = new A();
console.log(a.name); //sven

/**
 * 首先，尝试遍历对象 a 中的所有属性，但没有找到 name 这个属性。
 * 查找 name 属性的这个请求被委托给对象 a 的构造器的原型，它被 a.__proto__ 记录着并且指向 A.prototype，而 A.prototype 被设置为对象 obj。
 * 在对象 obj 中找到了 name 属性，并返回它的值。
 */

// 模拟实现继承效果

let A = function() {};
A.prototype = {name: 1};

let B = function() {};
B.prototype = new A();

let b = new B();
console.log(b.name); //name

//继承总是发生在对象与对象之间

//1.4.6 原型继承的未来

// ECMAScript带来了新的Class语法。 但还是基于原型机制
class Animal {
    constructor(name) {
        this.name = name;
    }
    getName() {
        return this.name;
    }
}

class Dog extends Animal {
    constructor(name) {
        super(name);
    }
    speak() {
        return 'woof'
    }
}

let dog = new Dog('Scamp');
console.log(dog.getName + 'say' + dog.speak());

//1.4.6 summary
// 原型模式！JavaScript通过原型来实现OOP