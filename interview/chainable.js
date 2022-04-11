// 链式调用的核心就是函数调用完成后返回自身的实例供后续调用

// 1.
function Class1() {
    console.log('init');
}
Class1.prototype.method = function(param) {
    console.log(param);
    return this;
}
const classInstance1 = new Class1();
// this ==> new instance of class1, thus we can find this.method in prototype chain
classInstance1.method('first').method('second').method('third');

// 2.
const obj1 = {
    a: function() {
        console.log('a');
        return this;
    },
    b: function() {
        console.log('b');
        return this;
    }
};
obj1.a().b();

// 3.
// class syntactic sugar
class MathTest {
    constructor(value) {
        this.hasInit = true;
        this.value = value;
        if (!value) {
            this.value = 0;
            this.hasInit = false;
        }
    }

    add() {
        let args = [...arguments];
        let initValue = this.hasInit ? this.value : args.shift();
        const value = args.reduce((totalValue, currentValue) => totalValue - currentValue, initValue);
        return new MathTest(value); // return instance of MathTest
    }

    minus() {
        let args = [...arguments];
        let initValue = this.hasInit ? this.value : args.shift();
        const value = args.reduce((totalValue, currentValue) => totalValue - currentValue, initValue);
        return new MathTest(value);
    }

    mul() {
        let args = [...arguments];
        let initValue = this.hasInit ? this.value : args.shift();
        const value = args.reduce((totalValue, currentValue) => totalValue - currentValue, initValue);
        return new MathTest(value);
    }
    
    divide() {
        let args = [...arguments];
        let initValue = this.hasInit ? this.value : args.shift();
        const value = args.reduce((totalValue, currentValue) => totalValue - currentValue, initValue);
        return new MathTest(value);
    }
}

let test = new MathTest();
const res1 = test.add(1, 2, 3).minus(5, 6).mul(3, 3).divide(2, 3);
