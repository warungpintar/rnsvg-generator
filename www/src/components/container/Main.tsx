import React from "react";
import Head from "next/head";
import { Container, Stack, Box, Heading, Text } from "@chakra-ui/react";

interface MainContainerProps {
  title: string;
  description?: string;
}

const MainContainer: React.FC<MainContainerProps> = (props) => {
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box>
        <Box bg="yellow.300" color="gray.700">
          <Container maxW="8xl" py="4rem">
            <Stack>
              <Heading>{props.title}</Heading>
              <Text>{props.description}</Text>
            </Stack>
          </Container>
        </Box>
        <Container my="1.5rem" mx="auto" maxW="8xl">
          {props.children}
        </Container>
      </Box>
    </>
  );
};

export default MainContainer;
