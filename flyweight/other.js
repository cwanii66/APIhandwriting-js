// 12.6.1 没有内部状态的享元


// 享元模式内部状态唯一时，这时候只需要唯一的单例对象，
// 这时候生产对象的工厂就是单例模式

const Upload = function() {}; // constructor 无参数
// 当没有内部状态的时候，意味着只需要唯一的一个共享对象
const UploadFactory = (function() {
    const uploadObj; // uploadObj 只是一个简单的共享对象
    return {
        create() {
            if (uploadObj) {
                return uploadObj;
            }
            return uploadObj = new Upload();
        }
    }
})();

let id = 0;
const uploadMananger = (function() {  
    const externalProperties = {};
    return {
        add(id, fileName, fileSize) {
            const flyWeightObj = UploadFactory.create();
            const dom = createElement('div');
            dom.innerHTML = 
                '<span>文件名称:'+ fileName +', 文件大小: '+ fileSize +'</span>' +
                '<button class="delFile">删除</button>';
            dom.querySelector('.delFile').addEventListener('click', () => {
                flyWeightObj.delFile(id);
            });
            externalProperties[id] = {
                fileName,
                fileSize,
                dom
            }
            return flyWeightObj;
        },
        setExternalProperties(id, flyWeightObj) {
            const uploadData = externalProperties[id];
            Object.assign(flyWeightObj, uploadData);
        }
    }
})();
window.startUpload = function(files) {
    for (let file of files) {
        const uploadObj = uploadMananger.add(++id, file.fileName, file.fileSize);
        uploadManager.setExternalProperties(id, uploadObj);
    }
};

startUpload([/** some external properties */]);

/**
 * 管理器部分的代码不需要改动，还是负责剥离和组装外部状态。
 * 可以看到，当对象没有内部状态的时候，
 * 生产共享对象的工厂实际上变成了一个单例工厂。
 */


// 12.6.2 没有外部状态的享元

// 对象池技术 => 另类的对象共享技术
/**
 * 对象池技术的应用非常广泛，HTTP 连接池和数据库连接池都是其代表应用。
 * 在 Web 前端开发中，对象池使用最多的场景大概就是跟 DOM 有关的操作。
 * 很多空间和时间都消耗在了 DOM节点上，如何避免频繁地创建和删除 DOM 节点就成了一个有意义的话题。
 */

// 12.7.1 对象池实现
/**
 * 先定义一个获取小气泡节点的工厂，
 * 作为对象池的数组成为私有属性被包含在工厂闭包里，
 * 这个工厂有两个暴露对外的方法，
 * 
 * create 表示获取一个 div 节点，
 * recover 表示回收一个 div 节点：
 */

const toolTipFactory = (function() {
    const toolTipPool = []; // toolTip对象池
    
    return {
        create() {
            if (toolTipPool.length === 0) {
                const div = document.createElement('div'); // 创建一个dom
                document.body.appendChild(div);
                return div;
            } else {
                return toolTipPool.shift(); // 从对象池中取出一个dom
            }
        },
        recover(tooltipDom) {
            return toolTipPool.push(tooltipDom);
        }
    }
})();

// 进行第一次搜索的时刻，目前需要创建 2 个小气泡节点，
// 为了方便回收，用一个数组 ary 来记录它们：

const ary = [];
for (let i = 0, str; str = ['A', 'B'][i++]; ) {
    const toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
    ary.push(toolTip);
};
// 接下来假设地图需要开始重新绘制，在此之前要把这两个节点回收进对象池：

for (let toolTip of ary) {
    toolTipFactory.recover(toolTip);
}

// 再创建 6 个气泡
for ( var i = 0, str; str = [ 'A', 'B', 'C', 'D', 'E', 'F' ][ i++ ]; ){
    var toolTip = toolTipFactory.create();
    toolTip.innerHTML = str;
};

/**
 * 对象池跟享元模式的思想有点相似，
 * 虽然 innerHTML 的值 A、B、C、D 等也可以看成节点的外部状态，
 * 但在这里我们并没有主动分离内部状态和外部状态的过程。
 */

// 12.7.2 通用对象池的实现

// 我们还可以在对象池工厂里，把创建对象的具体过程封装起来，实现一个通用的对象池：

// 这种通用封装形式可以让对象池多态 javascript里函数式一等公民
// 不让Factory立即执行是为了让对象池工厂通用

const objectPoolFactory = function(createObjFn) {
    const objectPool = [];

    return {
        create(...args) {
            const obj = objectPool.length === 0 ?
                createObjFn(args) : objectPool.shift();
            
            return obj;
        },
        recover(obj) {
            objectPool.push(obj);
        }
    }
};
// 现在利用 objectPoolFactory 来创建一个装载一些 iframe 的对象池：
const iframeFactory = objectPoolFactory(() => {
    const iframe = document.createElement('iframe');
        document.appendChild(iframe);

    iframe.addEventListener('load', () => {
        iframe.onload = null; // 防止重复加载的bug
        iframeFactory.recover(iframe); // iframe加载完之后回收结点
    });
});
const iframe1 = iframeFactory.create();
iframe1.src = 'https:// baidu.com';

const iframe2 = iframeFactory.create();
iframe2.src = 'https:// google.com';

setTimeout(() => {
    const iframe3 = iframeFactory.create();
    iframe3.src = 'https:// apple.com';
}, 3000);

/**
 * 对象池是另外一种性能优化方案，它跟享元模式有一些相似之处，
 * 但没有分离内部状态和外部状态这个过程。
 * 本章用享元模式完成了一个文件上传的程序，
 * 其实也可以用对象池+事件委托来代替实现。
 */

// 在一个存在大量相似对象的系统中，享元模式可以很好地解决大量对象带来的性能问题。