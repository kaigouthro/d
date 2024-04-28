import { Box, HStack, Spacer, VStack, useColorMode, useStyleConfig } from '@chakra-ui/react';
import { CreateAgentContentCard } from './CreateAgent/CreateAgentContentCard';
import { CreateAgentChatCard } from './CreateAgent/CreateAgentChatCard';
import { DuckieAllStates, DuckieStateJson } from '../../props/DuckieAgentProps';
import { AgentObjectiveContentCard } from './AgentObjective/AgentObjectiveContentCard';
import { AgentObjectiveChatCard } from './AgentObjective/AgentObjectiveChatCard';
import { EngineeringDesignContentCard } from './EngineeringDesign/EngineeringDesignContentCard';
import { EngineeringDesignChatCard } from './EngineeringDesign/EngineeringDesignChatCard';
import { TaskExecutionContentCard } from './TaskExecution/TaskExecutionContentCard';
import { TaskExecutionChatCard } from './TaskExecution/TaskExecutionChatCard';
import { AgentProgressTracker } from './AgentProgressTracker/AgentProgressTracker';
import { FinishCreateAgentContentCard } from './CreateAgent/FinishCreateAgentContentCard';
import { ContextSetChatCard } from './ContextSet/ContextSetChatCard';
import { ContextSetContentCard } from './ContextSet/ContextSetContentCard';

type DuckieAgentProps = {
  selectedAgentId: string;
  isOpen: boolean;
  setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
  agents: DuckieAllStates;
  setSelectedAgentId: React.Dispatch<React.SetStateAction<string>>;
};

export function DuckieAgent({ selectedAgentId, setDuckieAgents, isOpen, agents, setSelectedAgentId }: DuckieAgentProps) {
  const { colorMode } = useColorMode();
  const styles = useStyleConfig("DuckieAgent", { variant: colorMode });

  const chatCardWidth = useStyleConfig("ChatCard", { variant: colorMode }).width as string;

  const createAgentSection = () => {
    return (
      <HStack align='start' pl='5vw' pr='5vw'>
        <Box w='60%'>
          <CreateAgentContentCard
            agent={agents[selectedAgentId]}
            setDuckieAgents={setDuckieAgents}
            agents={agents}
            setSelectedAgentId={setSelectedAgentId}
          />
        </Box>
        <Spacer />
        <Box w='35%'>
        </Box>
        {/* <CreateAgentChatCard agent={agents[selectedAgentId]} setDuckieAgents={setDuckieAgents} /> */}
      </HStack>
    )
  };

  const finishCreateAgentSection = () => {
    return (
      <HStack align='start' pl='5vw' pr='5vw'>
        <Box w='60%'>
          <FinishCreateAgentContentCard agent={agents[selectedAgentId]} />
        </Box>
        <Spacer />
        <Box w='35%'>
        </Box>
        {/* <CreateAgentChatCard agent={agents[selectedAgentId]} setDuckieAgents={setDuckieAgents} /> */}
      </HStack>
    )
  };

  const contextSetSection = () => {
    return ['COMPLETE', 'CONTEXT_SET', 'OBJECTIVE_CLARIFICATION', 'PLANNING', 'RUNNING_TASKS'].includes(agents[selectedAgentId].stage) ? (
      <>
        <Box h='12vh' />
        <HStack align='start' pl='5vw' pr='5vw'>
          <Box w='60%'>
            <ContextSetContentCard agent={agents[selectedAgentId]} setDuckieAgents={setDuckieAgents} />
          </Box>
          <Spacer />
          <Box w='35%'>
            <ContextSetChatCard agent={agents[selectedAgentId]} setDuckieAgents={setDuckieAgents} />
          </Box>
        </HStack>
      </>
    ) : (<></>)
  }

  const agentObjectiveSection = () => {
    return ['COMPLETE', 'OBJECTIVE_CLARIFICATION', 'PLANNING', 'RUNNING_TASKS'].includes(agents[selectedAgentId].stage) ? (
      <>
        <Box h='12vh' />
        <HStack align='start' pl='5vw' pr='5vw'>
          <Box w='60%'>
            <AgentObjectiveContentCard agent={agents[selectedAgentId]} setDuckieAgents={setDuckieAgents} />
          </Box>
          <Spacer />
          <Box w='35%'>
            <AgentObjectiveChatCard agent={agents[selectedAgentId]} setDuckieAgents={setDuckieAgents} />
          </Box>
        </HStack>
      </>
    ) : (<></>)
  };

  const engineeringDesignSection = () => {
    return ['COMPLETE', 'PLANNING', 'RUNNING_TASKS'].includes(agents[selectedAgentId].stage) ? (
      <>
        <Box h='12vh' />
        <HStack align='start' pl='5vw' pr='5vw'>
          <Box w='60%'>
            <EngineeringDesignContentCard agent={agents[selectedAgentId]} setDuckieAgents={setDuckieAgents} />
          </Box>
          <Spacer />
          <Box w='35%'>
            <EngineeringDesignChatCard agent={agents[selectedAgentId]} setDuckieAgents={setDuckieAgents} />
          </Box>
        </HStack>
      </>
    ) : (<></>)
  };

  const taskExecutionSection = () => {
    return ['COMPLETE', 'RUNNING_TASKS'].includes(agents[selectedAgentId].stage) ? (
      <>
        <Box h='12vh' />
        <HStack align='start' pl='5vw' pr='5vw'>
          <Box w='60%'>
            <TaskExecutionContentCard agent={agents[selectedAgentId]} setDuckieAgents={setDuckieAgents} />
          </Box>
          <Spacer />
          <Box w='35%'>
            <TaskExecutionChatCard agent={agents[selectedAgentId]} setDuckieAgents={setDuckieAgents} />
          </Box>
        </HStack>
      </>
    ) : (<></>)
  };

  return agents[selectedAgentId] !== undefined ? (
    <>
      <Box flex="1" p={4} w='100%' h='calc(100vh - 60px)' overflow={'auto'} sx={styles} scrollBehavior={'smooth'} className="overlay-scrollbar">
        {agents[selectedAgentId] !== undefined ? (<>
          <VStack w='100%'>
            <Box id="createAgentSection" w='100%'>
              <Box h='5vh' />
              {agents[selectedAgentId].stage === 'create' ? (
                <>{createAgentSection()}</>)
                :
                (<>{finishCreateAgentSection()}</>)}
            </Box>
            <Box id="contextSetSection" w='100%'>
              {contextSetSection()}
            </Box>
            <Box id="agentObjectiveSection" w='100%'>
              {agentObjectiveSection()}
            </Box>
            <Box id="engineeringDesignSection" w='100%'>
              {engineeringDesignSection()}
            </Box>
            <Box id="taskExecutionSection" w='100%'>
              {taskExecutionSection()}
            </Box>
          </VStack>
          <Box h='95px' />
          <AgentProgressTracker agent={agents[selectedAgentId]} isOpen={isOpen} setDuckieAgents={setDuckieAgents} />
        </>) : (<></>)}
      </Box>
    </>
  ) :
    <Box flex="1" p={4} w='max' h='calc(100vh - 60px)' sx={styles}>
    </Box>;
}