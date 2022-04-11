/**
 * 目录:
 * 1. 提炼函数
 * 2. 合并重复的条件片段
 * 3. 把条件分支语句提炼成函数
 * 4. 合理使用循环
 * 5. 提前让函数退出，代替嵌套条件分支
 * 6. 传递对象参数代替过长的参数列表
 * 7. 尽量减少参数数量
 * 8. 少用三目运算符
 * 9. 合理使用链式调用
 * 10. 分解大型类
 * 11. 用return 退出多重循环
 */

// 1.
const getUserInfo = function() {
    // 纪要拉取用户数据还要打印log
    ajax('...', data => {
        console.log(data.userId);
        console.log(data.userName);
        console.log(data.userNickName);
    });
};

// 改为：
const getUserInfo2 = function() {
    ajax('...', data => {
        printDetails(data);
    });
};

const printDetails = function(data) {
    // print data log
};


// 2.

const paging = function( currPage ){
    if ( currPage <= 0 ) {
        currPage = 0;
        jump( currPage ); // 跳转
    } else if ( currPage >= totalPage ) {
        currPage = totalPage;
        jump( currPage ); // 跳转
    } else {
        jump( currPage ); // 跳转
    }
}; 

// jump 在每个条件分支都出现了
const paging2 = function(currPage) {
    if (currPage === 0) {
        currPage = 0;
    } else if (currPage >= totalPage) {
        currPage = totalPage;
    }
    jump(currPage); // 独立jump函数
};


// 3. 
const isSummer = function() {
    const date = new Date();
    return date.getMonth() >= 6 && date.getMonth() <= 9;
};

const getPrice = function(price) {
    if (isSummer()) { // 是否是夏天 (extract function)
        return price * 0.8;
    }
    return price;
};


// 4. 

// 下面我们灵活地运用循环，可以得到跟上面代码一样的效果：
var createXHR = function(){
    var versions= [ 'MSXML2.XMLHttp.6.0ddd', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp' ];
    for ( var i = 0, version; version = versions[ i++ ]; ){ // Much More Better
        try {
            return new ActiveXObject( version );
        } catch(e) {}
    }
};
var xhr = createXHR();


// 5. 
/**
 * 于是我们可以挑选一些条件分支，
 * 在进入这些条件分支之后，就立即让这个函数退出。
 * 要做到这一点，有一个常见的技巧，
 * 即在面对一个嵌套的 if 分支时，
 * 
 * 我们可以把外层 if 表达式进行反转。
 */
const del = function(obj) {
    if (obj.isReadOnly) {
        return;
    }
    if (obj.isFolder) {
        return deleteFolder(obj);
    }
    if (obj.isFile) {
        return deleteFile(obj);
    }
};

// 6.
var setUserInfo = function( obj ){
    console.log( 'id= ' + obj.id );
    console.log( 'name= ' + obj.name );
    console.log( 'address= ' + obj.address );
    console.log( 'sex= ' + obj.sex );
    console.log( 'mobile= ' + obj.mobile );
    console.log( 'qq= ' + obj.qq );
};

setUserInfo({
    id: 1314,
    name: 'sven',
    address: 'shenzhen',
    sex: 'male',
    mobile: '137********',
    qq: 377876679
});

// 7.

// 尽量减少参数数量

// 8. 减少三目运算符

// 9. 合理链式调用
// 但如果该链条很容易发生变化，导致调试和维护困难，那么还是建议使用普通调用的形式

const user = new User();
user.setId('111');
user.setName('sven');


// 10. 分解大型类

// Spirit.prototype.attack 这个方法实现是太庞大了，
// 实际上它完全有必要作为一个单独的类存在。
// 面向对象设计鼓励将行为分布在合理数量的更小对象之中：

class Attack {
    constructor(spirit) {
        this.spirit = spirit;
    }
    start(type) {
        return this.list()[type]
    }
    list() {
        return {
            waveBoxing() {
                console.log(this.spirit.name + 'waving Boxing');
            },
            whirlKick() {
                console.log(this.spirit.name + 'whirlKick');
            }
        };
    }
}

// 现在的spirit class 将会变得精简 => 将攻击动作委托给Attack class 来执行
// 这是 策略模式的运用之一：
class Spirit {
    constructor(name) {
        this.name = name;
        this.attackObj = new Attack(this);
    }
    attack(type) {
        this.attackObj.start(type);
    }
}
const spirit = new Spirit('RYU');
spirit.attack('waveBoxing');
spirit.attack('whirlKick');


// 11. 用return 退出多用循环

// Generally: 
// 1. 控制标记变量

// 2. 设置循环标记
const func = function() {
    outerloop:
    for (let i = 0; i < 10; i++) {
        innerloop:
        for (let j = 0; j < 10; j++) {
            break outerloop;
        }
    }
};

// Better method: 
// 在需要中止循环的时候直接退出整个方法：
// 同时应该解决循环之后将被执行的代码没机会进行的问题

const print__ = function(i) {
    console.log(i);
};

const func__ = function() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            if (i * j > 30) {
                return print__(i); // 把循环后面的代码放到return后面
            }
        }
    }
};

func__();
