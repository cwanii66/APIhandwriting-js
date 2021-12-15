const ball = document.getElementById('ball');
const pos = document.getElementById('pos');
const moveBtn = document.getElementById('moveBtn');
const cancelBtn = document.getElementById('cancelBtn');

class MoveCommand {
    constructor(receiver, pos) {
        this.receiver = receiver;
        this.pos = pos;
        this.oldPos = null;
    }
    execute() {
        this.receiver.start('left', this.pos, 1000, 'strongOut');
        this.oldPos = this.receiver.dom.getBoundingClientRect()[ this.receiver.propertyName ];
    }
    undo() {
        this.receiver.start(/** some args */)
    }
}
const moveCommand;
moveBtn.onclick = function() {
    let animate = new this.animate(ball);
    moveCommand = new MoveCommand(animate, pos.value);
    moveCommand.execute();
};
cancelBtn.onclick = function() {
    moveCommand.undo();
};
/**
 * 现在通过命令模式轻松地实现了撤销功能。
 * 如果用普通的方法调用来实现，
 * 也许需要每次都手工记录小球的运动轨迹，才能让它还原到之前的位置。
 * 而命令模式中小球的原始位置在小球开始移动前已经作为 command 对象的属性被保存起来，
 * 所以只需要再提供一个 undo 方法，并且在 undo方法中让小球回到刚刚记录的原始位置就可以了。
 */

// 9.5 撤销和重做
// 比如下棋：
/**
 * 我们可以将所有执行过的命令都存储在一个历史列表中，
 * 然后倒序循环来一次执行这些命令的undo操作，直到循环到预期的位置
 * 
 * 然而，在某些情况下无法顺利地利用 undo 操作让对象回到 execute 之前的状态。
 * 比如在一个Canvas 画图的程序中，画布上有一些点，
 * 我们在这些点之间画了 N 条曲线把这些点相互连接起来，当然这是用命令模式来实现的。
 * 但是我们却很难为这里的命令对象定义一个擦除某条曲线的undo 操作，
 * 因为在 Canvas 画图中，擦除一条线相对不容易实现。
 * 这时候最好的办法是先清除画布，然后把刚才执行过的命令全部重新执行一遍，
 * 这一点同样可以利用一个历史列表堆栈办到。
 * 记录命令日志，然后重复执行它们，这是逆转不可逆命令的一个好办法
 */

// 命令模式可以用来实现播放录像功能。
// 原理跟Canvas 画图的例子一样，我们把用户在键盘的输入都封装成命令，
// 执行过的命令将被存放到堆栈中。
// 播放录像的时候只需要从头开始依次执行这些命令便可：


// <button id="replay">play record</button>
const Rya = {
    attack() {
        console.log('attack');
    },
    defense() {
        console.log('defense');
    },
    jump() {
        console.log('jump');
    },
    crouch() {
        console.log('crouch');
    }
};

// create command
const makeCommand = function(receiver, state) {
    return function() {
        receiver[state]();
    }
};
const commands = {
    "119": "jump", // W
    "115": "crouch", // S
    "97": "defense", // A
    "100": "attack" // D 
};
const commandStack = [];
document.addEventListener('keypress', (event) => {
    const keyCode = event.code,
        command = makeCommand(Ryu, command[keyCode]);

    if (command) {
        command();
        commandStack.push(command); // 将刚刚执行过的命令保存进堆栈
    }
}, false);
document.getElementById('replay').addEventListener('click', () => { // 点击播放录像
    const command;
    while(command = commandStack.shift()) { // 从堆栈里依次去除命令并执行
        command();
    }
}, false);
