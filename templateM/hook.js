// Vue 的生命周期钩子类似于 模板方法模式的封装
/**
 * 模板方法封装了一套创建Vue组件实例的算法流程，
 * 同时也为我们暴露出组件从出生到挂载DOM的声明周期钩子 ==> beforecreate created beforemount mounted ...
 * 我们通过这些钩子函数影响实例
 */

// 11.5 钩子方法
/**
 * 放置钩子是隔离变化的一种常见手段。
 * 我们在父类中容易变化的地方放置钩子，
 * 钩子可以有一个默认的实现，
 * 究竟要不要“挂钩”，这由子类自行决定。
 * 钩子方法的返回结果决定了模板方法后面部分的执行步骤，
 * 也就是程序接下来的走向，
 * 这样一来，程序就拥有了变化的可能。
 * 在这个例子里，我们把挂钩的名字定为 customerWantsCondiments，
 * 接下来将挂钩放入 Beverage类，
 * 看看我们如何得到一杯不需要糖和牛奶的咖啡
 */

class Beverage {
    boilWater() {
        console.log('boil water');
    }
    brew() {
        console.log('brew');
    }
    pourInCup() {
        console.log('pour in cup');
    }
    addCondiments() {
        throw new Error('子类必须重写addCondiments方法');
    }
    
    customerWantsCondiments() {
        return true;
    }

    init() {
        this.boilWater();
        this.brew();
        this.pourInCup();
        if (this.customerWantsCondiments()) { // 如果挂钩返回true，则需要调料
            this.addCondiments();    
        }
    }
}

class CoffeeWithHook extends Beverage {
    boilWater() {
        console.log('boil water');
    }
    brew() {
        console.log('brew');
    }
    pourInCup() {
        console.log('pour in cup');
    }
    addCondiments() {
        console.log('加糖和牛奶');
    }
    customerWantsCondiments() {
        return window.confirm('请问需要调料吗?');
    }
}

const coffeeWithHook = new CoffeeWithHook();
coffeeWithHook.init();

// 好莱坞原则
/**
 * 我们允许底层组件将自己挂钩到高层组件中，
 * 而高层组件会决定什么时候、以何种方式去使用这些底层组件，
 * 高层组件对待底层组件的方式，跟演艺公司对待新人演员一样，
 * 都是“别调用我们，我们会调用你”。
 * 模板方法模式是好莱坞原则的一个典型使用场景，
 * 它与好莱坞原则的联系非常明显，
 * 当我们用模板方法模式编写一个程序时，
 * 就意味着子类放弃了对自己的控制权，
 * 而是改为父类通知子类，哪些方法应该在什么时候被调用。
 * 作为子类，只负责提供一些设计上的细节。
 * 除此之外，好莱坞原则还常常应用于其他模式和场景，
 * 例如发布-订阅模式和回调函数。
 */


// 11.7 真的需要"继承"吗

// javascript不但有基于prototype chain的继承，
// 同时也可以通过对象委托实现继承

const _Beverage = function(param) {
    const boildWater = function() {
        console.log('boil');
    };
    const brew = param?.brew ?? function() {
        throw new Error('必须传递brew方法');
    };
    const pourInCup = param?.pourInCup ?? function() {
        throw new Error('必须传递pourInCup方法');
    };
    const addCondiments = param?.addCondiments ?? function() {
        throw new Error('必须传递addCondiments方法');
    };

    return class F {
        init() {
            boildWater();
            brew();
            pourInCup();
            addCondiments();
        }
    };
}

const Coffee = _Beverage({
    brew(){
        console.log( '用沸水冲泡咖啡' );
    },
    pourInCup(){
        console.log( '把咖啡倒进杯子' );
    },
    addCondiments(){
        console.log( '加糖和牛奶' );
    } 
});

const Tea = _Beverage({
    brew(){
        console.log( '用沸水冲泡茶叶' );
    },
    pourInCup(){
        console.log( '把茶倒进杯子' );
    },
    addCondiments(){
        console.log( '加柠檬' );
    }
});

const coffee = new Coffee();
coffee.init();

const tea = new Tea();
tea.init();
/**
 * 在这段代码中，
 * 我们把 brew、pourInCup、addCondiments 这些方法依次传入 _Beverage 函数，
 * _Beverage 函数被调用之后返回构造器 F。
 * F 类中包含了“模板方法”F.prototype.init。
 * 跟继承得到的效果一样，该“模板方法”里依然封装了饮料子类的算法框架。
 */