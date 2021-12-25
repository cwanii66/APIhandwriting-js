/**
 * 我们总是不希望某个类天生就很庞大，
 * 一次性包含许多职责
 * 那么我们就可以使用装饰者模式。
 * 装饰者模式可以动态地给某个对象添加一些额外的职责(动态织入)，
 * 而不会影响从这个类中派生的其他对象。
 */

// 飞机大战
class Plane {
    constructor() { }
    fire() {
        console.log('发射普通子弹');
    }
}

// 增加两个装饰类
// constructor是为了包装
class MissileDecorator {
    constructor(plane) {
        this.plane = plane;
    }
    fire() {
        this.plane.fire();
        console.log('发射导弹');
    }
}
class AtomDecorator {
    constructor(plane) {
        this.plane = plane;
    }
    fire() {
        this.plane.fire();
        console.log('发射原子弹');
    }
}
// 导弹类和原子弹类的构造函数都接受参数 plane 对象，并且保存好这个参数，
// 在它们的 fire方法中，除了执行自身的操作之外，还调用 plane 对象的 fire 方法。
let plane = new Plane();
plane = new MissileDecorator(plane);
plane = new AtomDecorator(plane);

plane.fire(); // 分别输出： 发射普通子弹、发射导弹、发射原子弹

// 15.2 装饰者也是包装器
/**
 * 从功能上而言，decorator 能很好地描述这个模式，
 * 但从结构上看，wrapper 的说法更加贴切。
 * 装饰者模式将一个对象嵌入另一个对象之中，
 * 实际上相当于这个对象被另一个对象包装起来，
 * 形成一条包装链。请求随着这条链依次传递到所有的对象，
 * 每个对象都有处理这条请求的机会.
 */

// 15.3 回到javascript 的装饰者
const plane1 = {
    fire() {
        console.log('发射普通子弹');
    }
};

const missileDecorator = function() {
    console.log('发射导弹');
};
const atomDecorator = function() {
    console.log('发射原子弹');
};

const fire1 = plane1.fire;
plane1.fire = function() {
    fire1();
    missileDecorator();
};

const fire2 = plane1.fire;
plane1.fire = function() {
    fire2();
    atomDecorator();
};

plane1.fire(); // 分别输出： 发射普通子弹、发射导弹、发射原子弹

