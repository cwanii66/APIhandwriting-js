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

let strategies = {
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