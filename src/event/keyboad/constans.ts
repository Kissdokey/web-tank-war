export enum EPlayer {
  PLAYER1 = "player1",
  PLAYER2 = "player2",
}

export const DEFAULT_KEY_SETTINGS = {
  [EPlayer.PLAYER1]: {
    forward: "w",
    backward: "s",
    clockwise: "d",
    counterclockwise: "a",
    attack: " ",
  },
  [EPlayer.PLAYER2]: {
    forward: "i",
    backward: "k",
    clockwise: "l",
    counterclockwise: "j",
    attack: "Enter",
  },
};
export const TANK_ACTION = {
    MOVE: 'move',
    ROTATE: 'rotate',
    ATTACK: 'attack'
}