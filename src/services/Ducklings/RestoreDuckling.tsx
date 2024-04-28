import React from "react";
import { useAuth } from "../../context/AuthContext";

interface RestoreAgentOptions {
    agentId: string;
    uid: string;
}

export const useRestoreAgent = ({ agentId, uid }: RestoreAgentOptions) => {
    const [restoreStatus, setRestoreStatus] = React.useState<'IDLE' | 'SUCCESS' | 'ERROR'>('IDLE');
    const [error, setError] = React.useState<Error | null>(null);
    const backendServiceUrl = process.env.REACT_APP_BACKEND_SERVICES_URL;
    const { user, loading } = useAuth();
    const userId = user?.uid || 'NA';
    if (userId === 'NA') {
        throw new Error('useRestoreAgent must be used within an AuthProvider');
    }

    const restoreAgent = async () => {
        try {
            const response = await fetch(backendServiceUrl + '/api/restore_previous_state', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    agent_id: agentId,
                    uid: uid,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to restore agent');
            }

            const data = await response.json();

            if(data.status === 'OK') {
                setRestoreStatus('SUCCESS');
            } else {
                setRestoreStatus('ERROR');
                setError(new Error(data.message || 'Unexpected error'));
            }
        } catch (error: any) {
            setRestoreStatus('ERROR');
            setError(error);
        }
    };

    return { restoreStatus, error, restoreAgent };
}
