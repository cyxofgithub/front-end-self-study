export interface KeywordValidator {
  readonly name: string;
  isValid(keyword: string): boolean;
}

export class UnsafeRegexValidator implements KeywordValidator {
  readonly name = 'unsafe-regex';

  // 嵌套量词在失败输入上会产生指数级回溯，仅用于复现故障。
  private readonly pattern = /^(\w+\s?)*$/;

  isValid(keyword: string): boolean {
    return this.pattern.test(keyword);
  }
}

export class SafeRegexValidator implements KeywordValidator {
  readonly name = 'safe-regex-with-length-limit';

  private readonly pattern = /^[A-Za-z0-9_ ]+$/;
  private readonly maxLength: number;

  constructor(maxLength = 100) {
    this.maxLength = maxLength;
  }

  isValid(keyword: string): boolean {
    if (keyword.length === 0 || keyword.length > this.maxLength) return false;
    return this.pattern.test(keyword);
  }
}
