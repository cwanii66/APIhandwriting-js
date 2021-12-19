// 10.9引用父对象

/**
 * 但有时候我们需要在子节点上保持对父节点的引用，
 * 比如在组合模式中使用职责链时，
 * 有可能需要让请求从子节点往父节点上冒泡传递。
 * 还有当我们删除某个文件的时候，
 * 实际上是从这个文件所在的上层文件夹中删除该文件的。 
 */

const Folder = function(name) {
    return {
        name,
        parent: null,
        files: [],

        add(file) {
            file.parent = this; // 设置父对象
            this.files.push(file);
        },
        scan() {
            console.log('start scan this folder: ' + this.name);
            for (let file of this.files) {
                file.scan();
            }
        },
        remove() {
            if (!this.parent) { // 根节点或者树外的游离节点
                return;
            }
            for (let files = this.parent.files, l = files.length - 1; l >= 0; l--) {
                let file = files[l];
                if (file === this) {
                    files.splice(l, 1);
                }
            }
        },
    };
};

// File 类的实现基本一致
class File {
    constructor(name) {
        this.name = name;
        this.parent = null;
    }
    add() {
        throw new Error('不能添加在文件下面');
    }
    scan() {
        console.log('开始扫描文件: ' + this.name);
    }
    remove() {
        if (!this.parent) { //根节点或者树外的游离节点
            return;
        }
        for (var files = this.parent.files, l = files.length - 1; l >= 0; l--) {
            var file = files[l];
            if (file === this) {
                files.splice(l, 1);
            }
        }
    }
}

const folder = Folder('学习资料');
const folder1 = Folder('JavaScript');
const file1 = Folder('Node.js');

folder1.add(new File('js design pattern'));
folder.add(folder1);
folder.add(file1);

folder1.remove(); // 移除文件夹
folder.scan();

/**
 * 何时使用组合模式:
 *  表示对象的部分-整体层次结构。
 * 组合模式可以方便地构造一棵树来表示对象的部分-整体结构。
 * 特别是我们在开发期间不确定这棵树到底存在多少层次的时候。
 * 在树的构造最终完成之后，
 * 只需要通过请求树的最顶层对象，便能对整棵树做统一的操作.
 * 在组合模式中增加和删除树的节点非常方便，并且符合开放-封闭原则。
 * 
 *  客户希望统一对待树中的所有对象。
 * 组合模式使客户可以忽略组合对象和叶对象的区别，
 * 客户在面对这棵树的时候，不用关心当前正在处理的对象是组合对象还是叶对象，
 * 也就不用写一堆 if、else 语句来分别处理它们。
 * 组合对象和叶对象会各自做自己正确的事情，这是组合模式最重要的能力。
 */