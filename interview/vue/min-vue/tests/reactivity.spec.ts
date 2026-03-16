import { describe, expect, it } from "vitest";
import { effect } from "../src/reactivity/effect";
import { reactive } from "../src/reactivity/reactive";

describe("reactivity core", () => {
  it("tracks and triggers effects on property change", () => {
    const state = reactive({ count: 0 });
    let dummy = 0;

    effect(() => {
      dummy = state.count;
    });

    expect(dummy).toBe(0);
    state.count += 1;
    expect(dummy).toBe(1);
  });
});
