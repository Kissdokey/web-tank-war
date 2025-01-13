type Keys = KeyboardEvent["key"];
export interface ITankOperator {
  forward: Keys;
  backward: Keys;
  clockwise: Keys;
  counterclockwise: Keys;
  attack: Keys;
}
export type OperatorEvenType = keyof ITankOperator;
