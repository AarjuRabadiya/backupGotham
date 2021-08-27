import React from "react";
import styled from "styled-components";
// import * as variable from 'Base/Variables'

const Svg = styled.svg`
  width: ${(props) => props.width + "px"};
  height: ${(props) => props.height + "px"};
  cursor: pointer;
  max-width: 70%;
`;

export default class Icon extends React.Component {
  constructor(props) {
    super(props);
  }

  render = (props) => {
    const { width, height, path, fill } = this.props;

    return (
      <Svg
        viewBox={"0 0 " + width + " " + height}
        xmlns="http://www.w3.org/2000/svg"
        width={width}
        height={height}
      >
        <path fill={fill} fillRule="evenodd" d={path} />
      </Svg>
    );
  };
}
