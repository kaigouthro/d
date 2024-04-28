import {
    Box,
    VStack,
    Text,
    Collapse,
    Spacer,
    Icon,
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
    ModalBody,
    useToast,
    Tooltip,
} from '@chakra-ui/react';
import Prism from 'prismjs';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiFolder, FiFile, FiTrash2 } from 'react-icons/fi';
import { useDeleteFile } from '../../../services/Ducklings/ContextFileEdit';

type TreeNodeProps = {
    node: any;
    name: string;
    path: string;
    agentId: string;
};

function TreeNode({ node, name, path, agentId }: TreeNodeProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isHovering, setIsHovering] = useState(false);
    const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure();
    const isLeafNode = node.hasOwnProperty('filePath') && node.hasOwnProperty('content');
    const { deleteFile, deleteFileStatus, error } = useDeleteFile({ agentId, fileName: path });
    const [isDeleting, setIsDeleting] = useState(false);
    const toast = useToast();


    const handleFileClick = () => {
        if (isLeafNode) {
            onModalOpen();
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleMouseEnter = () => {
        setIsHovering(true);
    }

    const handleMouseLeave = () => {
        setIsHovering(false);
    }

    const handleTrashClick = async (event: React.MouseEvent) => {
        event.stopPropagation();
        setIsDeleting(true);
        path = path?.replace('root/', '');

        // Call deleteFile to delete the file
        await deleteFile({ agentId, fileName: path });

        // Handle the response status
        if (deleteFileStatus === 'ERROR') {
            toast({
                title: 'Error deleting file',
                description: error?.message || 'Unexpected error',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }

        setIsDeleting(false);
    };

    return (
        <VStack align="start" spacing={1} width="100%">
            <Box
                display="flex"
                alignItems="center"
                p={2}
                borderRadius="md"
                onClick={handleFileClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                cursor="pointer"
                width="100%"
                bg={isHovering ? '#FFF199' : 'transparent'} // background color change on hover
            >
                {isLeafNode ? (
                    <>
                        <Icon as={FiFile} boxSize={5} color="black" />  {/* change in icon size and color */}
                        <Text pl='5px' pr='5px' fontSize="16px">{name}</Text>  {/* increase in font size */}
                        <Spacer />
                        <Box w='5px' h='100%' />
                        {isHovering &&
                            <Tooltip label='Delete file' aria-label='Delete file'>
                                <Box h='90%' pt='5px' mt='-1' mb='-1'>
                                    <Icon as={FiTrash2} boxSize={5} color="black" cursor="pointer" onClick={handleTrashClick} />
                                </Box>
                            </Tooltip>
                        }
                    </>
                ) : (
                    <>
                        <Icon as={FiFolder} boxSize={5} color="black" />  {/* change in icon size and color */}
                        <Text pl='5px' fontSize="16px">{name}</Text>  {/* increase in font size */}
                        <Spacer />

                        <Icon as={FiFolder} boxSize={5} display="none" />
                    </>
                )}
            </Box>
            <Box w='100%'>
                {!isLeafNode && (
                    <Collapse in={isOpen}>
                        {Object.keys(node).map(key => (
                            <Box pl={4} key={key} w='100%'>
                                <TreeNode node={node[key]} name={key} path={path ? `${path}/${key}` : key} agentId={agentId} />
                            </Box>
                        ))}
                    </Collapse>
                )}
            </Box>
            {isLeafNode && (
                <Modal isOpen={isModalOpen} onClose={onModalClose} size='4xl' isCentered>
                    <ModalOverlay />
                    <ModalContent>
                        <ModalHeader>{name}</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody maxH='80vh' overflow={'auto'} className='overlay-scrollbar'>
                            <MemoizedSyntaxHighlighter code={node.content} filePath={node.filePath} />
                        </ModalBody>
                    </ModalContent>
                </Modal>
            )}
        </VStack>
    );
}

const extensionToLanguageMap: Record<string, string> = {
    "py": "python",
    "java": "java",
    "js": "javascript",
    "go": "go",
    "rst": "rst",
    "rs": "rust",
    "swift": "swift",
    "md": "markdown",
    "tex": "latex",
    "html": "html",
    "yaml": "yaml",
    "sh": "bash",
    "jsx": "jsx",
    "tsx": "tsx",
    "css": "css"
};

const MemoizedSyntaxHighlighter = ({ code, filePath }: { code: string, filePath: string }) => {
    const ref = useRef<HTMLElement | null>(null);
    const language = extensionToLanguageMap[filePath.split('.').pop()?.split(' ')[0] || ''] || 'python';

    useEffect(() => {
        if (ref.current) {
            Prism.highlightElement(ref.current);
        }
    }, [code, language]);

    return useMemo(() => (
        <pre style={{ fontSize: "14px" }}>
            <code ref={ref} className={`language-${language}`}>
                {code}
            </code>
        </pre>
    ), [code, language, ref]);
};

type FileTreeProps = {
    data: any;
    agentId: string;
};

export function FileTree({ data, agentId }: FileTreeProps) {
    return (
        <Box h='100%' overflowY='auto' className='overlay-scrollbar'>
            <TreeNode node={data} name="root" path="root" agentId={agentId} />
        </Box>
    );
}

