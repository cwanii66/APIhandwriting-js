// 首先来看看Function.prototype.before & Function.prototype.after

Function.prototype.before = function(beforefn) {
    const __self = this; // 保存原函数的引用
    return function(...args) { // 返回包含原函数和新函数的代理函数
        beforefn.apply(this, args); // 执行新函数，保证this不被劫持，
                                    // 新函数接受的参数也会原封不动的传入原函数，新函数在原函数之前执行
        return __self.apply(this, args); // 执行原函数并返回原函数的执行结果，
                                        // 并且保证this不被劫持
    };
};

Function.prototype.after = function(afterfn) {
    const __self = this;
    return function(...args) {
        const ret = __self.apply(this, args);
        afterfn.apply(this, args);
        return ret;
    };
};

// try it
document.getElementById = document.getElementById.before(function() {
    alert(1);
});

const button = document.getElementById('button');
console.log(button);

window.onload = function() {
    alert(1);
};
window.onload = (window.onload || function() {}).after(function() {
    alert(2);
}).after(function() {
    alert(3);
}); // ...

// 变通 => 把原函数和新函数都作为参数传入before & after 方法

const before_ = function(originalFn, beforeFn) {
    return function(...args) {
        beforeFn.apply(this, args);
        return originalFn.apply(this, args);
    };
};

const b = before_(function() {alert(3)}, function() {alert(4)});
b = before_(b, function() {alert(5)});
b();