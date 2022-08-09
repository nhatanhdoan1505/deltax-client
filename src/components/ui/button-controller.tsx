import { Button } from "@chakra-ui/react";
import { AppContext, Types } from "store/index";
import { useCallback, useContext, useEffect, useState } from "react";

export function ButtonController({
  label,
  data,
  isRadioButton,
  isJoggingButton,
  colorScheme,
}: {
  label: string;
  data: string;
  isRadioButton: boolean;
  isJoggingButton: boolean;
  colorScheme: string;
}) {
  const { state, dispatch } = useContext(AppContext);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [_interval, set_Interval] = useState<any>(null);
  const [speech, setSpeech] = useState<number>(
    100 - state.controller.jogging.speech
  );

  const socketSelector = state.controller.setting.socket;

  const onPressHandler = useCallback(() => {
    isRadioButton &&
      dispatch({
        type: Types.PRESS,
        payload: { jogging: { radioButtonId: data } },
      });
    socketSelector.emit(Types.PRESS, { data: `${data}\n` });
  }, [data, dispatch, isRadioButton, socketSelector]);

  const handleEvent = useCallback(
    (_function: Function) => {
      set_Interval(
        setInterval(() => {
          if (isMouseDown) {
            _function();
          }
        }, speech)
      );
    },
    [isMouseDown, speech]
  );

  useEffect(() => {
    setSpeech(
      state.controller.jogging.speech === 100
        ? 100
        : 100 - state.controller.jogging.speech
    );
  }, [state.controller.jogging.speech]);

  useEffect(() => {
    if (!isMouseDown) {
      clearInterval(_interval);
      return;
    }
    handleEvent(onPressHandler);
  }, [_interval, handleEvent, onPressHandler, isMouseDown]);

  const toggleMouseDown = () => {
    setIsMouseDown(true);
  };

  const toggleMouseUp = () => {
    setIsMouseDown(false);
  };

  // useEffect(() => {
  //   document.addEventListener("contextmenu", (e) => e.preventDefault());
  // }, []);

  useEffect(() => {
    setIsActive(
      data === state.controller.jogging.radioButtonId && isRadioButton
        ? true
        : false
    );
  }, [data, isRadioButton, state]);

  return (
    <>
      {isJoggingButton ? (
        <Button
          onClick={onPressHandler}
          onTouchStart={toggleMouseDown}
          onTouchEnd={toggleMouseUp}
          isActive={isActive}
          colorScheme={colorScheme}
          size="lg"
          variant="outline"
        >
          {label}
        </Button>
      ) : (
        <Button
          onClick={onPressHandler}
          isActive={isActive}
          colorScheme={colorScheme}
          size="lg"
          variant="outline"
        >
          {label}
        </Button>
      )}
    </>
  );
}
