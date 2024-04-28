import { useColorMode, useStyleConfig, Text, HStack, Avatar, Image, VStack, Spacer, Tooltip, Box, Link, useToast } from '@chakra-ui/react';
import { useAuth } from '../../../context/AuthContext';
import { redirect } from 'react-router-dom';
import { MdRestore } from 'react-icons/md';
import { DisabledBox } from '../../CustomComponents/DisabledBox';
import { useRestoreAgent } from '../../../services/Ducklings/RestoreDuckling';
import { useState } from 'react';
import { DuckieStateJson } from '../../../props/DuckieAgentProps';
import Cookies from 'js-cookie';
import ReactMarkdown from 'react-markdown';

type ChatMessageProps = {
  message: string;
  isUser: boolean;
  agent: DuckieStateJson;
  uid: string;
};

export function ChatMessage({ message, isUser, agent, uid }: ChatMessageProps) {
  const { colorMode } = useColorMode();
  const styles = useStyleConfig("ChatCard", { variant: colorMode });
  const toast = useToast();

  const { user, loading: authLoading } = useAuth();
  const userId = user?.uid || 'NA';
  if (userId === 'NA') {
    redirect('/');
  }

  const { restoreStatus, restoreAgent } = useRestoreAgent({ agentId: agent.agent_id, uid: uid });
  const [isRestoring, setIsRestoring] = useState(false);
  const handleRestoreAgent = async () => {
    setIsRestoring(true);
    Cookies.set('prepopMessage_' + agent.agent_id, message);

    await restoreAgent();
    setIsRestoring(false);

    if (restoreStatus === 'ERROR') {
      toast({
        title: 'Error',
        description: 'Failed to restore agent',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  }

  const screenName = (user as any)?.reloadUserInfo?.screenName || 'NA'
  return (
    <VStack align='start' spacing='0' pb='7px'>
      <HStack p='0' m='0' w='100%'>
        {isUser ? <Avatar name={screenName} src={user?.photoURL || ''} width='16px' height='16px' /> : <Image src='images/logo_duck.png' width='16px' height='16px' />}
        <Text fontSize='14px' fontWeight='medium'>{isUser ? screenName : 'Duckie'}</Text>
        <Spacer />
        {isUser &&
          <Tooltip label='Restore' aria-label='Restore'>
            <Box>
              <DisabledBox as={Link} onClick={handleRestoreAgent} isDisabled={isRestoring || agent.status === 'COMPLETE'}>
                <MdRestore size='16px' />
              </DisabledBox>
            </Box>
          </Tooltip>
        }
      </HStack>
      <div style={{ width: '100%', whiteSpace: 'normal', wordWrap: 'break-word', overflowY: 'auto'}}>
        {message.split('\n').map((line, index) => (
          <p key={index} style={{ marginBottom: '8px' }}>
            <ReactMarkdown children={line} />
          </p>
        ))}
      </div>
    </VStack>
  );
}