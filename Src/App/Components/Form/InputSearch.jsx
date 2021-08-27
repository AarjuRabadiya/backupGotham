import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";

import {
  media,
  //  sizes
} from "Base/Media";

const Container = styled.div`
  width: 100%;
  display: table;
  text-align: center;
  padding: 0.2rem;
  clip-path: polygon(0 0%, 96% 0, 100% 10px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-image: linear-gradient(136deg, #8c14cf 0%, #01c3c5 100%);
  cursor: pointer;
`;

const ContainerInner = styled.div`
  text-decoration: none;
  width: 100%;
  display: table;
  text-align: center;
  padding: ${variable.spacingSmaller};
  clip-path: polygon(0 0%, 96% 0, 100% 10px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-color: rgba(0, 0, 0, 0.9);

  ${media.tablet`
        font-size: ${variable.textLarge};
    `}
`;

const Input = styled.input`
  width: 100% !important;
  outline: 0;
  border: 0;
  background: transparent;
  font-family: ${variable.bodyFontFamily};
  color: ${variable.light};
  font-size: ${variable.textMedium};
`;

export default class InputSearch extends React.Component {
  constructor(props) {
    super();
  }

  render = () => {
    const { type } = this.props;

    return (
      <Container {...this.props}>
        <ContainerInner>
          <Input {...this.props} />
        </ContainerInner>
      </Container>
    );
  };
}
