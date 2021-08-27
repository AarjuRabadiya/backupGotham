import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";

import Panel from "Components/Panel/Panel";
import Title from "Components/Typography/Title";
import { inject, observer } from "mobx-react";

@inject("MiningStore")
@observer
class SelectedNFTs extends React.Component {
  constructor(props) {
    super(props);
  }
  /**
   * Remove the NFT from the list
   * @param e
   * @param key
   */
  removeNFT = (e, key) => {
    e.preventDefault();
    this.props.removeNFT(key);
  };

  render = () => {
    const { selected, MiningStore } = this.props;

    return (
      <PanelContainer>
        <Title
          shadow={false}
          tag="h4"
          align="left"
          spacing="medium"
          size="smaller"
          color={variable.greenLight}
        >
          {this.props.title}
        </Title>

        <List>
          {MiningStore.defaultTokens &&
            MiningStore.defaultTokens.map((token, i) => {
              return selected.includes(token._id.$oid) ? (
                <ListItem key={i}>
                  <ImageContainer>
                    <Image
                      src={token.image_url}
                      width={40}
                      height={40}
                      alt=""
                    />
                    <TickIcon
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 21 21"
                    >
                      <defs>
                        <linearGradient
                          id="b"
                          x1="59.903%"
                          x2="-21.496%"
                          y1="142.584%"
                          y2="-334.113%"
                        >
                          <stop offset="0%" stopColor="#27CF7B" />
                          <stop offset="100%" stopColor="#6475F0" />
                        </linearGradient>
                        <path
                          id="a"
                          d="M10.462 20.925c1.885 0 3.629-.471 5.232-1.413a10.572 10.572 0 003.818-3.818 10.142 10.142 0 001.413-5.232c0-1.884-.471-3.628-1.413-5.23a10.572 10.572 0 00-3.818-3.819A10.142 10.142 0 0010.462 0c-1.884 0-3.628.471-5.23 1.413a10.572 10.572 0 00-3.819 3.818A10.142 10.142 0 000 10.462c0 1.885.471 3.629 1.413 5.232a10.572 10.572 0 003.818 3.818 10.142 10.142 0 005.231 1.413zM8.775 16.2a.562.562 0 01-.464-.211l-4.388-4.387a.562.562 0 01-.21-.465c0-.196.07-.351.21-.464l.929-.97c.14-.14.302-.21.485-.21s.344.07.485.21l2.953 2.953 6.328-6.328c.14-.14.302-.21.485-.21s.345.07.485.21l.929.97c.14.113.21.268.21.464 0 .197-.07.352-.21.465l-7.763 7.762a.562.562 0 01-.464.211z"
                        />
                      </defs>
                      <g fill="none" fillRule="evenodd">
                        <circle cx="9.5" cy="10.5" r="9.5" fill="#000" />
                        <g fillRule="nonzero">
                          <use fill="#0C4D56" xlinkHref="#a" />
                          <use fill="url(#b)" xlinkHref="#a" />
                        </g>
                      </g>
                    </TickIcon>
                  </ImageContainer>
                  <ListItemContent>
                    <Name>
                      <Title
                        shadow={false}
                        tag="h5"
                        align="left"
                        spacing="smallest"
                        size="smallest"
                        color={variable.white}
                      >
                        {token.name}
                      </Title>
                    </Name>
                    <Remove
                      onClick={() => MiningStore.removeSelectedNFT(token)}
                    >
                      Remove
                    </Remove>
                  </ListItemContent>
                </ListItem>
              ) : null;
            })}
        </List>
      </PanelContainer>
    );
  };
}

const PanelContainer = styled(Panel)`
  position: sticky;
  top: 0;
`;

const List = styled.ul`
  max-height: 300px;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
    scrollbar-width: none;
  }
`;
const ListItem = styled.li`
  display: flex;
  margin-bottom: ${variable.spacingSmall};
`;

const Name = styled.div``;

const Remove = styled.a`
  text-decoration: underline;
  color: ${variable.purple};
  font-size: ${variable.textSmall};
  text-align: left;
  font-family: ${variable.bodyFontFamily};
`;

const ImageContainer = styled.div`
  position: relative;
  margin-right: ${variable.spacingMedium};
  flex-shrink: 0;
`;

const Image = styled.img`
  border-radius: 100%;
  border: 2px solid ${variable.green};
  align-self: flex-start;
  width: 4rem;
  height: 4rem;
  flex-shrink: 0;
`;

const ListItemContent = styled.div`
  display: flex;
  flex-direction: column;
`;

const TickIcon = styled.svg`
  position: absolute;
  top: 0;
  right: -10px;
  width: 2rem;
  height: 2rem;
`;

export default SelectedNFTs;
