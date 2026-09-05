import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { AllocationPressureService } from '../src/allocation-pressure.js';

describe('AllocationPressureService', () => {
  it('只保留配置数量的批次', () => {
    const service = new AllocationPressureService(10, 2);

    service.allocate();
    service.allocate();
    const result = service.allocate();

    assert.equal(result.allocatedObjects, 10);
    assert.equal(result.retainedBatches, 2);
    assert.equal(service.release(), 2);
    assert.equal(service.release(), 0);
  });
});
