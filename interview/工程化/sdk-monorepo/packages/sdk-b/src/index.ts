// SDK B - 导出类型和方法（仅支持 UMD）

export interface SDKBType {
  id: number
  message: string
}

export function sdkB(options?: SDKBType): void {
  const config: SDKBType = options || {
    id: 1,
    message: 'Hello from SDK-B',
  }
  console.log('[SDK-B]', config)
}

export default sdkB
