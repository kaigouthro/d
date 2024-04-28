import { ChatCard } from '../Chat/ChatCard';
import { DuckieAllStates, DuckieStateJson } from '../../../props/DuckieAgentProps';

type ContextSetChatCardProps = {
  agent: DuckieStateJson;
  setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
};

export function ContextSetChatCard({ agent, setDuckieAgents }: ContextSetChatCardProps) {
  return (
    <ChatCard agent={agent} stage={"CONTEXT_SET"} setDuckieAgents={setDuckieAgents} />
  );
}
