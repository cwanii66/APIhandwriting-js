// 命令队列

// 宏命令 => 一组命令的结合
// 首先我们依然得创建好各种命令

var closeDoorCommand = {
    execute: function(){
        console.log( '关门' );
    }
};
var openPcCommand = {
    execute: function(){
        console.log( '开电脑' );
    }
}; 
var openQQCommand = {
    execute: function(){
        console.log( '登录 QQ' );
    }
}; 

// 定义MacroCommand
const MacroCommand = function() {
    return {
        commandsList: [],
        add(command) {
            this.commandsList.push(command);
        },
        execute() {
            for (let c of this.commandsList) {
                c.execute();
            }
        }
    };
};
const macroCommand = MacroCommand();
macroCommand.add(closeDoorCommand);
macroCommand.add(openPcCommand);
macroCommand.add(openQQCommand);

macroCommand.execute();

// 智能命令与傻瓜命令

// JavaScript 可以用高阶函数非常方便地实现命令模式。
// 命令模式在 JavaScript 语言中是一种隐形的模式。
