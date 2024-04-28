import { Box, Card, useColorMode, useStyleConfig, Text, HStack, Flex, Link, Icon, useToast, AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, Tooltip } from '@chakra-ui/react';
import { DuckieAllStates, DuckieStateJson } from '../../../props/DuckieAgentProps';
import { FiGithub } from 'react-icons/fi';
import { AiOutlineRight, AiOutlineApartment } from 'react-icons/ai';
import { TiThListOutline } from 'react-icons/ti';
import { BsFileEarmarkCode, BsFillTrashFill } from 'react-icons/bs';
import { GoTasklist } from 'react-icons/go';
import { BiGitPullRequest, BiUndo } from 'react-icons/bi';
import { useDeleteAgent } from '../../../services/Ducklings/DeleteDuckling';
import { useState, useRef } from 'react';
import { FaStop } from 'react-icons/fa';
import { useStopAgent } from '../../../services/Ducklings/StopDuckling';
import { DisabledBox } from '../../CustomComponents/DisabledBox';
import { useRestoreAgent } from '../../../services/Ducklings/RestoreDuckling';
import Cookies from 'js-cookie';


type AgentProgressTrackerProps = {
    agent: DuckieStateJson;
    isOpen: boolean;
    setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
};

export function AgentProgressTracker(props: AgentProgressTrackerProps) {
    const { error, deleteStatus, deleteAgent } = useDeleteAgent({ agentId: props.agent.agent_id });
    const toast = useToast();

    const isActive = (stage: string) => {
        const agentStage = props.agent.stage;
        switch (stage) {
            case 'create_agent':
                return true;
            case 'context':
                return ['COMPLETE', 'CONTEXT_SET', 'OBJECTIVE_CLARIFICATION', 'PLANNING', 'RUNNING_TASKS'].includes(agentStage) ? true : false;
            case 'objective':
                return ['COMPLETE', 'OBJECTIVE_CLARIFICATION', 'PLANNING', 'RUNNING_TASKS'].includes(agentStage) ? true : false;
            case 'design':
                return ['COMPLETE', 'PLANNING', 'RUNNING_TASKS'].includes(agentStage) ? true : false;
            case 'tasks':
                return ['COMPLETE', 'RUNNING_TASKS'].includes(agentStage) ? true : false;
            case 'pr':
                return ['COMPLETE'].includes(agentStage) ? true : false;
            default:
                return true;
        }
    }

    const getColor = (stage: string) => {
        switch (stage) {
            case 'create_agent':
                return '#FFFFFF';
            case 'context':
                return isActive(stage) ? '#FFFFFF' : '#606060';
            case 'objective':
                return isActive(stage) ? '#FFFFFF' : '#606060';
            case 'design':
                return isActive(stage) ? '#FFFFFF' : '#606060';
            case 'tasks':
                return isActive(stage) ? '#FFFFFF' : '#606060';
            case 'pr':
                return isActive(stage) ? '#FFFFFF' : '#606060';
            default:
                return '#FFFFFF';
        }
    }
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const cancelDeleteRef = useRef<HTMLButtonElement>(null);

    const onOpenDeleteDialog = () => {
        setIsDeleteDialogOpen(true);
    };

    const onCloseDeleteDialog = () => {
        setIsDeleteDialogOpen(false);
    };

    const onDeleteAgent = async () => {
        await handleDeleteAgent();
        onCloseDeleteDialog();
    };

    const [isDeleting, setIsDeleting] = useState(false);
    const handleDeleteAgent = async () => {
        setIsDeleting(true);
        if (props.agent.agent_id === 'new') {
            props.setDuckieAgents((prevState) => {
                delete prevState['new'];
                return { ...prevState };
            });
            return;
        }

        await deleteAgent();
        setIsDeleting(false);
    }

    const { response: stopAgentResponse, stopAgent } = useStopAgent();
    const [isStopping, setIsStopping] = useState(false);
    const handleStopAgent = async () => {
        setIsStopping(true);
        await stopAgent({ user_id: props.agent.user_id, agent_id: props.agent.agent_id });
        setIsStopping(false);
    };

    const getRestoreId = () => {
        if (props.agent.input_history.length === 0) {
            return '';
        }
        return props.agent.input_history[props.agent.input_history.length - 1]?.uid || '';
    }

    const { restoreStatus, restoreAgent } = useRestoreAgent({ agentId: props.agent.agent_id, uid: getRestoreId() });
    const [isRestoring, setIsRestoring] = useState(false);
    const handleRestoreAgent = async () => {
        if (props.agent.input_history.length > 0) {
            Cookies.set('prepopMessage_' + props.agent.agent_id, props.agent.input_history[props.agent.input_history.length - 1].text);
        }

        setIsRestoring(true);
        await restoreAgent();
        setIsRestoring(false);
    }

    return (
        <>
            <HStack>
                <Card
                    position="absolute"
                    bottom="35px"
                    left="50%"
                    transform="translateX(-50%)"
                    bg='#000000'
                    h='50px'
                    pl='15px'
                    pr='15px'
                    ml={props.isOpen ? '160px' : '28px'}
                    transition="all 0.2s ease-in-out"
                    w='auto'
                    zIndex={4}
                >
                    <Flex h="100%">
                        <Box as={Link} h='100%' href='#createAgentSection'>
                            <HStack h='100%'>
                                <Icon as={FiGithub} boxSize={4} color={getColor('create_agent')} />
                                <Text color={getColor('create_agent')} pl='3px'>Setup</Text>
                            </HStack>
                        </Box>
                        <HStack pl='12px' h='100%'>
                            <Icon as={AiOutlineRight} boxSize={4} color={getColor('context')} />
                            <Box as={Link} h='100%' href={isActive('context') ? '#contextSetSection' : '#'}>
                                <HStack h='100%'>
                                    <Icon as={BsFileEarmarkCode} boxSize={4} color={getColor('context')} />
                                    <Text color={getColor('context')} pl='3px'>Context</Text>
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack pl='12px' h='100%'>
                            <Icon as={AiOutlineRight} boxSize={4} color={getColor('objective')} />
                            <Box as={Link} h='100%' href={isActive('objective') ? '#agentObjectiveSection' : '#'}>
                                <HStack h='100%'>
                                    <Icon as={TiThListOutline} boxSize={4} color={getColor('objective')} />
                                    <Text color={getColor('objective')} pl='3px'>Objective</Text>
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack pl='12px' h='100%'>
                            <Icon as={AiOutlineRight} boxSize={4} color={getColor('design')} />
                            <Box as={Link} h='100%' href={isActive('design') ? '#engineeringDesignSection' : '#'}>
                                <HStack h='100%'>
                                    <Icon as={AiOutlineApartment} boxSize={4} color={getColor('design')} />
                                    <Text color={getColor('design')} pl='3px'>Design</Text>
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack pl='12px' h='100%'>
                            <Icon as={AiOutlineRight} boxSize={4} color={getColor('tasks')} />
                            <Box as={Link} h='100%' href={isActive('tasks') ? '#taskExecutionSection' : '#'}>
                                <HStack h='100%'>
                                    <Icon as={GoTasklist} boxSize={4} color={getColor('tasks')} />
                                    <Text color={getColor('tasks')} pl='3px'>Tasks</Text>
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack pl='12px' h='100%'>
                            <Icon as={AiOutlineRight} boxSize={4} color={getColor('pr')} />
                            <Box as={Link} h='100%' href={isActive('pr') ? props.agent.pr_url : '#'} isExternal={isActive('pr')}>
                                <HStack h='100%'>
                                    <Icon as={BiGitPullRequest} boxSize={4} color={getColor('pr')} />
                                    <Text color={getColor('pr')} pl='3px'>Review</Text>
                                </HStack>
                            </Box>
                        </HStack>
                        <HStack pl='12px' h='100%'>
                            <Text color='#FFFFFF' pl='3px' fontSize='10px'>|</Text>
                            <Tooltip label="Go back" aria-label="Go back" placement="bottom">
                                <Box h='100%'>
                                    <DisabledBox as={Link} h='100%' onClick={(handleRestoreAgent)} isDisabled={['INITIATED', 'CONTEXT_SET'].includes(props.agent.stage)}>
                                        <Icon as={BiUndo} boxSize={5} color='#FFFFFF' h='100%' />
                                    </DisabledBox>
                                </Box>
                            </Tooltip>
                            <Tooltip label="Stop Duckie" aria-label="Stop Duckie" placement="bottom">
                                <Box h='100%'>
                                    <DisabledBox as={Link} h='100%' onClick={handleStopAgent} isDisabled={props.agent.status !== 'RUNNING'}>
                                        <Icon as={FaStop} boxSize={3} color='#FFFFFF' h='100%' />
                                    </DisabledBox>
                                </Box>
                            </Tooltip>
                            <Tooltip label="Delete Duckie" aria-label="Delete Duckie" placement="bottom">
                                <Box h='100%'>
                                    <DisabledBox as={Link} h='100%' onClick={onOpenDeleteDialog} pl='1px'>
                                        <Icon as={BsFillTrashFill} boxSize={3.5} color='#FFFFFF' h='100%' />
                                    </DisabledBox>
                                </Box>
                            </Tooltip>
                        </HStack>
                    </Flex>
                </Card>
            </HStack>

            <AlertDialog
                isOpen={isDeleteDialogOpen}
                leastDestructiveRef={cancelDeleteRef}
                onClose={onCloseDeleteDialog}
                isCentered
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Delete Duckie
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            Are you sure? You can't undo this action afterwards.
                        </AlertDialogBody>

                        <AlertDialogFooter>
                            <Button ref={cancelDeleteRef} onClick={onCloseDeleteDialog}>
                                Cancel
                            </Button>
                            <Button colorScheme='red' onClick={onDeleteAgent} ml={3}>
                                Delete
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    );
}