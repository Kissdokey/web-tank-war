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
    forward: "ArrowUp",
    backward: "ArrowDown",
    clockwise: "ArrowRight",
    counterclockwise: "ArrowLeft",
    attack: "0",
  },
};
