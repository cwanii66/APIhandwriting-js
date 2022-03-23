// 1. 跟踪属性访问
// get set has ... 可以知道对象是么时候被访问、查询
// 把实现相应捕获器的某个对象代理放到应用中，可以监控这个对像的访问
const user = {
    name: 'jake'
};
const handler = {
    get(target, property, receiver) {
        console.log(`Getting ${property}`);

        return Reflect.get(...arguments); // default
    },
    set(target, property, value, receiver) {
        console.log(`Setting ${property} = ${value}`);

        return Reflect.set(...arguments); // default
    }
};
const proxy = new Proxy(user, handler);

proxy.name; // Getting name
proxy.age = 27; // Setting age=27 

// 2. 隐藏属性
const hiddenProperties = ['foo', 'bar'];
const targetObject = {
    foo: 1,
    bar: 2,
    baz: 3
};
const proxy2 = new Proxy(targetObject, {
    get(target, property, receiver) {
        if (hiddenProperties.includes(property)) {
            return undefined;
        } else {
            return Reflect.get(...arguments);
        }
    },
    has(target, property) {
        if (hiddenProperties.includes(property)) {
            return false;
        } else {
            return Reflect.has(...arguments);
        }
    }
});
// get()
console.log(proxy2.foo); // undefined
console.log(proxy2.bar); // undefined
console.log(proxy2.baz); // 3
// has()
console.log('foo' in proxy2); // false
console.log('bar' in proxy2); // false
console.log('baz' in proxy2); // true

// 3. 属性验证
// 所有复制操作都会触发set() traps, 所以可以根据赋的值决定允许还是拒绝赋值
const targetObj = {
    onlyNumbersGoHere: 0
};

const proxy3 = new Proxy(targetObj, {
    set(target, property, value) {
        if (typeof value !== "number") {
            return false;
        } else {
            return Reflect.set(...arguments);
        }
    }
});

proxy3.onlyNumbersGoHere = 1;
console.log(proxy3.onlyNumbersGoHere); // 1
proxy3.onlyNumbersGoHere = '2';
console.log(proxy3.onlyNumbersGoHere); // 1

// 4. 函数与构造函数参数验证
// 我们同样可以对函数和构造函数参数进行审查。
function median(...nums) {
    return nums.sort()[Math.floor(nums.length / 2)];
}
const proxy4 = new Proxy(median, {
    apply(target, thisArg, argumentsList) {
        for (const arg of argumentsList) {
            if (typeof arg !== 'number')
                throw 'Non-number argument provided';
        }
        return Reflect.apply(...arguments);
    }
});
console.log(proxy4(4, 7, 1)); // 4
console.log(proxy4(4, '7', 1));
// Error: Non-number argument provided 

// 同样也可以要求实例化时必须给构造函数传参
class User {
    constructor(id) {
        this.id_ = id;
    }
}

const proxy5 = new Proxy(User, {
    construct(target, argumentsList, newTarget) {
        if (argumentsList[0] === undefined) {
            throw 'User cannot be instantiated without id';
        } else {
            return Reflect.construct(...arguments);
        }
    }
});

new proxy5(1);
new proxy5();


// 5. 数据绑定与可观察对象
// 连接不相关部分
const personList = []; // global instance collection
class Person {
    constructor(name) {
        this.name = name;
    }
}
const proxy6 = new Proxy(Person, {
    construct() {
        const newPerson = Reflect.construct(...arguments);
        personList.push(newPerson);
        return newPerson;
    }
});
new proxy6('John');
new proxy6('Jacob');
new proxy6('Jingleheimerschmidt');
console.log(personList); // [User {}, User {}, User{}] 

// 另外，还可以把集合绑定到一个事件分派程序，每次插入新实例时都会发送消息
const userList = [];
function emit(newValue) { // emit message
    console.log(newValue);
}

const proxy7 = new Proxy(userList, {
    set(target, property, value, receiver) {
        const result = Reflect.set(...arguments);
        if (result) emit(Reflect.get(target, property, receiver));
        
        return result;
    }
});
proxy7.push('John');
// John
proxy7.push('Jacob');
// Jacob