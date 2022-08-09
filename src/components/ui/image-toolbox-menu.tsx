import { Box, Tooltip } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AppContext, Types } from "store/index";

export function ImageToolboxMenu({
  icon,
  iconFocus,
  index,
  label,
}: {
  icon: JSX.Element;
  iconFocus: JSX.Element;
  index: number;
  label: string;
}) {
  const { state, dispatch } = useContext(AppContext);
  const [isActive, setIsActive] = useState<boolean>(false);
  const objectDetectingSelector = state.controller.objectDetecting;

  useEffect(() => {
    setIsActive(state.controller.objectDetecting.indexTool === index);
  }, [state.controller.objectDetecting.indexTool, index]);

  const onClickHandler = () => {
    if (objectDetectingSelector.indexTool === index) {
      dispatch({
        type: Types.OBJECT_DETECTING_DEFAULT,
        payload: {},
      });
      return;
    }

    dispatch({
      type: Types.SET_IMAGE_TOOL,
      payload: { objectDetecting: { indexTool: index } },
    });
  };
  return (
    <Box _hover={{ cursor: "pointer" }} onClick={onClickHandler} py={2}>
      <Tooltip label={label} shouldWrapChildren={true}>
        {isActive ? iconFocus : icon}
      </Tooltip>
    </Box>
  );
}
