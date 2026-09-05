import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { SafeRegexValidator, UnsafeRegexValidator } from '../src/keyword-validator.js';

describe('KeywordValidator', () => {
  it('两种策略都接受正常搜索词', () => {
    assert.equal(new UnsafeRegexValidator().isValid('hello node_22'), true);
    assert.equal(new SafeRegexValidator().isValid('hello node_22'), true);
  });

  it('安全策略拒绝非法字符和超长输入', () => {
    const validator = new SafeRegexValidator(10);

    assert.equal(validator.isValid('hello!'), false);
    assert.equal(validator.isValid('a'.repeat(11)), false);
  });
});
