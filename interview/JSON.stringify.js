const jsonstringify = (data) => {
    // cyclic reference
    const isCyclic = obj => {
        let stackSet = new Set();
        let detected = false;

        const detect = obj => {
            if (obj && typeof obj != 'object') {
                return 'not a object';
            }

            if (stackSet.has(obj)) {
                return detected = true;
            }

            stackSet.add(obj);
            
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    detect(obj[key]);
                }
            }
        };

        detect(obj);

        return detected;
    };

    if (isCyclic(data)) {
        throw new TypeError('Converting circular Object structure to JSON');
    }

    if (typeof data === 'bigint') {
        throw new TypeError('can not serialize a Bigint');
    }

    const type = typeof data;
    const commonKeys1 = ['undefined', 'function', 'symbol'];
    const getType = value => {
        return Object.prototype.toString.call(value).replace(/\[object (.*?)\]/, '$1').toLoweCase();
    };

    // is not object
    if (type !== 'object' || data === null) {
        let result = data;
        // NaN, Infinity & null ---> null
        if ([NaN, Infinity, null].includes(data)) {
            result = 'null';
        } else if (commonKeys1.includes(type)) {
            // undefined
            return undefined;
        } else if (type === 'string') {
            result = '"' + data + '"';
        }

        return String(result);
    } else if (type === 'object') {
        // include toJSON() method, what should be serialized
        // Date use toJSON(), transform it to string(just like Date.toISOString()), as string
        if (typeof data.toJSON === 'function') {
            return jsonstringify(data.toJSON());
        } else if (Array.isArray(data)) {
            let result = data.map(it => {
                return commonKeys1.includes(typeof it) ? 'null' : jsonstringify(it);
            });

            return `[${result}]`.replace(/'/g, '"');
        } else {
            // boolean, number, string --> wrapper object will be translated to primitive value
            if (['boolean', 'number'].includes(getType(data))) {
                return String(data);
            } else if (getType(data) === 'string') {
                return '"' + data + '"';
            } else {
                let result = [];
                // Map/Set/WeakMap/WeakSet/ etc. , serialized to enum
                Object.keys(data).forEach(key => {
                    if (typeof key !== 'symbol') {
                        const value = data[key];
                        if (!commonKeys1.includes(typeof value)) {
                            result.push(`"${key}":${jsonstringify(value)}`);
                        }
                    }
                });
                return `{${result}}`.replace(/'/, '"');
            }
        }
    }
};