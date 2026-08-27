Page({
  data: {
    strategy: 'naive',
    nodeCount: 300,
    rate: 30,
    payloadKb: 4,
    leak: false,
    running: false,
    events: 0,
    setDataCount: 0,
    setDataMs: '0.0',
    nextTickMs: '0.0',
    trafficKb: '0.0',
    heapText: '不可读',
    heapUnit: '需工具/真机',
    rows: [],
  },

  onLoad() {
    this.sourceTimer = null;
    this.flushTimer = null;
    this.pending = false;
    this.retained = [];
    this.performanceApi = typeof wx.getPerformance === 'function' ? wx.getPerformance() : null;
    this.resetRows(this.data.nodeCount);
    this.updateMemory();
  },

  onHide() {
    // 页面进入后台时停止实验，避免后台继续制造请求、定时器和内存压力。
    if (this.data.running) this.stopExperiment();
  },

  onUnload() {
    this.stopExperiment();
    this.retained = [];
  },

  now() {
    return this.performanceApi && typeof this.performanceApi.now === 'function'
      ? this.performanceApi.now()
      : Date.now();
  },

  resetRows(count) {
    const rows = [];
    for (let i = 0; i < count; i += 1) {
      rows.push({ id: i + 1, width: 20 + ((i * 17) % 70) });
    }
    this.rows = rows;
    this.setData({ rows });
  },

  chooseNaive() {
    this.changeStrategy('naive');
  },

  chooseBatched() {
    this.changeStrategy('batched');
  },

  changeStrategy(strategy) {
    if (this.data.strategy === strategy) return;
    if (this.data.running) this.stopExperiment();
    this.setData({ strategy });
  },

  changeNodes(event) {
    const nodeCount = Number(event.detail.value);
    this.setData({ nodeCount });
    this.resetRows(nodeCount);
  },

  changeRate(event) {
    this.setData({ rate: Number(event.detail.value) });
    if (this.data.running) {
      this.stopExperiment();
      this.startExperiment();
    }
  },

  changePayload(event) {
    this.setData({ payloadKb: Number(event.detail.value) });
  },

  toggleLeak() {
    this.setData({ leak: !this.data.leak });
  },

  toggleRun() {
    if (this.data.running) this.stopExperiment();
    else this.startExperiment();
  },

  startExperiment() {
    const interval = Math.max(8, 1000 / this.data.rate);
    this.setData({ running: true });
    const tick = () => {
      if (!this.data.running) return;
      this.receiveEvent();
      this.sourceTimer = setTimeout(tick, interval);
    };
    tick();
  },

  stopExperiment() {
    clearTimeout(this.sourceTimer);
    clearTimeout(this.flushTimer);
    this.sourceTimer = null;
    this.flushTimer = null;
    this.pending = false;
    this.setData({ running: false });
  },

  receiveEvent() {
    const events = this.data.events + 1;
    this.setData({ events });
    if (this.data.strategy === 'naive') {
      this.commitUpdate();
      return;
    }
    this.pending = true;
    if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => {
        this.flushTimer = null;
        if (this.pending) {
          this.pending = false;
          this.commitUpdate();
        }
      }, 50);
    }
  },

  commitUpdate() {
    const start = this.now();
    const rows = this.rows.map((row, index) => ({
      id: row.id,
      width: 20 + ((index * 17 + this.data.events) % 70),
    }));
    this.rows = rows;
    const payload = new Array(this.data.payloadKb * 1024 + 1).join('x');
    if (this.data.leak && this.retainedSize < 64 * 1024 * 1024) {
      this.retained.push(payload + this.data.events);
      this.retainedSize = (this.retainedSize || 0) + payload.length;
    }
    const trafficKb = Number(this.data.trafficKb) + this.data.payloadKb + (rows.length * 12) / 1024;
    this.setData({ rows, payload, setDataCount: this.data.setDataCount + 1, trafficKb: trafficKb.toFixed(1) }, () => {
      const setDataMs = this.now() - start;
      this.setData({ setDataMs: setDataMs.toFixed(2) });
      const nextTickStart = this.now();
      wx.nextTick(() => {
        this.setData({ nextTickMs: (this.now() - nextTickStart).toFixed(2) });
      });
      this.updateMemory();
    });
  },

  updateMemory() {
    const memory = this.performanceApi && this.performanceApi.memory;
    if (memory && typeof memory.usedJSHeapSize === 'number') {
      this.setData({ heapText: (memory.usedJSHeapSize / 1048576).toFixed(1), heapUnit: 'MB JS Heap' });
    }
  },

  reset() {
    this.stopExperiment();
    this.retained = [];
    this.retainedSize = 0;
    this.rows = [];
    this.setData({ events: 0, setDataCount: 0, setDataMs: '0.0', nextTickMs: '0.0', trafficKb: '0.0', payload: '', heapText: '不可读', heapUnit: '需工具/真机' }, () => {
      this.resetRows(this.data.nodeCount);
      this.updateMemory();
    });
  },
});
