import { Box, Card, useColorMode, useStyleConfig, Text, VStack, Button, HStack, Spacer, Textarea, Flex, Tooltip } from '@chakra-ui/react';
import { DuckieAllStates, DuckieStateJson } from '../../../props/DuckieAgentProps';
import ReactMarkdown from 'react-markdown';
import { useRunAgent } from '../../../services/Ducklings/RunDucklingStep';
import { useEffect, useState } from 'react';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import React from 'react';
import { useUpdateAgentDesign } from '../../../services/Ducklings/UpdateAgentDesign';
import { CheckIcon, NotAllowedIcon, EditIcon } from '@chakra-ui/icons';
import TextareaAutosize from 'react-textarea-autosize';

type EngineeringDesignContentCardProps = {
  agent: DuckieStateJson;
  setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
}

export function EngineeringDesignContentCard(props: EngineeringDesignContentCardProps) {
  const { colorMode } = useColorMode();
  const styles = useStyleConfig("ContentCard", { variant: colorMode });
  const { response, runDucklingStep } = useRunAgent();
  const { updateStatus, error, updateAgentDesign } = useUpdateAgentDesign();

  const [isContracted, setIsContracted] = useState(props.agent.stage === 'PLANNING');
  React.useEffect(() => {
    setIsContracted(props.agent.stage !== 'PLANNING');
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

  const [editing, setEditing] = useState(false);
  const [engDesign, setEngDesign] = useState(props.agent.summary_plan || '');
  useEffect(() => {
    setEngDesign(props.agent.summary_plan || '');
  }, [props]);

  const getEngineeringDesign = () => {
    if (editing) {
      return (
        <Box h={height}>
          <Textarea
            value={engDesign}
            onChange={(e) => {
              setEngDesign(e.target.value);
            }}
            h={'lg'}
            ml='-20px'
            w='calc(100% + 20px)'
            as={TextareaAutosize}
            maxRows={20}
          />
          <div>
            {engDesign.split('\n').map((line, index) => (
              <p key={index} style={{ marginBottom: '8px' }}>
                <ReactMarkdown className='duckie-markdown' children={line} />
              </p>
            ))}
          </div>
        </Box>
      )
    } else {
      return (
        <div>
          {engDesign.split('\n').map((line, index) => (
            <p key={index} style={{ marginBottom: '8px' }}>
              <ReactMarkdown className='duckie-markdown' children={line} />
            </p>
          ))}
        </div>
      );
    }
  };

  const handleSaveEdit = () => {
    updateAgentDesign({
      agentId: props.agent.agent_id,
      engDesign: engDesign,
    });
  }

  React.useEffect(() => {
    if (updateStatus === 'SUCCESS') {
      props.agent.summary_plan = engDesign;
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
    setEngDesign(props.agent.summary_plan || '');
    setEditing(false);
  }

  const [saveEditButtons, setSaveEditButtons] = useState(<></>);
  React.useEffect(() => {
    const showButtons = editing;
    if (showButtons) {
      setSaveEditButtons(
        <Flex justify="center" align="center" pl="10px" h="15px">
          <HStack>
            {/* <Text fontSize="15px" color="gray.600">Editing:</Text> */}
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
  }, [engDesign, props, editing]);

  return (
    <Card sx={styles} maxH={height}>
      <VStack align='left' overflow='auto' className='overlay-scrollbar'>
        <HStack>
          <Text fontSize='14px' color='#D9BC00'>Engineering Design</Text>
          {saveEditButtons}
          <Spacer />
          {isContracted ? (
            <MdExpandLess size='25px' color='#A0A0A0' onClick={() => setIsContracted(false)} />
          ) : (
            <MdExpandMore size='25px' color='#A0A0A0' onClick={() => setIsContracted(true)} />
          )}
        </HStack>
        <Box pl='25px' pt='10px' overflow='auto' h='100%' className='overlay-scrollbar'>
          {getEngineeringDesign()}
        </Box>
      </VStack>
      <HStack pt='10px'>
        <Spacer />
        <Button bgColor='#FFDC03' isDisabled={props.agent.status !== 'REQ_INPUT'} display={props.agent.stage === 'PLANNING' ? 'block' : 'none'} size='sm' onClick={handleAccept}>Accept</Button>
      </HStack>
    </Card>
  );
}
