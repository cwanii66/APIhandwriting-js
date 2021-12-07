// 虚拟代理合并HTTP请求

// 假设我们有一堆checkbox

// 为checkbox绑定事件
let synchronousFile = id => console.log(id);

let checkbox = document.getElementsByTagName('input');
for (let i of checkbox) {
    i.addEventListener('click', function() {
        if (this.checked === true) {
            synchronousFile(this.id);
        }
    })
}
/**
 * 我们可以通过一个代理函数 proxySynchronousFile 来收集一段时间之内的请求，
 * 最后一次性发送给服务器。比如我们等待 2 秒之后才把这 2 秒之内需要同步的文件 ID 打包发给服务器，
 * 如果不是对实时性要求非常高的系统，2 秒的延迟不会带来太大副作用，却能大大减轻服务器的压力。
 */

let proxySynchronousFile = (function() {
    let cache = [], // 保存一段时间内同步的id
        timer; // 定时器
    
    return function(id) {
        cache.push(id);
        if (timer) {
            return;
        }
        timer = setTimeout(function() {
            synchronousFile(cache.join(',')); // 2秒后想本体发送需要同步的id集合
            clearTimeout(timer);
            timer = null;
            cache.length = 0; // 清空id集合
        }, 2000)
    }
})()

let checkbox = document.getElementsByTagName('input');

for (let i of checkbox) {
    i.addEventListener('click', function() {
        if (this.checked === true) {
            proxySynchronousFile(this.id);
        }
    })
}

// 虚拟代理在惰性加载中的应用
