// 期约进度通知
// 执行中的期约可能会有不少离散的“阶段”，在最终解决之前必须依次经过。
// 1. 拓展 Promise类，添加notify() 方法

class TrackablePromise extends Promise {
    constructor(executor) {
        const notifyHandlers = []; // 记录每段notify状态

        super((resolve, reject) => {
            return executor(resolve, reject, (status) => { // notify
                notifyHandlers.map((handler) => handler(status));
            });
        });
        this.notifyHandlers = notifyHandlers;
    }
    notify(notifyHandler) {
        this.notifyHandlers.push(notifyHandler);
        return this;
    }
}

let p = new TrackablePromise((resolve, reject, notify) => {
    (function countdown(x) {
        if (x > 0) {
            notify(`${20 * x}% remaining`);
            setTimeout(() => countdown(x - 1), 1000);
        } else {
            resolve();
        }
    })(5); // 5 次递归地设置1000ms的超时，每个超时回调都会调用notify() 并传入状态值
});

p.notify((x) => setTimeout(console.log, 0, 'progress:', x));
p.then(() => setTimeout(console.log, 0, 'completed'));


// summary
// 改变构造器添加notify函数作为参数( 希望notify 以怎样的形式进行)， 提供notifyhandlers 属性，增加notify 原型方法
// 实际上通知的知性逻辑在 executor 的notify 参数 中