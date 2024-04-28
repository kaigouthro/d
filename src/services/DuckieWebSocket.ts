import { useToast } from "@chakra-ui/react";
import { DuckieAllStates, DuckieStateJson, ChatMessageProps, SnippetsJson, TaskJson, TaskCodeChange } from "../props/DuckieAgentProps";
import { playNotificationSound, showNotification } from "../components/Notifications/Notifications";
import Cookies from "js-cookie";

const parseMessage = (message: any): DuckieStateJson => {
    const mapChatMessage = (chat: any): ChatMessageProps => {
        chat = chat.M;
        if (!chat || !chat.text || !chat.sender || !chat.timestamp || !chat.stage) {
            console.error("Unexpected chat format:", chat);
            return {} as ChatMessageProps;
        }

        return {
            text: chat.text.S,
            sender: chat.sender.S,
            timestamp: new Date(chat.timestamp.S).getTime(),
            stage: chat.stage.S,
            uid: chat.uid?.S || '',
        }

    };

    const mapSnippets = (snippet: any): SnippetsJson => {
        snippet = snippet.M;

        return ({
            content: snippet.content.S,
            id: snippet.id.S,
            score: Number(snippet?.score?.N ?? 0),
        })
    };

    const mapTasks = (task: any): TaskJson => {
        task = task.M;
    
        return ({
            title: task.title.S,
            description: task.description.S,
            operation: task.operation.S,
            file: task.file.S || null,
            instructions: task.instructions.L.map((instruction: any) => instruction.S),
            code_change_snippets: task.code_change_snippets.L.map((code_changes: any): TaskCodeChange => {
                code_changes = code_changes.M
                return ({
                    description: code_changes.description.S,
                    snippet: code_changes.snippet.S
                })
            })
        })
        
    };

    const updatedAgent: DuckieStateJson = {
        agent_id: message.agent_id.S,
        all_file_paths: message.all_file_paths.L.map((item: any) => item.S),
        default_branch: message.default_branch.S,
        input_history: message.input_history.L.map(mapChatMessage),
        objective_description: message.objective_description.S,
        objective_name: message.objective_name.S,
        output_history: message.output_history.L.map(mapChatMessage),
        pr_url: message.pr_url.NULL ? "" : message.pr_url.S,
        repo: message.repo.S,
        repo_url: message.repo_url.S,
        snippets: message.snippets.L.map(mapSnippets),
        stage: message.stage.S,
        status: message.status.S,
        summary_plan: message.summary_plan.NULL ? null : message.summary_plan.S,
        task_objects: message.task_objects.L.map(mapTasks),
        timestamp: message.timestamp.S,
        user_id: message.user_id.S,
    };

    return updatedAgent;
};



export class DuckieWebSocket {
    ws: any;
    reconnectAttempts: number = 0;
    maxReconnectAttempts: number = 5;
    heartbeatInterval: number = 30 * 1000;
    heartbeatTimer: any;
    lastNotificationTime: number = new Date().getTime();;

    constructor(userId: string, toast: ReturnType<typeof useToast>, setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>, agents: DuckieAllStates) {
        this.setupWebSocket(userId, toast, setDuckieAgents, agents);
    }

    setupWebSocket(userId: string, toast: ReturnType<typeof useToast>, setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>, agents: DuckieAllStates) {
        const websocketUrl: string = 'wss://j64xk4zca5.execute-api.us-east-1.amazonaws.com/production/?user_id=' + userId;
        this.ws = new WebSocket(websocketUrl);

        this.ws.onopen = () => {
            this.reconnectAttempts = 0;
            this.startHeartbeat();
        };

        this.ws.onmessage = (event: { data: any; }) => {
            const data = event.data.toString();
            const response = JSON.parse(data);
            const status = response['status'];

            if (event.data === 'pong') {
                this.heartbeat();
                return
            }

            if (data.includes("message") && data.includes("type")) {
                if (response['type'] === 'new') {
                    const agent = parseMessage(response['message']);
                    const isNewRequest = (): boolean => {
                        if (agents[agent.agent_id] === undefined) {
                            return true;
                        } else if (agents[agent.agent_id].status === 'REQ_INPUT' || agents[agent.agent_id].status === 'COMPLETE') {
                            return false;
                        } else {
                            return true;
                        }
                    };

                    if ((agent.status === 'REQ_INPUT' || agent.status === 'COMPLETE') && Cookies.get('prepopMessage_' + agent.agent_id) === undefined && isNewRequest() && new Date().getTime() - this.lastNotificationTime > 1000) {
                        this.lastNotificationTime = new Date().getTime();
                        playNotificationSound();
                        showNotification('Duckie AI', { body: 'New Duckie request!', icon: '/images/logo_duck.png' });
                    }

                    setDuckieAgents((prevState) => ({
                        ...prevState,
                        [agent.agent_id]: agent,
                    }));
                } else if (response['type'] === 'delete') {
                    const agentId = response['message']['agent_id'];
                    setDuckieAgents((prevState) => {
                        delete prevState[agentId];
                        return { ...prevState };
                    });
                } else {
                    console.log("Unknown message type")
                }
            }
        };

        this.ws.onerror = (event: { type: string; message: string; }) => {
            console.log("WebSocket error: " + event.type + " - " + event.message)
        };

        this.ws.onclose = () => {
            if (this.reconnectAttempts < this.maxReconnectAttempts) {
                setTimeout(() => {
                    this.setupWebSocket(userId, toast, setDuckieAgents, agents);
                    this.reconnectAttempts++;
                }, 1000); // 5 seconds delay before trying to reconnect.
            } else {
            }
        };
    }

    startHeartbeat() {
        this.heartbeat();
        this.heartbeatTimer = setInterval(() => {
            this.heartbeat();
        }, this.heartbeatInterval);
    }

    heartbeat() {
        clearInterval(this.heartbeatTimer);
        if (this.ws.readyState === WebSocket.OPEN) {
            this.ws.send('ping');
        }
    }

    closeWebSocket() {
        if (this.ws) {
            this.ws.close();
        }
    }
}

