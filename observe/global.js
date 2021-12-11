/**
 * 回想下刚刚实现的发布—订阅模式，
 * 我们给售楼处对象和登录对象都添加了订阅和发布的功能，
 * 这里还存在两个小问题。
 *    我们给每个发布者对象都添加了 listen 和 trigger 方法，
 *     以及一个缓存列表 clientList，这其实是一种资源浪费。
 *    小明跟售楼处对象还是存在一定的耦合性，
 *     小明至少要知道售楼处对象的名字是salesOffices，才能顺利的订阅到事件。
 */

/**
 * 但实际上：我们只要把订阅的请求交给中介公司
 * 而各大房产公司也只需要通过中介公司来发布房子信息。
 * 这样一来，我们不用关心消息是来自哪个房产公司，
 * 我们在意的是能否顺利收到消息。
 * 当然，为了保证订阅者和发布者能顺利通信，
 * 订阅者和发布者都必须知道这个中介公司。
 */

// 我们将一个全局Event obj作为中介者将发布-订阅者联系起来

const Event = (function() {
    let clientList = {},
        listen,
        trigger,
        remove;
    listen = function(key, fn) {
        if (!clientList[key]) {
            clientList[key] = [];
        }
        clientList[key].push(fn);
    };

    trigger = function(key, ...args) {
        let fns = clientList[key];
        if (!fns || fns.length === 0) {
            return false;
        }
        for (const fn of fns) {
            fn(...args);
        }
    };

    remove = function(key, fn) {
        let fns = clientList[key];
        if (!fns) {
            return false;
        }
        if (!fn) { // 没有fn，remove all
            fns && ( fns.length = 0 );
        } else {
            for (let l = fns.length - 1; l >= 0; l--) {
                let _fn = fns[l];
                if (_fn === fn) {
                    fns.splice(l, 1);
                }
            }
        }
    };

    return {
        listen,
        trigger,
        remove
    }
})(); // module mode
