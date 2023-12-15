class ConferenceRoom {
    static bestArrange(conference) {
        const arr = conference.sort((a, b) => a[1] - b[1]);

        const res = [arr[0]];
        let pre = arr.shift();

        for (let i = 0; i < arr.length; i++) {
            if (arr[i][0] >= pre[1]) {
                res.push(arr[i]);
                pre = arr[i];
            }
        }

        return res;
    }
}

const conference = [
    [7, 9],
    [7, 10],
    [8, 9],
    [11, 13],
    [10, 12],
    [9, 10],
];

console.log(ConferenceRoom.bestArrange(conference));
