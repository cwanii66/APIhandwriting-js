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


