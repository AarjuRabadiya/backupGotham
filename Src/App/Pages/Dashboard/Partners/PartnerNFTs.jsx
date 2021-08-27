import React from "react";
import styled, { keyframes } from "styled-components";
import * as variable from "Base/Variables";

import { withTranslation } from "react-i18next";
import Title from "Components/Typography/Title";
import Button from "Components/Buttons/Button";
import { media } from "Base/Media";

class PartnerNFTs extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  /**
   * Check the Image exists
   * @param url
   * @returns {*}
   */
  checkImageExists = (url, name = "") => {
    let img;

    try {
      img = require(`Pages/Dashboard/Mining/assets/${url}@2x.png`);
    } catch (e) {
      img = require(`Pages/Dashboard/Mining/assets/default@2x.png`);
    }

    return img;
  };

  openWindow = (res) => {
    let url = process.env.OPENSEA_URL + res.opensea_address;

    if (res.mongo_table === "pepemon") {
      url =
        "https://opensea.io/collection/pepemonfactory?ref=0x6aa6940525c96324D6C3f174e15f553A4B59D8D0";
    }

    if (res.mongo_table === "bondly") {
      url = "https://bondly.finance";
    }

    window.open(url, "_blank");
  };

  render = () => {
    const { i18n, nfts } = this.props;

    return (
      <Container {...this.props}>
        <PanelWrapper>
          {nfts &&
            nfts.map((res, key) => {
              return res.mongo_table !== "cryptomorph3" ? (
                <PanelContainer key={key}>
                  <Panel onClick={(e) => this.openWindow(res)}>
                    <PanelInner>
                      <Title
                        theme="light"
                        shadow={true}
                        tag="h4"
                        align="center"
                        spacing="small"
                        size="smaller"
                        color={variable.green}
                      >
                        {res.name}
                      </Title>
                      <Image
                        src={this.checkImageExists(res.mongo_table, res.name)}
                        alt=""
                      />
                      <ButtonContainer
                        theme="purple"
                        href={
                          res.mongo_table === "pepemon"
                            ? "https://opensea.io/collection/pepemonfactory?ref=0x6aa6940525c96324D6C3f174e15f553A4B59D8D0"
                            : res.mongo_table === "bondly"
                            ? "https://bondly.finance"
                            : process.env.OPENSEA_URL + res.opensea_address
                        }
                        width="auto"
                        size="wide"
                        target="_blank"
                      >
                        {i18n.t("dashboard.partners.buy")}
                      </ButtonContainer>
                    </PanelInner>
                  </Panel>
                </PanelContainer>
              ) : null;
            })}
        </PanelWrapper>
      </Container>
    );
  };
}

const Container = styled.div`
  ${media.tablet`
        display: flex;
        flex-wrap: wrap;
    `}
`;

const Image = styled.img`
  width: 16rem;
  height: 10rem;
  object-fit: contain;
  object-position: center;
  align-self: center;
  margin-top: ${variable.spacingSmall};
  margin-bottom: ${variable.spacingSmall};
`;

const PanelContainer = styled.div`
  margin-bottom: ${variable.spacingMedium};

  ${media.tablet`
        width: 50%;
        padding: 0 ${variable.spacingMedium};
    `}

  ${media.large_desktop`
        width: 33.333%;
        margin-bottom: ${variable.spacingMedium};
        padding: 0 ${variable.spacingMedium};
    `}
`;

const PanelWrapper = styled.div`
  ${media.tablet`
        margin: 0 -${variable.spacingMedium};
        width: 100%;
        display: flex;
        flex-wrap: wrap;
    `}
`;

const animation = keyframes`
    0% {background-position:0% 50%}
    50% {background-position:100% 50%}
    100% {background-position:0% 50%}
`;

const Panel = styled.div`
  width: 100%;
  height: 100%;
  display: table;
  text-align: center;
  padding: 0.2rem;
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-image: linear-gradient(200deg, #8c14cf 0%, #01c3c5 100%);
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  animation: ${animation} 30s ease infinite;

  &:hover {
    animation: ${animation} 30s ease infinite;
    transform: scale(1.05);
  }
`;

const ButtonContainer = styled(Button)`
  margin-top: auto;
`;

const PanelInner = styled.div`
  padding: ${variable.spacingLarge};
  font-family: ${variable.headingFontFamily};
  text-decoration: none;
  width: 100%;
  height: 100%;

  text-align: center;
  color: ${variable.light};
  font-size: ${variable.textMedium};
  padding: ${variable.spacingSmaller} ${variable.spacingSmaller};
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.tablet`
        padding: ${variable.spacingMedium};
        font-size: ${variable.textLarge};
    `}
`;

export default withTranslation()(PartnerNFTs);
