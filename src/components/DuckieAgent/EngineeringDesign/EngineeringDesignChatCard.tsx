import { ChatCard } from '../Chat/ChatCard';
import { DuckieAllStates, DuckieStateJson } from '../../../props/DuckieAgentProps';

type EngineeringDesignChatCardProps = {
  agent: DuckieStateJson;
  setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
};

export function EngineeringDesignChatCard({ agent, setDuckieAgents }: EngineeringDesignChatCardProps) {
  return (
    <ChatCard agent={agent} stage={"PLANNING"} setDuckieAgents={setDuckieAgents} />
  );
}
