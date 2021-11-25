/**
 * 策略模式也可以用来封装一系列的“业务规则”。
 * 只要这些业务规则指向的目标一致，并且可以被替换使用
 */



/**
 * 在点击注册按钮之前，有如下几条校验逻辑。
 *  用户名不能为空。
 *  密码长度不能少于 6 位。
 *  手机号码必须符合格式。
 */

let strategies = {  // 单一职责
    isNoneEmpty(value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },
    minLength(value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg;
        }
    },
    isMobile(value, errorMsg) {
        if ( !/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};

// 实现Validator类。Validator类在这里作为Context，负责接收用户的请求并委托给Strategy 对象
// !!! 我们有必要提前知道用户如何使用Validator类来发送请求的，这样有助于我们知道如何去编写 Validator 类

// 用户的实际校验逻辑
let validateFunc = function() {
    let validator = new Validator();

    // add 校验规则
    validator.add( registerForm.userName, 'isNonEmpty', '用户名不能为空' );
    validator.add( registerForm.password, 'minLength:6', '密码长度不能少于 6 位' );
    validator.add( registerForm.phoneNumber, 'isMobile', '手机号码格式不正确' );

    let errorMsg = validator.start(); // 获得校验结果
    return errorMsg || true;
}

let registerForm = document.getElementById('registerForm');

registerForm.addEventListener('submit', () => {
    let errorMsg = validateFunc(); // 有error, 未通过校验
    if (errorMsg) {
        alert(errorMsg);
        return false; // 阻止表单提交
    }
})

// 作为context，用户校验衍生于validator类，不同的校验有不同的对象，多态
class Validator {
    constructor() {
        this.cache = []; // 保存校验规则
    }

    add(dom, rule, errorMsg) {
        let ary = rule.split(':'); // strategy 和参数分离
        this.cache.push(function() { // 把校验的步骤用空函数包装起来，并且放入 cache
            let strategy = ary.shift(); // 获得strategy
            ary.unshift(dom.value); // 把input的value添加进参数列表
            ary.push(errorMsg); // 添加errorMsg添加进参数列表
            return strategies[strategy].apply(dom, ary);
        });
    }

    start() {
        for (let i = 0, validatorFunc; validatorFunc = this.cache[i++]; ) {
            let msg = validatorFunc(); // 开始校验
            if (msg) { // 校验函数有返回值，说明校验没有通过
                return msg;
            }
        }
    }
}

// 5.6.3文本输入框添加多种校验规则
// 期望
validator.add(registerForm.userName, [{
    strategy: 'isNonEmpty',
    errorMsg: '用户名不能为空'
}, {
    strategy: 'minLength',
    errorMsg: '用户名长度不能小于10位'
}]);

/**************策略对象*****************/

let strategies_ = {
    isNonEmpty(value, errorMsg) {
        if (value === '') {
            return errorMsg;
        }
    },

    minLength(value, length, errorMsg) {
        if (value.length < length) {
            return errorMsg;
        }
    },

    isMobile(value, errorMsg) {
        if (!/(^1[3|5|8][0-9]{9}$)/.test(value)) {
            return errorMsg;
        }
    }
};

/** *********Validator类*********** */
class Validator_ {  // validator class 实际上是用户和处理用户行为的中间件
    constructor() {
        this.cache = [];
    }

    add(dom, rules) { // dom 取得校验结点和调用规则
        for (let i = 0, rule; rule = rules[i++]; ) {
            let strategyAry = rule.strategy.split(':');
            let errorMsg = rule.errorMsg;
            this.cache.push(function() {
                let strategy = strategyAry.shift();
                strategyAry.unshift(dom.value);
                strategyAry.push(errorMsg);
                return strategies_[strategy].apply(dom, strategyAry);
            })
        }
    }

    start() {
        for (let i = 0, validatorFunc; validatorFunc = this.cache[i++]; ) {
            let errorMsg = validatorFunc();
            if (errorMsg) {
                return errorMsg;
            }
        }
    }
}


/* ***************用户调用*****************/

let registerForm_ = document.getElementById('registerForm');

let validateFunc_ = function() {
    let validator = new Validator_();
    validator.add( registerForm.userName, [{
        strategy: 'isNonEmpty',
        errorMsg: '用户名不能为空'
    }, {
        strategy: 'minLength:6',
        errorMsg: '用户名长度不能小于 10 位'
    }]);
    validator.add( registerForm.password, [{
        strategy: 'minLength:6',
        errorMsg: '密码长度不能小于 6 位'
    }]);
    validator.add( registerForm.phoneNumber, [{
        strategy: 'isMobile',
        errorMsg: '手机号码格式不正确'
    }]);

    let errorMsg_ = validator.start();
    return errorMsg_;
}

registerForm_.onsubmit = function() {
    let errorMsg = validateFunc_();
    if (errorMsg) {
        alert(errorMsg)
        return false;
    }
};

// summary
/**
 *  策略模式利用组合、委托和多态等技术和思想，可以有效地避免多重条件选择语句。
 *  策略模式提供了对开放—封闭原则的完美支持，将算法封装在独立的 strategy 中，使得它们易于切换，易于理解，易于扩展。
 *  策略模式中的算法也可以复用在系统的其他地方，从而避免许多重复的复制粘贴工作。
 *  在策略模式中利用组合和委托来让 Context 拥有执行算法的能力，这也是继承的一种更轻便的替代方案。
 * 
 */

/**
 * 策略模式已经融入到了js语言本身当中，
 * 我们经常用高阶函数来封装不同的行为，
 * 并且把它传递到另一个函数中。
 * 当我们对这些函数发出“调用”的消息时，
 * 不同的函数会返回不同的执行结果。
 */

let S = function( salary ) {
    return salary * 6;
};
let A = function( salary ) {
    return salary * 3;
};
// ...

let caculateBonus = function(func, salary) {
    return func(salary);
}

caculateBonus(S, 10**5);

