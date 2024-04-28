import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";

type UpdateAgentDesignParams = {
    agentId: string;
    engDesign: string;
};

export const useUpdateAgentDesign = () => {
    const [updateStatus, setUpdateStatus] = useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [error, setError] = useState<Error | null>(null);
    const { user } = useAuth();
    const userId = user?.uid || 'NA';

    if (userId === 'NA') {
        throw new Error('useUpdateAgentDesign must be used within an AuthProvider');
    }

    const updateAgentDesign = async ({ agentId, engDesign }: UpdateAgentDesignParams) => {
        setUpdateStatus('IDLE');
        setError(null);

        try {
            const response = await fetch(process.env.REACT_APP_BACKEND_SERVICES_URL + '/api/update_agent_plan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    agent_id: agentId,
                    eng_plan: engDesign,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update agent engineering design');
            }

            const data = await response.json();

            if (data.status === 'OK') {
                setUpdateStatus('SUCCESS');
            } else {
                setUpdateStatus('ERROR');
                setError(new Error(data.message || 'Unexpected error occurred while updating agent engineering design'));
            }

        } catch (error: any) {
            setUpdateStatus('ERROR');
            setError(error);
        }
    };

    return { updateStatus, error, updateAgentDesign };
};
