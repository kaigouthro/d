import { useColorMode, useStyleConfig, HStack, Box, Card, Icon, VStack, Text } from '@chakra-ui/react';
import { BiGitRepoForked } from 'react-icons/bi';
import { DuckieStateJson } from '../../../props/DuckieAgentProps';

type FinishCreateAgentContentCardProps = {
  agent: DuckieStateJson;
};

export function FinishCreateAgentContentCard({ agent }: FinishCreateAgentContentCardProps) {
  const { colorMode } = useColorMode();
  const styles = useStyleConfig("ContentCard", { variant: colorMode });
  
  const getRepoName = () => {
    const url_components = agent.repo.split('/');
    return url_components[url_components.length - 1];
  }
  
  return (
    <Card sx={styles}>
      <VStack align='left' h='100%'>
        <HStack>
          <Text fontSize='14px' color='#D9BC00'>Create Duckie</Text>
        </HStack>
        <HStack>
          <Icon as={BiGitRepoForked} color='#000000' />
          <Text fontSize='16px'>{getRepoName()}</Text>
        </HStack>
        <Box>
          <Text fontSize='24px'>{agent.objective_name}</Text>
        </Box>
      </VStack>
    </Card>
  );
}
