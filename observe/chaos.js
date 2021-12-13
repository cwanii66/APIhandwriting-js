// 8.11 全局事件的命名冲突
import Event from './global';
/**
 * 全局的发布—订阅对象里只有一个 clinetList 来存放消息名和回调函数，
 * 大家都通过它来订阅和发布各种消息，久而久之，难免会出现事件名冲突的情况，
 * 所以我们还可以给 Event 对象提供创建命名空间的功能。
 *
 * 我们要建立一个存放离线事件的堆栈，
 * 当事件发布的时候，如果此时还没有订阅者来订阅这个事件，
 * 我们暂时把发布事件的动作包裹在一个函数里，
 * 这些包装函数将被存入堆栈中，等到终于有对象来订阅此事件的时候，
 * 我们将遍历堆栈并且依次执行这些包装函数，
 * 也就是重新发布里面的事件。当然离线事件的生命周期只有一次
 */

/************** 先发布后订阅 ********************/
Event.trigger('click', 1);
Event.listen('click', function(a) {
    console.log(a);
});

/************** 使用命名空间 ********************/
Event.create('namespace1').listen('click', function(a) {
    console.log(a); // 1
});

Event.create('namespace1').trigger('click', 1);

Event.create('namespace2').listen('click', function(a) {
    console.log(a); // 2
});
Event.create('namespace2').trigger('click', 2);

// 具体代码实现
// 见global.js

// 总结
