import React, { createContext, useReducer, Dispatch, ReactNode } from "react";
import { ControllerActions, controllerReducer, ControllerType } from ".";
import { io } from "socket.io-client";

type InitialStateType = {
  controller: ControllerType;
};

type Action = ControllerActions;

const initialState: InitialStateType = {
  controller: {
    jogging: { radioButtonId: "", speech: 50 },
    setting: {
      ip: process.env.REACT_APP_SERVER_ADDRESS as string,
      port: Number(process.env.REACT_APP_SERVER_PORT) as number,
      socket: io(
        `http://${process.env.REACT_APP_SERVER_ADDRESS}:${process.env.REACT_APP_SERVER_PORT}`
      ),
    },
    objectDetecting: {
      indexTool: null!,
      crop: null!,
      applyCrop: false,
      currentObject: null!,
      isDelete: false,
    },
    controllerIndex: 0,
  },
};

const AppContext = createContext<{
  state: InitialStateType;
  dispatch: Dispatch<Action>;
}>({
  state: initialState,
  dispatch: () => null,
});

const mainReducer = ({ controller }: InitialStateType, action: Action) => ({
  controller: controllerReducer(controller, action),
});

const AppProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState as never);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider, AppContext };
