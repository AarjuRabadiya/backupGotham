import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";

import {
  media,
  //  sizes
} from "Base/Media";

const InputContainer = styled.input`
  background: #001928;
  border: 0;
  outline: 0;
  padding: ${variable.spacingSmall};
  color: ${variable.light};
  font-size: ${variable.textSmall};
  font-family: ${variable.headingFontFamily};
  font-weight: 400;
  clip-path: polygon(95% 0, 100% 20px, 100% 100%, 0 100%, 0 0);
  border-left: 2px solid ${variable.green};
  width: 100%;
  border-radius: 0;
  -webkit-appearance: none;

  ${media.tablet`
        font-size: ${variable.textMedium};
    `}
`;

export default class Input extends React.Component {
  constructor(props) {
    super();
  }

  render = () => {
    const { type } = this.props;

    return <InputContainer {...this.props} />;
  };
}
