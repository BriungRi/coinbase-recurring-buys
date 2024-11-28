import { roundToNearestIncrement } from "../utils/math";

describe("roundToNearestIncrement", () => {
  it("should round to the nearest increment", () => {
    expect(roundToNearestIncrement(5.5, 1)).toBe(6);
    expect(roundToNearestIncrement(5.4, 1)).toBe(5);
    expect(roundToNearestIncrement(5.5, 0.5)).toBe(5.5);
    expect(roundToNearestIncrement(5.25, 0.5)).toBe(5.5);
    expect(roundToNearestIncrement(5.75, 0.5)).toBe(6);
  });

  it("should handle zero increment", () => {
    expect(() => roundToNearestIncrement(5, 0)).toThrow();
  });

  it("should handle negative increments", () => {
    expect(roundToNearestIncrement(5.5, -1)).toBe(6);
  });
});
