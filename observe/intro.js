/**
 * 发布—订阅模式又叫观察者模式，它定义对象间的一种@一对多@的依赖关系，
 * 当一个对象的状态发生改变时，所有依赖于它的对象都将得到通知。
 * 在 JavaScript 开发中，我们一般用@事件模型@来替代传统的发布—订阅模式。
 */

/**
 * 1. 发布—订阅模式可以广泛应用于异步编程中，这是一种替代传递回调函数的方案。
 *      比如，我们可以订阅 ajax 请求的 error、succ 等事件。
 * 2. 发布—订阅模式可以取代对象之间硬编码的通知机制，一个对象不用再显式地调
 *       用另外一个对象的某个接口。
 */

// DOM事件 => 最简单的发布订阅
document.body.addEventListener('click', () => {
    alert('click');
}, false);
/**
 * 在这里需要监控用户点击 document.body 的动作，
 * 但是我们没办法预知用户将在什么时候点击。
 * 所以我们订阅 document.body 上的 click 事件，
 * 当 body 节点被点击时，body 节点便会向订阅者发布这个消息。
 */

// 自定义事件
/**
 *  首先要指定好谁充当发布者（比如售楼处）；(发布者一定要明确)
 *  然后给发布者添加一个缓存列表，用于存放回调函数以便通知订阅者（售楼处的花名册）；
 *  最后发布消息的时候，发布者会遍历这个缓存列表，
 *   依次触发里面存放的订阅者回调函数（遍历花名册，挨个发短信）。
 * 
 * 另外，我们还可以往回调函数里填入一些参数，订阅者可以接收这些参数。
 * 这是很有必要的，比如售楼处可以在发给订阅者的短信里加上房子的单价、面积、容积率等信息，
 * 订阅者接收到这些信息之后可以进行各自的处理：
 */

let salesOffice = {}; // 售楼处
salesOffice.clientList = []; // 缓存列表，存放订阅者的回调函数

salesOffice.listen = function(fn) { // 增加订阅者
    this.clientList.push(fn); // 订阅的消息添加进缓存列表
};

salesOffice.trigger = function(...args) { // 发布消息（事件模型）
    for (let i = 0, fn; fn = this.clientList[i++]; ) {
        fn.apply(this, args); // args 是发布消息时带上的参数
    }
};

// test
salesOffice.listen(function(price, squareMeter) { // Ming subscribe msg
    console.log('price: ', price);
    console.log('squareMeter = ', squareMeter);
});
salesOffice.listen(function(price, squareMeter) { // Hong subscribe msg
    console.log('price: ', price);
    console.log('squareMeter = ', squareMeter);
});

salesOffice.trigger(2000000, 100);
salesOffice.trigger(200000, 800);

/**
 * 小明只想买 88 平方米的房子，但是发布者把 110 平方米的信息也推送给了小明，
 * 这对小明来说是不必要的困扰。所以我们有必要增加一个标示 key，
 * 让订阅者只订阅自己感兴趣的消息。
 */

let salesOffice_ = {};
salesOffice_.clientList = {}; // clientlist 每个属性对应一种消息

salesOffice_.listen = function(key, fn) {
    if (!this.clientList[key]) { // 如果还没有订阅过此类消息，给该消息创建一个缓存列表
        this.clientList[key] = [];
    }
    this.clientList[key].push(fn); // 订阅的消息添加进缓存列表
}

salesOffice_.trigger = function(key, ...args) {
    let fns = this.clientList[key]; // 取出对应消息类型
    
    if (!fns || fns.length === 0) {
        return false; // 没人订阅该消息
    }
    for (let fn of fns) {
        fn(...args); // args是发布消息时附加的参数
    }
};

salesOffice_.listen('squareMeter88', function( price ){ // 小明订阅 88 平方米房子的消息
    console.log( '价格= ' + price ); // 输出： 2000000
});
salesOffice_.listen( 'squareMeter110', function( price ){ // 小红订阅 110 平方米房子的消息
    console.log( '价格= ' + price ); // 输出： 3000000
});

salesOffice_.trigger( 'squareMeter88', 2000000 ); // 发布 88 平方米房子的价格
salesOffice_.trigger( 'squareMeter110', 3000000 ); // 发布 110 平方米房子的价格


// 发布订阅的通用实现
// 将发布订阅的功能提取出来
let _event = {
    clientList: [],
    listen(key, fn) {
        if (!this.clientList[key]) {
            this.clientList[key] = [];
        }
        this.clientList[key].push(fn);
    },
    trigger(key, ...args) {
        let fns = this.clientList[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (const fn of fns) {
            fn(...args);
        }
    }
}

// define a installEvent fn，给所有对象动态安装发布-订阅功能
let installEvent = function(obj) {
    for (let i in _event) {
        obj[i] = _event[i];
    }
};


//remove event we've subscribed
_event.remove = function(key, fn) { //remove 和 subscribe 相对应
    let fns = this.clientList[key];
    if (!fns) {
        return {
            msg: 'Not Found!'
        }
    }
    if (!fn) { // 如果没有传入具体的回调函数，则表示需要取消key对应消息的所有订阅
        fns && (fns.length = 0);
    } else {
        for (let l = fns.length - 1; l >= 0; l--) { //反向遍历订阅的回调函数
            let _fn = fns[l];
            if (_fn === fn) {
                fns.splice(l, 1); // 删除订阅者的回调函数
            }
        }
    }
};
