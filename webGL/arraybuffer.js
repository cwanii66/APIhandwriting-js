const buf = new ArrayBuffer(32);
const dataView = new DataView(buf);
dataView.getUint8(0);

// TypedArray
const buffer = new ArrayBuffer(12);
const x1 = new Int32Array(buffer);
x1[0] = 1;
const x2 = new Uint8Array(buffer);
x2[0] = 2;

x1[0] //2

const buffer1 = new ArrayBuffer(32);
buffer1.byteLength // 32

const buffer2 = new ArrayBuffer(8);
ArrayBuffer.isView(buffer2) // false
// 相当于判断参数，是否为TypedArray实例或DataView实例
const v = new Int32Array(buffer2);
ArrayBuffer.isView(v) // true

// 2.2 typedArray constructor

