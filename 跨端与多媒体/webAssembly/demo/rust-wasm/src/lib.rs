use js_sys::Int32Array;
use wasm_bindgen::prelude::*;

#[wasm_bindgen(start)]
pub fn init() {
    #[cfg(feature = "console_error_panic_hook")]
    console_error_panic_hook::set_once();
}

/// 数组求和：接收 JS 传入的 Int32Array，返回总和
#[wasm_bindgen]
pub fn sum_array(arr: &Int32Array) -> i32 {
    arr.to_vec().iter().sum()
}

/// 斐波那契：用于性能对比（JS vs WASM）
#[wasm_bindgen]
pub fn fib(n: u32) -> u32 {
    match n {
        0 => 0,
        1 => 1,
        _ => fib(n - 1) + fib(n - 2),
    }
}
