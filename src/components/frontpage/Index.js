import React from "react";
import styled from "styled-components";
import Header from "./Header";
import Steps from "./Steps";

const ContainerDiv = styled.div`
  max-width: 1400px;
  margin: auto;
`;
const Content = styled.div`
  max-width: 1400px;
  margin: auto;
  background: rgb(249, 247, 247);
  padding-top: 100px;
  padding-bottom: 200px;
`;

const Heading = styled.h1`
  text-align: center;
`;

const Frontpage = props => (
  <ContainerDiv>
    <Header {...props} />
    <Content>
      <Heading>How it works</Heading>
      <Steps />
    </Content>
  </ContainerDiv>
);

export default Frontpage;