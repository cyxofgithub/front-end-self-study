// SDK A - 导出类型和方法

export interface SDKAType {
  name: string
  version: string
}

export function sdkA(options?: SDKAType): void {
  const config: SDKAType = options || {
    name: 'SDK-A',
    version: '1.0.0',
  }
  console.log('[SDK-A]', config)
}

export default sdkA
