import { ChatCard } from '../Chat/ChatCard';
import { DuckieAllStates, DuckieStateJson } from '../../../props/DuckieAgentProps';

type AgentObjectiveChatCardProps = {
  agent: DuckieStateJson;
  setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
};

export function AgentObjectiveChatCard({ agent, setDuckieAgents }: AgentObjectiveChatCardProps) {
  return (
    <ChatCard agent={agent} stage={"OBJECTIVE_CLARIFICATION"} setDuckieAgents={setDuckieAgents} />
  );
}
