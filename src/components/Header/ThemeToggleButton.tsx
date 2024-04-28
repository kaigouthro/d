import { IconButton, useColorMode } from "@chakra-ui/react";
import { IoMdMoon, IoIosSunny } from "react-icons/io";


export function ThemeToggleButton() {
  const { colorMode, toggleColorMode } = useColorMode();
  return (
    <IconButton onClick={toggleColorMode} aria-label="Toggle Theme" icon={colorMode === 'light' ? <IoMdMoon /> : <IoIosSunny />} bg='transparent' _hover={{ bg: 'transparent' }} size='lg' w='0' />
  );
}