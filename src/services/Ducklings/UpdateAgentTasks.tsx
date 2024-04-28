import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

type UpdateAgentTasksParams = {
  agentId: string;
  tasks: any[]; // Replace `any[]` with the appropriate task type
};

export const useUpdateAgentTasks = () => {
  const [updateStatus, setUpdateStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();
  const userId = user?.uid || 'NA';

  if (userId === 'NA') {
    throw new Error('useUpdateAgentTasks must be used within an AuthProvider');
  }

  const updateAgentTasks = async ({ agentId, tasks }: UpdateAgentTasksParams) => {
    setUpdateStatus('IDLE');
    setError(null);

    try {
      const response = await fetch(process.env.REACT_APP_BACKEND_SERVICES_URL + '/api/update_agent_tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          agent_id: agentId,
          tasks: tasks,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update agent tasks');
      }

      const data = await response.json();

      if (data.status === 'OK') {
        setUpdateStatus('SUCCESS');
      } else {
        setUpdateStatus('ERROR');
        setError(new Error(data.message || 'Unexpected error occurred while updating agent tasks'));
      }

    } catch (error: any) {
      setUpdateStatus('ERROR');
      setError(error);
    }
  };

  return { updateStatus, error, updateAgentTasks };
};
