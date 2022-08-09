import { HStack, VStack, Image, Text } from "@chakra-ui/react";
import {
  AiFillSignal,
  AiOutlineControl,
  AiOutlineFileSearch,
  AiTwotoneSetting,
} from "react-icons/ai";
import { SideBarItem } from ".";

export function SideBar() {
  const LOGO = "https://i.imgur.com/PYBWGfE.png?1";
  const MENU_ITEM = [
    { label: "JOGGING", icon: <AiOutlineControl fontSize="25px" />, index: 0 },
    {
      label: "OBJECT DETECTING",
      icon: <AiOutlineFileSearch fontSize="25px" />,
      index: 1,
    },
    {
      label: "SETTING",
      icon: <AiTwotoneSetting fontSize="25px" />,
      index: 2,
    },
  ];
  return (
    <VStack
      h="100vh"
      backgroundColor="blackAlpha.900"
      px={3}
      borderRadius="base"
      boxShadow="rgba(0, 0, 0, 0.16) 0px 1px 4px;"
    >
      <HStack
        minWidth="300px"
        justifyContent="space-between"
        color="white"
        mb={10}
      >
        <Image src={LOGO} alt="DELTA X" maxW="60px" />
        <Text fontWeight="extrabold" letterSpacing="3px" fontSize="1.5rem">
          DELTA X
        </Text>
        <AiFillSignal />
      </HStack>
      {MENU_ITEM.map((menu) => (
        <SideBarItem {...menu} key={menu.index} />
      ))}
    </VStack>
  );
}
