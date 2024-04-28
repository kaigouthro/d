import React from "react";
import { useAuth } from "../../context/AuthContext";

interface DeleteAgentOptions {
    agentId: string;
}

export const useDeleteAgent = ({ agentId }: DeleteAgentOptions) => {
    const [deleteStatus, setDeleteStatus] = React.useState<'IDLE' | 'SUCCESS' | 'ERROR'>( 'IDLE');
    const [error, setError] = React.useState<Error | null>(null);
    const backendServiceUrl = process.env.REACT_APP_BACKEND_SERVICES_URL;
    const { user, loading } = useAuth();
    const userId = user?.uid || 'NA';
    if (userId === 'NA') {
        throw new Error('useDeleteAgent must be used within an AuthProvider');
    }

    const deleteAgent = async () => {
        try {
            const response = await fetch(backendServiceUrl + '/api/delete_agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    agent_id: agentId,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete agent');
            }

            const data = await response.json();

            if(data.status === 'OK') {
                setDeleteStatus('SUCCESS');
            } else {
                setDeleteStatus('ERROR');
                setError(new Error(data.message || 'Unexpected error'));
            }

        } catch (error: any) {
            setDeleteStatus('ERROR');
            setError(error);
        }
    };

    return { deleteStatus, error, deleteAgent };
}
