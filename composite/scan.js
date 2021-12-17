//扫描文件夹
/**
 * 文件与文件夹之间的关系，适合用组合模式来描述
 * 
 * 一般树形结构，我们都可以通过组合模式来描述
 */

/******************************* Folder ******************************/ 
class Folder {
    constructor(name) {
        this.name = name;
        this.files = [];
    }
    add(file) {
        this.files.push(file);
    }
    scan() {
        console.log('start to scan: '+ this.name);
        for (let i = 0, file, files = this.files; file = files[i++]; ) {
            file.scan();
        }
    }
}

/******************************* File ******************************/
class File {
    constructor(name) {
        this.name = name;
    }
    add() {
        throw new Error('can not add file');
    }
    scan() {
        console.log('start scan file: ' + this.name);
    }
}

const folder = new Folder('学习资料');
const folder1 = new Folder('Javascript');
const folder2 = new Folder('Vue');

const file1 = new File('javascript 设计模式与开发实践');
const file2 = new File('Webpack');
const file3 = new File('nodejs');

folder1.add(file1);
folder2.add(file2);

folder.add(folder1);
folder.add(folder2);
folder.add(file3);

// 现在的需求是把移动硬盘里的文件和文件夹都复制到这棵树中，假设我们已经得到了这些文件对象：

const folder3 = new Folder('MySql');
const file4 = new File('mysql intro');
folder3.add(file4);
const file5 = new File('mongodb');
folder.add(folder3);
folder.add(file5);

/**
 * 我们改变了树的结构，增加了新的数据，却不用修改任何一句原有的代码，
 * 这是符合开放封闭原则的。
 * 运用了组合模式之后，扫描整个文件夹的操作也是轻而易举的，
 * 我们只需要操作树的最顶端对象：
 */
folder.scan();