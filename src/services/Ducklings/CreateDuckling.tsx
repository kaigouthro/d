import { useState } from "react";

interface AgentFormData {
    user_id: string;
    repo_url: string;
    installation_id: string;
    objective_name: string;
    objective_description?: string;
    auto_run?: {
        code_search?: boolean;
        objective?: boolean;
        planning?: boolean;
        task?: boolean;
    };
}

interface CreateAgentResponse {
    success: boolean;
    data?: any;
    error?: Error;
}

export const useCreateAgent = () => {
    const [response, setResponse] = useState<CreateAgentResponse>({ success: false, data: undefined, error: undefined });    
    const backendServiceUrl = process.env.REACT_APP_BACKEND_SERVICES_URL;


    const createAgent = async (formData: AgentFormData) => {
        try {
            const response = await fetch(backendServiceUrl + '/api/create_agent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to create agent');
            }

            const data = await response.json();

            if (data.status === 'ERROR') {
                setResponse({ success: false, error: new Error(data.message || 'Unexpected error') });
            } else {
                setResponse({ success: true, data: data });
            }

        } catch (error: any) {
            setResponse({ success: false, error: error });
        }
    };

    return { response, createAgent };
};
