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