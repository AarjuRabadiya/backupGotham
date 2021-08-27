import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import Title from "Components/Typography/Title";
import Text from "Components/Typography/Text";
import Transition from "Components/Transition/Transition";
import Button from "Components/Buttons/Button";

import { media } from "Base/Media";

import { withTranslation } from "react-i18next";
import { nextParticipationWindow } from "Base/Utilities";
import Link from "Components/Buttons/Link";

class PanelMining extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hashrate: 0,
    };
  }

  render = (props) => {
    const { title, nextWindow, i18n, hashrate, ago } = this.props;
    return (
      <Transition duration={2}>
        <Container {...this.props}>
          <ContainerInner {...this.props}>
            <SectionHeader>
              {title ? (
                <Title
                  theme="light"
                  shadow={true}
                  tag="h2"
                  align="left"
                  spacing="small"
                  size="smaller"
                  color={variable.green}
                >
                  {title}
                </Title>
              ) : null}
            </SectionHeader>

            {nextWindow ? (
              <React.Fragment>
                <Text
                  tag="p"
                  color={variable.white}
                  spacing="smallest"
                  weight="500"
                  size="large"
                >
                  {i18n.t("dashboard.participation.submitted")} {ago} with a
                  hashrate of {hashrate}
                </Text>

                <Text
                  tag="p"
                  color={variable.white}
                  spacing="smaller"
                  weight="500"
                  size="large"
                >
                  {i18n.t("dashboard.mining.window")}{" "}
                  {nextParticipationWindow(nextWindow)}
                </Text>

                <Button
                  theme="purple"
                  onClick={() => this.props.history.push("/dashboard/stats")}
                >
                  {i18n.t("dashboard.stats.button")}
                </Button>
              </React.Fragment>
            ) : null}
          </ContainerInner>
        </Container>
      </Transition>
    );
  };
}

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Container = styled.div`
  width: 100%;
  display: table;
  text-align: center;
  padding: 0.2rem;
  clip-path: polygon(0 0%, 98% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-image: linear-gradient(to right, #00ffe6 0%, #00fffd 100%);
  cursor: pointer;
  margin-bottom: ${variable.spacingMedium};

  ${media.tablet`
        margin-top: ${variable.spacingMedium};
    `}
`;

const ContainerInner = styled.div`
  font-family: ${variable.headingFontFamily};
  text-decoration: none;
  width: 100%;
  display: table;
  text-align: center;
  color: ${variable.light};
  padding: ${variable.spacingMedium};
  clip-path: polygon(0 0%, 98% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-color: rgba(0, 0, 0, 0.9);

  ${media.tablet`
        padding: calc(${variable.spacingSmall} * 1.8);
    `}
`;

const MemoizedPanel = React.memo(PanelMining);

export default withTranslation()(MemoizedPanel);
