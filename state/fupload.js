// 另一个状态模式实例: 文件上传

/**
 * 现在看看文件在不同的状态下，点击这两个按钮将分别发生什么行为。
 *  文件在扫描状态中，是不能进行任何操作的，
 * 既不能暂停也不能删除文件，只能等待扫描完成。
 * 扫描完成之后，根据文件的 md5 值判断，
 * 若确认该文件已经存在于服务器，则直接跳到上传完成状态。
 * 如果该文件的大小超过允许上传的最大值，或者该文件已经损坏，
 * 则跳往上传失败状态。剩下的情况下才进入上传中状态。
 * 
 *  上传过程中可以点击暂停按钮来暂停上传，暂停后点击同一个按钮会继续上传。
 * 
 *  扫描和上传过程中，点击删除按钮无效，
 * 只有在暂停、上传完成、上传失败之后，才能删除文件。
 */

window.external.upload = function(state) { // window.external已弃用
    console.log(state); // 可能为sign、uploading、done、error
};

const plugin = (function() {
    const plugin = document.getElementById('embed');
    plugin.style.display = 'none';
    plugin.type = 'application/txftn-webkit';

    plugin.sign = function(){
        console.log( '开始文件扫描' );
    }
    plugin.pause = function(){
        console.log( '暂停文件上传' );
    };
     plugin.uploading = function(){
        console.log( '开始文件上传' );
    };
    plugin.del = function(){
        console.log( '删除文件上传' );
    }
    plugin.done = function(){
        console.log( '文件上传完成' );
    }
    document.body.appendChild( plugin );
    return plugin;
})();


// 先定义Upload类，控制上传过程的对象将从Upload类中创建而来：
class Upload {
    constructor(fileName) {
        this.plugin = plugin;
        this.fileName = fileName;
        this.button1 = null;
        this.button2 = null;
        this.state = 'sign'; // 设置初始化状态为waiting
    }
    // init 方法会进行一些初始化工作，包括创建页面中的一些节点。
    // 在这些节点里，起主要作用的是两个用于控制上传流程的按钮，
    // 第一个按钮用于暂停和继续上传，第二个用于删除文件：
    init() {
        const that = this;
        this.dom = document.createElement('div');
        this.dom.innerHTML = 
            '<span>文件名称:'+ this.fileName +'</span>\
            <button data-action="button1">扫描中</button>\
            <button data-action="button2">删除</button>'; 
        document.body.appendChild(this.dom);
        this.button1 = this.dom.querySelector('[data-action="button1"]');
        this.button2 = this.dom.querySelector('[data-action="button2"]');
        this.bindEvent();
    }
    // 接下来需要给两个按钮分别绑定点击事件：
    bindEvent() {
        var self = this;
        this.button1.onclick = function(){
        if ( self.state === 'sign' ){ // 扫描状态下，任何操作无效
        console.log( '扫描中，点击无效...' );
        }else if ( self.state === 'uploading' ){ // 上传中，点击切换到暂停
        self.changeState( 'pause' );
        }else if ( self.state === 'pause' ){ // 暂停中，点击切换到上传中
        self.changeState( 'uploading' );
        }else if ( self.state === 'done' ){
        console.log( '文件已完成上传, 点击无效' );
        }else if ( self.state === 'error' ){
        console.log( '文件上传失败, 点击无效' );
        }
        };
        this.button2.onclick = function(){
        if ( self.state === 'done' || self.state === 'error'
        || self.state === 'pause' ){
        // 上传完成、上传失败和暂停状态下可以删除
        self.changeState( 'del' );
        }else if ( self.state === 'sign' ){
        console.log( '文件正在扫描中，不能删除' );
        }else if ( self.state === 'uploading' ){
        console.log( '文件正在上传中，不能删除' );
        }
        };
    }; 
    // 再接下来是 Upload.prototype.changeState 方法，
    // 它负责切换状态之后的具体行为，包括改变按钮的 innerHTML，
    // 以及调用插件开始一些“真正”的操作：
    changeState(state) {
        switch( state ) {
            case 'sign':
                this.plugin.sign();
                this.button1.innerHTML = '扫描中，任何操作无效';
            break;
            case 'uploading':
                this.plugin.uploading();
                this.button1.innerHTML = '正在上传，点击暂停';
            break;
            case 'pause':
                this.plugin.pause();
                this.button1.innerHTML = '已暂停，点击继续上传';
            break;
            case 'done':
                this.plugin.done();
                this.button1.innerHTML = '上传完成';
            break;
            case 'error':
                this.button1.innerHTML = '上传失败';
            break;
            case 'del':
                this.plugin.del();
                this.dom.parentNode.removeChild( this.dom );
                console.log( '删除完成' );
            break;
        }
        this.state = state;
    }
}

// OK 接下来我们用状态模式重构
/**
 * 记住 => 内部状态、行为委托、封装状态
 */

// Step1 -> provide   window.external.upload, create upload plugin on the page
window.external.upload = function(state) { // window.external已弃用
    console.log(state); // 可能为sign、uploading、done、error
};

const plugin = (function() {
    const plugin = document.getElementById('embed');
    plugin.style.display = 'none';
    plugin.type = 'application/txftn-webkit';

    plugin.sign = function(){
        console.log( '开始文件扫描' );
    }
    plugin.pause = function(){
        console.log( '暂停文件上传' );
    };
     plugin.uploading = function(){
        console.log( '开始文件上传' );
    };
    plugin.del = function(){
        console.log( '删除文件上传' );
    }
    plugin.done = function(){
        console.log( '文件上传完成' );
    }
    document.body.appendChild( plugin );
    return plugin;
})();

// Step2: 改造Upload 函数，在构造函数中为每种子类都创建一个实例对象：
class Upload_ {
    constructor(fileName) {
        this.plugin = plugin;
        this.fileName = fileName;
        this.button1 = null;
        this.button2 = null;
        this.signState = new SignState(this); // 设置初始状态为waiting
        this.uploadingState = new UploadingState(this);
        this.pauseState = new PauseState(this);
        this.doneState = new DoneState(this);
        this.errorState = new ErrorState(this);
        this.currState = new SignState(this); // 设置当前状态
    }
    // Step3: init() 无需改变，仍然是创建uploadDOM节点，并绑定按钮事件
    init() {
        const that = this;
        this.dom = document.createElement('div');
        this.dom.innerHTML = 
            '<span>文件名称:'+ this.fileName +'</span>\
            <button data-action="button1">扫描中</button>\
            <button data-action="button2">删除</button>'; 
        document.body.appendChild(this.dom);
        this.button1 = this.dom.querySelector('[data-action="button1"]');
        this.button2 = this.dom.querySelector('[data-action="button2"]');
        this.bindEvent();
    }
    // Step4: 负责具体的按钮事件实现，点击按钮后，context 并不做任何具体的操作
    //      而是把请求委托给当前的状态类来执行:
    bindEvent() {
        this.button1.addEventListener('click', () => {
            this.currState.clickHandle1();
        });
        this.button2.addEventListener('click', () => {
            this.currState.clickHandle2();
        });
    }

    // 把状态对应的逻辑行为放在 Upload 类中：
    sign() {
        this.plugin.sign();
        this.currState = this.signState;
    }
    uploading() {
        this.button1.innerHTML = '正在上传，点击暂停';
        this.plugin.uploading();
        this.currState = this.uploadingState;
    }
    pause() {
        this.button1.innerHTML = '已暂停，点击继续上传';
        this.plugin.pause();
        this.currState = this.pauseState;
    }
    done() {
        this.button1.innerHTML = '上传完成';
        this.plugin.done();
        this.currState = this.doneState;
    }
    error() {
        this.button1.innerHTML = '上传失败';
        this.currState = this.errorState;
    }
    del() {
        this.plugin.del();
        this.dom.parentNode.removeChild( this.dom );
    }
}

// Step5: 我们要编写各个状态类的实现。
// 值得注意的是，我们使用了StateFactory，从而避免因为 JavaScript 中没有抽象类所带来的问题。

const StateFactory = (function() {
    class State {
        clickHandle1() {
            throw new Error('must rewrite clickHandle1()');
        }
        clickHandle2() {
            throw new Error('must rewrite clickHandle2()');
        }
    };
    return class F extends State {
        constructor(uploadObj) {
            super();
            this.uploadObj = uploadObj;
        }
    }
})();

const SignState = new StateFactory({
    clickHandle1() {
        console.log('扫描中,点击无效');
    },
    clickHandler2(){
        console.log( '文件正在上传中，不能删除' );
    } 
});

var UploadingState = new StateFactory({
    clickHandler1: function(){
    this.uploadObj.pause();
    },
    clickHandler2: function(){
    console.log( '文件正在上传中，不能删除' );
    }
});
var PauseState = new StateFactory({
    clickHandler1: function(){
    this.uploadObj.uploading();
    },
    clickHandler2: function(){
    this.uploadObj.del();
    }
});
var DoneState = new StateFactory({
    clickHandler1: function(){
    console.log( '文件已完成上传, 点击无效' );
    },
    clickHandler2: function(){
    this.uploadObj.del();
    }
});
var ErrorState = new StateFactory({
    clickHandler1: function(){
    console.log( '文件上传失败, 点击无效' );
    },
    clickHandler2: function(){
    this.uploadObj.del();
    }
});

// 16.6 状态模式的优缺点
/**
 *  状态模式定义了状态与行为之间的关系，
 * 并将它们封装在一个类里。
 * 通过增加新的状态类，很容易增加新的状态和转换。
 * 
 *  避免 Context 无限膨胀，
 * 状态切换的逻辑被分布在状态类中，
 * 也去掉了 Context 中原本过多的条件分支。
 * 
 *  用对象代替字符串来记录当前状态，
 * 使得状态的切换更加一目了然。
 * 
 *  Context 中的请求动作和状态类中封装的行为可以非常容易地独立变化而互不影响。
 */

/**
 * 但也造成了逻辑分散的问题，我们无法在一个地方就看出整个状态机的逻辑。 
 */

/**
 * 优化点：
 *  在本章的例子中，我们为每个 Context 对象都创建了一组 state 对象，
 * 实际上这些 state对象之间是可以共享的，各 Context 对象可以共享一个 state 对象，
 * 这也是 *享元模式* 的应用场景之一。
 */