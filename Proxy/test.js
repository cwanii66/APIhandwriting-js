// 小明和MM的故事，小明委托好朋友给MM送花

// 1. no proxy
class Flower {
    constructor() {

    }
}

let mrMing = {
    sendFlower(target) {
        let flower = new Flower();
        target.receiveFlower(flower);
    }
};
let A = {
    receiveFlower(flower) {
        console.log('收到花' + flower);
    },
    listenGoodMood(fn) {
        setTimeout(() => fn(), 1000) // 假设一秒之后A的心情变好
    }
};

// set proxy B, B send flower to A

let B = {
    receiveFlower(flower) {
        A.receiveFlower(flower);
    }
};
mrMing.sendFlower(A);
/**
 * 但是 A 的朋友 B 却很了解 A，所以小明只管把花交给 B，
 * B 会监听 A 的心情变化，然后选择 A 心情好的时候把花转交给 A
 */

let B = {
    receiveFlower(flower) {
        A.listenGoodMood(() => {
            A.receiveFlower(flower);
        });
    }
};
mrMing.sendFlower(B);

/**
 * 代理 B 可以帮助 A过滤掉一些请求，
 * 比如送花的人中年龄太大的或者没有宝马的，
 * 这种请求就可以直接在代理 B处被拒绝掉。这种代理叫作保护代理。
 * 
 * 假设现实中的花价格不菲，导致在程序世界里，new Flower 也是一个代价昂贵的操作，
 * 那么我们可以把 new Flower 的操作交给代理 B 去执行，
 * 代理 B 会选择在 A 心情好时再执行 newFlower，
 * 这是代理模式的另一种形式，叫作虚拟代理。
 * 虚拟代理把一些开销很大的对象，延迟到真正需要它的时候才去创建。
 */
let B = {
    receiveFlower(flower) {
        A.listenGoodMood(function() {
            let flower = new Flower();
            A.receiveFlower(flower);
        })
    }
}
// 代理模式与ES6 的Proxy语法相对应，可以看做是一种元编程，对象经过代理后可以看做是更接近target

// 6.3 虚拟代理实现图片预加载

/**
 * 下面我们来实现这个虚拟代理，首先创建一个普通的本体对象，
 * 这个对象负责往页面中创建一个 img 标签，并且提供一个对外的 setSrc 接口，
 * 外界调用这个接口，便可以给该 img 标签设置
 */

let myImage = (function() {
    let imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
        setSrc(src) {
            imgNode.src = src;
        }
    }
})();
myImage.setSrc('...'); // 如果网速慢的话会有空白

/**
 * 现在开始引入代理对象 proxyImage，通过这个代理对象，
 * 在图片被真正加载好之前，页面中将出现一张占位的菊花图 loading.gif, 
 * 来提示用户图片正在加载。代码如下：
 */

let myImage = (function() {
    let imgNode = document.createElement('img');
    document.body.appendChild(imgNode);

    return {
        setSrc(src) {
            imgNode.src = src;
        }
    }
})();

let proxyImage = (function() {
    let img = new Image;
    img.onload = function() {
        myImage.setSrc(this.src);
    }
    return {
        setSrc(src) {
            myImage.setSrc('.gif');
            img.src = src;
        }
    }
})();

proxyImage.setSrc('...');
/**
 * 单一职责原则指的是，就一个类（通常也包括对象和函数等）而言，
 * 应该仅有一个引起它变化的原因。
 * 如果一个对象承担了多项职责，就意味着这个对象将变得巨大，
 * 引起它变化的原因可能会有多个。
 * 面向对象设计鼓励将行为分布到细粒度的对象之中，
 * 如果一个对象承担的职责过多，等于把这些职责耦合到了一起，
 * 这种耦合会导致脆弱和低内聚的设计。
 * 当变化发生时，设计可能会遭到意外的破坏。
 * 
 * 职责被定义为“引起变化的原因”。 
 */

// !!! 代理和本体接口必须一致






