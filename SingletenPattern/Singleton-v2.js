// 4.5 惰性单例

// 在需要的时候才创建对象实例。惰性单例是单例模式的重点

/**
 * instance 实例对象总是在我们调用 Singleton.getInstance 的时候才被创建，
 * 而不是在页面加载好的时候就创建，代码如下：
 */

Singleton.getInstance = (function() {
    let instance = null;
    return function( name ) {
        if (!instance) {
            instance = new Singleton( name );
        }
        return instance;
    }
})()

//不过这是基于“类”的单例模式，前面说过，基于“类”的单例模式在 JavaScript 中并不适用，下面我们将以 WebQQ 的登录浮窗为例，介绍与全局变量结合实现惰性的单例。

/**
 * 当点击左边导航里 QQ 头像时，
 * 会弹出一个登录浮窗（如图 4-1 所示），
 * 很明显这个浮窗在页面里总是唯一的，
 * 不可能出现同时存在两个登录窗口的情况。
 */

// 1. 在页面加载完称的时候便创建好这个div浮窗，浮窗一开始是隐藏状态，当地那几登录按钮才开始显示

let createLoingLayer = (function() {
    let div = document.createElement('div');
    div.innerHTML = `I'm login layer`;
    div.style.display = 'none';
    document.body.appendChild(div);
    return div
})()

// document.getElementById('loginBtn').onclick = () => loginLayer.style.display = 'block';
// 但是结点一开始是被隐藏的，我们只需要在点击的时候他才有
document.getElementById('loginBtn').addEventListener('click', () => {
    let loginLayer = createLoginLayer();
    loginLayer.style.display = 'block';
})
// 但是频繁的删除和创建结点并没有这个必要
// 前面的做法是加一条逻辑判断，提那极爱各变量判断是否已经创建过登陆窗

// if (!div) ...

// 通用的惰性单例

/**
 * 
 *  这段代码仍然是违反单一职责原则的，
 * 创建对象和管理单例的逻辑都放在 createLoginLayer对象内部。
 * 
 *  如果我们下次需要创建页面中唯一的 iframe，或者 script 标签，
 * 用来跨域请求数据，就必须得如法炮制，把 createLoginLayer 函数几乎照抄一遍：
 */

/**
 * 单例逻辑 与 创建逻辑分离
 */
let obj;
if (!obj) {
    // ... 单例逻辑
}

// 封装在getSingleton, 
// 创建对象的方法fn被当成参数动态传入getSingle函数
let getSingleton = function( fn ) {
    let result;
    return function() {
        return result ?? (result = fn.apply(this, arguments))
    }
}
let createLoginLayer = function() {
    let div = document.createElement('div');
    div.innerHTML = "i'm login layer";
    div.style.display = 'none';
    document.body.appendChild(div);
    return div;
}

let createSingleLoginLayer = getSingleton(createLoginLayer); //connect

document.getElementById('loginBtn').onclick = function() {
    let loginLayer = createSingleLoginLayer();
    loginLayer.style.display = 'block';
}

//当它们连接在一起的时候，就完成了创建唯一实例对象的功能

let bindEvent = getSingleton(function() {
    document.getElementById('div1').addEventListener('click', function() {
        alert('click');
    })
    return true;
})

let render = function() {
    console.log('start rendering');
    bindEvent();
}

for (let i = 0; i < 10; i++) {
    render();
}

//render 函数和 bindEvent 函数都分别执行了多次，但 div 实际上只被绑定了一个事件。
