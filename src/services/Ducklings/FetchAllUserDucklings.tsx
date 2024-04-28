import { useState } from "react";
import { DuckieAllStates, DuckieStateJson } from "../../props/DuckieAgentProps";
import axios from 'axios';
import { redirect } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export const useGetAllAgents = (setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>, setSelectedAgentId: React.Dispatch<React.SetStateAction<string>>) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { user, loading: authLoading } = useAuth();

  const getAllAgents = async () => {
    setIsLoading(true);
    // Handle user auth
    const userId = user?.uid || 'N/A';
    if (userId === 'N/A') {
      redirect('/');
    }

    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND_SERVICES_URL + '/api/get_all_agents', { user_id: userId });
      if (response.data.status === 'OK') {

        let newAgents = {} as DuckieAllStates;
        for (let i = 0; i < response.data.agents.length; i++) {
          if (response.data.agents[i].stage !== undefined) {
            newAgents[response.data.agents[i].agent_id] = response.data.agents[i];
          }
        }
        setDuckieAgents(newAgents);

        if (response.data.agents.length > 0) {
          response.data.agents.sort((a: DuckieStateJson, b: DuckieStateJson) => {
            const timestampA = new Date(a.timestamp).getTime();
            const timestampB = new Date(b.timestamp).getTime();
            return timestampB - timestampA;
          });
          setSelectedAgentId(response.data.agents[0]?.agent_id ? response.data.agents[0].agent_id : "");
        }
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Failed to get all agents:', error);
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, error, getAllAgents };
};