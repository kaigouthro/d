import React from 'react';
import { Box, HStack, IconButton, Spacer, useColorMode, useStyleConfig, Image, VStack, Text, Link } from "@chakra-ui/react";
import { ThemeToggleButton } from "./ThemeToggleButton";
import { HamburgerIcon } from '@chakra-ui/icons';
import { HelpMenu } from './HelpMenu';
import { UserMenu } from './UserMenu';
import { DuckieAllStates } from '../../props/DuckieAgentProps';

type DuckieAppHeaderProps = {
  onToggle: () => void;
  isOpen: boolean;
  selectedAgentId: string;
  agents: DuckieAllStates
};

export const DuckieAppHeader: React.FC<DuckieAppHeaderProps> = ({ onToggle, isOpen, selectedAgentId, agents }) => {
  const { colorMode } = useColorMode();
  const styles = useStyleConfig("DuckieAppHeader", { variant: colorMode });

  return (
    <HStack
      w='100%'
      h='60px'
      sx={styles}
    >
      <Box
        display='flex'
        alignItems='center'
        // paddingLeft={'16px'}
        transition="all 0.2s"
        h='100%'
        w={isOpen ? '320px' : '56px'}
        borderRight='1px solid #D9D9D999'
      >
        <IconButton
          size={'lg'}
          icon={<HamburgerIcon />}
          aria-label={''}
          onClick={onToggle}
          bg='transparent'
          _hover={{ bg: 'transparent' }}
        />
      </Box>
      <Box pr='12px' />
      <Link href='/'>
        <Image src={'/images/logo_duck.png'} alt='Duckie Logo' boxSize='32px' fill='black' w='32px' h='32px'/>
      </Link>
      <VStack align='left' pl='12px'>
        {agents[selectedAgentId] !== undefined ? (<>
        <Text fontSize='16px' h='18px' fontWeight='semibold' color='#808080'>{agents[selectedAgentId].objective_name}</Text>
        <HStack>
          <Link href={agents[selectedAgentId].repo_url} isExternal>
            <Text fontSize='12px' h='14px' fontWeight='normal' color='#808080'>{agents[selectedAgentId].repo} · {agents[selectedAgentId].default_branch}</Text>
          </Link>
        </HStack></>
        ) : (<></>)}
      </VStack>
      <Spacer />
      <ThemeToggleButton />
      <HelpMenu />
      <UserMenu />
    </HStack>
  );
};
