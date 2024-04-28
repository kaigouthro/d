import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

type UpdateAgentObjectiveParams = {
    agentId: string;
    objectiveDescription: string;
};

export const useUpdateAgentObjective = () => {
    const [updateStatus, setUpdateStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [error, setError] = useState<Error | null>(null);
    const { user } = useAuth();
    const userId = user?.uid || 'NA';

    if (userId === 'NA') {
        throw new Error('useUpdateAgentObjective must be used within an AuthProvider');
    }

    const updateAgentObjective = async ({ agentId, objectiveDescription }: UpdateAgentObjectiveParams) => {
        setUpdateStatus('IDLE');
        setError(null);

        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_SERVICES_URL + '/api/update_agent_objective', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    agent_id: agentId,
                    objective_description: objectiveDescription,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update agent objective');
            }

            const data = await response.json();

            if (data.status === 'OK') {
                setUpdateStatus('SUCCESS');
            } else {
                setUpdateStatus('ERROR');
                setError(new Error(data.message || 'Unexpected error occurred while updating agent objective'));
            }

        } catch (error: any) {
            setUpdateStatus('ERROR');
            setError(error);
        }
    };

    return { updateStatus, error, updateAgentObjective };
};
