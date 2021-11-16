// defination: 保证一个类仅有一个实例，并提供一个访问它的全局访问点

/**
 * 试想一下，当我们单击登录按钮的时候，页面中会出现一个登录浮窗，
 * 而这个登录浮窗是唯一的，无论单击多少次登录按钮，
 * 这个浮窗都只会被创建一次，那么这个登录浮窗就适合用单例模式来创建。
 */

/***************************************************************************** */

// 4.1 standard

let Singleton = function( name ) {
    this.name = name
    this.instance = null
}

Singleton.prototype.getName = function() {
    alert(this.name)
}

Singleton.getInstance = function( name ) {
    if (!this.instance) {
        this.instance = new Singleton( name )
    }

    return this.instance
}

let a = Singleton.getInstance('sven1')
let b = Singleton.getInstance('sven2')

alert(a === b)

// equal to

let Singleton = function( name ) {
    this.name = name
}

Singleton.prototype.getName = function() {
    alert(this.name)
}

Singleton.getInstance = (function() {
    let instance = null
    return function(name) {
        if (!instance) {
            instance = new Singleton(name)
        }
        return instance
    }
})()

// create single div node at our page
let CreateDiv = (() => {
    let instance;

    class CreateDiv {
        constructor(html) {
            if (instance) {
                return instance
            }
            this.html = html
            this.init()
            return instance = this
        }

        init() {
            let div = document.createElement('div');
            div.innerHTML = this.html;
            document.body.appendChild(div);
        }
    }

    return CreateDiv;
})();

let a = new CreateDiv('sven1');
let b = new CreateDiv('sven2');
alert(a === b); // true

// equal to

var CreateDiv = (function(){
    var instance;
    var CreateDiv = function( html ){
        if ( instance ){
        return instance;
    }

    this.html = html;
    this.init(); 
    return instance = this;
};

    CreateDiv.prototype.init = function(){
        var div = document.createElement( 'div' );
        div.innerHTML = this.html;
        document.body.appendChild( div );
    };
    return CreateDiv;

})();
var a = new CreateDiv( 'sven1' );
var b = new CreateDiv( 'sven2' );
alert ( a === b ); // true 
// 必须先知道功能才能了解其中的原理

/**
 * CreateDiv 的构造函数实际上负责了两件事情。第一是创建对象和执行初始
化 init 方法，第二是保证只有一个对象。虽然我们目前还没有接触过“单一职责原则”的概念，
但可以明确的是，这是一种不好的做法，至少这个构造函数看起来很奇怪。
假设我们某天需要利用这个类，在页面中创建千千万万的 div，即要让这个类从单例类变成
一个普通的可产生多个实例的类，那我们必须得改写 CreateDiv 构造函数，把控制创建唯一对象
的那一段去掉，这种修改会给我们带来不必要的烦恼。
 */
// 单一职责， createDiv 仅仅作为create div 的类
class CreateDiv {
    constructor( html ) {
        this.html = html;
        this.init();
    }

    init() {
        let div = document.createElement('div');
        div.innerHTML = this.html;
        document.body.appendChild( div );
    }
}

// 引入代理、将createDiv的行为改变成单例

let ProxySingletonCreateDiv = (() => {
    let instance;
    return html => {
        if (!instance) {
            instance = new CreateDiv( html );
        }
        return instance;
    }
})();

var a = new ProxySingletonCreateDiv( 'sven1' );
var b = new ProxySingletonCreateDiv( 'sven2' );
alert ( a === b ); 

/**我们同样完成了一个单例模式的编写，跟之前不同的是，现在我们
把负责管理单例的逻辑移到了代理类 proxySingletonCreateDiv 中。这样一来，CreateDiv 就变成了
一个普通的类，它跟 proxySingletonCreateDiv 组合起来可以达到单例模式的效果。
 */
