import { Card, useColorMode, useStyleConfig, Text, VStack, Button, HStack, Spacer } from '@chakra-ui/react';
import { DuckieAllStates, DuckieStateJson } from '../../../props/DuckieAgentProps';
import { useRunAgent } from '../../../services/Ducklings/RunDucklingStep';
import React, { useState } from 'react';
import { FileTree } from './FileTree';
import { AddContextFile } from './AddContextFile';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';

type ContextSetContentCardProps = {
  agent: DuckieStateJson;
  setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
}

export function ContextSetContentCard(props: ContextSetContentCardProps) {
  const { colorMode } = useColorMode();
  const styles = useStyleConfig("ContentCard", { variant: colorMode });
  const { response, runDucklingStep } = useRunAgent();

  const [isContracted, setIsContracted] = useState(props.agent.stage !== 'CONTEXT_SET');
  React.useEffect(() => {
    setIsContracted(props.agent.stage !== 'CONTEXT_SET');
  }, [props]);

  const [height, setHeight] = useState('540px');
  React.useEffect(() => {
    if (isContracted) {
      setHeight('540px');
    } else {
      setHeight('100%');
    }
  }, [isContracted]);

  const handleAccept = () => {
    runDucklingStep({
      user_id: props.agent.user_id,
      agent_id: props.agent.agent_id,
      user_message: 'done',
    });
    props.agent.status = 'RUNNING';
    props.setDuckieAgents((prev) => {
      delete prev[props.agent.agent_id];
      return {
        ...prev,
        [props.agent.agent_id]: props.agent,
      }
    });
  }

  const treeSnippetData: any = {};
  props.agent.snippets.sort((a, b) => {
    if (a.id < b.id) {
      return -1;
    } else if (a.id > b.id) {
      return 1;
    } else {
      return 0;
    }
  })
  .forEach(snippet => {
    let pathParts: string[] = [];
    if (snippet.id.includes(' (part')) {
      pathParts = snippet.id.split('/');
      const fileName = pathParts[pathParts.length - 2] + '/' + pathParts[pathParts.length - 1]
      pathParts[pathParts.length - 2] = fileName;
      pathParts.pop();
    } else {
      pathParts = snippet.id.split('/');
    }

    let currentLevel = treeSnippetData;

    pathParts.forEach((part, index) => {
      if (index === pathParts.length - 1) { // If we're at the file level
        if (!currentLevel[part]) {
          const content = snippet.content.slice(snippet.content.indexOf('\n') + 1);
          currentLevel[part] = {
            filePath: snippet.id,
            content: content
          };
        }
      } else {
        if (!currentLevel[part]) {
          currentLevel[part] = {};  // Initialize as an empty object for folders
        }
        currentLevel = currentLevel[part];
      }
    });
  });

  return (
    <Card sx={styles} maxH={height}>
      <VStack align='left' w='100%' h='100%' overflowY='auto'>
        <HStack>
          <Text fontSize='14px' color='#D9BC00' pb='5px'>Set Context</Text>
          <Spacer />
          {isContracted ? (
            <MdExpandLess size='25px' color='#A0A0A0' onClick={() => setIsContracted(false)} />
          ) : (
            <MdExpandMore size='25px' color='#A0A0A0' onClick={() => setIsContracted(true)} />
          )}
        </HStack>
        <AddContextFile agent={props.agent} />
        <FileTree data={treeSnippetData} agentId={props.agent.agent_id} />
        <HStack pt='20px'>
          <Spacer />
          <Button bgColor='#FFDC03' isDisabled={props.agent.status !== 'REQ_INPUT'} display={props.agent.stage === 'CONTEXT_SET' ? 'block' : 'none'} size='sm' onClick={handleAccept}>Accept</Button>
        </HStack>
      </VStack>
    </Card>
  );
}