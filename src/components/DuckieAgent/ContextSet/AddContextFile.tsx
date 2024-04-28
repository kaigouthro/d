import { Select } from "chakra-react-select";
import {
    Box,
    Button,
    useColorMode,
    useToast,
    Tooltip
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useAddFile } from "../../../services/Ducklings/ContextFileEdit";
import { DuckieStateJson } from "../../../props/DuckieAgentProps";

interface AddContextFileProps {
    agent: DuckieStateJson;
}

export const AddContextFile: React.FC<AddContextFileProps> = ({ agent }: AddContextFileProps) => {
    const { colorMode } = useColorMode();
    const buttonBackgroundColor = colorMode === "dark" ? "#506cd1" : "#f5de81";
    const textColor = colorMode === "dark" ? "gray.100" : "gray.600";
    const toast = useToast();
    const { addFile, addFileStatus } = useAddFile({ agentId: agent.agent_id, fileName: "" });
    const [addFileLoading, setAddFileLoading] = useState(false);

    const [inputValue, setInputValue] = React.useState<{
        value: string;
        label: string;
    } | null>(null);

    const handleAddFile = async (inputValue: { value: string; label: string }) => {
        if (!inputValue || !inputValue.value) {
            return;
        }
        setAddFileLoading(true);
        const response = await addFile({agentId: agent.agent_id, fileName: inputValue.value});
        if (addFileStatus === "ERROR") {
            toast({
                title: "Error adding file.",
                description: "The file could not be added to the context set.",
                status: "error",
                duration: 9000,
                isClosable: true,
            });
        }
        setAddFileLoading(false);
        setInputValue(null);
    };

    return (
        <Box display="flex" marginBottom="10px" w="100%">
            <div style={{ width: "100%" }}>
                <Select
                    placeholder="Select a file"
                    tagVariant="solid"
                    options={agent.all_file_paths.filter(
                        (path: string) =>
                            !agent.snippets.map(({ id }: { id: string }) => id)
                                .includes(path)
                    )
                        .map((path: string) => ({ value: path, label: path }))}
                    value={inputValue}
                    onChange={setInputValue}
                    size='sm'
                />
            </div>
            <Tooltip label="Add a file to the context set" aria-label="Add a file to the context set">
                <Button
                    isDisabled={addFileLoading || agent.status === "RUNNING" || !inputValue}
                    marginLeft="10px"
                    bg={buttonBackgroundColor}
                    color={textColor}
                    size='sm'
                    onClick={() => handleAddFile(inputValue as { value: string; label: string })}
                >
                    Add File
                </Button>
            </Tooltip>
        </Box>
    );
};