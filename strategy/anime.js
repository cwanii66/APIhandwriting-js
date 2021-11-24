/**
 * context 影响职责 context 并没有计算奖金的能力
 * 而是把这个职责委托隔了某个策略对象
 * 每个策略对象的算法被各自封装在对象内部
 */

// 5.4 用策略模式实现缓动动画

// JavaScript连续改变元素的某个CSS属性，比如 left、top、background-position 来实现动画效果。

let tween = {
    linear(t, b, c, d) {
        return c*t / d + b;
    },
    easeIn(t, b, c, d) {
        return c * (t /= d) + b;
    },
    strongEaseIn(t, b, c, d) {
        return c * ( t /= d ) * t * t * t * t + b;
       },
    strongEaseOut(t, b, c, d) {
        return c * ( ( t = t / d - 1) * t * t * t * t + 1 ) + b;
    },
    sineaseIn( t, b, c, d ) {
        return c * ( t /= d) * t * t + b;
    },
    sineaseOut(t, b, c, d) {
        return c * ( ( t = t / d - 1) * t * t + 1 ) + b;
    }     
}; // 缓动算法封装

class Animate {
    constructor( dom ) {
        this.dom = dom; // 进行运动的 dom 节点
        this.startTime = 0; // 动画开始时间
        this.startPos = 0; // 动画开始时，dom 节点的位置，即 dom 的初始位置
        this.endPos = 0; // 动画结束时，dom 节点的位置，即 dom 的目标位置
        this.propertyName = null; // dom 节点需要被改变的 css 属性名
        this.easing = null; // 缓动算法
        this.duration = null; // 动画持续时间
    }

    // 启动动画
    start(propertyName, endPos, duration, easing) {
        this.startTime = +new Date; //动画启动时间
        this.startPos = this.dom.getBoundingClientRect()[ propertyName ]; // dom 结点初始位置
        this.propertyName = propertyName; //css 属性改变
        this.endPos = endPos; // dom 节点目标位置
        this.duration = duration; // 动画持续事件
        this.easing = tween[ easing ]; // 缓动算法

        // 启动定时器开始执行动画
        // 如果动画已结束，则清除定时器
        let timeId = setInterval(() => {
            if ( this.step() === false ) {
                clearInterval( timeId );
            }
        }, 19);
    }

    // 小球每一帧要做的事情
    step() {
        let t = +new Date; // 取得当前时间
        if (t >= this.startTime + this.this.duration) { // 动画结束
            this.update(this.endPos); // 更新小球CSS属性值
            return false;
        }
        let pos = this.easing(t - this.startTime, this.startPos, this.endPos, this.duration);
        // pos 为小球当前位置
        this.update(pos); // update小球css属性
    }

    update(pos) {
        this.dom.style[this.propertyName] = pos + 'px';
    }
}

let div = document.getElementById('div');
let animate = new Animate( div );

animate.start('left', 500, 1000, 'strongEaseOut');
/**
 * 关键是如何从策略模式的实现背后，
 * 找到封装变化、委托和多态性这些思想的价值。
 */

/**
 * 多态最根本的作用就是通过把过程化的条件分支语句转化为对象的多态性，
 * 从而消除这些条件分支语句。 
 * 多态就是相同的操作在不同的对象上能产生不同的效果
 */

/**
 * 抽象相同点
 */




