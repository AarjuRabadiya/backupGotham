import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";

/**
 *  Main Panel class for the NFTs
 *  Pass in multiple prop types to display on screen
 *  title, image, hashrate, selectButton
 */
class Panel extends React.Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    return (
      <Container {...this.props}>
        <ContainerInner {...this.props}>{this.props.children}</ContainerInner>
      </Container>
    );
  };
}

const Container = styled.div`
  width: 100%;
  // display: table;
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  text-align: center;
  padding: 0.2rem;
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-image: linear-gradient(to right, #00ffe6 0%, #00fffd 100%);
  cursor: pointer;
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);

    background-color: ${variable.black};
  }

  ::-webkit-scrollbar {
    height: 10px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: ${variable.green};
  }
  ${(props) =>
    props.theme
      ? `
        background-image: linear-gradient(136deg, #8C14CF 0%, #01C3C5 100%);
    `
      : null}

  ${(props) =>
    props.content === "centered"
      ? `
        padding-bottom: 100%;
        position: relative;
    `
      : null}
`;

const ContainerInner = styled.div`
  font-family: ${variable.headingFontFamily};
  text-decoration: none;
  width: 100%;
  // display: table;
  text-align: center;
  color: ${variable.light};
  font-size: ${variable.textMedium};
  padding: ${variable.spacingSmaller} ${variable.spacingSmaller};
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-color: rgba(0, 0, 0, 0.9);
  display: inline-block;
  vertical-align: top;
  overflow: auto;
  ::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: ${variable.black};
  }

  ::-webkit-scrollbar {
    height: 10px;
    background-color: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: ${variable.green};
  }
  ${(props) =>
    props.content === "centered"
      ? `
        display: flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 3px;
        left: 3px;
        width: calc(100% - 6px);
        height: calc(100% - 6px);
        z-index: 99999;
    `
      : null}

  ${media.tablet`
        padding: calc(${variable.spacingSmall} * 1.8);
        font-size: ${variable.textLarge};
    `}
`;

export default Panel;
