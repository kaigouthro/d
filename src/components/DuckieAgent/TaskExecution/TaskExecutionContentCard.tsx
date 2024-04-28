import { Box, Card, useColorMode, useStyleConfig, Text, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Heading, VStack, Divider, HStack, Spacer, Button, Badge, Tooltip, Textarea, IconButton, Flex, useToast } from '@chakra-ui/react';
import { OptionBase, Select } from "chakra-react-select";
import { DuckieAllStates, DuckieStateJson, TaskCodeChange, TaskJson } from '../../../props/DuckieAgentProps';
import ReactMarkdown from 'react-markdown';
import React, { useEffect, useState } from 'react';
import { useRunAgent } from '../../../services/Ducklings/RunDucklingStep';
import { MdExpandLess, MdExpandMore } from 'react-icons/md';
import { BiCode, BiUser } from 'react-icons/bi';
import { DeleteIcon, EditIcon, CheckIcon, NotAllowedIcon } from '@chakra-ui/icons';
import TextareaAutosize from 'react-textarea-autosize';
import { useUpdateAgentTasks } from '../../../services/Ducklings/UpdateAgentTasks';
import AceEditor from "react-ace";


type TaskExecutionContentCardProps = {
  agent: DuckieStateJson;
  setDuckieAgents: React.Dispatch<React.SetStateAction<DuckieAllStates>>;
}

interface IOption extends OptionBase {
  label: string;
  value: string;
}

export function TaskExecutionContentCard(props: TaskExecutionContentCardProps) {
  const { colorMode } = useColorMode();
  const styles = useStyleConfig("ContentCard", { variant: colorMode });
  const [tasks, setTasks] = useState<TaskJson[]>([]);
  const { updateStatus, error, updateAgentTasks } = useUpdateAgentTasks();

  useEffect(() => {
    import('ace-builds/src-noconflict/ace').then(ace => {
      require("ace-builds/src-noconflict/mode-javascript");
      require("ace-builds/src-noconflict/theme-github");
      require("ace-builds/src-noconflict/mode-java");
      require("ace-builds/src-noconflict/mode-python");
      require("ace-builds/src-noconflict/mode-golang");
      require("ace-builds/src-noconflict/mode-rust");
      require("ace-builds/src-noconflict/mode-swift");
      require("ace-builds/src-noconflict/mode-markdown");
      require("ace-builds/src-noconflict/mode-latex");
      require("ace-builds/src-noconflict/mode-jsx");
      require("ace-builds/src-noconflict/mode-tsx");
      require("ace-builds/src-noconflict/mode-protobuf");
      require("ace-builds/src-noconflict/mode-ruby");
      require("ace-builds/src-noconflict/mode-c_cpp");
      require("ace-builds/src-noconflict/mode-rst");
      require("ace-builds/src-noconflict/mode-scala");
      require("ace-builds/src-noconflict/ext-language_tools");
    });
  }, []);

  useEffect(() => {
    setTasks(JSON.parse(JSON.stringify(props.agent.task_objects)) as TaskJson[]);
  }, [props]);

  const { response, runDucklingStep } = useRunAgent();

  const [isContracted, setIsContracted] = useState(props.agent.stage === 'RUNNING_TASKS');
  React.useEffect(() => {
    setIsContracted(props.agent.stage !== 'RUNNING_TASKS');
  }, [props]);

  const [height, setHeight] = useState('540px');
  React.useEffect(() => {
    if (isContracted) {
      setHeight('540px');
    } else {
      setHeight('100%');
    }
  }, [isContracted]);

  const [taskExpandIndex, setTaskExpandIndex] = React.useState(tasks.map((task, index) => index));
  const handleTaskAccordionChange = (indices: number[]) => {
    setTaskExpandIndex(indices);
  };
  
  const extensionToLanguageMap: Record<string, string> = {
    "py": "python",
    "java": "java",
    "js": "javascript",
    "go": "golang",
    "rs": "rust",
    "swift": "swift",
    "md": "markdown",
    "tex": "latex",
    "jsx": "jsx",
    "tsx": "tsx",
    "proto": "protobuf",
    "ruby": "ruby",
    "c": "c_cpp",
    "cpp": "c_cpp",
    "rst": "rst",
  };

  const handleAccept = () => {
    runDucklingStep({
      user_id: props.agent.user_id,
      agent_id: props.agent.agent_id,
      user_message: 'confirm',
    });
    props.agent.status = 'RUNNING';
    props.setDuckieAgents((prev) => {
      delete prev[props.agent.agent_id];
      return {
        ...prev,
        [props.agent.agent_id]: props.agent,
      }
    });
  };

  function removeDashPrefix(input: string): string {
    if (input.startsWith('- ')) {
      return input.slice(2);
    }
    return input;
  }

  const handleDeleteTask = (taskIndex: number) => {
    const newTasks = [...tasks];
    newTasks.splice(taskIndex, 1);
    setTasks(newTasks);
  }

  const [editing, setEditing] = useState(false);
  const getTaskDescription = (task: TaskJson, index: number) => {
    if (editing) {
      return (
        <Box h={height}>
          <Textarea
            value={task.description}
            onChange={(e) => {
              const newTasks = [...tasks];
              newTasks[index].description = e.target.value;
              setTasks(newTasks);
            }}
            as={TextareaAutosize}
            maxRows={20}
          />
        </Box>
      )
    } else {
      return (
        <Text fontSize='16px' fontWeight='normal'>{task.description}</Text>
      );
    }
  }

  const getTaskFile = (task: TaskJson, index: number) => {
    if (editing) {
      return (
        <HStack w='100%' h='fit-content'>
          <Text fontWeight='semibold'>File:</Text>
          <Box w='100%'>
            <Select
              placeholder="Select a file"
              tagVariant="solid"
              options={props.agent.all_file_paths.map((path: string): IOption => ({ value: path, label: path }))}
              value={task.file ? { label: task.file, value: task.file } : undefined}
              onChange={(option) => {
                const newTasks = [...tasks];
                if (option) {
                  newTasks[index].file = option.value;
                  setTasks(newTasks);
                }
              }}
              size='sm'
            />
          </Box>
        </HStack>
      )
    } else {
      return (
        <HStack>
          <Text fontWeight='semibold'>File:</Text>
          <Box pl='26px'>
            <ReactMarkdown className='duckie-markdown' children={`\`\`\`${(task.file || '').split('.').pop()}\n${task.file}\n\`\`\``} />
          </Box>
        </HStack>
      );
    }
  }

  const getTaskInstructions = (task: TaskJson, index: number) => {
    if (editing) {
      return (
        <Box h={height}>
          <Textarea
            value={(task.instructions?.map((instruction) => instruction[0] === '-' ? instruction : ('- ' + instruction)) || []).join('\n')}
            onChange={(e) => {
              task.instructions = e.target.value.split('\n');
              const newTasks = [...tasks];
              newTasks[index].instructions = task.instructions;
              setTasks(newTasks);
            }}
            pl='-10px'
            as={TextareaAutosize}
            maxRows={20}
          />
        </Box>
      )
    } else {
      return (
        <Box pl='10px'>
          {task.instructions && task.instructions.length > 0 ? (
            <>
              {task.instructions.map((instruction, index) => (
                <ReactMarkdown key={index} className='duckie-markdown' children={'- ' + instruction} />
              ))}
            </>
          ) : null}
        </Box>
      );
    }
  }

  const getTaskCodeChanges = (task: TaskJson, index: number) => {
    if (editing) {
      return (
        <Box h={height}>
          {task.code_change_snippets?.map((code_change, codeChangeIndex) => (
            <>
            <Box pt='20px' />
              <Textarea
                value={code_change.description}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  const modifyTask = newTasks[index];
                  (modifyTask.code_change_snippets || [] as TaskCodeChange[])[codeChangeIndex].description = e.target.value;
                  if ((modifyTask.code_change_snippets || [] as TaskCodeChange[])[codeChangeIndex].description === '' && (modifyTask.code_change_snippets || [] as TaskCodeChange[])[codeChangeIndex].snippet === '') {
                    (modifyTask.code_change_snippets || [] as TaskCodeChange[]).splice(codeChangeIndex, 1);
                  }
                  setTasks(newTasks);
                }}
                pl='-10px'
                as={TextareaAutosize}
              />
              <Box w='100%' pt='10px'>
                <AceEditor
                  mode={extensionToLanguageMap[task.file?.split('.').pop() || 'python'] || 'python'}
                  theme="github"
                  enableSnippets={false}
                  value={code_change.snippet}
                  name="CODE_SNIPPET"
                  fontSize={'14px'}
                  width='100%'
                  readOnly={false}
                  minLines={1}
                  maxLines={100}
                  onChange={(e) => {
                    const newTasks = [...tasks];
                    const modifyTask = newTasks[index];
                    (modifyTask.code_change_snippets || [] as TaskCodeChange[])[codeChangeIndex].snippet = e;
                    if ((modifyTask.code_change_snippets || [] as TaskCodeChange[])[codeChangeIndex].description === '' && (modifyTask.code_change_snippets || [] as TaskCodeChange[])[codeChangeIndex].snippet === '') {
                      (modifyTask.code_change_snippets || [] as TaskCodeChange[]).splice(codeChangeIndex, 1);
                    }
                    setTasks(newTasks);
                  }}
                  setOptions={{
                    enableLiveAutocompletion: true,
                    showLineNumbers: true,
                    tabSize: 2,
                    enableSnippets: false
                  }}
                />
              </Box>
            </>
          ))}
        </Box>
      )
    } else {
      return (
        <>
          {(task.code_change_snippets || []).map((code_change, codeChangeIndex) => (
            <>
              <Box pt='5px' />
              <Box pl='26px'>
                <ReactMarkdown key={codeChangeIndex} className='duckie-markdown' children={removeDashPrefix(code_change.description)} />
              </Box>
              <Box w='100%'>
                <AceEditor
                  mode={extensionToLanguageMap[task.file?.split('.').pop() || 'python'] || 'python'}
                  theme="github"
                  enableSnippets={true}
                  value={code_change.snippet}
                  name="CODE_SNIPPET"
                  fontSize={'14px'}
                  width='100%'
                  readOnly={true}
                  minLines={1}
                  maxLines={100}
                  showGutter={false}
                />
              </Box>
            </>
          ))}
        </>
      );
    }
  }

  const handleSaveEdit = () => {
    tasks.map((task) => {
      task.instructions = task.instructions?.map((instruction) => instruction[0] === '-' ? instruction.slice(2) : instruction).filter((instruction) => instruction !== '') || null;
    })

    setEditing(false);
    updateAgentTasks({
      agentId: props.agent.agent_id,
      tasks: tasks,
    });
  }
  const toast = useToast();
  React.useEffect(() => {
    if (updateStatus !== 'SUCCESS' && error) {
      toast({
        title: "Error updating tasks.",
        description: "The tasks could not be updated.",
        status: "error",
        duration: 9000,
        isClosable: true,
        position: 'top',
      });
    }
  }, [error, updateStatus]);

  const handleUndoEdit = () => {
    setEditing(false);
    setTasks(JSON.parse(JSON.stringify(props.agent.task_objects)) as TaskJson[]);
  }

  const [saveEditButtons, setSaveEditButtons] = useState(<></>);
  React.useEffect(() => {
    const showButtons = editing;
    if (showButtons) {
      setSaveEditButtons(
        <Flex justify="center" align="center" pl="10px" h="15px">
          <HStack>
            {/* <Text fontSize="15px" color="gray.600">Editing:</Text> */}
            <Tooltip label="Save Changes" aria-label="Save Changes">
              <CheckIcon color="#FFDC03" onClick={handleSaveEdit} />
            </Tooltip>
            <Tooltip label="Cancel" aria-label="Cancel">
              <NotAllowedIcon color="gray.500" onClick={handleUndoEdit} />
            </Tooltip>
          </HStack>
        </Flex>
      );
    } else {
      setSaveEditButtons(
        <Flex justify="center" align="center" h="full">
          <Box pl="10px">
            <EditIcon color="#A0A0A0" onClick={() => {
              setEditing(!editing)
              setIsContracted(false);
            }} />
          </Box>
        </Flex>
      );
    }
  }, [tasks, props, editing]);


  return (
    <Card sx={styles} maxH={height}>
      <HStack>
        <Text fontSize='15px' color='#D9BC00'>Task Execution</Text>
        {saveEditButtons}
        <Spacer />
        {isContracted ? (
          <MdExpandLess size='25px' color='#A0A0A0' onClick={() => setIsContracted(false)} />
        ) : (
          <MdExpandMore size='25px' color='#A0A0A0' onClick={() => setIsContracted(true)} />
        )}
      </HStack>
      <Accordion allowMultiple allowToggle index={taskExpandIndex} onChange={handleTaskAccordionChange} overflow={'auto'} className='overlay-scrollbar' h='100%'>
        {tasks.map((task: TaskJson, index: number) => {
          const file = task.file || '';
          return (
            <AccordionItem key={index} h='100%'>
              <h2>
                <AccordionButton>
                  <HStack as="span" flex='1' textAlign='left' position='relative' _hover={{ "> div": { opacity: 1 } }} h='100%'>
                    {((task.instructions || []).length > 0) ?
                      <BiUser size='20px' color='#D9BC00' /> :
                      <BiCode size='20px' color='#D9BC00' />
                    }
                    <Text fontSize='18px' fontWeight='semibold'>{task.title}</Text>
                    <Spacer />
                    <Box
                      position="absolute"
                      right="0"
                      top="0"
                      opacity="0" // initially invisible
                      transition="opacity 0.2s ease-in-out"
                      _groupHover={{ opacity: 1 }}
                      h='100%'
                    >
                      <Tooltip label='Delete Task' aria-label='Delete Task'>
                        <IconButton
                          aria-label='Delete task'
                          icon={<DeleteIcon />}
                          size="sm"
                          variant="ghost"
                          _hover={{ bg: 'transparent' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTask(index);
                            setEditing(true);
                          }}
                          h='100%'
                        />
                      </Tooltip>
                    </Box>
                  </HStack>
                </AccordionButton>
              </h2>
              <AccordionPanel h='100%'>
                {task.file ? (
                  <Box pb='20px'>
                    <Box>
                      {getTaskFile(task, index)}
                    </Box>
                  </Box>
                ) : (<></>)}
                <Text fontSize='16px' fontWeight='semibold'>Description</Text>
                {getTaskDescription(task, index)}
                {
                  task.instructions && task.instructions.length > 0 ? (
                    <>
                      <Box pt='20px' />
                      <Text fontSize='16px' fontWeight='semibold'>Instructions</Text>
                      {getTaskInstructions(task, index)}
                    </>
                  ) : null
                }
                {
                  task.code_change_snippets && task.code_change_snippets.length > 0 ? (
                    <>
                      <Box pt='20px' h='100%'>
                        <Text fontSize='16px' fontWeight='semibold'>Code Changes</Text>
                        {getTaskCodeChanges(task, index)}
                      </Box>
                    </>
                  ) : null
                }
              </AccordionPanel>
            </AccordionItem>
          );
        }
        )}
      </Accordion>
      <HStack pt='15px'>
        <Spacer />
        <Button bgColor='#FFDC03' isDisabled={props.agent.status !== 'REQ_INPUT'} display={props.agent.stage === 'RUNNING_TASKS' ? 'block' : 'none'} size='sm' onClick={handleAccept}>Write Code</Button>
      </HStack>
    </Card>
  );
}