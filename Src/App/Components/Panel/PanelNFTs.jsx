import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";

import Title from "Components/Typography/Title";
import Text from "Components/Typography/Text";
import Button from "Components/Buttons/Button";
import { withTranslation } from "react-i18next";

/**
 *  Main Panel class for the NFTs
 *  Pass in multiple prop types to display on screen
 *  title, image, hashrate, selectButton
 */
class PanelNFTs extends React.Component {
  constructor(props) {
    super(props);
  }
  render = () => {
    const {
      title,
      image,
      hashrate,
      selectButton,
      selected,
      i18n,
      maxSelected,
      slug,
    } = this.props;

    return (
      <Container {...this.props}>
        <ContainerInner {...this.props}>
          {title ? (
            <TitleWrapper
              theme="light"
              shadow={true}
              tag="h2"
              align="center"
              spacing="small"
              size="smaller"
              color={variable.white}
            >
              {title}
            </TitleWrapper>
          ) : null}
          {hashrate ? (
            <Text
              tag="div"
              color={variable.white}
              spacing="small"
              align="center"
              weight="bold"
              size="small"
              width="100%"
            >
              Hashrate:{" "}
              <Text
                tag="span"
                color={variable.green}
                spacing="large"
                align="center"
                weight="bold"
                size="small"
              >
                {hashrate}
              </Text>
            </Text>
          ) : !hashrate && selectButton ? (
            <Text
              tag="div"
              color={variable.white}
              spacing="small"
              align="center"
              weight="bold"
              size="small"
              width="100%"
            >
              Hashrate:{" "}
              <Text
                tag="span"
                color={variable.green}
                spacing="large"
                align="center"
                weight="bold"
                size="small"
              >
                0
              </Text>
            </Text>
          ) : null}

          {image ? (
            <Image src={image} slug={slug} alt="" />
          ) : (
            <NoImage>No Image found</NoImage>
          )}

          {selectButton && hashrate ? (
            <ButtonContainer
              theme={selected ? "green" : "purple"}
              disabled={maxSelected}
            >
              {selected ? i18n.t("dashboard.mining.selected") : selectButton}
            </ButtonContainer>
          ) : null}
        </ContainerInner>
      </Container>
    );
  };
}

const TitleWrapper = styled(Title)`
  font-size: ${variable.textSmall};

  ${media.tablet`
        font-size: ${variable.textMedium};
    `}

  ${media.desktop`
        font-size: ${variable.textLarge};
    `}
`;
const Container = styled.div`
  width: 100%;
  height: 100%;
  display: table;
  text-align: center;
  padding: 0.2rem;
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-image: linear-gradient(136deg, #8c14cf 0%, #01c3c5 100%);
  cursor: pointer;

  ${(props) =>
    props.selected
      ? `
        background-image:  linear-gradient(to right, #00ffe6 0%,#00fffd 100%);
        box-shadow: 0 0 34px 0 rgba(0,217,255,0.50);
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

const ButtonContainer = styled(Button)`
  margin-top: auto;

  ${(props) =>
    props.disabled
      ? `
        opacity: 0.2;
    `
      : null}
`;

const ContainerInner = styled.div`
  padding: ${variable.spacingMedium};
  font-family: ${variable.headingFontFamily};
  text-decoration: none;
  width: 100%;
  height: 100%;

  text-align: center;
  color: ${variable.light};
  font-size: ${variable.textMedium};
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  align-items: center;

  ${media.tablet`
        padding: ${variable.spacingMedium};
    `}

  ${media.large_desktop`
        padding: ${variable.spacingSmall} ${variable.spacingSmall};
        font-size: ${variable.textLarge};
    `}

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
`;

const NoImage = styled.div`
  width: 75%;
  height: 220px;
  object-fit: contain;
  margin-bottom: ${variable.spacingSmall};
  display: flex;
  align-items: center;
  justify-content: center;

  ${media.tablet`
        max-width: 150px;
    `}

  ${media.large_desktop`
        max-width: 200px;
    `}
`;

const Image = styled.img`
  width: 75%;
  height: 220px;
  object-fit: contain;
  margin-bottom: ${variable.spacingSmall};

  ${media.tablet`
        max-width: 150px;
    `}

  ${media.large_desktop`
        max-width: 200px;
        
        ${(props) =>
          props.slug === "warriders"
            ? `
            max-width: 300px;
        `
            : null}
    `}
`;

export default withTranslation()(PanelNFTs);
