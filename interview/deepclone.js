// 1.
function clone(target) {
    if (typeof target === 'object') {
        let cloneTarget = {};
        for (const key in target) {
            cloneTarget[key] = clone(target[key]);
        }
        return cloneTarget;
    } else {
        return target;
    }
}

// 2. on account of Array
function clone2(target) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};
        for (const key in target) {
            cloneTarget[key] = clone(target[key]);
        }
        return cloneTarget;
    } else {
        return target;
    }
}

// 3. if having circular reference
/**
 * check out whether object was cloned
 * T --- return
 * F --- object as key, clone object as value and stored in a Map
 * continue
 */

function clone3(target, map = new WeakMap()) {
    if (typeof target === 'object') {
        let cloneTarget = Array.isArray(target) ? [] : {};

        if (map.get(target)) {
            return map.get(target);
        }
        map.set(target, cloneTarget);

        for (const key in target) {
            cloneTarget[key] = clone3(target[key], map);
        }
        return cloneTarget;
    } else {
        return target;
    }
}

const generalizedObjType = function(obj) {
    const Ctor = obj.construcor;
    return new Ctor();
}

const deepclone = function(targetObj, map = new WeakMap()) {
    if (targetObj === null || typeof targetObj !== 'object') return targetObj;
    // simply extend the types    
    if (targetObj instanceof Date) return new Date(targetObj);
    if (targetObj instanceof RegExp) return new RegExp(targetObj);

    if (map.get(targetObj)) return map.get(targetObj); // return from circular reference, extracting from map cache
    
    let cloneTarget = generalizedObjType(); // generalize the targetObj type
    map.set(targetObj, cloneTarget); // cache obj to check out cyclic reference

    for (let key in targetObj) {
        if (targetObj.hasOwnProperty(key)) {
            cloneTarget[key] = deepclone(targetObj[key], map);
        }
    }
    return cloneTarget;
};

const deepClone = function(target, cache = new WeakMap()) {
    const isObject = obj => typeof obj === 'object' && obj !== null;

    if (isObject(target)) {
        // resolve circular reference
        const cachedTarget = cache.get(target);

        if (cachedTarget) return cachedTarget;

        let cloneTarget = Array.isArray(target) ? [] : {};

        cache.set(target, cloneTarget);

        for (const key in target) {
            cloneTarget[ key ] = isObject(target[key]) ? deepClone(target[key], cache) : target[ key ];
        }
        return cloneTarget;
    } else {
        return target;
    }
};
