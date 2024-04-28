import React, { useState } from 'react';
import { Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, Box, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FindDuckieItem } from './FindDuckieItem';
import { DuckieAllStates, DuckieStateJson } from '../../props/DuckieAgentProps';
import { Search2Icon } from '@chakra-ui/icons';

type FindDuckieModalProps = {
    isOpen: boolean;
    onClose: () => void;
    agents: DuckieAllStates;
    setSelectedAgentId: React.Dispatch<React.SetStateAction<string>>;
};

export const FindDuckieModal: React.FC<any> = ({ isOpen, onClose, agents, setSelectedAgentId }: FindDuckieModalProps) => {
    const [inputValue, setInputValue] = useState<string>('');

    const filteredAgents = Object.values(agents).filter(
        (agent: DuckieStateJson) =>
            agent.objective_name.toLowerCase().includes(inputValue.toLowerCase() ?? '')
    ).sort((a, b) => {
        const timestampA = new Date(a.timestamp).getTime();
        const timestampB = new Date(b.timestamp).getTime();
        return timestampB - timestampA;
    }
    );

    return (
        <Modal isOpen={isOpen} onClose={onClose} size='2xl'>
            <ModalOverlay />
            <ModalContent>
                <ModalBody mb='15px'>
                    <Box mb='20px' mt='15px'>
                        <InputGroup size='lg'>
                            <InputLeftElement pointerEvents='none'>
                                <Search2Icon color='gray.300' />
                            </InputLeftElement>
                            <Input
                                placeholder='Find a Duckie...'
                                onChange={(e) => setInputValue(e.target.value)}
                                value={inputValue}
                                bg='#FFFDF2'
                            />
                        </InputGroup>
                    </Box>
                    {filteredAgents.map((agent: DuckieStateJson) => (
                        <FindDuckieItem agent={agent} setSelectedAgentId={setSelectedAgentId} onClose={onClose} />
                    ))}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};
