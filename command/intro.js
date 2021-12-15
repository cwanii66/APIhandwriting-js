/**
 * 有时候需要向某些对象发送请求，
 * 但是并不知道请求的接收者是谁，
 * 也不知道被请求的操作是什么，
 * 此时希望用一种松耦合的方式来设计软件，
 * 使得请求发送者和请求接收者能够消除彼此之间的耦合关系。
 * 
 * 记录着订餐信息的清单，就是命令模式中的命令对象
 * 
 * 解耦，发送者、接受者、发送请求、接受请求、执行命令、命令类
 */

// 菜单程序
// 这里有3个按钮

const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const button3 = document.getElementById('button3');

// setCommand function
let setCommand = (button, command) => {
    button.onclick = function() {
        command.excute();
    }
};

const MenuBar = {
    refresh() {
        console.log('refresh menu');
    }
};
const SubMenu = {
    add() {
        console.log('add');
    },
    del() {
        console.log('delete');
    }
};

class RefreshMenuCommand {
    constructor(receiver) {
        this.receiver = receiver;
    }
    execute() {
        this.receiver.refresh();
    }
}
class AddSubMenuCommand {
    constructor(receiver) {
        this.receiver = receiver;
    } 
    execute() {
        this.receiver.add();
    }
}
class DelSubMenuCommand {
    constructor(receiver) {
        this.receiver = receiver;
    }
    execute() {
        this.receiver.del();
    }
}

// 最后就是把命令接收者传入到 command 对象中，
// 并且把 command 对象安装到 button 上面：
const refreshMenuBarCommand = new RefreshMenuCommand(MenuBar);
const addSubMenuCommand = new AddSubMenuCommand(SubMenu);
const delSubMenuCommand = new DelSubMenuCommand(SubMenu);

setCommand(button1, refreshMenuBarCommand);
setCommand(button2, addSubMenuCommand);
setCommand(button3, delSubMenuCommand);

// 以上就是传统面向对象的设计

// at javascript
// 所谓的命令模式，看起来就是给对象的某个方法取了 execute 的名字。
const bindClick = function(button, func) {
    button.onclick = func;
};

const MenuBar = {
    refresh() {
        console.log('refresh');
    }
};
const SubMenu = {
    add() {
        // ...
    },
    del() {
        // ... 
    }
};

bindClick(button1, MenuBar.refresh);


//命令模式的由来，其实是回调（callback）函数的一个面向对象的替代品。



