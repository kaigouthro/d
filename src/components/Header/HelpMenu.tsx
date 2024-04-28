import { Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, useDisclosure } from "@chakra-ui/react";
import { AiOutlineQuestionCircle } from "react-icons/ai";
import { FeedbackModal } from "../Feedback/FeedbackModal";


export function HelpMenu() {
    const { isOpen, onOpen, onClose } = useDisclosure();

    return (
        <>
            <Menu>
                <MenuButton
                    pr='4'
                    transition='all 0.2s'
                    _hover={{ bg: 'transparent' }}
                    _expanded={{ bg: 'transparent' }}
                    _focus={{ boxShadow: 'transparent' }}
                >
                    <AiOutlineQuestionCircle size='24px' />
                </MenuButton>
                <MenuList>
                    <MenuItem as={Link} _hover={{ textDecoration: 'none' }} href='https://docs.duckie.ai' isExternal><Text fontSize='14px' pl='5px'>Help & Documentation</Text></MenuItem>
                    <MenuItem as={Link} _hover={{ textDecoration: 'none' }} href='mailto:founders@duckie.ai'><Text fontSize='14px' pl='5px'>Contact Support</Text></MenuItem>
                    <MenuItem as={Link} _hover={{ textDecoration: 'none' }} onClick={onOpen}><Text fontSize='14px' pl='5px'>Provide Feedback</Text></MenuItem>
                    <MenuItem as={Link} _hover={{ textDecoration: 'none' }} href='https://discord.gg/JwQSRj9Wx2' isExternal><Text fontSize='14px' pl='5px'>Join us on Discord</Text></MenuItem>
                    <MenuDivider />
                    <MenuItem as={Link} _hover={{ textDecoration: 'none' }} href='https://docs.duckie.ai' isExternal><Text fontSize='14px' pl='5px'>Terms of Service</Text></MenuItem>
                    <MenuItem as={Link} _hover={{ textDecoration: 'none' }} href='https://docs.duckie.ai' isExternal><Text fontSize='14px' pl='5px'>Privacy Policy</Text></MenuItem>
                </MenuList>
            </Menu>

            <FeedbackModal isOpen={isOpen} onClose={onClose} />
        </>
    );
}