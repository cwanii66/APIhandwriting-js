// 享元模式的核心是运用共享技术来有效支持大量细粒度的对象。

// without flyweight
const Model = function(sex, underwear) {
    this.sex = sex;
    this.underwear = underwear;
};
Model.prototype.takePhoto = function() {
    // ...
};
for(let i = 1; i <= 50; i++) {
    const femaleModel = new Model('female', 'underwear', i);
    femaleModel.takePhoto();
}
// male => same as above

// 这样就建立太多相似的对象 => 享元模式就是为了消除这些多余的对象

// 改写一下 => 我们只需要区别男女模特

class _Model {
    constructor(sex) {
        this.sex = sex;
    }
    takePhoto() {
        console.log('sex= ' + this.sex + ' underwear=' + this.underwear);
    }
}
const maleModel = new _Model('male'),
    femaleModel = new _Model('female');

for (let i = 1; i <= 50; i++) {
    maleModel.underwear = 'underwear' + i;
    maleModel.takePhoto();
}
for (let i = 1; i <= 50; i++) {
    femaleModel.underwear = 'underwear' + i;
    femaleModel.takePhoto();
}
// 改进后只需要两个对象 => 享元模式的雏形

// 12.2 内部状态和外部状态
/**
 * 享元模式要求将对象的属性划分为内部状态与外部状态（状态在这里通常指属性）
 * 享元模式的目标是尽量减少共享对象的数量，
 * 关于如何划分内部状态和外部状态:
 *  内部状态存储于对象内部。
 *  内部状态可以被一些对象共享。
 *  内部状态独立于具体的场景，通常不会改变。
 *  外部状态取决于具体的场景，并根据场景而变化，外部状态不能被共享。
 * 
 * 这样一来，我们便可以把所有内部状态相同的对象都指定为同一个共享的对象。
 * 而外部状态可以从对象身上剥离出来，并储存在外部。 
 * 
 * 上面的例子中性别是内部状态，内衣是外部状态
 * 
 * 通常来讲，内部状态有多少种组合，
 * 系统中便最多存在多少个对象，
 * 因为性别通常只有男女两种，所以该内衣厂商最多只需要 2 个对象。
 */

// 12.3 享元模式的通用结构
/**
 * 我们通过一个对象工厂来解决第一个问题，
 * 只有当某种共享对象被真正需要时，它才从工厂中被创建出来。
 * 对于第二个问题，可以用一个管理器来记录对象相关的外部状态，
 * 使这些外部状态通过某个钩子和共享对象联系起来。
 */

console.log('文件上传例子，见 upload.js');
