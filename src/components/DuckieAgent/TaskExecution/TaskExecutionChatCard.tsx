import { ChatCard } from '../Chat/ChatCard';
import { DuckieAllStates, DuckieStateJson } from '../../../props/DuckieAgentProps';

type TaskExecutionChatCardProps = {
  agent: DuckieStateJson;
  setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
};

export function TaskExecutionChatCard({ agent, setDuckieAgents }: TaskExecutionChatCardProps) {
  return (
    <ChatCard agent={agent} stage={"RUNNING_TASKS"} setDuckieAgents={setDuckieAgents} />
  );
}
