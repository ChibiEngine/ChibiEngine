import RelativeArray from "../../src/utils/RelativeArray";

test("Iteration over relative array", () => {
  const relativeArray = new RelativeArray<number>();

  relativeArray.add(-1, 1);
  relativeArray.add(0, 2);
  relativeArray.add(1, 3);
  relativeArray.add(10, 4);
  relativeArray.add(-10, 0);

  const result = [];
  for(const value of relativeArray) {
    result.push(value);
  }

  expect(result).toEqual([0, 1, 2, 3, 4]);
});

test("delete from relative array", () => {
  const relativeArray = new RelativeArray<number>();

  relativeArray.add(-1, 1);
  relativeArray.add(0, 2);
  relativeArray.add(1, 3);
  relativeArray.add(10, 4);
  relativeArray.add(-10, 0);

  relativeArray.remove(0);

  const result = [];
  for(const value of relativeArray) {
    result.push(value);
  }

  expect(result.length).toBe(4);
  expect(result).toEqual([0, 1, 3, 4]);
});