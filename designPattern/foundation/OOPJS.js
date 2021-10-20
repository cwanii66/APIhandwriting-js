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