// 状态模式的关键是区分事物内部的状态，事物内部状态的改变往往会带来事物的行为改变

// 16.1.1 电灯程序

class Light {
    constructor() {
        this.state = 'off'; // 给电灯设置初始状态off
        this.button = null; // 电灯开关按钮
    }
    init() {
        const button = document.getElementById('button');
        button.innerHTML = '开关';
        this.button = document.body.appendChild(button);
        this.button.addEventListener('click', () => {
            this.buttonWasPressed();
        });
    }
    buttonWasPressed() {
        if (this.state === 'off') {
            console.log('开灯');
            this.state = 'on';
        } else if (this.state === 'on') {
            console.log('关灯');
            this.state = 'off';
        }
    }
}

const light = new Light();
light.init();

/**
 * 但是，世界上的电灯并非只有一种。
 * 许多酒店里有另外一种电灯，这种电灯也只有一个开关，
 * 但它的表现是：第一次按下打开弱光，第二次按下打开强光，
 * 第三次才是关闭电灯。现在必须改造上面的代码，
 * 
 * 那就是：
 * 添加更多的if else分支语句 显然这样是不行的
 */

/**
 *  很明显 buttonWasPressed 方法是违反开放-封闭原则的，
 * 每次新增或者修改 light 的状态，
 * 都需要改动 buttonWasPressed 方法中的代码，
 * 这使得 buttonWasPressed 成为了一个非常不稳定的方法。
 * 
 *  所有跟状态有关的行为，都被封装在 buttonWasPressed 方法里，
 * 如果以后这个电灯又增加了强强光、超强光和终极强光，
 * 那我们将无法预计这个方法将膨胀到什么地步。
 * 在实际开发中，要处理的事情可能比这多得多，
 * 也就是说，buttonWasPressed方法要比现在庞大得多。
 * 
 *  状态的切换非常不明显，仅仅表现为对 state 变量赋值，
 * 比如 this.state = 'weakLight'。
 * 在实际开发中，这样的操作很容易被程序员不小心漏掉。
 * 我们也没有办法一目了然地明白电灯一共有多少种状态，
 * 除非耐心地读完 buttonWasPressed 方法里的所有代码。
 * 当状态的种类多起来的时候，
 * 某一次切换的过程就好像被埋藏在一个巨大方法的某个阴暗角落里。
 * 
 *  状态之间的切换关系，不过是往 buttonWasPressed 方法里堆砌 if、else 语句，
 * 增加或者修改一个状态可能需要改变若干个操作，
 * 这使 buttonWasPressed 更加难以阅读和维护。
 */

// 16.1.2 状态模式改进电灯程序
/**
 * 通常我们谈到封装，一般都会优先封装对象的行为，而不是对象的状态。
 * 但在状态模式中刚好相反，状态模式的关键是把事物的每种状态都封装成单独的类，
 * 跟此种状态有关的行为都被封装在这个类的内部，
 * 所以 button 被按下的的时候，
 * 只需要在上下文中，把这个请求委托给当前的状态对象即可，
 * 该状态对象会负责渲染它自身的行为。
 */

// OffLightState:
class OffLightState {
    constructor(light) {
        this.light = light;
    }
    buttonWasPressed() {
        console.log('弱光');
        this.light.setState(this.light.weakLightState); // 切换状态到weakLightState
    }
}
class WeakLightState {
    constructor(light) {
        this.light = light;
    }
    buttonWasPressed() {
        console.log('强光');
        this.light.setState(this.light.strongLightState); 
    }
}
class StrongLightState {
    constructor(light) {
        this.light = light;
    }
    buttonWasPressed() {
        console.log('关灯');
        this.light.setState(this.light.offLightState); 
    }
}

/**
 * 接下来改写 Light 类，现在不再使用一个字符串来记录当前的状态，
 * 而是使用更加立体化的状态对象。
 * 我们在 Light 类的构造函数里为每个状态类都创建一个状态对象，
 * 这样一来我们可以很明显地看到电灯一共有多少种状态
 */

class Light_ {
    constructor() {
        this.offLightState = new OffLightState(this);
        this.weakLightState = new WeakLightState(this);
        this.strongLightState = new StrongLightState(this);

        this.button = null;
    }
    init() {
        const button = document.getElementById('button'),
            self = this;
        this.button = document.body.appendChild(button);
        this.button.innerHTML = 'on&off';
        this.currState = this.offLightState; // 设置当前状态
        this.button.onclick = function() {
            self.currState.buttonWasPressed();
        }
    }
    // 最后还要提供一个 Light.prototype.setState 方法，
    // 状态对象可以通过这个方法来切换 light对象的状态。
    setState(newState) {
        this.currState = newState;
    }
}

const light1 = new Light_();
light.init();

// 添加状态 ==> 加一个新的状态类，然后将对应状态类安装到Light主类构造函数中


// 16.2 状态类的定义

/**
 * ****************允许一个对象在其内部状态改变时改变它的行为，对象看起来似乎修改了它的类。*******************
 * 第一部分的意思是将状态封装成独立的类，
 * 并将请求委托给当前的状态对象，
 * 当对象的内部状态改变时，会带来不同的行为变化。
 * 
 * 第二部分是从客户的角度来看，我们使用的对象，
 * 在不同的状态下具有截然不同的行为，
 * 这个对象看起来是从不同的类中实例化而来的，
 * 实际上这是使用了委托的效果。
 */

