/**
 * 缓存代理可以为一些开销大的运算结果提供暂时的存储，
 * 在下次运算时，如果传递进来的参数跟之前一致，
 * 则可以直接返回前面存储的运算结果。
 */

// 例：计算乘积

let mult = function(...args) {
    console.log('start!')
    let a = 1;
    for (let i = 0, l = args.length; i < l; i++) {
        a = a * args[i];
    }
    return a;
}
mult(2, 3); // 6
mult(2,3,4); // 24

// now 我们加入缓存代理函数
let proxyMult = (function() {
    let cache = {};
    return function filteredFn(...args) {
        let argsStr = args.join(',');
        if (Reflect.has(cache, argsStr)) {
            return cache[argsStr];
        }
        return cache[argsStr] = mult.apply(this, args); // 绑定this，并且可以传入不确定个数参数
    }
})()
proxyMult( 1, 2, 3, 4 ); // 输出：24
proxyMult( 1, 2, 3, 4 ); // 输出：24 

// 缓存代理用于ajax异步请求数据

/**
 * 我们无法直接把计算结果放到代理对象的缓存中，而是要通过回调的方式.
 */

// 高阶函数动态创建代理
/**
 * 现在这些计算方法被当作参数传入一个 专门用于创建缓存代理的工厂中， 
 * 这样一来，我们就可以为乘法、加法、减法等创建缓存代理
 */
/**************** 计算乘积 *****************/
let mult = function(...args){
    let a = 1;
    for ( let i = 0, l = args.length; i < l; i++ ){
        a = a * args[i];
    }
    return a;
};
/**************** 计算加和 *****************/
let plus = function(...args){
    let a = 0;
    for ( let i = 0, l = args.length; i < l; i++ ){
        a = a + args[i];
    }
    return a;
};
/**************** 创建缓存代理的工厂 *****************/
let createProxyFactory = function(fn) {
    let cache = {};
    return function(...args) {
        let argsStr = args.join('|');
        if (Reflect.has(cache, argsStr)) {
            return cache[argsStr];
        }
        return cache[argsStr] = fn.apply(this, args);
    }
};

let proxyMult = createProxyFactory(mult),
    proxyPlus = createProxyFactory(plus);

    alert ( proxyMult( 1, 2, 3, 4 ) ); // 输出：24
    alert ( proxyMult( 1, 2, 3, 4 ) ); // 输出：24
    alert ( proxyPlus( 1, 2, 3, 4 ) ); // 输出：10
    alert ( proxyPlus( 1, 2, 3, 4 ) ); // 输出：10 


/**
 * 代理模式包括许多小分类，在 JavaScript 开发中最常用的是虚拟代理和缓存代理。
 * 虽然代理模式非常有用，但我们在编写业务代码的时候，往往不需要去预先猜测是否需要使用代理模式。
 * 当真正发现不方便直接访问某个对象的时候，再编写代理也不迟。
 */
