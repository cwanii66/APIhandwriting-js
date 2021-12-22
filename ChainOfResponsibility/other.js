//用了职责链模式之后，   每种订单都有各自的处理函数而互不影响。

// 职责连接点增删改查都异常方便，且与其他功能解耦
// 弊端解决：
// 1. 设置职责链终点，这个宝地的接受者结点可以用来处理即将离开链尾的请求
// 2. 从性能方面考虑，我们应该避免过长的职责链

// 13.7 AOP实现职责链

/**
 * 在之前的职责链实现中，我们利用了一个 Chain 类来把普通函数包装成职责链的节点。
 * 利用 JavaScript 的函数式特性，有一种更加方便的方法来创建职责链:
 * 改写一下 3.2.3 节 Function.prototype.after 函数，
 * 使得第一个函数返回'nextSuccessor'时，
 * 将请求继续传递给下一个函数，
 * 无论是返回字符串'nextSuccessor'或者 false 都只是一个约定，
 * 当然在这里我们也可以让函数返回 false 表示传递请求，
 * 选择'nextSuccessor'字符串是因为它看起来更能表达我们的目的
 */

Function.prototype.after = function(fn) {
    const self = this;
    return function() {
        const ret = self.apply(this, arguments);
        if (ret === 'nextSuccessor') {
            return fn.apply(this, arguments);
        }
        return ret;
    };
};

const order = order500yuan.after(order200yuan).after(orderNormal);
order( 1, true, 500 ); // 输出：500 元定金预购，得到 100 优惠券
order( 2, true, 500 ); // 输出：200 元定金预购，得到 50 优惠券
order( 1, false, 500 ); // 输出：普通购买，无优惠券


// 13.8 用职责链模式获取文件上传对象

const getActiveloadObj = function() {
    try {
        return new ActiveXObject('TXFNActiveX.FTNUpload'); // IE 上传控件
    } catch(e) {
        return 'nexSuccessor';
    }
};

const getFlashloadObj = function() {
    if (supportFlash()) {
        const str = '<object type="application/x-shockwave-flash"></object>';
        return $(str).appendTo($('body'));
    }
    return 'nextSuccessor';
};

const getFormUploadObj = function() {
    return $( '<form><input name="file" type="file"/></form>' ).appendTo( $('body') );
};

const getUploadObj = getActiveloadObj.after(getFlashloadObj).after(getFormUploadObj);
console.log(getUploadObj());

// 13.9 summary
/**
 * 实际上只要运用得当，职责链模式可以很好地帮助我们管理代码，
 * 降低发起请求的对象和处理请求的对象之间的耦合性。
 * 职责链中的节点数量和顺序是可以自由变化的，
 * 我们可以在运行时决定链中包含哪些节点。
 * 
 * 无论是作用域链、原型链，还是 DOM 节点中的事件冒泡，
 * 我们都能从中找到职责链模式的影子。
 * 职责链模式还可以和组合模式结合在一起，
 * 用来连接部件和父部件，或是提高组合对象的效率。
 */
