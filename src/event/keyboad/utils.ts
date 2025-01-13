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
  let eventType = "attack",
    eventParams = {};
  if (isAttackType(eType)) {
    eventType = eType;
  }
  if (isMoveType(eType)) {
    eventType = "move";
    eventParams = {
      isForward: eType === "forward",
    };
  }
  if (isRotateType(eType)) {
    eventType = "rotate";
    eventParams = {
      isClockWise: eType === "clockwise",
    };
  }
  return {
    eventType,
    eventParams
  }
};
