// Array.prototype.reduce --> 1D array summation

// one
const arr = [1, 2, 3];
const reducer = (accumulator, currentValue) => accumulator + currentValue;
console.log(arr.reduce(reducer, 0));

// instanceof
/**
 * @param {*} obj instance obj
 * @param {*} func constructor
 * @returns true | false
 */
const instanceOF = (obj, func) => {
    if (!(obj && ['object', 'function'].includes(typeof obj))) {
        return false;
    }

    let proto = Object.getPrototypeOf(obj);
    
    if (proto === func.prototype) {
        return true;
    } else if (proto === null) {
        return false;
    } else {
        // continue search along the prototype chain
        return instanceOF(proto, func);
    }
};
/**
 * @param {*} obj instance object
 * @param {*} func constructor
 * @returns true | false
 */
const instanceOF2 = (obj, func) => {
    if (!(obj && ['object', 'function'].includes(typeof obj))) {
        return false;
    }
    let proto = obj;
    
    while(proto = Object.getPrototypeOf(proto)) {
        if (proto === null) {
            return false;
        } else if (proto === func.prototype) {
            return true;
        }
    }
    return false;
};
// test
let Fn = function() {};
let p1 = new Fn();

console.log(instanceOF({}, Object));
console.log(instanceOF(p1, Fn))
console.log(instanceOF({}, Fn))
console.log(instanceOF(null, Fn))
console.log(instanceOF(1, Fn))
console.log(instanceOF(function a() {}, Function))


// Simple Promise
class MyPromise {
    constructor(executor) {
        this.value = undefined;
        this.status = 'pending';
        this.successQueue = [];
        this.failureQueue = [];
        // private function
        const resolve = () => {
            const doResolve = (value) => {
                if (this.status === 'pending') {
                    this.status = 'fulfilled';
                    this.value = value;

                    while(this.successQueue.length) {
                        const cb = this.successQueue.shift();
                        cb && cb(this.value);
                    }
                }
            }
            setTimeout(doResolve, 0);
        };
        const reject = () => {
            const doReject = (value) => {
                if (this.status === 'pending') {
                    this.status = 'failure';
                    this.value = value;

                    while(this.failureQueue.length) {
                        const cb = this.failureQueue.shift();
                        cb && cb(this.value);
                    }
                }
            };

            setTimeout(doReject, 0);
        };

        executor(resolve, reject);
    }

    then(fulfill = (value) => value, failure = (value) => value) {
        return new MyPromise((resolve, reject) => {
            const fulfilledFunc = (value) => {
                try {
                    const result = fulfill(value);
                    result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch(error) {
                    reject(error);
                }
            };

            const failureFunc = (value) => {
                try {
                    const result = failure(value);
                    result instanceof MyPromise ? result.then(resolve, reject) : resolve(result);
                } catch(error) {
                    reject(error);
                }
            };

            if (this.status === 'pending') {
                this.successQueue.push(fulfilledFunc);
                this.failureQueue.push(failureFunc);
            } else if (this.status === 'fulfilled') {
                fulfill(this.value);
            } else {
                failure(this.value);
            }
        });
    }
    catch() {
        // pending
    }
}
// test MyPromise
const promise = new MyPromise((resolve, reject) => {
    setTimeout(resolve, 1000);
    setTimeout(reject, 2000);
});
promise
  .then(() => {
    console.log('2_1')
    const newPro = new MyPromise((resolve, reject) => {
      console.log('2_2')
      setTimeout(reject, 2000)
    })
    console.log('2_3')
    return newPro
  })
  .then(
    () => {
      console.log('2_4')
    },
    () => {
      console.log('2_5')
    }
  )
  
promise
  .then(
    data => {
      console.log('3_1')
      throw new Error()
    },
    data => {
      console.log('3_2')
    }
  )
  .then(
    () => {
      console.log('3_3')
    },
    e => {
      console.log('3_4')
    }
  )

// simple new
/**
 * execution of new
 * 1. create a new Object
 * 2. the __proto__ of the object point to the prototype of constructor
 * 3. execute constructor and add proterties & methods to the new Object
 * 4. return the object
 */

const _new = function(func, ...args) {
    if (typeof func !== 'function') {
        throw 'the first argument should be a function';
    }
    // create (simply get the copy of func.prototype)
    // let obj = Object.create(func.prototype); 
    let Ctor = function() {};
    Ctor.prototype = func.prototype;
    Ctor.prototype.constructor = func;
    
    let obj = new Ctor();

    let result = func.apply(obj, args);
    
    if (typeof result === 'object'
            && 
        result !== null 
            || 
        typeof result === 'function') {
            return result;
    } else {
        return obj;
    }
};
const Person = function(name, sex) {
    this.name = name;
    this.sex = sex;
};
Person.prototype.showInfo = function() {
    console.log(this.name, this.sex);
};
let person1 = _new(Person, 'chris', 'man');
console.log(person1);

// compose
// usage
function fn1(x) {
    return x + 1;
}
function fn2(x) {
    return x + 2;
}
function fn3(x) {
    return x + 3;
}
function fn4(x) {
    return x + 4;
}
const fn5 = compose(fn1, fn2, fn3, fn4);
console.log(fn5(1));
// compose achievement
function compose(...fn) {
    return fn.reduce((result, currentFn) => {
        return (...args) => {
            return result(currentFn(...args));
        };
    }, (currentFn) => currentFn);
}
function compose(baseFn, ...fn) {
    return fn.reduce((accumulator, currentFn) => {
        return (...args) => accumulator(currentFn(...args)); // merge to accumulator, push current forward
    }, baseFn); 
}


// simple create
const create = (prop, props) => {
    if (![ 'object', 'function' ].includes(typeof prop)) {
        throw new TypeError(`Object prototype may only be an Object or null: ${prop}`);
    }

    // build constructor
    const Ctor = function() {};
    // assign prototype
    Ctor.prototype = prop;
    // create instance
    const obj = new Ctor();
    // support second param
    if (props) {
        Object.defineProperties(obj, props);
    }
    // support null
    if (prop === null) {
        obj.__proto__ = null;
    }

    return obj;
};
// 1. usual create
const person = {
    showName() {
        console.log(this.name);
    }
};
const me = Object.create(person);
const me2 = create(person);
me.name = 'chris';
me2.name = 'wong';

me.showName();
me2.showName();

// 2. null
const emptyObj = Object.create(null);
const emptyObj2 = create(null);

console.log(emptyObj);
console.log(emptyObj2); // null

// 3. propertiesObject params
const props = {
    // foo ==> data attribute
    foo: {
        writable: true,
        configurable: true,
        value: 'hello'
    },
    // bar ==> accessor property
    bar: {
        configurable: true,
        get() { return 'this is getter'; },
        set(value) {
            console.log(`setting ${o.bar} to ${value}`);
        }
    }
};

let o = Object.create(Object.prototype, props);
let o2 = create(Object.prototype, props);
o.bar = 'chris'
o2.bar = 'wong'

console.log(o.foo)
console.log(o.bar)

console.log(o2.foo)
console.log(o2.bar)

