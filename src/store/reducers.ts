import { Crop } from "react-image-crop";
import { io, Socket } from "socket.io-client";

export enum Types {
  PRESS = "PRESS",
  SPEED = "SPEED",
  SET_SIDE_BAR_INDEX = "SET_SIDE_BAR_INDEX",
  SET_CONNECTION = "SET_CONNECTION",
  SET_IMAGE_TOOL = "SET_IMAGE_TOOL",
  SET_CROP_VALUE = "SET_CROP_VALUE",
  APPLY_CROP = "APPLY_CROP",
  SET_CURRENT_OBJECT = "SET_CURRENT_OBJECT",
  OBJECT_DETECTING_DEFAULT = "OBJECT_DETECTING_DEFAULT",
  IS_DELETE_OBJECT = "IS_DELETE_OBJECT",
}

export interface IRect {
  x: number;
  y: number;
  name?: string;
  width: number;
  height: number;
}

export type ControllerType = {
  jogging: JoggingType;
  setting: SettingType;
  objectDetecting: ObjectDetectingType;
  controllerIndex: number;
};

export type ControllerActions = {
  type: Types;
  payload: ControllerPayload;
};

export type ControllerPayload = {
  jogging?: JoggingPayload;
  setting?: SettingPayload;
  objectDetecting?: ObjectDetectingPayload;
  controllerIndex?: number;
};

export const controllerReducer = (
  state: ControllerType,
  action: ControllerActions
): ControllerType => {
  switch (action?.type) {
    case Types.PRESS:
      return {
        ...state,
        jogging: {
          ...state.jogging,
          radioButtonId: action.payload.jogging?.radioButtonId!,
        },
      };
    case Types.SPEED:
      return {
        ...state,
        jogging: {
          ...state.jogging,
          speech: action.payload.jogging?.speech!,
        },
      };

    case Types.SET_SIDE_BAR_INDEX:
      return { ...state, controllerIndex: action.payload.controllerIndex! };
    case Types.SET_CONNECTION:
      state.setting.socket.disconnect();
      state.setting.socket = io(
        `http://${action.payload.setting?.ip}:${action.payload.setting?.port}`
      );
      return {
        ...state,
        setting: {
          ...state.setting,
          ip: action.payload.setting?.ip!,
          port: action.payload.setting?.port!,
        },
      };
    case Types.SET_IMAGE_TOOL:
      return {
        ...state,
        objectDetecting: {
          ...state.objectDetecting,
          indexTool: action.payload.objectDetecting?.indexTool!,
        },
      };
    case Types.SET_CROP_VALUE:
      return {
        ...state,
        objectDetecting: {
          ...state.objectDetecting,
          crop: action.payload.objectDetecting?.crop!,
        },
      };
    case Types.APPLY_CROP:
      return {
        ...state,
        objectDetecting: {
          ...state.objectDetecting,
          applyCrop: action.payload.objectDetecting?.applyCrop!,
        },
      };
    case Types.SET_CURRENT_OBJECT:
      return {
        ...state,
        objectDetecting: {
          ...state.objectDetecting,
          currentObject: action.payload.objectDetecting?.currentObject!,
        },
      };
    case Types.OBJECT_DETECTING_DEFAULT:
      return {
        ...state,
        objectDetecting: {
          ...state.objectDetecting,
          currentObject: null!,
          indexTool: null!,
        },
      };
    case Types.IS_DELETE_OBJECT:
      return {
        ...state,
        objectDetecting: {
          ...state.objectDetecting,
          isDelete: action.payload.objectDetecting?.isDelete!,
        },
      };
    default:
      return state;
  }
};

type JoggingPayload = {
  radioButtonId?: string;
  speech?: number;
};

type JoggingType = { radioButtonId: string; speech: number };

export type SettingType = {
  ip: string;
  port: number;
  socket: Socket;
};

export type SettingPayload = {
  ip?: string;
  port?: number;
  socket?: Socket;
};

export type ObjectDetectingType = {
  indexTool: number;
  applyCrop: boolean;
  crop: Crop;
  currentObject: IRect;
  isDelete: boolean;
};

export type ObjectDetectingPayload = {
  indexTool?: number;
  applyCrop?: boolean;
  crop?: Crop;
  currentObject?: IRect;
  isDelete?: boolean;
};
