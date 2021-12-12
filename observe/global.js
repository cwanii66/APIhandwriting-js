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
/*** 
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

**/

const Event = (function() {
    let global = this,
        Event,
        _default = 'default';
    
    Event = (function() {
        let _listen,
            _trigger,
            _remove,
            _slice = Array.prototype.slice,
            _shift = Array.prototype.shift,
            _unshift = Array.prototype.unshift,
            namespaceCache = {},
            _create,
            find,
            each = function(ary, fn) {
                let ret;
                for (let i = 0, l = ary.length; i < l; i++) {
                    let n = ary[i];
                    ret = fn.call(n, i, n);
                }
                return ret;
            };

            _listen = function(key, fn, cache) {
                if (!cache[key]) {
                    cache[key] = [];
                }
                cache[key].push(fn);
            };
            
            _remove = function(key, cache, fn) {
                if (cache[key]) {
                    if (fn) {
                        for (let i = cache[key].length; i >= 0; i--) {
                            if (cache[key][i] === fn) {
                                cache[key].splice(i, 1);
                            }
                        }
                    } else {
                        cache[key] = [];
                    }
                }
            };

            _trigger = function(cache, key, ...args) {
                let _self = this,
                    ret,
                    stack = cache[key];
                if (!stack || !stack.length) {
                    return;
                }
                
                return each(stack, () => {
                    return this.apply(_self, args);
                });
            };

            _create = function(namespace) {
                let namespace = namespace ?? _default;
                let cache = {},
                    offlineStack = [], //离线事件
                    ret = {
                        listen(key, fn, last) {
                            _listen(key, fn, cache);
                            if (offlineStack === null) {
                                return;
                            }
                            if (last === 'last') {
                                offlineStack.length && offlineStack.pop()();
                            } else {
                                each(offlineStack, function() {
                                    this();
                                })
                            }
                            offlineStack = null;
                        },

                        one(key, fn, last) {
                            _remove(key, cache);
                            this.listen(key, fn, last);
                        },

                        remove(key, fn) {
                            _remove(key, cache, fn);
                        },

                        trigger(...args) {
                            let _self = this,
                                fn;
                            _unshift.call(args, cache);
                            
                            fn = function() {
                                return _trigger.apply(_self, ...args);
                            };
                            if (offlineStack) {
                                return offlineStack.push(fn);
                            }
                            return fn();
                        }
                    };

                    return namespace ? 
                        (namespaceCache[namespace] ? namespaceCache[namespace] : 
                            namespaceCache[namespace] = ret)
                                : ret;

            };
        return {
            create: _create,
            one(key, fn, last) {
                let event = this.create();
                event.one(key, fn, last);
            },
            remove(key, fn) {
                let event = this.create();
                event.remove(key, fn);
            },
            listen(key, fn, last) {
                let event = this.create();
                event.listen(key, fn, last);
            },
            trigger(...args) {
                let event = this.create();
                event.trigger(...args);
            }
        };
    })();

    return Event;
    
})();

export default Event;
