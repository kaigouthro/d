import { Card, useColorMode, useStyleConfig, Text, VStack, HStack, Icon, Select, Box, Editable, EditableInput, EditablePreview, EditableTextarea, Spacer, Button, Tooltip, Link, useToast, Checkbox, Radio, RadioGroup, Stack, Switch, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { BiPlusCircle } from 'react-icons/bi';
import { useRepoDetails } from '../../../services/GitHub/FetchAllUserRepos';
import { DuckieAllStates, DuckieStateJson } from '../../../props/DuckieAgentProps';
import { useCreateAgent } from '../../../services/Ducklings/CreateDuckling';
import React from 'react';
import { useRunAgent } from '../../../services/Ducklings/RunDucklingStep';
import { InfoOutlineIcon } from '@chakra-ui/icons';

type CreateAgentContentCardProps = {
  agent: DuckieStateJson;
  agents: DuckieAllStates;
  setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
  setSelectedAgentId: React.Dispatch<React.SetStateAction<string>>;
};

export function CreateAgentContentCard({ agent, setDuckieAgents, agents, setSelectedAgentId }: CreateAgentContentCardProps) {
  const { colorMode } = useColorMode();
  const styles = useStyleConfig("ContentCard", { variant: colorMode });

  const [isCollab, setIsCollab] = useState<boolean>(true);
  const handleToggleCollab = () => {
    setIsCollab(!isCollab);
  };

  const { isLoading, setIsLoading, fetchAllUserInstallations, repoInstallations } = useRepoDetails();
  useEffect(() => {
    fetchAllUserInstallations();
  }, []);


  const { runDucklingStep } = useRunAgent();

  const [repo, setRepo] = useState(agent.repo);
  const isRepoSelected = () => { return repo !== ''; }

  const handleRepoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    agent.repo = e.target.value;
    agent.repo_url = 'https://github.com/' + e.target.value;
    setDuckieAgents((prevState) => ({
      ...prevState,
      [agent.agent_id]: agent,
    }));
    setRepo(e.target.value);
  };

  const toast = useToast();

  useEffect(() => {
    if (!isLoading && Object.keys(repoInstallations).length === 0) {
      toast({
        title: 'No repo installations found',
        description: 'Please install the Duckie app on your repo by clicking the + icon',
        status: 'info',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    }
  }, [repoInstallations, isLoading]);

  const [objectiveName, setObjectiveName] = useState(agent.objective_name);
  const isObjectiveNameSelected = () => { return objectiveName !== ''; }

  const handleObjectiveChange = (nextValue: string) => {
    agent.objective_name = nextValue;
    setDuckieAgents((prevState) => ({
      ...prevState,
      [agent.agent_id]: agent,
    }));
    setObjectiveName(nextValue);
  };

  const [objectiveDescription, setObjectiveDescription] = useState(agent.objective_description);
  const isObjectiveDescriptionSelected = () => { return objectiveDescription !== ''; }
  const handleObjectiveDescriptionChange = (nextValue: string) => {
    agent.objective_description = nextValue;
    setDuckieAgents((prevState) => ({
      ...prevState,
      [agent.agent_id]: agent,
    }));
    setObjectiveDescription(nextValue);
  };

  const { response, createAgent } = useCreateAgent();
  const handleAccept = () => {
    const formData = {
      user_id: agent.user_id,
      repo_url: agent.repo_url,
      installation_id: repoInstallations[agent.repo],
      objective_name: agent.objective_name,
      objective_description: agent.objective_description,
      auto_run: {
        code_search: !isCollab,
        objective: !isCollab,
        planning: !isCollab,
        task: !isCollab,
      },
    } as AgentFormData;
    createAgent(formData);
    setDuckieAgents((prev) => {
      delete prev['new'];
      return {
        ...prev,
        ['new']: agent,
      }
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<any>) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      handleAccept();
    }
  }

  // Loading state until response is received
  React.useEffect(() => {
    if (response?.success === true) {
      const new_agent_id = response.data.agentId;
      setIsLoading(false);
      setDuckieAgents((prev) => {
        delete prev['new'];
        return {
          ...prev
        }
      });
      runDucklingStep({
        user_id: agent.user_id,
        agent_id: new_agent_id,
        user_message: '',
      });
      setSelectedAgentId(new_agent_id);
    }
  }, [response]);

  interface AgentFormData {
    user_id: string;
    repo_url: string;
    installation_id: string;
    objective_name: string;
    objective_description?: string;
    auto_run?: {
      code_search?: boolean;
      objective?: boolean;
      planning?: boolean;
      task?: boolean;
    };
    user_files?: string[] | null; // Adjust as per your needs for file handling
  }

  // if loading, show loading
  if (isLoading) {
    return (
      <Card sx={styles}>
        <VStack align='left'>
          <Text fontSize='14px' color='#D9BC00'>Create Duckie</Text>
          <HStack>
            <Tooltip label='Install the Duckie app on your repo' aria-label='Install the Duckie app on your repo'>
              <Box
                borderRadius="50%"
                bg="#FFDD00"
                display="flex"
                alignItems="center"
                justifyContent="center"
                p={1}
              >
                <Icon as={BiPlusCircle} boxSize={5} color={'#6c6c6c'} m={-1.5} />
              </Box>
            </Tooltip>
          </HStack>
        </VStack>
      </Card>
    );
  }

  return (
    // <Card sx={styles}>
    <Card w='100%' padding='4'>
      <VStack align='left' w='100%'>
        <HStack>
          <Text fontSize='14px' color='#D9BC00'>Create Duckie</Text>
          <Spacer />
          <HStack w='150px' h='20px' onClick={handleToggleCollab} spacing={0} borderRadius='5px' cursor='pointer' alignItems='center'>
            <Tooltip label=" Collaborative mode lets your work with the Duckie agent throughout the development process." aria-label='Collaborative mode'>
              <Box w='75px' h='100%' bg={!isCollab ? 'transparent' : '#FFDC03'} display="flex" justifyContent="center" alignItems="center"
                borderWidth={'1px'} borderLeftRadius={'5px'} borderColor={'#FFDC03'}>
                <Text fontSize='12px' fontWeight={isCollab ? 'bold' : 'normal'} color='#6f6f6f'>Collab</Text>
              </Box>
            </Tooltip>
            <Tooltip label="Autonomous mode lets the Duckie run the entire task on it's own." aria-label='Auto mode'>
              <Box w='75px' h='100%' bg={isCollab ? 'transparent' : '#FFDC03'} display="flex" justifyContent="center" alignItems="center"
                borderWidth={'1px'} borderRightRadius={'5px'} borderColor={'#FFDC03'}>
                <Text fontSize='12px' fontWeight={!isCollab ? 'bold' : 'normal'} color='#6f6f6f'>Auto</Text>
              </Box>
            </Tooltip>
          </HStack>
        </HStack>
        <HStack>
          <Tooltip label='Install the Duckie app on your repo' aria-label='Install the Duckie app on your repo'>
            <Box
              borderRadius="50%"
              bg="#FFDD00"
              display="flex"
              alignItems="center"
              justifyContent="center"
              p={1}
              as={Link}
              href='https://github.com/apps/duckie-ai-helper' isExternal
            >
              <Icon as={BiPlusCircle} boxSize={5} color={'#6c6c6c'} m={-1.5} />
            </Box>
          </Tooltip>
          <Select placeholder='Select Repo' fontSize='sm' required value={repo} onChange={handleRepoChange} border='0px' iconSize='0' color={isRepoSelected() ? '#000000' : '#B2B2B2'}>
            {
              Object.keys(repoInstallations).map((repo: string) => (
                <option key={repo} value={repo}>{repo}</option>
              ))
            }
          </Select>
        </HStack>
        <Box>
          <Editable
            placeholder='Your objective statement'
            value={objectiveName}
            onChange={handleObjectiveChange}
            onKeyDown={handleKeyDown}
          >
            <EditablePreview color={isObjectiveNameSelected() ? '#000000' : '#B2B2B2'} fontSize='28px' />
            <EditableInput fontSize='28px' paddingLeft='10px' />
          </Editable>
        </Box>
        <Box>
          <Editable
            placeholder='Your objective description'
            value={objectiveDescription}
            onChange={handleObjectiveDescriptionChange}
            onKeyDown={handleKeyDown}
          >
            <EditablePreview color={isObjectiveDescriptionSelected() ? '#000000' : '#B2B2B2'} fontSize='16px' />
            <EditableTextarea fontSize='16px' paddingLeft='10px' border='0px' />
          </Editable>
        </Box>
        <HStack>
          <Spacer />
          <Button bgColor='#FFDC03' size='sm' display={!isRepoSelected() || !isObjectiveNameSelected() || agent.status === 'RUNNING' ? 'none' : 'block'} onClick={handleAccept}>Create Duckie</Button>
        </HStack>
      </VStack>
    </Card>
  );
}
