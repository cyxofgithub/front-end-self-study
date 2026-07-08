// /**
//  * @param {string[]} strs
//  * @return {string[][]}
//  */
// var groupAnagrams = function (strs) {
//     const result = [];
//     const map = new Map();

//     for (let i = 0; i < strs.length; i++) {
//         const key = [...strs[i]].sort().join("");
//         const list = map.has(key) ? map.get(key) : [];

//         list.push(strs[i]);
//         map.set(key, list);
//     }

//     return [...map.values()];
// };

var groupAnagrams = function (strs) {
    const map = new Object();
    for (let s of strs) {
        const count = new Array(26).fill(0);
        for (let c of s) {
            count[c.charCodeAt() - "a".charCodeAt()]++;
        }
        map[count] ? map[count].push(s) : (map[count] = [s]);
    }
    return Object.values(map);
};

groupAnagrams(["eat", "tea", "tan", "ate", "nat", "bat"]);
