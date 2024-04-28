import { Box, Card, useColorMode, useStyleConfig, Text, VStack, Button, HStack, Spacer, Textarea, Flex, Tooltip } from '@chakra-ui/react';
import { DuckieAllStates, DuckieStateJson } from '../../../props/DuckieAgentProps';
import ReactMarkdown from 'react-markdown';
import { useRunAgent } from '../../../services/Ducklings/RunDucklingStep';
import React, { useEffect, useRef, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { useUpdateAgentObjective } from '../../../services/Ducklings/UpdateAgentObjective';
import TextareaAutosize from 'react-textarea-autosize';
import { CheckIcon, NotAllowedIcon, EditIcon } from '@chakra-ui/icons';


type AgentObjectiveContentCardProps = {
  agent: DuckieStateJson;
  setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
}

export function AgentObjectiveContentCard(props: AgentObjectiveContentCardProps) {
  const { colorMode } = useColorMode();
  const styles = useStyleConfig("ContentCard", { variant: colorMode });
  const { response, runDucklingStep } = useRunAgent();
  const { updateStatus, error, updateAgentObjective } = useUpdateAgentObjective();

  const [isContracted, setIsContracted] = useState(props.agent.stage === 'OBJECTIVE_CLARIFICATION');
  React.useEffect(() => {
    setIsContracted(props.agent.stage !== 'OBJECTIVE_CLARIFICATION');
  }, [props]);

  const [height, setHeight] = useState('540px');
  React.useEffect(() => {
    if (isContracted) {
      setHeight('540px');
    } else {
      setHeight('100%');
    }
  }, [isContracted]);

  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(props.agent.objective_description || '');
  useEffect(() => {
    setDescription(props.agent.objective_description || '');
  }, [props]);

  const getObjectiveDescription = () => {
    if (editing) {
      return (
        <Box h={height}>
          <Textarea
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
            }}
            as={TextareaAutosize}
            maxRows={20}
            ml='-20px'
            w='calc(100% + 20px)'
          />
          {description.split('\n').map((line, index) => (
            <p key={index} style={{ marginBottom: '8px' }}>
              <ReactMarkdown className='duckie-markdown' children={line} />
            </p>
          ))}
        </Box>
      )
    } else {
      return (
        <div>
          {description.split('\n').map((line, index) => (
            <p key={index} style={{ marginBottom: '8px' }}>
              <ReactMarkdown className='duckie-markdown' children={line} />
            </p>
          ))}
        </div>
      );
    }
  };

  const handleAccept = () => {
    runDucklingStep({
      user_id: props.agent.user_id,
      agent_id: props.agent.agent_id,
      user_message: 'confirm',
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

  const handleSaveEdit = () => {
    updateAgentObjective({
      agentId: props.agent.agent_id,
      objectiveDescription: description,
    });
    setEditing(false);
  }

  React.useEffect(() => {
    if (updateStatus === 'SUCCESS') {
      props.agent.objective_description = description;
      props.setDuckieAgents((prev) => {
        delete prev[props.agent.agent_id];
        return {
          ...prev,
          [props.agent.agent_id]: props.agent,
        }
      });
    }
  }, [updateStatus]);

  const handleUndoEdit = () => {
    setDescription(props.agent.objective_description);
    setEditing(false);
  }

  const [saveEditButtons, setSaveEditButtons] = useState(<></>);
  React.useEffect(() => {
    const showButtons = editing;
    if (showButtons) {
      setSaveEditButtons(
        <Flex justify="center" align="center" pl="10px" h="15px">
          <HStack>
            <Tooltip label="Save Changes" aria-label="Save Changes">
              <CheckIcon color="#FFDC03" onClick={handleSaveEdit} />
            </Tooltip>
            <Tooltip label="Cancel" aria-label="Cancel">
              <NotAllowedIcon color="gray.500" onClick={handleUndoEdit} />
            </Tooltip>
          </HStack>
        </Flex>
      );
    } else {
      setSaveEditButtons(
        <Flex justify="center" align="center" h="full">
          <Box pl="10px">
            <EditIcon color="#A0A0A0" onClick={() => {
              setEditing(!editing)
              setIsContracted(false);
            }} />
          </Box>
        </Flex>
      );
    }
  }, [description, props, editing]);

  return (
    <Card sx={styles} maxH={height}>
      <VStack align='left' h='100%' overflow={'auto'} className='overlay-scrollbar'>
        <HStack>
          <Text fontSize='14px' color='#D9BC00'>Requirements</Text>
          {saveEditButtons}
          <Spacer />
          {isContracted ? (
            <MdExpandLess size='25px' color='#A0A0A0' onClick={() => setIsContracted(false)} />
          ) : (
            <MdExpandMore size='25px' color='#A0A0A0' onClick={() => setIsContracted(true)} />
          )}
        </HStack>
        <Box pl='26px' overflow={'auto'} className='overlay-scrollbar'>
          {getObjectiveDescription()}
        </Box>
      </VStack>
      <HStack pt='10px'>
        <Spacer />
        <Button bgColor='#FFDC03' isDisabled={props.agent.status !== 'REQ_INPUT'} display={props.agent.stage === 'OBJECTIVE_CLARIFICATION' ? 'block' : 'none'} size='sm' onClick={handleAccept}>Accept</Button>
      </HStack>
    </Card>
  );
}
