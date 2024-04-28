import { Box, Card, useColorMode, useStyleConfig, HStack, Spacer, Icon, Spinner } from '@chakra-ui/react';
import { DuckieStateJson, ChatMessageProps, DuckieAllStates } from '../../../props/DuckieAgentProps';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { useState } from 'react';
import { MdExpandMore, MdExpandLess } from 'react-icons/md';
import { BsFillCircleFill } from 'react-icons/bs';
import { useRef, useEffect } from 'react';

type ChatCardProps = {
    agent: DuckieStateJson;
    stage: string;
    setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
}

export function ChatCard(props: ChatCardProps) {
    const { colorMode } = useColorMode();
    const styles = useStyleConfig("ChatCard", { variant: colorMode });
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);

    const [isContracted, setIsContracted] = useState(true);

    const isThisStage = (messageStage: string) => {
        return props.stage === messageStage;
    }

    const allMessages = props.agent.output_history.concat(props.agent.input_history).filter((message: ChatMessageProps) => {
        return isThisStage(message.stage);
    });

    const sortedMessages = allMessages.sort((a: ChatMessageProps, b: ChatMessageProps) => {
        const timeDifference = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();

        if (timeDifference === 0) {
            return a.sender !== 'musa' ? -1 : 1;
        }

        return timeDifference;
    });


    const chatMessages = sortedMessages.map((message: ChatMessageProps) => {
        return (
            <ChatMessage message={message.text} isUser={message.sender !== 'musa'} agent={props.agent} uid={message.uid} />
        );
    });

    useEffect(() => {
        if (messagesContainerRef.current) {
            messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
        }
    }, [chatMessages]);

    const getHeight = () => {
        if (isContracted) {
            return '540px'
        } else {
            return '100%'
        }
    }

    const showChatInput = () => {
        return !['create', 'CONTEXT_SET', 'INITIATED'].includes(props.stage);
    }

    const getChatCardIcon = () => {
        if (!isThisStage(props.agent.stage)) {
            return <></>;
        } else if (props.agent.status === 'REQ_INPUT') {
            return <Icon as={BsFillCircleFill} boxSize={4} color={'#FFDD00'} />;
        } else if (props.agent.status === 'RUNNING') {
            return <Spinner boxSize='6' speed='1s' color={'#FFDD00'} />;
        } else {
            return <></>;
        }
    }

    return (
        <>
            <Card sx={{ ...styles, pt: 0 }} maxH={getHeight()} >
                <HStack style={{ display: 'flex', alignItems: 'center' }} minH='40px'>
                    {getChatCardIcon()}
                    <Spacer />
                    {isContracted ? (
                        <MdExpandLess size='25px' color='#A0A0A0' onClick={() => setIsContracted(false)} />
                    ) : (
                        <MdExpandMore size='25px' color='#A0A0A0' onClick={() => setIsContracted(true)} />
                    )}

                </HStack>
                <Box overflow='auto' className="overlay-scrollbar" ref={messagesContainerRef}>
                    {chatMessages}
                </Box>
                <Box>
                    {showChatInput() &&
                        <Box pt='10px'>
                            <ChatInput agent={props.agent} stage={props.stage} setDuckieAgents={props.setDuckieAgents} />
                            <div ref={messagesEndRef}></div>
                        </Box>}
                </Box>
            </Card>
        </>
    );
}
