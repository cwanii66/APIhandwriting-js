/**
 * 我们正在开发一个商城网站，
 * 网站里有 header 头部、nav 导航、消息列表、购物车等模块，
 * 这几个模块的渲染有一个共同的前提条件，
 * 就是必须先用 ajax 异步请求获取用户的登录信息。
 * 比如用户的名字和头像要显示在 header 模块里，
 * 而这两个字段都来自用户登录后返回的信息。( vue MVVM mode )
 */

// 来看一个模块与用户信息强耦合的例子(我们不知道还有那些模块需要使用这些用户信息)
login.succ((data) => {
    header.setAvatar(data.avatar);
    nav.setAvatar(data.avatar);
    message.refresh();
    cart.refresh();
    address.refresh(); // n 久后，新的业务要求又得重新加上这行代码
}); // 也就是说在我们编写login模块的时候还需要详细的了解其他模块的实现，比如header拥有setAvatar...
    // 耦合性让我们很难去修改 ==> 针对具体实现编程不好

/**
 * 用发布—订阅模式重写之后，
 * 对用户信息感兴趣的业务模块将自行订阅登录成功的消息事件。
 * 当登录成功时，登录模块只需要发布登录成功的消息，
 * 而业务方接受到消息之后，就会开始进行各自的业务处理，
 * 登录模块并不关心业务方究竟要做什么，也不想去了解它们的内部细节。
 * 
 * 我们想要的就是各干各的，并且在各个模块发生变化之后，其他模块通过可以得到变化消息自行改变
 */

fetch('...').then((data) => {
    login.trigger('login success', data);
});

// 各模块监听
let header = (function() {
    login.listen('login success', function(data) {
        header.setAvatar(data.avatar);
    });
    return {
        setAvatar(data) {
            console.log('设置header模块的头像');
        }
    }
})();

let nav = (function() {
    login.listen('login success', function(data) {
        nav.setAvatar(data.avatar);
    });
    return {
        setAvatar(data) {
            console.log('设置nav模块头像');
        }
    }
})();

/**
 * 如上所述，我们随时可以把 setAvatar 的方法名改成 setTouxiang。
 * 如果有一天在登录完成之后，又增加一个刷新收货地址列表的行为，
 * 那么只要在收货地址模块里加上监听消息的方法即可，
 * 而这可以让开发该模块的同事自己完成，
 * 你作为登录模块的开发者，永远不用再关心这些行为了。
 */
 var address = (function(){ // nav 模块
    login.listen( 'loginSucc', function( obj ){
        address.refresh( obj );
    });
    return {
        refresh( avatar ){
            console.log( '刷新收货地址列表' );
        }
    }
})();

