import { Avatar, Icon, Link, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spacer, Text } from "@chakra-ui/react";
import { redirect } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiGithub } from "react-icons/fi";


export function UserMenu() {
    const { user, loading: authLoading, logout } = useAuth();
    const userId = user?.uid || 'NA';
    if (userId === 'NA') {
        redirect('/');
    }

    const screenName = (user as any)?.reloadUserInfo?.screenName || 'NA'

    const onSignOutClick = () => {
        logout();
    }

    return (
        <Menu>
            <MenuButton
                pr='4'
                transition='all 0.2s'
                _hover={{ bg: 'transparent' }}
                _expanded={{ bg: 'transparent' }}
                _focus={{ boxShadow: 'transparent' }}
            >
                <Avatar name={screenName} src={user?.photoURL || ''} width='32px' height='32px' />
            </MenuButton>
            <MenuList>
                <MenuItem as={Link} href={'https://github.com/' + screenName} isExternal _hover={{ textDecoration: 'none' }}>
                    <Text fontWeight='bold' fontSize='14px' pl='5px' textDecoration={'none'}>{screenName}</Text>
                    <Spacer />
                    <Icon as={FiGithub} />
                </MenuItem>
                <MenuDivider />
                {/* <MenuGroup title="Notifications">
                    <MenuItem onClick={onNotificationClick} closeOnSelect={false}>
                        <Text fontSize='14px' pl='5px'>Browser</Text>
                        <Spacer />
                        <Switch id='browser-alerts' size='sm' />
                    </MenuItem>
                </MenuGroup>
                <MenuDivider /> */}
                <MenuItem onClick={onSignOutClick}>
                    <Text fontSize='14px' pl='5px'>Sign Out</Text>
                </MenuItem>
            </MenuList>
        </Menu>
    );
}