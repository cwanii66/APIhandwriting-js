// 10.4 更强大的宏命令
const MacroCommand = function() {
    return {
        commandList: [],
        add(command) {
            this.commandList.push(command);
        },
        execute() {
            for(let i = 0, command; command = this.commandList[i++]; ) {
                command.execute();
            }
        }
    };
};

const openAcCommand = {
    execute() {
        console.log('open AC');
    }
};

/**********家里的电视和音响是连接在一起的，所以可以用一个宏命令来组合打开电视和打开音响的命令*********/

const openTvCommand = {
    execute() {
        console.log('open TV');
    },
    //案通常是给叶对象也增加 add 方法，并且在调用这个方法时，抛出一个异常来及时提醒客户
    add() {
        throw new Error('can not add new leaf');
    }
};

const openSoundCommand = {
    execute() {
        console.log('open Sound');
    }
};

const macroCommand1 = MacroCommand();
macroCommand1.add(openTvCommand);
macroCommand1.add(openSoundCommand);

/*********关门、打开电脑和打登录 QQ 的命令****************/ 

const closeDoorCommand = {
    execute() {
        console.log('close door');
    }
};

const openPcCommand = {
    execute() {
        console.log('open PC');
    }
};

const openQQCommand = {
    execute() {
        console.log('open QQ');
    }
};
const macroCommand2 = MacroCommand();
macroCommand2.add( closeDoorCommand );
macroCommand2.add( openPcCommand );
macroCommand2.add( openQQCommand );

/*********现在把所有的命令组合成一个“超级命令”**********/

const macroCommand = MacroCommand();
macroCommand.add( openAcCommand );
macroCommand.add( macroCommand1 );
macroCommand.add( macroCommand2 );

/*********最后给遥控器绑定“超级命令”**********/ 

const setCommand = (function(command) {
    document.getElementById('button').addEventListener('click', () => {
        command.execute();
    })
})(macroCommand);

/**只需要调用最上层对象的 execute 方法。每当对最上层的对象
进行一次请求时，实际上是在对整个树进行深度优先的搜索 */
