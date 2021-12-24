/**
 * 
 */

const colorSelect = document.getElementById('colorSelect'),
    numberInput = document.getElementById('numberInput'),
    colorInfo = document.getElementById('colorInfo'),
    numberInfo = document.getElementById('numberInfo'),
    nextBtn = document.getElementById('nextBtn');


const goods = { // 手机库存
    red: 3,
    blue: 6
};

colorSelect.addEventListener('change', function() {
    const color = this.value, // 颜色
        number = numberInput.value, // 数量
        stock = goods[color]; // 该颜色对应的当前库存
    
    colorInfo.innerHTML = color;
    if (!color) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请选择手机颜色';
        return;
    }
    if ( ( ( number - 0 ) | 0 ) !== number - 0 ) { // 用户输入的购买数量是否为正整数
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请输入正确的购买数量';
        return;
    }
    if ( number > stock ) { // 当前选择数量没有超过库存量
        nextBtn.disabled = true;
        nextBtn.innerHTML = '库存不足';
        return;
    }
    nextBtn.disabled = false;
    nextBtn.innerHTML = '放入购物车';
});

numberInput.addEventListener('input', function() {
    const color = colorSelect.value, // 颜色
        number = this.value, // 数量
        stock = goods[color]; // 该颜色对应的当前库存
    
    numberInfo.innerHTML = number;
    if (!color) {
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请选择手机颜色';
        return;
    }
    if ( ( ( number - 0 ) | 0 ) !== number - 0 ) { // 用户输入的购买数量是否为正整数
        nextBtn.disabled = true;
        nextBtn.innerHTML = '请输入正确的购买数量';
        return;
    }
    if ( number > stock ) { // 当前选择数量没有超过库存量
        nextBtn.disabled = true;
        nextBtn.innerHTML = '库存不足';
        return;
    }
    nextBtn.disabled = false;
    nextBtn.innerHTML = '放入购物车';
});


// 14.3.3 可能遇到的困难
// 仅仅添加了一个memory选择条件，就要通知到与其相关的对象

// 14.3.4 引入中介者
/**
 * 现在我们来引入中介者对象，
 * 所有的节点对象只跟中介者通信。
 * 当下拉选择框 colorSelect、memorySelect 
 * 和文本输入框 numberInput 发生了事件行为时，
 * 它们仅仅通知中介者它们被改变了，
 * 同时把自身当作参数传入中介者，
 * 以便中介者辨别是谁发生了改变。
 * 剩下的所有事情都交给中介者对象来完成，
 * 这样一来，无论是修改还是新增节点，都只需要改动中介者对象里的代码。
 */

const goods_ = {
    'red|32G': 3,
    'red|16G': 0,
    'blue|32G': 1,
    'blue|16G': 6
};

const mediator = (function() {
// grab dom
    const colorSelect = document.getElementById( 'colorSelect' ),
        memorySelect = document.getElementById( 'memorySelect' ),
        numberInput = document.getElementById( 'numberInput' ),
        colorInfo = document.getElementById( 'colorInfo' ),
        memoryInfo = document.getElementById( 'memoryInfo' ),
        numberInfo = document.getElementById( 'numberInfo' ),
        nextBtn = document.getElementById( 'nextBtn' );
    return {
        changed(obj) {
            const color = colorSelect.value,
                memory = memorySelect.value,
                number = numberInput.value,
                stock = goods_[`${color}|${memory}`];

            if (obj === colorSelect) { // 如果改变的是颜色下拉框
                colorInfo.innerHTML = color;
            } else if (obj === memorySelect) {
                memoryInfo.innerHTML = memory;
            } else if (obj === numberInput) {
                numberInfo.innerHTML = number;
            }

            if (!color) {
                nextBtn.disabled = true;
                nextBtn.innerHTML = '请选择手机颜色';
                return; 
            }
            if ( !memory ){
                nextBtn.disabled = true;
                nextBtn.innerHTML = '请选择内存大小';
                return;
            }
            if ( ( ( number - 0 ) | 0 ) !== number - 0 ){ // 输入购买数量是否为正整数
                nextBtn.disabled = true;
                nextBtn.innerHTML = '请输入正确的购买数量';
                return;
            }
            if ( number > stock ){ // 当前选择数量没有超过库存量
                nextBtn.disabled = true;
                nextBtn.innerHTML = '库存不足';
                return ;
            }
            nextBtn.disabled = false;
            nextBtn.innerHTML = '放入购物车';
        }   
    }

})();
// 事件函数
colorSelect.addEventListener('change', function() {
    mediator.changed(this);
});
memorySelect.addEventListener('change', function() {
    mediator.changed(this);
});
numberInput.addEventListener('input', function() {
    mediator.changed(this);
});

// 增加了中介者之后很明显对象间的耦合度降低了，当新的需求产生，我们只需要修改mediator对象就ok
// 比如我们想增添CPU型号
const goods__ = {
    "red|32G|800": 3, // 颜色 red，内存 32G，cpu800，对应库存数量为 3
    "red|16G|801": 0,
    "blue|32G|800": 1,
    "blue|16G|801": 6 
};
const mediator__ = (function() {
    // ...
    const cpuSelect = document.getElementById('cpuSelect');

    return {
        // ...
        change(obj) {
            const cpu = cpuSelect.value,
                stock = goods[`${color}|${memory}|${cpu}`];
            if (obj === cpuSelect) {
                cpuSelect.innerHTML = cpu;
            }

            // ... do something else
        }
    }
})();




/**
 * summary: 
 * 中介者模式是迎合迪米特法则的一种实现。迪米特法则也叫最少知识原则,
 * ，是指一个对象应该尽可能少地了解另外的对象（类似不和陌生人说话）。
 * 如果对象之间的耦合性太高，一个对象发生改变之后，
 * 难免会影响到其他的对象，跟“城门失火，殃及池鱼”的道理是一样的。
 * 而在中介者模式里，对象之间几乎不知道彼此的存在，
 * 它们只能通过中介者对象来互相影响对方。
 * 
 * 中介者模式使各个对象之间得以解耦，
 * 以中介者和对象之间的一对多关系取代了对象之间的网状多对多关系。
 * 各个对象只需关注自身功能的实现，
 * 对象之间的交互关系交给了中介者对象来实现和维护。
 */

/**
 * 不过，中介者模式也存在一些缺点。
 * 其中，最大的缺点是系统中会新增一个中介者对象，
 * 因为对象之间交互的复杂性，转移成了中介者对象的复杂性，
 * 使得中介者对象经常是巨大的。
 * 中介者对象自身往往就是一个难以维护的对象。
 * 
 * 关键在于如何去衡量对象之间的耦合程度。
 * 一般来说，如果对象之间的复杂耦合确实导致调用和维护出现了困难，
 * 而且这些耦合度随项目的变化呈指数增长曲线，
 * 那我们就可以考虑用中介者模式来重构代码。
 */



