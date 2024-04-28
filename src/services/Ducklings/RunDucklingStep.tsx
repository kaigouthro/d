import { useState } from "react";

interface RunAgentRequestData {
    user_id: string;
    agent_id: string;
    user_message: string;
}

interface RunAgentResponse {
    success: boolean;
    error?: Error;
}

export const useRunAgent = () => {
    const [response, setResponse] = useState<RunAgentResponse>({ success: false, error: undefined });
    const backendServiceUrl = process.env.REACT_APP_BACKEND_SERVICES_URL;

    const runDucklingStep = async (requestData: RunAgentRequestData) => {
        try {
            const response = await fetch(backendServiceUrl + '/api/run_agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData),
            });

            if (!response.ok) {
                throw new Error('Failed to run agent');
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

    return { response, runDucklingStep };
};
