// 14.2 案例 --- 泡泡堂游戏

// before

class Player_deprecated {
    constructor(name) {
        this.name = name;
        this.enemy = null; // enemy
    }
    win() {
        console.log(`${this.name} win`);
    }
    lose() {
        console.log(`${this.name} lost`);
    } 
    die() {
        this.lose();
        this.enemy.win();
    }
}

const player1_ = new Player_deprecated('jack');
const player2_ = new Player_deprecated('rose');

player1_.enemy = player2_;
player2_.enemy = player1_;

// add player
/**
 * 我们定义一个数组 players 来保存所有的玩家，
 * 在创建玩家之后，循环 players 来给每个玩家设置队友和敌人: 
 * 
 * const players = [];
 * 
 * 再改写构造函数 Player，使每个玩家对象都增加一些属性，
 * 分别是队友列表、敌人列表 、玩家当前状态、角色名字以及玩家所在的队伍颜色：
 */
const players = [];
class Player {
    constructor(name, teamColor) {
        this.partners = []; // partner list
        this.enemies = []; // enemy list
        this.state = 'live'; // play state
        this.name = name; // player name
        this.teamColor = teamColor; // team color
    }

    win() {
        console.log(`${this.name} win`);
    }
    lose() {
        console.log(`${this.name} lost`);
    }

    /*玩家死亡的方法要变得稍微复杂一点，
    我们需要在每个玩家死亡的时候，
    都遍历其他队友的生存状况，
    如果队友全部死亡，则这局游戏失败，
    同时敌人队伍的所有玩家都取得胜利*/

    die() { 
        let all_dead = true;
        this.state = 'dead'; // 设置玩家状态为死亡

        for (let partner of this.partners) { // 遍历队友列表
            if (partner.state !== 'dead') { // 如果有一个还未死亡，那队伍还没有失败
                all_dead = false;
                break;
            }
        }

        if (all_dead === true) { // 如果全部队友死亡
            this.lose(); // 通知自己游戏失败
            for (let partner of this.partners) { // 通知所有队友玩家游戏失败
                partner.lose();
            }
            for (let enemy of this.enemies) {
                enemy.win();
            }
        }   
    }
}

// 定义工厂创建玩家
const playerFactory = function(name, teamColor) {
    const newPlayer = new Player(name, teamColor);

    for (let i = 0, player; player = players[i++]; ) {
        if (player.teamColor === newPlayer.teamColor) {
            player.partners.push(newPlayer);
            newPlayer.partners.push(player);
        } else {
            player.enemies.push(newPlayer);
            newPlayer.enemies.push(player);
        }
    }

    players.push(newPlayer);
    return newPlayer;
};

// 现在来感受一下, 用这段代码创建 8 个玩家：
//红队：
const player1 = playerFactory( '皮蛋', 'red' ),
    player2 = playerFactory( '小乖', 'red' ),
    player3 = playerFactory( '宝宝', 'red' ),
    player4 = playerFactory( '小强', 'red' );
//蓝队：
const player5 = playerFactory( '黑妞', 'blue' ),
    player6 = playerFactory( '葱头', 'blue' ),
    player7 = playerFactory( '胖墩', 'blue' ),
    player8 = playerFactory( '海盗', 'blue' );


// 问题来了~ ~
/**
 * 每个玩家和其他玩家都是紧紧耦合在一起的。
 * 在此段代码中，每个玩家对象都有两个属性，
 * this.partners 和 this.enemies，
 * 用来保存其他玩家对象的引用。当每个对象的状态发生改变，
 * 比如角色移动、吃到道具或者死亡时，
 * 都必须要显式地遍历通知其他对象。
 */

// 14.2.3 中介者模式改造

/**
 * 在 player 对象的这些原型方法中，
 * 不再负责具体的执行逻辑，
 * 而是把操作转交给中介者对象，
 * 我们把中介者对象命名为playerDirector
 */

class _Player {
    constructor(name, teamColor) {
        this.name = name;
        this.teamColor = teamColor;
        this.state = 'alive';
    }
    win() {
        console.log(this.name + ' won ');
    }
    lose() {
        console.log(this.name + ' lost');
    }
    /*******************玩家死亡*****************/
    die() {
        this.state = 'dead';
        playerDirector.receiveMessage( 'playerDead', this ); // 给中介者发送消息，玩家死亡
    }
    /*******************移除玩家*****************/
    remove() {
        playerDirector.receiveMessage( 'removePlayer', this ); // 给中介者发送消息，移除一个玩家
    }
    /*******************玩家换队*****************/
    changeTeam(color) {
        playerDirector.receiveMessage( 'changeTeam', this, color ); // 给中介者发送消息，玩家换队
    }
}
// 工厂函数
const _playerFactory = function(name, teamColor) {
    const newPlayer = new _Player(name, teamColor);
    playerDirector.receiveMessage('addPlayer', newPlayer);

    return newPlayer;
};

/**
 * 我们需要实现这个中介者 playerDirector 对象，一般有以下两种方式。
 * 
 *  利用发布—订阅模式。将 playerDirector 实现为订阅者，
 * 各 player 作为发布者，一旦 player的状态发生改变，
 * 便推送消息给 playerDirector，
 * playerDirector 处理消息后将反馈发送给其他 player。
 * 
 *  在 playerDirector 中开放一些接收消息的接口，
 * 各 player 可以直接调用该接口来给playerDirector 发送消息，
 * player 只需传递一个参数给 playerDirector，
 * 这个参数的目的是使 playerDirector 可以识别发送者。
 * 同样，playerDirector 接收到消息之后会将处理结果反馈给其他 player。
 */

const playerDirector = (function() {
    const players = {},
        operations = {}; // 中介者可以执行的操作

    /****************新增一个玩家***************************/
    operations.addPlayer = function(player) {
        const teamColor = player.teamColor;
        players[teamColor] = players[teamColor] ?? []; // 如果改颜色的玩家还没有成立队伍，则成立一个新的队伍
        players[teamColor].push(player); // add new Player
    };
    /****************移除一个玩家***************************/
    operations.removePlayer = function(player) {
        const teamColor = player.teamColor,
            teamPlayers = players[teamColor] || []; // 该队伍所有成员
        
        for (let i = teamPlayers.length - 1; i >= 0; i--) { //遍历删除
            if (teamPlayers[i] === player) {
                teamPlayers.splice(i, 1);
            }
        }
    };
    /****************玩家换队***************************/ 
    operations.changeTeam = function(player, newTeamColor) {
        operations.removePlayer(player); // 从原队伍中删除
        player.teamColor = newTeamColor; // 改变队伍颜色
        operations.addPlayer(player); // 增加到新队伍中
    };
    /****************玩家死亡***************************/
    operations.playerDead = function(player) {
        const teamColor = player.teamColor,
            teamPlayers = players[teamColor]; // 玩家所在队伍
        
        let all_dead = true;

        for (let player of teamPlayers) {
            if (player.state !== 'dead') {
                all_dead = false;
                break;
            }
        }
        if (all_dead === true) { //全部死亡
            for (let player of teamPlayers) {
                player.lose();
            }
            for (let color in players) {
                if (color !== teamColor) {
                    const teamPlayers = players[color]; // 其他队伍的玩家
                    for (let player of teamPlayers) {
                        player.win(); // 其他队伍玩家获胜
                    }
                }
            }
        }
    };

    // 实现receiveMessage接口
    const receiveMessage = function(...args) {
        const message = args.shift(); // 第一个参数为消息名
        operations[message](...args); // player obj & team color
    };

    return {
        receiveMessage
    }
})();

/**
 * 可以看到，除了中介者本身，没有一个玩家知道其他任何玩家的存在，
 * 玩家与玩家之间的耦合关系已经完全解除，
 * 某个玩家的任何操作都不需要通知其他玩家，
 * 而只需要给中介者发送一个消息，
 * 中介者处理完消息之后会把处理结果反馈给其他的玩家对象。
 * 我们还可以继续给中介者扩展更多功能，以适应游戏需求的不断变化。
 */

// 红队：
const player1 = _playerFactory( '皮蛋', 'red' ),
 player2 = _playerFactory( '小乖', 'red' ),
 player3 = _playerFactory( '宝宝', 'red' ),
 player4 = _playerFactory( '小强', 'red' );
// 蓝队：
const player5 = _playerFactory( '黑妞', 'blue' ),
 player6 = _playerFactory( '葱头', 'blue' ),
 player7 = _playerFactory( '胖墩', 'blue' ),
 player8 = _playerFactory( '海盗', 'blue' );
player1.die();
player2.die();
player3.die();
player4.die();

// 假设皮蛋和小乖掉线
player1.remove();
player2.remove();
player3.die();
player4.die(); 

// 假设皮蛋从红队叛变到蓝队
player1.changeTeam( 'blue' );
player2.die();
player3.die();
player4.die(); 

