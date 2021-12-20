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
    }
}

// 工厂进行对象实例化
const UploadFactory = (function() {
    
})


