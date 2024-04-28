import { useEffect, useState } from 'react'
import {
    Box,
    ButtonGroup,
    Button,
    Heading,
    Flex,
    FormControl,
    FormLabel,
    Input,
    Select,
    Text,
    VStack,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalBody,
    ModalFooter,
    Link,
} from '@chakra-ui/react'
import { FaTwitter, FaDiscord } from 'react-icons/fa'
import { useGetUser, useSaveUser } from '../../services/User/UserInfoHelper'

const UserDetails = (formData: any, setFormData: (arg0: (prev: any) => any) => void) => {
    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal" mb="2%">
                Welcome to Duckie!
            </Heading>
            <VStack justifyContent='center'>
                <FormControl mt="2%">
                    <FormLabel htmlFor="email" ml='5px'>
                        Email address
                    </FormLabel>
                    <Input id="email" type="email"
                        placeholder="Email address"
                        value={formData.email}
                        onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                    />
                </FormControl>

                <FormControl mt="2%">
                    <FormLabel  ml='5px'>
                        How did you hear about us?
                    </FormLabel>
                    <Select
                        placeholder="Select option"
                        onChange={(e) => setFormData((prev) => ({ ...prev, hearAboutUs: e.target.value }))}
                        value={formData.hearAboutUs}
                    >
                        <option>Friend or colleague</option>
                        <option>Twitter</option>
                        <option>Reddit</option>
                        <option>Product Hunt</option>
                        <option>LinkedIn</option>
                        <option>Google</option>
                        <option>Other</option>
                    </Select>
                </FormControl>
            </VStack>
        </>
    )
}

const JoinOurCommunity = () => {
    return (
        <>
            <Heading w="100%" textAlign={'center'} fontWeight="normal">
                Join Our Community
            </Heading>
            <Flex w='100%' h='100%' alignContent='center' justifyContent='center' paddingTop='30px'>
                <VStack gap='2vh'>
                    <Text textAlign='center' paddingLeft='10%' paddingRight='10%'>
                       We are always looking for feedback and suggestions!
                    </Text>
                    <Link href="https://discord.gg/JwQSRj9Wx2" isExternal>
                        <Button bg='#9098f6' w='250px' >
                            <FaDiscord />
                            <Text paddingLeft='1vh'>Join our Discord</Text>
                        </Button>
                    </Link>
                    <Link href="https://twitter.com/duckie_ai" isExternal>
                        <Button bg='twitter.200' w='250px'>
                            <FaTwitter />
                            <Text paddingLeft='1vh'>Follow us on Twitter</Text>
                        </Button>
                    </Link>
                </VStack>
            </Flex>
        </>
    )
}
export const SignUpForm = (isLoading: boolean) => {
    const { userData, getUser, isLoadingUser } = useGetUser();
    const [isOpen, setIsOpen] = useState(false)
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: null,
        hearAboutUs: null,
        signUpDate: new Date(),
    });
    const { saveUser } = useSaveUser(formData);

    useEffect(() => {
        if (!isLoading) {
            getUser()
        }
    }, [isLoading])

    useEffect(() => {
        if (!isLoadingUser) {
            setIsOpen(userData === null);
        }
    }, [userData, isLoadingUser])

    const onSubmit = () => {
        setIsOpen(false)
        saveUser()
    }

    return (
        <Modal isOpen={isOpen} onClose={() => { }} size='2xl' isCentered>
            <ModalOverlay />
            <ModalContent h='400px'>
                {/* <ModalCloseButton /> */}
                <ModalBody>
                    <Box
                        rounded="lg"
                        maxWidth={800}
                        p={4}
                        m="10px auto"
                        as="form"
                        textColor='gray.600'
                    >
                        {step === 1 ? UserDetails(formData, setFormData) : <JoinOurCommunity />}
                    </Box>
                </ModalBody>
                <ModalFooter>
                    <ButtonGroup mt="10px" w="100%">
                        <Flex w="100%" justifyContent="space-between">
                            <Flex>
                                <Button
                                    onClick={() => {
                                        setStep(step - 1)
                                    }}
                                    display={step === 1 ? 'none' : 'block'}
                                    variant="solid"
                                    w="7rem"
                                    bg="#FFDC03"
                                    textColor='gray.600'
                                    mr="5%">
                                    Back
                                </Button>
                                <Button
                                    w="7rem"
                                    display={step === 2 ? 'none' : 'block'}
                                    onClick={() => {
                                        setStep(step + 1)
                                    }}
                                    bg="#FFDC03"
                                    variant="outline">
                                    Next
                                </Button>
                            </Flex>
                            {step === 2 ? (
                                <Button
                                    bg="#FFDC03"
                                    textColor='gray.600'
                                    variant="solid"
                                    onClick={() => {
                                        onSubmit()
                                    }}>
                                    Start Working
                                </Button>
                            ) : null}
                        </Flex>
                    </ButtonGroup>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}