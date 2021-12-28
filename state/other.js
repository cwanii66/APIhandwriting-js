// state pattern at JavaScript

class Light {
    constructor() {
        this.currState = FSM.off; // 设置当前状态
        this.button = null; 
    }
    init() {
        const button = document.createElement('button');
        button.innerHTML = '已关灯';
        this.button = document.body.appendChild(button);
        this.button.addEventListener('click', () => {
            this.currState.buttonWasPressed.call(this);
        });
    }
}

const FSM = {
    off: {
        buttonWasPressed(){
            console.log( '关灯' );
            this.button.innerHTML = '下一次按我是开灯';
            this.currState = FSM.on;
        }
    },
    on: {
        buttonWasPressed(){
            console.log( '开灯' );
            this.button.innerHTML = '下一次按我是关灯';
            this.currState = FSM.off;
        }
    }
};

const light = new Light();
light.init();

// 另一种方法：利用下面的 delegate 函数来完成这个状态机编写
// 这是面向对象设计和闭包互换的一个例子，
// 前者把变量保存为对象的属性，而后者把变量封闭在闭包形成的环境中：

const delegate = function(client, delegation) {
    return {
        buttonWasPressed(...args) { // 将客户的操作委托给delegation对象
            return delegation.buttonWasPressed.apply(client, args);
        }
    };
};

// Here is FSM Obj

class Light_ {
    constructor() {
        this.offState = delegate(this, FSM.off);
        this.onState = delegate(this, FSM.on);
        this.currState = this.offState;
        this.button = null;
    }
    init() {
        const button = document.createElement('button');
        button.innerHTML = '已关灯';
        this.button = document.body.appendChild(button);
        this.button.addEventListener('click', () => {
            this.currState.buttonWasPressed();
        });
    }
}

const light2 = new Light_();
light2.init();