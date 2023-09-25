import RelativeArray from "../../src/utils/RelativeArray";

test("Iteration over relative array", () => {
  const relativeArray = new RelativeArray<number>();

  relativeArray.add(-1, 1);
  relativeArray.add(0, 2);
  relativeArray.add(1, 3);

  const result = [];
  for(const value of relativeArray) {
    result.push(value);
  }

  expect(result).toEqual([1, 2, 3]);
});