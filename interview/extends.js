// 1. constructor stealing   ==>  call()|apply()  bind this to a new constructor
function SuperType() {
    this.colors = ["red", "blue", "green"];
}

function SubType() {
    // extends SuperType
    SuperType.call(this);
}

let instance1 = new SubType();
instance1.colors.push("black");
console.log(instance1.colors); // "r b g b"

let instance2 = new SubType();
console.log(instance2.colors); // "red,blue,green"

function SuperType(name){
    this.name = name;
}
function SubType() {
    // 继承 SuperType 并传参
SuperType.call(this, "Nicholas");
    // 实例属性
    this.age = 29;
}

let instance = new SubType();
console.log(instance.name); // "Nicholas";
console.log(instance.age); // 29 

// 2. composition nheritance
function S1T(name) {
    this.name = name;
    this.gender = ['man', 'woman'];
}
S1T.prototype.sayName = function() {
    console.log(this.name);
}

function S1B(name, age) {
    SuperType.call(this, name);
    this.age = age;
}
S1B.prototype = new S1T();
S1B.prototype.constructor = S1B;
S1B.prototype.sayAge = function() {
    console.log(this.age);
}; 

// 3. classic prototype inheritance
function object(o) {
    function F() {}
    F.prototype = o;
    return new F();
}

// 4. parasitic inheritance

function createAnother(original) {
    let clone = object(original); // create a new obj
    clone.sayHi = function() { console.log("hi"); }; // strengthen this obj in some way
    return clone; // return this obj
}

// 5. parasitic & composed inheritance
// do not call superconstructor again and again
function inheritPrototype(subType, superType) {
    let prototype = object(superType.prototype);
    prototype.constructor = subType;
    subType.prototype = prototype;
}
