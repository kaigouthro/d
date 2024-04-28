import { Box, VStack, useColorMode, Text, Icon, Link, Spacer, Spinner, Tooltip } from '@chakra-ui/react';
import { DuckieStateJson } from '../../props/DuckieAgentProps';
import { BiErrorAlt, BiGitPullRequest } from "react-icons/bi"
import { BsFillCircleFill } from "react-icons/bs"
import React, { useRef } from 'react';

type SideBarItemProps = {
    agent: DuckieStateJson;
    setSelectedAgentId: React.Dispatch<React.SetStateAction<string>>;
    onClose: () => void;
};

export function FindDuckieItem({ agent, setSelectedAgentId, onClose }: SideBarItemProps) {
    const { colorMode } = useColorMode();
    // const styles = useStyleConfig("SideBarItem", { variant: colorMode });

    const getStatusIcon = () => {
        switch (agent.status) {
            case 'ERROR':
                return (
                    <Tooltip label="Error" aria-label="Error">
                        <Box pt='4px'>
                            <Icon as={BiErrorAlt} boxSize={6} color={determineStatusColor()} />
                        </Box>
                    </Tooltip>)
            case 'STOPPED':
                return (
                    <Tooltip label="Stopped" aria-label="Stopped">
                        <Box pt='4px'>
                            <Icon as={BsFillCircleFill} boxSize={4} color={determineStatusColor()} />
                        </Box>
                    </Tooltip>)
            case 'COMPLETE':
                return (
                    <Link href={agent.pr_url} isExternal display="flex" alignItems="center" justifyContent="center">
                        <Icon as={BiGitPullRequest} boxSize={6} color={determineStatusColor()} />
                    </Link>
                )
            case 'RUNNING' || 'INITIATED':
                return (
                    <Tooltip label="Running" aria-label="Running">
                        <Box pt='4px'>
                            <Spinner boxSize='6' speed='1s' color={determineStatusColor()} />
                        </Box>
                    </Tooltip>)
            // return <Icon as={ImSpinner6} boxSize={6} color={determineStatusColor()} />;
            case 'REQ_INPUT':
                return (
                    <Tooltip label="Input requested" aria-label="Input requested">
                        <Box pt='4px'>
                            <Icon as={BsFillCircleFill} boxSize={4} color={determineStatusColor()} />
                        </Box>
                    </Tooltip>)
            default:
                return <Icon as={BsFillCircleFill} boxSize={4} color={determineStatusColor()} />;
        }
    }

    const determineStatusColor = () => {
        switch (agent.status) {
            case 'ERROR':
                return '#FF0505';
            case 'STOPPED':
                return '#ff5455';
            case 'COMPLETE':
                return '#9B9B9B';
            case 'INITIATED':
                return '#FFDD00';
            case 'RUNNING':
                return '#FFDD00';
            case 'REQ_INPUT':
                return '#FFDD00';
            default:
                return '#FFDD00';
        }
    };

    const getRepoName = () => {
        const url_components = agent.repo.split('/');
        return url_components[url_components.length - 1];
    }

    const onClick = () => {
        setSelectedAgentId(agent.agent_id);
        onClose();
    }
    return (
        <Box
            display="flex"
            alignItems="center"
            py={2}
            px={4}
            onClick={onClick}
            cursor="pointer"
            _hover={{
                bg: '#FFF199',
                '.repoName': {
                    color: '#C9AE00',
                },
            }}
            borderRadius={4}
        >
            <VStack align="start" spacing={1}>
                <Text 
                    className='repoName' 
                    isTruncated 
                    w="220px" 
                    fontSize='14px' 
                    fontWeight='medium'
                >
                    {getRepoName()}
                </Text>
                <Text fontSize='16px' noOfLines={2} textColor={'#000000'}>{agent.objective_name}</Text>
            </VStack>
            <Spacer />
            <Box display="flex" alignItems="center" justifyContent="center" pl='5px' h='100%'>
                {getStatusIcon()}
            </Box>
        </Box>
    );
}
