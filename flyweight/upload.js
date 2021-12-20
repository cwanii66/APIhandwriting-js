/**
 * 不论是插件上传，还是 Flash 上传，
 * 原理都是一样的，当用户选择了文件之后，
 * 插件和 Flash 都会通知调用 Window 下的一个全局 JavaScript 函数，
 * 它的名字是startUpload，
 * 用户选择的文件列表被组合成一个数组 files 塞进该函数的参数列表里
 */


let id = 0;

window.startUpload = function(uploadType, files) { //uploadType 区分是控件还是 flash
    for(let i = 0, file; file = files[i++]; ) {
        const uploadObj = new Upload(uploadType, file.fileName, file.fileSize);
        uploadObj.init(id++);
    }
};
/**
 * 当用户选择完文件之后，startUpload 函数会遍历 files 数组来创建对应的 upload 对象。
 * 接下来定义 Upload 构造函数，它接受 3 个参数，分别是插件类型、文件名和文件大小。
 * 这些信息都已经被插件组装在 files 数组里返回，
 */

class Upload {
    constructor(uploadType, fileName, fileSize) {
        this.uploadType = uploadType;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.dom = null;
    }

    init(id) {
        this.id = id;
        this.dom = document.createElement('div');
        this.dom.innerHTML = 
            '<span>文件名称:'+ this.fileName +', 文件大小: '+ this.fileSize +'</span>' +
            '<button class="delFile">删除</button>'; 
        this.dom.querySelector('.delFile').addEventListener('click', () => {
            delFile();
        })
        document.body.appendChild(this.dom);
    }
    delFile() {
        //...
    }
}

startUpload( 'plugin', [
    {
    fileName: '1.txt',
    fileSize: 1000
    },
    {
    fileName: '2.html',
    fileSize: 3000
    },
    {
    fileName: '3.txt',
    fileSize: 5000
    }
   ]);
   startUpload( 'flash', [
    {
    fileName: '4.txt',
    fileSize: 1000
    },
    {
    fileName: '5.html',
    fileSize: 3000
    },
    {
    fileName: '6.txt',
    fileSize: 5000
    }
]); 

// 12.4.2 享元模式重构文件上传

/**
 * 首先，我们需要确认插件类型 uploadType 是内部状态，
 * 那为什么单单 uploadType 是内部状态呢？
 * 前面讲过，划分内部状态和外部状态的关键主要有以下几点。
     内部状态储存于对象内部。
     内部状态可以被一些对象共享。
     内部状态独立于具体的场景，通常不会改变。
     外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。
 */

// 剥离外部状态

class Upload_ {
    constructor(uploadType) {
        this.uploadType = uploadType;
    }
    // init 函数不再需要，
    // 因为 upload 对象初始化的工作被放在了 uploadManager.add 函数里面，
    delFile(id) {
        uploadManager.setExternalState( id, this ); // 文件大小等外部属性存储在外部管理器的uploadManager中
        if (this.fileSize < 3000) {
            return this.dom.parentNode.removeChild(this.dom);
        }
        if (window.confirm( '确定要删除该文件吗? ' + this.fileName )){
            return this.dom.parentNode.removeChild( this.dom );
        } 
    }
}

// 工厂进行对象实例化
const UploadFactory = (function() {
    const createdFlyWeightObjs = {};

    return {
        create(uploadType) {
            if (createdFlyWeightObjs[uploadType]) {
                return createdFlyWeightObjs[uploadType];
            }
            return createdFlyWeightObjs[uploadType] = new Upload_(uploadType); // create obj 核心代码
        }
    }
})();

// 管理器封装外部状态
/**
 * 它负责向 UploadFactory 提交创建对象的请求，
 * 并用一个 uploadDatabase 对象保存所有 upload 对象的外部状态，
 * 以便在程序运行过程中给upload 共享对象设置外部状态，
 */
const uploadManager = (function() {
    const uploadDatabase = {};

    return {
        add(id, uploadType, fileName, fileSize) {
            const flyWeightObj = UploadFactory.create(uploadType);
            const dom = document.createElement('div');
            dom.innerHTML = 
                '<span>文件名称:'+ fileName +', 文件大小: '+ fileSize +'</span>' +
                '<button class="delFile">删除</button>'; 
            dom.querySelector('.delFile').addEventListener('click', () => {
                flyWeightObj.delFile(id);
            })
            document.body.appendChild(dom);
            
            uploadDatabase[id] = {
                fileName,
                fileSize,
                dom
            }; // 外部状态
            return flyWeightObj; // 作为设置外部属性的主对象
        },
        setExternalState(id, flyWeightObj) {
            const uploadData = uploadDatabase[id];
            for (const i in uploadData) {
                flyWeightObj[i] = uploadData[i]; // 与database存储的外部属性对接
            }
        }
    }
})();

// 开始触发上传动作的startUpload函数:
let id = 0;
window.startUpload = function(uploadType, files) {
    for (let file of files) {
        const uploadObj = uploadManager.add(++id, uploadType, file.fileName, file.fileSize);
        uploadManager.setExternalState(id, uploadObj);
    }
};

startUpload('plugin', [
    {
        fileName: '1.txt',
        fileSize: 1000
    },
    {
        fileName: '2.html',
        fileSize: 3000
    },
    {
        fileName: '3.txt',
        fileSize: 5000
    }
]);
startUpload('Flash', [
    {
        fileName: '4.txt',
        fileSize: 1000
    },
    {
        fileName: '5.html',
        fileSize: 3000
    },
    {
        fileName: '6.txt',
        fileSize: 5000
    } 
]);

// 12.5 享元模式的适用性
/**
 * 享元模式带来的好处很大程度上取决于如何使用以及何时使用，
 * 一般来说，以下情况发生时便可以使用享元模式。
 *     一个程序中使用了大量的相似对象。
 *     由于使用了大量对象，造成很大的内存开销。
 *     对象的大多数状态都可以变为外部状态。
 *     剥离出对象的外部状态之后，可以用相对较少的共享对象取代大量对象。
 * 
 * 可以看到，文件上传的例子完全符合这四点。
 */

