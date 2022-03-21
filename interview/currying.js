const currying = function(func) {
    const args = [];

    return function fn(..._args_) {
        if (_args_.length === 0) {
            return func.apply(this, args);
        } else {
            args.push(..._args_);
            return fn;
        }
    };
};
// cost caculating test
const cost = (function() {
    let money = 0;

    return function(...args) {
        for (let i = 0, l = args.length; i < l; i++) {
            money += args[i];
        }
        return money;
    }
})();

const curriedCost = currying(cost); // tansform it to curry function

cost(100);
cost(200);
cost(300); // do not sum
alert(cost()); // input: 600


/**
 * params composing
 * and return new function to receive next param
 * then equal to the formal param number ... execute
 */

// uncurrying
// in order to generalize

Function.prototype.uncurrying = function() {
    const self = this;

    return function(...args) {
        return Reflect.apply(Function.prototype.call, self, args); // 对 call 以 apply的方式调用
    };
};