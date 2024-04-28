import { useState } from "react";

interface StopAgentRequestData {
    user_id: string;
    agent_id: string;
}

interface StopAgentResponse {
    success: boolean;
    error?: Error;
}

export const useStopAgent = () => {
    const [response, setResponse] = useState<StopAgentResponse>({ success: false, error: undefined });
    const backendServiceUrl = process.env.REACT_APP_BACKEND_SERVICES_URL;

    const stopAgent = async (requestData: StopAgentRequestData) => {
        try {
            const response = await fetch(backendServiceUrl + '/api/stop_agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Failed to stop agent');
            }

            const data = await response.json();

            if (data.status === 'ERROR') {
                setResponse({ success: false, error: new Error(data.message || 'Unexpected error') });
            } else {
                setResponse({ success: true });
            }
        } catch (error: any) {
            setResponse({ success: false, error: error });
        }
    };

    return { response, stopAgent };
};