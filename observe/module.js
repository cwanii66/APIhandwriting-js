/**
 * 比如现在有两个模块，a 模块里面有一个按钮，每次点击按钮之后，
 * b 模块里的 div 中会显示按钮的总点击次数，
 * 我们用全局发布—订阅模式完成下面的代码，
 * 使得 a 模块和 b 模块可以在保持封装性的前提下进行通信。
 */

// button(id = 'count') at html
// ==>
let a = (function() {
    let count = 0;
    let button = document.getElementById('count');
    button.onclick = function() {
        Event.trigger('add', count++);
    }
})();
let b = (function() {
    let div = document.getElementById('show');
    Event.listen('add', function(count) {
        div.innerHTML = count;
    })
})();

// 但是所有有关发布者和订阅者的信息都会被隐藏

// tips: 
/**
 * 在某些情况下，我们需要先将这条消息保存下来，
 * 等到有对象来订阅它的时候，再重新把消息发布给订阅者。
 * 就如同 QQ 中的离线消息一样，
 * 离线消息被保存在服务器中，
 * 接收人下次登录上线之后，可以重新收到这条消息。
 */