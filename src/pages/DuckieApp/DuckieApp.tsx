import * as React from "react";
import { Flex, useDisclosure, Spinner, Center, Text, VStack, useToast } from "@chakra-ui/react";
import { DuckieAppHeader } from "../../components/Header/DuckieAppHeader";
import { SideBar } from "../../components/SideBar/SideBar";
import { DuckieAgent } from "../../components/DuckieAgent/DuckieAgent";
import { useGetAllAgents } from "../../services/Ducklings/FetchAllUserDucklings";
import { useAuth } from "../../context/AuthContext";
import { DuckieWebSocket } from "../../services/DuckieWebSocket";
import { DuckieAllStates, DuckieStateJson } from "../../props/DuckieAgentProps";
import { SignUpForm } from "../../components/Tour/SignUpFormModal";
import { all } from "axios";

export const DuckieApp = () => {
    const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });

    const [selectedAgentId, setSelectedAgentId] = React.useState("");
    const [allAgents, setDuckieAgents] = React.useState({} as DuckieAllStates);
    const { isLoading, error, getAllAgents } = useGetAllAgents(setDuckieAgents, setSelectedAgentId);
    const [previousAgents, setPreviousAgents] = React.useState({} as DuckieAllStates);

    // Handle user auth
    const { user, loading: authLoading } = useAuth();
    const userId = user?.uid || 'N/A';

    const userOnboardingModal = SignUpForm(authLoading);

    React.useEffect(() => {
        getAllAgents();
    }, [authLoading]);

    const toast = useToast();
    const duckieWebSocketRef = React.useRef<DuckieWebSocket | null>(null);
    React.useEffect(() => {
        if (!duckieWebSocketRef.current && userId !== 'N/A' && !isLoading && Object.keys(allAgents).length > 0) {
            duckieWebSocketRef.current = new DuckieWebSocket(userId, toast, setDuckieAgents, allAgents);
        }
    }, [userId, duckieWebSocketRef, isLoading, allAgents]);

    React.useEffect(() => {
        if ((selectedAgentId === "" && Object.keys(allAgents).length > 0) || !Object.keys(allAgents).includes(selectedAgentId)) {
            const sorted = Object.values(allAgents).sort((a, b) => {
                const timestampA = new Date(a.timestamp).getTime();
                const timestampB = new Date(b.timestamp).getTime();
                return timestampB - timestampA;
            });
            
            if (sorted.length > 0) {
                setSelectedAgentId(sorted[0].agent_id);
            }
        }

        const numReqInput = Object.values(allAgents).filter((agent: DuckieStateJson) => { return agent.status === 'REQ_INPUT'; }).length;
        if (numReqInput > 0) {
            document.title = `(${numReqInput}) Duckie AI`;
        } else {
            document.title = `Duckie AI`;
        }
    }, [selectedAgentId, allAgents]);

    React.useEffect(() => {
        if (Object.keys(previousAgents).join('') !== Object.keys(allAgents).join('')) {
            // get the new agent id
            const newAgentId = Object.keys(allAgents).filter((agentId) => !Object.keys(previousAgents).includes(agentId))[0];
            if (newAgentId) {
                setSelectedAgentId(newAgentId);
            }

            setPreviousAgents(allAgents);
        }
    }, [allAgents]);

    if (isLoading || authLoading) {
        return (
            <Center h="100vh">
                <VStack>
                    <Spinner size="xl" speed='1s' />
                    <Text ml="2" pt='15px'>Quack...</Text>
                </VStack>
            </Center>
        );
    }

    return (
        <>
            {userOnboardingModal}
            <DuckieAppHeader onToggle={onToggle} isOpen={isOpen} selectedAgentId={selectedAgentId} agents={allAgents} />
            <Flex h='100%'>
                <SideBar isOpen={isOpen} agents={allAgents || new Map()} setDuckieAgents={setDuckieAgents} setSelectedAgentId={setSelectedAgentId} selectedAgentId={selectedAgentId} />
                <DuckieAgent selectedAgentId={selectedAgentId} isOpen={isOpen} setDuckieAgents={setDuckieAgents} agents={allAgents} setSelectedAgentId={setSelectedAgentId} />
            </Flex>
        </>
    );
};
