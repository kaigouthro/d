import { Box, VStack, useColorMode, useStyleConfig, Text, HStack, Image, Icon, LinkBox, LinkOverlay, Tooltip, Circle, useDisclosure } from '@chakra-ui/react';
import { DuckieAllStates, DuckieStateJson } from '../../props/DuckieAgentProps';
import { SideBarItem } from './SideBarItem';
import { AiOutlineSearch } from "react-icons/ai"
import { redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEffect, useState } from 'react';
import { FindDuckieModal } from '../FindDuckie/FindDuckieModal';

type SideBarProps = {
    agents: DuckieAllStates;
    setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
    isOpen: boolean;
    selectedAgentId: string;
    setSelectedAgentId: React.Dispatch<React.SetStateAction<string>>;
};

export function SideBar({ isOpen, agents, setDuckieAgents, selectedAgentId, setSelectedAgentId }: SideBarProps) {
    const { colorMode } = useColorMode();
    const styles = useStyleConfig("SideBar", { variant: colorMode });

    const { isOpen: isSearchOpen, onOpen: onSearchOpen, onClose: onSearchClose } = useDisclosure();

    const [sortedAgents, setSortedAgents] = useState<DuckieStateJson[]>([]);
    useEffect(() => {
        const sorted = Object.values(agents).sort((a, b) => {
            const timestampA = new Date(a.timestamp).getTime();
            const timestampB = new Date(b.timestamp).getTime();
            return timestampB - timestampA;
        });
        setSortedAgents(sorted);
    }, [agents, selectedAgentId]);

    // Handle user auth
    const { user, loading: authLoading } = useAuth();
    const userId = user?.uid || 'NA';
    if (userId === 'NA') {
        redirect('/');
    }

    const onClickNewDuckie = () => {
        const generateTimestamp = (): string => {
            const date = new Date();
            date.setDate(date.getDate() + 1);
            
            // Convert to ISO string and replace 'Z' with the timezone offset
            const isoString = date.toISOString();
            const offset = new Date().getTimezoneOffset();
            const sign = offset > 0 ? '-' : '+';
            const hours = Math.abs(Math.floor(offset / 60)).toString().padStart(2, '0');
            const minutes = (Math.abs(offset) % 60).toString().padStart(2, '0');
            
            return isoString.replace('Z', `${sign}${hours}:${minutes}`);
        };
          

        const timestamp = generateTimestamp();

        const newAgent = {
            agent_id: 'new',
            all_file_paths: [],
            default_branch: '',
            input_history: [],
            objective_description: '',
            objective_name: '',
            output_history: [],
            pr_url: '',
            repo: '',
            repo_url: '',
            snippets: [],
            stage: 'create',
            status: 'REQ_INPUT',
            summary_plan: '',
            task_objects: [],
            timestamp: timestamp,
            user_id: userId,
        } as DuckieStateJson;
        agents[newAgent.agent_id] = newAgent;
        setDuckieAgents(agents);
        setSelectedAgentId(newAgent.agent_id);
    }

    const onClickFindDuckie = () => {
        onSearchOpen();
    }

    return isOpen ?
        (
            <Box
                w="321px"
                pt={4}
                transition="all 0.2s"
                h='calc(100vh - 60px)'
                sx={styles}
            >
                <VStack align='left' pt='12px' width='321px' ml='0'>
                    <Box pb='40px'>
                        <LinkBox pb='25px' onClick={onClickNewDuckie}>
                            <LinkOverlay href='#'>
                                <div className="new-duckie">
                                    <HStack pl='16px'>
                                        <Image src={'/images/grey_duck_logo.png'} alt='Duckie Logo' boxSize='24px' fill='black' />
                                        <Text fontSize='16px' pl='6px' fontWeight='semibold' color='#808080'>Start a new Duckie</Text>
                                    </HStack>
                                </div>
                            </LinkOverlay>
                        </LinkBox>
                        <LinkBox onClick={onClickFindDuckie}>
                            <LinkOverlay href='#'>
                                <HStack pl='16px'>
                                    <Icon as={AiOutlineSearch} boxSize='24px' color='#808080' />
                                    <Text fontSize='16px' pl='6px' fontWeight='semibold' color='#808080'>Find a Duckie</Text>
                                </HStack>
                            </LinkOverlay>
                        </LinkBox>
                    </Box>
                    <Text fontSize='sm' pl='16px' fontWeight='semibold' color='#808080'>Duckies</Text>
                    <div className='see-all-duckies'>
                    <Box w='321px' pl='0'>
                        {sortedAgents.map((agent) => (
                            <SideBarItem key={agent.agent_id} agent={agent} selectedAgentId={selectedAgentId} setSelectedAgentId={setSelectedAgentId} />
                        ))}
                    </Box>
                    </div>
                </VStack>

                <FindDuckieModal isOpen={isSearchOpen} onClose={onSearchClose} agents={agents} setSelectedAgentId={setSelectedAgentId} />
            </Box>
        ) : (
            <Box
                w="57px"
                p={4}
                transition="all 0.2s"
                h='calc(100vh - 60px)'
                sx={styles}
            >
                <VStack align='left' pt='12px'>
                    <LinkBox pb='12px' onClick={onClickNewDuckie}>
                        <Tooltip label="Start a new Duckie" aria-label="Start a new Duckie">
                            <LinkOverlay href='#'>
                                <HStack>
                                    <Image src={'/images/grey_duck_logo.png'} alt='Duckie Logo' boxSize='24px' fill='black' />
                                </HStack>
                            </LinkOverlay>
                        </Tooltip>
                    </LinkBox>
                    <LinkBox onClick={onClickFindDuckie} pb='40px'>
                        <Tooltip label="Find a Duckie" aria-label="Find a Duckie">
                            <LinkOverlay href='#'>
                                <HStack>
                                    <Icon as={AiOutlineSearch} boxSize='24px' color='#808080' />
                                </HStack>
                            </LinkOverlay>
                        </Tooltip>
                    </LinkBox>
                </VStack>

                <FindDuckieModal isOpen={isSearchOpen} onClose={onSearchClose} agents={agents} setSelectedAgentId={setSelectedAgentId} />
            </Box>
        );
}
