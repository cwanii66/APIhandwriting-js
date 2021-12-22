/**
 * 定义：使多个对象都有机会处理请求，
 * 从而避免请求的发送者和接收者之间的耦合关系，
 * 将这些对象连成一条链，并沿着这条链传递该请求，
 * 直到有一个对象处理它为止。
 * 
 * 请求发送者只需要知道链中的第一个节点，
 * 从而弱化了发送者和一组接收者之间的强联系。
 * 如果不使用职责链模式，那么在公交车上，
 * 我就得先搞清楚谁是售票员，才能把硬币递给他。
 */

// 13.2 实际开发中的职责链模式

// 最糟糕的设计就是堆砌一大坨条件分支语句

// 用职责链模式来重构代码
// 1.0版本

const order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('500元定金预约，得到100元优惠券');
    } else {
        order200(orderType, pay, stock); // 将请求传递给200元订单
    }
};

const order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200元定金预约，得到50元优惠券');
    } else {
        orderNormal(orderType, pay, stock); // 将请求传递给普通订单
    }
};

const orderNormal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买，无优惠券');
    } else {
        console.log('手机库存不足');
    }
};
/**
 * 虽然已经把大函数拆分成了互不影响的 3个小函数，
 * 但可以看到，请求在链条传递中的顺序非常僵硬，
 * 传递请求的代码被耦合在了业务函数之中：
 * 
 * order200(orderType, pay, stock);
 * // order200和order500耦合在了一起
 * 
 * 违反开放封闭原则
 */

// 13.4 灵活可拆分的职责链结点

/**
 * 约定
 * 我们约定，如果某个节点不能处理请求，
 * 则返回一个特定的字符串'nextSuccessor'来表示该请求需要继续往后面传递
 */

const order500 = function(orderType, pay, stock) {
    if (orderType === 1 && pay === true) {
        console.log('500元定金预约，得到100元优惠券');
    } else {
        return 'nextSuccessor'; // 我不知道下一个结点是谁，反正把请求往后面传递
    }
};

const order200 = function(orderType, pay, stock) {
    if (orderType === 2 && pay === true) {
        console.log('200元定金预约，得到50元优惠券');
    } else {
        return 'nextSuccessor'; // 我不知道下一个结点是谁，反正把请求往后面传递
    }
};

const orderNormal = function(orderType, pay, stock) {
    if (stock > 0) {
        console.log('普通购买，无优惠券');
    } else {
        console.log('手机库存不足');
    }
};

/**
 * 接下来需要把函数包装进职责链节点，
 * 我们定义一个构造函数 Chain，
 * 在 new Chain 的时候传递的参数即为需要被包装的函数，
 * 同时它还拥有一个实例属性 this.successor，
 * 表示在链中的下一个节点。
 */

class Chain {
    constructor(fn) {
        this.fn = fn;
        this.successor = null;
    }
    setNextSuccessor(successor) {
        return this.successor = successor;
    }
    passRequest(...args) {
        const ret = this.fn(args);
        if (ret = 'nextSuccessor') {
            return this.successor && this.successor.passRequest(...args);
        }
    }
    
    next() {
        return this.successor && this.successor.passRequest(this.successor, arguments);
    }
}

// 将三个函数分别包装成职责链的结点
const chainOrder500 = new Chain(order500);
const chainOrder200 = new Chain(order200);
const chainOrderNormal = new Chain(orderNormal);

// 指定结点在职责链中的顺序
chainOrder500.setNextSuccessor(chainOrder200);
chainOrder200.setNextSuccessor(chainOrderNormal);

// 最后把请求传递给第一个节点：
chainOrder500.passRequest( 1, true, 500 ); // 输出：500 元定金预购，得到 100 优惠券
chainOrder500.passRequest( 2, true, 500 ); // 输出：200 元定金预购，得到 50 优惠券
chainOrder500.passRequest( 3, true, 500 ); // 输出：普通购买，无优惠券
chainOrder500.passRequest( 1, false, 0 ); // 输出：手机库存不足

// 在这里完全不用理会原来的订单函数代码, 我们要做的只是增加一个节点, 然后重新设置链中相关节点的顺序。 


// 13.5 异步的职责链

/**
 * 而在现实开发中，我们经常会遇到一些异步的问题，
 * 比如我们要在节点函数中发起一个 ajax异步请求，
 * 异步请求返回的结果才能决定是否继续在职责链中passRequest。
 * 
 * 这时候让节点函数同步返回"nextSuccessor"已经没有意义了，
 * 所以要给 Chain 类再增加一个原型方法 Chain.prototype.next，
 * 表示手动传递请求给职责链中的下一个节点:
 */

const fn1 = new Chain(function() {
    console.log(1);
    return 'nextSuccessor';
});

const fn2 = new Chain(function() {
    console.log(2);
    setTimeout(() => {
        this.next();
    }, 1000);
});

const fn3 = new Chain(function() {
    console.log(3);
});

fn.setNextSuccessor(fn2).setNextSuccessor(fn3);
fn1.passRequest();

/**
 * 现在我们得到了一个特殊的链条，
 * 请求在链中的节点里传递，
 * 但节点有权利决定什么时候把请求交给下一个节点。
 * 可以想象，异步的职责链加上命令模式（把 ajax 请求封装成命令对象, 
 * 我们可以很方便地创建一个异步 ajax 队列库。
 */
