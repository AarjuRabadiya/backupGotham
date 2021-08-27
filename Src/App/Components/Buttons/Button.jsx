import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import {
  // ThemeProvider,
  css,
} from "styled-components";
import {
  media,
  //  sizes
} from "Base/Media";

const purple = css`
  background: #6727cf; /* Old browsers */
  background: linear-gradient(to right, #f064c1 -106%, #6727cf 100%);
`;

const green = css`
  background: linear-gradient(to right, #64f0a1 0%, #27a8cf 100%);
  color: #000;
`;

const orange = css`
  background: #e8821f;
  color: #000;
`;

const ButtonContainer = styled.a`
  font-family: ${variable.headingFontFamily};
  text-transform: uppercase;
  text-decoration: none !important;
  width: 100%;
  display: table;
  text-align: center;
  color: ${variable.light};
  font-size: ${variable.textMedium};
  padding: ${variable.spacingSmaller} ${variable.spacingSmaller};
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  clip-path: polygon(0 0%, 98% 0, 100% 12%, 100% 100%, 2% 100%, 0 87%, 0 0%);
  cursor: pointer;
  &:hover {
    color: ${variable.light};
  }
  ${(props) =>
    props.width
      ? `
        width: ${props.width};
    `
      : null}

  ${media.tablet`
        padding: ${variable.spacingSmall} ${variable.spacingSmall};
        font-size: ${variable.textLarge};

         ${(props) =>
           props.size === "wide"
             ? `
            padding: ${variable.spacingSmaller} ${variable.spacingMedium};
        `
             : null}
    `}

    ${(props) =>
    props.size === "wide"
      ? `
        padding: ${variable.spacingSmaller} ${variable.spacingSmall};
    `
      : null}

    ${(props) =>
    props.theme === "purple"
      ? `
        ${purple}
    `
      : (props) =>
          props.theme === "green"
            ? `
        ${green}
    `
            : (props) =>
                props.theme === "metamask"
                  ? `
        ${orange}
    `
                  : null}
`;

export default class Button extends React.Component {
  constructor(props) {
    super();
  }

  render = () => {
    return <ButtonContainer {...this.props} />;
  };
}
