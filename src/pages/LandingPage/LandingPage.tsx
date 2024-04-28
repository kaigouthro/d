import * as React from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Container,
  Flex,
  Button,
  Image,
  SimpleGrid,
  HStack,
} from "@chakra-ui/react";
import LandingPageHeader from "../../components/Header/LandingPageHeader";
import { landingPageTheme } from "../../themes/LandingPageTheme";
import ReactPlayer from "react-player";
import { useAuth } from "../../context/AuthContext";
import { GithubAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "../../services/FirebaseSDK";

const firebaseApp = initializeApp(firebaseConfig);
// Initialize Firebase
const auth = getAuth();
const provider = new GithubAuthProvider();

export const LandingPage = () => {
  document.title = `Duckie AI`;
  const videoSrc = '/videos/demo_fast_2.mp4'

  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const signInWithGithub = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      if (token) {
        Cookies.set('githubToken', token, { expires: 7, secure: true });
      }
      setUser(result.user);
      navigate('/app');
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      }
    }
  }

  return (
    <ChakraProvider theme={landingPageTheme}>
      <Box bg={"background"} pt={"20px"}>
        <LandingPageHeader />
        {/* Hero Section */}
        <Container as={"section"}>
          <Box
            maxW={"1170px"}
            w={"full"}
            mx={"auto"}
            px={"16px"}
            py={{ base: "100px", md: "150px" }}
            backgroundImage={"/images/hero-bg.png"}
            backgroundRepeat={"no-repeat"}
            backgroundPosition={"right"}
          >
            <Flex
              flexDir={"column"}
              gap={"30px"}
              alignItems={"center"}
              justifyContent={"center"}
              width={"full"}
            >
              {/* Tag */}
              <Box
                bg={"navBg"}
                py={"4px"}
                px={"10px"}
                w={"fit-content"}
                mx={"auto"}
                border={"1px"}
                borderColor={"goldenBorder"}
                borderRadius={"full "}
              >
                <Text as={"h3"} color={"white"}>
                  Free public beta!
                </Text>
              </Box>

              {/* Main Heading */}
              <Text
                as={"h1"}
                color={"white"}
                fontSize={{ base: "4xl", lg: "6xl" }}
                textAlign={"center"}
                w={"90%"}
              >
                Reimagine Engineering
              </Text>

              {/* sub Heading */}
              <Text
                as={"h2"}
                color={"greyText"}
                fontSize={{ base: "16px", lg: "2xl" }}
                textAlign={"center"}
                w={"80%"}
              >
                Manage a team of AI software development companions that get your work done.
              </Text>

              {/* Button */}
              <Button
                color={"black"}
                py={{ base: "10px", md: "14px" }}
                px={{ base: "10px", md: "30px" }}
                border={"1px"}
                borderColor={"golden"}
                borderRadius={"10px"}
                boxShadow={"-2px -2px 30px -14px #FFDD00"}
                alignItems={"center"}
                bgColor={"golden"}
                onClick={signInWithGithub}
              >
                <Image
                  src="/images/logo-1.png"
                  alt="Duckie logo"
                  h={"28px"}
                  w={"28px"}
                  mr={{ base: "2px", md: "12px" }}
                />
                Try Duckie
              </Button>
            </Flex>
          </Box>
        </Container>
        {/* Video Holder */}
        <Container as={"section"} h={"100%"} pos={"relative"}>
          <Box
            pos={"absolute"}
            top={"-10%"}
            right={"10%"}
            zIndex={"10"}
            borderRadius={"200px"}
            h={"200px"}
            w={"200px"}
            bgColor={"golden"}
            filter={"blur(115px)"}
            opacity={"60%"}
          ></Box>
          <Box
            pos={"absolute"}
            top={"15%"}
            zIndex={"0"}
            borderRadius={"50% 50% 0% 0%"}
            h={"500px"}
            w={"full"}
            border={"0px"}
            bg={"transparent"}
            boxShadow={"-8px -50px 150px -50px rgba(255,221,0,0.64)"}
          ></Box>
          <Box maxW={"1170px"} w={"full"} mx={"auto"}>
            <Flex alignItems={"center"} justifyContent={"center"} width={"full"}>
              <Box
                top={"0"}
                maxW={"1170px"}
                w={{ base: "90%", lg: "full" }}
                mx={"auto"}
                h={"auto"}
                zIndex={"1"}
                bgColor={"black"}
                border={"1px"}
                borderColor={"goldenBorder"}
                borderRadius={"45px"}
                boxShadow={"-1px -3px 50px -20px #FFDD00"}
                overflow={"hidden"} 
              >
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  h={"100%"}
                >
                  <video autoPlay loop muted playsInline src={videoSrc} width='auto' height='100%' />
                </Flex>
              </Box>
            </Flex>
          </Box>
        </Container>
        {/* Backed By */}
        <Container as={"section"}>
          <Box maxW={"1170px"} w={{ base: "90%", lg: "full" }} mx={"auto"} paddingTop='70px'>
            <Text
              as={"h3"}
              color={"greyText"}
              fontSize={{ base: "14px", lg: "2xl" }}
              textAlign={"center"}
            >
              Backed by
            </Text>
            <Box h={"40px"}>
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                gap={"12px"}
                w={"full"}
              >
                <Link href={"https://www.ycombinator.com/"} isExternal>
                  <Image
                    src="/images/YC_logo.png"
                    alt="Y Combinator"
                    w={{ base: "180px", lg: "240px" }}
                  />
                </Link>
              </Flex>
            </Box>
          </Box>
        </Container>
        {/* Leads */}
        <Container as={"section"}>
          <Box
            maxW={"1170px"}
            w={{ base: "90%", lg: "full" }}
            mx={"auto"}
            mt={"100px"}
            p={"16px"}
          >
            <Text
              as={"h2"}
              color={"white"}
              fontSize={{ base: "2xl", lg: "4xl" }}
              textAlign={"center"}
              w={"full"}
              mx={"auto"}
              maxW={"570x"}
              alignItems={"center"}
              mb={"20px"}
            >
              <Flex
                alignItems={"center"}
                justifyContent={"center"}
                mx={"Auto"}
                gap={"12px"}
                w={"full"}
                flexWrap={"wrap"}
              >
                You be the lead. Let{" "}
                <Image
                  src="/images/logo-1.png"
                  alt="Duckie logo"
                  h={"36px"}
                  w={"36px"}
                />{" "}
                Duckie do the work.
              </Flex>
            </Text>
            {/* Define Objective */}
            <SimpleGrid
              w={"full"}
              border={"1px"}
              borderRadius={"20px"}
              borderColor={"goldenBorder"}
              column={{ base: 1, xl: 2 }}
              minChildWidth={{ base: "100%", xl: "50%" }}
              mx={"auto"}
              my={"40px"}
              pos={"relative"}
            >
              <Box
                pos={"absolute"}
                display={{ base: "none", xl: "block" }}
                top={"5%"}
                left={"45%"}
                w={"100px"}
                h={"100px"}
                backgroundColor={"#FFDD00"}
                borderRadius={"full"}
                filter={"blur(80px)"}
              ></Box>
              <Box p={"50px"}>
                <Flex
                  flexDirection={"column"}
                  alignItems={{ base: "center", xl: "flex-start" }}
                  justifyContent={"space-between"}
                  h={"full"}
                  gap={{ base: "50px" }}
                >
                  <Box
                    w={"56px"}
                    h={"56px"}
                    border={"1px"}
                    borderRadius={"5px"}
                    borderColor={"goldenBorder"}
                    boxShadow={"-2px -2px 30px -14px #FFDD00"}
                  >
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      h={"full"}
                      color={"white"}
                    >
                      1
                    </Flex>
                  </Box>
                  <Box>
                    <Text
                      as={"h3"}
                      color={"white"}
                      fontSize={{ base: "xl", lg: "3xl" }}
                      w={"full"}
                      mb={"10px"}
                      textAlign={{ base: "center", xl: "left" }}
                    >
                      Define Objective
                    </Text>
                    <Text
                      as={"h3"}
                      color={"greyText"}
                      fontSize={{ base: "14px", lg: "xl" }}
                      textAlign={{ base: "center", xl: "left" }}
                    >
                      Tell Duckie what you want it to work on. Duckie will ask you
                      questions to better define your goal.
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Box p={"10px"}>
                <Image
                  src="/images/create_agent.png"
                  alt="Define Objective Image"
                  m={"auto"}
                  borderRadius={"20px"}
                  maxWidth='520px'
                  w='100%'
                />
              </Box>
            </SimpleGrid>
            {/* Collaborative Planning */}
            <SimpleGrid
              w={"full"}
              border={"1px"}
              borderRadius={"20px"}
              borderColor={"goldenBorder"}
              column={{ base: 1, xl: 2 }}
              minChildWidth={{ base: "100%", xl: "50%" }}
              mx={"auto"}
              my={"40px"}
              pos={"relative"}
            >
              <Box
                pos={"absolute"}
                display={{ base: "none", xl: "block" }}
                top={"5%"}
                left={"45%"}
                w={"100px"}
                h={"100px"}
                backgroundColor={"#FFDD00"}
                borderRadius={"full"}
                filter={"blur(80px)"}
              ></Box>
              <Box p={"10px"}>
                <Image
                  src="/images/plan.png"
                  alt="Define Objective Image"
                  m={"auto"}
                  borderRadius={"20px"}
                  maxWidth='520px'
                  w='100%'
                />
              </Box>
              <Box p={"50px"}>
                <Flex
                  flexDirection={"column"}
                  alignItems={{ base: "center", xl: "flex-start" }}
                  justifyContent={"space-between"}
                  h={"full"}
                  gap={{ base: "50px" }}
                >
                  <Box
                    w={"56px"}
                    h={"56px"}
                    border={"1px"}
                    borderRadius={"5px"}
                    borderColor={"goldenBorder"}
                    boxShadow={"-2px -2px 30px -14px #FFDD00"}
                  >
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      h={"full"}
                      color={"white"}
                    >
                      2
                    </Flex>
                  </Box>
                  <Box>
                    <Text
                      as={"h3"}
                      color={"white"}
                      fontSize={{ base: "xl", lg: "3xl" }}
                      w={"full"}
                      mb={"10px"}
                      textAlign={{ base: "center", xl: "left" }}
                    >
                      Collaborative Planning
                    </Text>
                    <Text
                      as={"h3"}
                      color={"greyText"}
                      fontSize={{ base: "14px", lg: "xl" }}
                      textAlign={{ base: "center", xl: "left" }}
                    >
                      Duckie will come up with an implementation plan. Provide
                      feedback to Duckie's proposed plan until you are satisfied.
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </SimpleGrid>
            {/* Task Execution */}
            <SimpleGrid
              w={"full"}
              border={"1px"}
              borderRadius={"20px"}
              borderColor={"goldenBorder"}
              column={{ base: 1, xl: 2 }}
              minChildWidth={{ base: "100%", xl: "50%" }}
              mx={"auto"}
              my={"40px"}
              pos={"relative"}
            >
              <Box
                pos={"absolute"}
                display={{ base: "none", xl: "block" }}
                top={"5%"}
                left={"45%"}
                w={"100px"}
                h={"100px"}
                backgroundColor={"#FFDD00"}
                borderRadius={"full"}
                filter={"blur(80px)"}
              ></Box>
              <Box p={"50px"}>
                <Flex
                  flexDirection={"column"}
                  alignItems={{ base: "center", xl: "flex-start" }}
                  justifyContent={"space-between"}
                  h={"full"}
                  gap={{ base: "20px" }}
                >
                  <Box
                    w={"56px"}
                    h={"56px"}
                    border={"1px"}
                    borderRadius={"5px"}
                    borderColor={"goldenBorder"}
                    boxShadow={"-2px -2px 30px -14px #FFDD00"}
                  >
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      h={"full"}
                      color={"white"}
                    >
                      3
                    </Flex>
                  </Box>
                  <Box>
                    <Text
                      as={"h3"}
                      color={"white"}
                      fontSize={{ base: "xl", lg: "3xl" }}
                      w={"full"}
                      mb={"10px"}
                      textAlign={{ base: "center", xl: "left" }}
                    >
                      Task Execution
                    </Text>
                    <Text
                      as={"h3"}
                      color={"greyText"}
                      fontSize={{ base: "14px", lg: "xl" }}
                      textAlign={{ base: "center", xl: "left" }}
                    >
                      After laying out a plan, Duckie will move on to task
                      executions. You can provide feedback at any point to modify
                      the tasks.
                    </Text>
                  </Box>
                </Flex>
              </Box>
              <Box p={"10px"}>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  h="100%"
                >
                  <Image
                    src="/images/tasks.png"
                    alt="Define Objective Image"
                    borderRadius={"20px"}
                    maxWidth="520px"
                    w="100%"
                  />
                </Flex>
              </Box>
            </SimpleGrid>
            {/* Code Review */}
            <SimpleGrid
              w={"full"}
              border={"1px"}
              borderRadius={"20px"}
              borderColor={"goldenBorder"}
              column={{ base: 1, xl: 2 }}
              minChildWidth={{ base: "100%", xl: "50%" }}
              mx={"auto"}
              my={"40px"}
              pos={"relative"}
            >
              <Box
                pos={"absolute"}
                display={{ base: "none", xl: "block" }}
                top={"5%"}
                left={"45%"}
                w={"100px"}
                h={"100px"}
                backgroundColor={"#FFDD00"}
                borderRadius={"full"}
                filter={"blur(80px)"}
              ></Box>
              <Box p={"10px"}>
                <Flex
                  alignItems="center"
                  justifyContent="center"
                  h="100%"
                >
                  <Image
                    src="/images/code_review.png"
                    alt="Code Review"
                    borderRadius={"20px"}
                    maxWidth="520px"
                    w="100%"
                  />
                </Flex>
              </Box>
              <Box p={"50px"}>
                <Flex
                  flexDirection={"column"}
                  alignItems={{ base: "center", xl: "flex-start" }}
                  justifyContent={"space-between"}
                  h={"full"}
                  gap={{ base: "20px" }}
                >
                  <Box
                    w={"56px"}
                    h={"56px"}
                    border={"1px"}
                    borderRadius={"5px"}
                    borderColor={"goldenBorder"}
                    boxShadow={"-2px -2px 30px -14px #FFDD00"}
                  >
                    <Flex
                      alignItems={"center"}
                      justifyContent={"center"}
                      h={"full"}
                      color={"white"}
                    >
                      4
                    </Flex>
                  </Box>
                  <Box>
                    <Text
                      as={"h3"}
                      color={"white"}
                      fontSize={{ base: "xl", lg: "3xl" }}
                      w={"full"}
                      mb={"10px"}
                      textAlign={{ base: "center", xl: "left" }}
                    >
                      Code Review
                    </Text>
                    <Text
                      as={"h3"}
                      color={"greyText"}
                      fontSize={{ base: "14px", lg: "xl" }}
                      textAlign={{ base: "center", xl: "left" }}
                    >
                      After all tasks are finished, Duckie will publish a Pull Request, 
                      which you can review on GitHub and Duckie will make the changes for you.
                    </Text>
                  </Box>
                </Flex>
              </Box>
            </SimpleGrid>
          </Box>
        </Container>
        {/* Footer Banner */}
        <Container as={"section"}>
          <Box
            w={"full"}
            h={"620px"}
            mx={"auto"}
            p={"16px"}
            backgroundImage={'url("/images/footerbanner.png")'}
            backgroundRepeat={"no-repeat"}
            backgroundPosition={"center"}
          >
            <Flex
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              w={"full"}
              h={"full"}
              gap={"50px"}
            >
              <Box
                w={"56px"}
                h={"56px"}
                bg={"#0E1114"}
                opacity={"70%"}
                border={"1px"}
                borderRadius={"5px"}
                borderColor={"goldenBorder"}
                boxShadow={"-2px -2px 30px -14px #FFDD00"}
              >
                <Flex
                  alignItems={"center"}
                  justifyContent={"center"}
                  h={"full"}
                  color={"white"}
                >
                  <Image
                    src="/images/logo-1.png"
                    alt="Duckie logo"
                    h={"36px"}
                    w={"36px"}
                  />
                </Flex>
              </Box>
              <Text
                as={"h2"}
                color={"white"}
                fontSize={{ base: "2xl", lg: "4xl" }}
                textAlign={"center"}
                w={"full"}
                mx={"auto"}
                alignItems={"center"}
              >
                Try Duckie AI.
                <br /> Free public beta
              </Text>
              {/* Button */}
              <Button
                color={"black"}
                py={{ base: "8px", md: "12px" }}
                px={{ base: "10px", md: "30px" }}
                border={"1px"}
                borderColor={"golden"}
                borderRadius={"10px"}
                boxShadow={"-2px -2px 30px -14px #FFDD00"}
                alignItems={"center"}
                bgColor={"golden"}
                onClick={signInWithGithub}
              >
                <Image
                  src="/images/logo-1.png"
                  alt="Duckie logo"
                  h={"28px"}
                  w={"28px"}
                  mr={{ base: "2px", md: "12px" }}
                />
                Try Duckie
              </Button>
            </Flex>
          </Box>
        </Container>
        {/* Footer */}
        <Container as={"footer"} overflow={"hidden"} p={"20px"}>
          <Box p={"10px"} pt={"50px"} maxW={"1170px"} w={{ base: "90%", lg: "full" }} mx={"auto"}>
            <Flex
              height={"50px"}
              flexDirection={{ base: "column", md: "row" }}
              alignItems={"center"}
              justifyContent={"space-between"}
              width={"full"}
            >
              <Box p={"10px"} pos={"relative"}>
                <Box
                  pos={"absolute"}
                  top={"300%"}
                  left={"20%"}
                  w={"100px"}
                  h={"100px"}
                  backgroundColor={"#FFDD00"}
                  borderRadius={"full"}
                  filter={"blur(100px)"}
                ></Box>
                <Text
                  as={"h3"}
                  color={"greyText"}
                  fontSize={{ base: "14px", lg: "16px" }}
                >
                  © 2023 Duckie AI
                </Text>
              </Box>
              <HStack
                as={"nav"}
                spacing={"8"}
                display={"flex"}
                pos={"relative"}
              >
                <Box
                  pos={"absolute"}
                  top={"250%"}
                  left={"20%"}
                  w={"100px"}
                  h={"100px"}
                  backgroundColor={"#184165"}
                  borderRadius={"full"}
                  filter={"blur(60px)"}
                ></Box>
                <Box
                  as="a"
                  _hover={{
                    textDecoration: "none",
                    color: "golden",
                  }}
                  href={"Privacy-policy"}
                  color={"white"}
                >
                  <Text
                    as={"h3"}
                    color={"greyText"}
                    fontSize={{ base: "14px", lg: "16px" }}
                    _hover={{
                      textDecoration: "none",
                      color: "golden",
                    }}
                  >
                    Privacy Policy
                  </Text>
                </Box>
                <Box
                  as="a"
                  _hover={{
                    textDecoration: "none",
                    color: "golden",
                  }}
                  href={"terms-of-services"}
                  color={"white"}
                >
                  <Text
                    as={"h3"}
                    color={"greyText"}
                    fontSize={{ base: "14px", lg: "16px" }}
                    _hover={{
                      textDecoration: "none",
                      color: "golden",
                    }}
                  >
                    Terms of Services
                  </Text>

                </Box>
              </HStack>
            </Flex>
          </Box>
        </Container>
      </Box>
    </ChakraProvider>
  )
}