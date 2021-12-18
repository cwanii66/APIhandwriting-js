class Vehicle {}

let FooMixin = (Superclass) => {
    return class extends Superclass {
        foo() {
            console.log('foo');
        }
    }
};
let BarMixin = (Superclass) => {
    return class extends Superclass {
        bar() {
            console.log('bar');
        }
    }
};
let BazMixin = (Superclass) => {
    return class extends Superclass {
        baz() {
            console.log('baz');
        }
    }
};

const Mixin = function(Baseclass, ...Mixin) {
    return Mixin.reduce((accumulator, current) => current(accumulator), Baseclass);
};

class Bus extends Mixin(Vehicle, FooMixin, BarMixin, BazMixin) {}

let b = new Bus();
b.foo()
b.bar()
b.baz()