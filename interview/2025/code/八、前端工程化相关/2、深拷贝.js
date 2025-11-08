function deepcopy(obj) {
    const map = new Map();

    const traverse = currentObj => {
        // 非对象类型直接返回（基本类型、null等）
        if (currentObj === null || typeof currentObj !== 'object') {
            return currentObj;
        }

        // 处理特殊对象类型
        if (currentObj instanceof Date) {
            return new Date(currentObj);
        }
        if (currentObj instanceof RegExp) {
            return new RegExp(currentObj.source, currentObj.flags);
        }

        // 处理循环引用：若已拷贝过当前对象，直接返回对应的拷贝结果
        if (map.has(currentObj)) {
            return map.get(currentObj);
        }

        // 创建对应类型的拷贝容器（数组/纯对象）
        const result = Array.isArray(currentObj) ? [] : {};
        // 关键：立即记录当前对象与拷贝容器的映射，避免自身循环引用
        map.set(currentObj, result);

        // 遍历所有属性（数组索引/对象键），统一递归深拷贝
        const keys = Object.keys(currentObj);
        for (const key of keys) {
            // 无论属性值是哪种对象类型（数组、纯对象等），都递归深拷贝
            result[key] = traverse(currentObj[key]);
        }

        return result;
    };

    return traverse(obj);
}

const a = {
    name: '陈',
    age: 18,
};

a.person = a;
console.log(deepcopy([1, 2, 3, a]));
