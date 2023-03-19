import Position from "../../../engine/geom/position/Position";

test('Position interpolation 0.5 between (0;0) and (100;100) should be (50;50)', () => {
  const position = new Position(0, 0);
  position.set(100, 100);
  expect(position.interpolate(0.5)).toEqual({ x: 50, y: 50 });
});

test('Position interpolation 0.9 between (0;0) and (100;10) should be (90;9)', () => {
  const position = new Position(0, 0);
  position.set(100, 10);
  expect(position.interpolate(0.9)).toEqual({ x: 90, y: 9 });
});

test('Chained position interpolation 0.9 between (100;10) and (200;20) should be (190;19)', () => {
  const position = new Position(0, 0);
  position.set(100, 10);
  position.set(200, 20);
  expect(position.interpolate(0.9)).toEqual({ x: 190, y: 19 });
});