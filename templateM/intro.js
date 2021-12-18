// 基于集成的设计模式 --- 模板方法(Template Method)

// 11.1 模板方法模式的定义和组成

/**
 * 模板方法模式由两部分结构组成，
 * 第一部分是抽象父类，
 * 第二部分是具体的实现子类。
 * 通常在抽象父类中封装了子类的算法框架，
 * 包括实现一些公共方法以及封装子类中所有方法的执行顺序。
 * 子类通过继承这个抽象类，也继承了整个算法结构，
 * 并且可以选择重写父类的方法。 
 */
/**
 * 假如我们有一些平行的子类，
 * 各个子类之间有一些相同的行为，
 * 也有一些不同的行为。
 * 如果相同和不同的行为都混合在各个子类的实现中，
 * 说明这些相同的行为会在各个子类中重复出现。
 * 但实际上，相同的行为可以被搬移到另外一个单一的地方，
 * 模板方法模式就是为解决这个问题而生的。
 * 在模板方法模式中，子类实现中的相同部分被上移到父类中，
 * 而将不同的部分留待子类来实现。
 * 这也很好地体现了泛化的思想。
 */

// 11.2 Coffee or Tea

class Coffee {
    boilWater() {
        console.log('把水煮沸');
    }

    brewCoffeeGriends() {
        console.log('wash');
    }

    pourInCup() {
        console.log('pour');
    }

    addSugarAndMilk() {
        console.log('add');
    }

    init() {
        this.boilWater();
        this.brewCoffeeGriends();
        this.pourInCup();
        this.addSugarAndMilk();
    }
}
const coffee = new Coffee();
coffee.init();

// 泡一杯茶的步骤和咖啡并无二致

/**
 * 我们找到泡咖啡和泡茶主要有以下不同点。
 *  原料不同。一个是咖啡，一个是茶，但我们可以把它们都抽象为“饮料”。
 *  泡的方式不同。咖啡是冲泡，而茶叶是浸泡，我们可以把它们都抽象为“泡”。
 *  加入的调料不同。一个是糖和牛奶，一个是柠檬，但我们可以把它们都抽象为“调料”。
 * 
 * 经过抽象：
 * (1) 把水煮沸
 * (2) 用沸水冲泡饮料
 * (3) 把饮料倒进杯子
 * (4) 加调料
 */

class Beverage {
    boilWater() {
        console.log('把水煮沸');
    }
    brew() {}  // 空方法，应该由子类重写
    pourCup() {}
    addCondiment() {}

    init() {
        this.boilWater();
        this.brew();
        this.pourCup();
        this.addCondiment();
    }
}
// 创建Coffee 子类和 Tea子类
class Coffee extends Beverage {
    brew() {
        console.log('brew');
    }
    pourCup() {
        console.log('pour');
    }
    addCondiment() {
        console.log('add');
    }
}

new Coffee().init();

/**
 * 本章一直讨论的是模板方法模式，
 * 那么在上面的例子中，到底谁才是所谓的模板方法呢？
 * 
 * 答案是 Beverage.prototype.init。
 * 
 * 该方法中封装了子类的算法框架，
 * 它作为一个算法的模板，
 * 指导子类以何种顺序去执行哪些方法。
 * 在 Beverage.prototype.init 方法中，
 * 算法内的每一个步骤都清楚地展示在我们眼前。
 */




