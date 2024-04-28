import { Card, Textarea, Icon, Box, Link } from '@chakra-ui/react';
import { DuckieAllStates, DuckieStateJson } from '../../../props/DuckieAgentProps';
import { FaArrowAltCircleUp } from 'react-icons/fa';
import React from 'react';
import { useRunAgent } from '../../../services/Ducklings/RunDucklingStep';
import TextareaAutosize from 'react-textarea-autosize';
import Cookies from 'js-cookie';

type ChatInputProps = {
    agent: DuckieStateJson;
    stage: string;
    setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
};

export function ChatInput({ agent, stage, setDuckieAgents }: ChatInputProps) {
    const { response, runDucklingStep } = useRunAgent();

    const prepopMessage = Cookies.get('prepopMessage_' + agent.agent_id);

    const [message, setMessage] = React.useState('');
    if (prepopMessage) {
        setMessage(prepopMessage);
        Cookies.remove('prepopMessage_' + agent.agent_id);
    }

    const sendMessage = () => {
        runDucklingStep({
            user_id: agent.user_id,
            agent_id: agent.agent_id,
            user_message: message,
        });
        agent.status = 'RUNNING';
        setDuckieAgents((prev) => {
            delete prev[agent.agent_id];
            return {
                ...prev,
                [agent.agent_id]: agent,
            }
        });
        setMessage('');
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
            sendMessage();
        }
    }

    const isThisStage = () => {
        return stage === agent.stage;
    }

    const enabled = () => {
        return isThisStage() && agent.status === 'REQ_INPUT';
    }

    return (
        <Card bg='#FFFDF2' border='0px solid #D9D9D9' position="relative">
            <Textarea placeholder='Reply...' onKeyDown={handleKeyDown}
                as={TextareaAutosize}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={!enabled()}
                fontSize='14px'
                minH='60px'
                maxH='280px'
            />
            <Box
                position="absolute"
                right="10px"
                bottom="5px"
                zIndex={2}
            >
                <Link onClick={sendMessage} display={enabled() && message !== '' ? 'block' : 'none'}>
                    <Icon as={FaArrowAltCircleUp} color='#FFDD00' w='20px' h='20px' />
                </Link>
            </Box>
        </Card>
    );
}