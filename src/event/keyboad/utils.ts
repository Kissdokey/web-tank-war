import { TANK_ACTION } from "./constans";
import type { OperatorEvenType } from "./type";

export const isMoveType = (type: OperatorEvenType) => {
  return ["forward", "backward"].includes(type);
};
export const isRotateType = (type: OperatorEvenType) => {
  return ["clockwise", "counterclockwise"].includes(type);
};
export const isAttackType = (type: OperatorEvenType) => {
  return ["attack"].includes(type);
};

export const getEventParams = (eType: OperatorEvenType) => {
  let eventType = TANK_ACTION.ATTACK,
    eventParams = {};
  if (isAttackType(eType)) {
    eventType = eType;
  }
  if (isMoveType(eType)) {
    eventType = TANK_ACTION.MOVE;
    eventParams = {
      isForward: eType === "forward",
    };
  }
  if (isRotateType(eType)) {
    eventType = TANK_ACTION.ROTATE;
    eventParams = {
      isClockWise: eType === "clockwise",
    };
  }
  return {
    eventType,
    eventParams
  }
};
