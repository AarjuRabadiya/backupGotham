import React from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
import * as variable from "Base/Variables";
import Title from "Components/Typography/Title";
import Text from "Components/Typography/Text";
import Transition from "Components/Transition/Transition";
import Select from "Components/Select/Select";
import { media } from "Base/Media";
import Button from "Components/Buttons/Button";

@inject("MiningStore", "QuestStore")
@observer
class PanelMining extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hashrate: 0,
      cloudminingPool: [],
      selectPoolCode: {},
      selectedCode: "",
      poolErrorMessage: false,
      userPool: null,
    };
  }
  componentDidMount() {
    this.getTotalHashrate();
    let { AuthStore } = this.props;
    this.setState({
      userPool: AuthStore.userPool,
    });
  }
  componentDidUpdate(prevProps) {
    const { selected } = this.props;

    if (
      prevProps.selected.length !== selected.length &&
      selected.length !== 0
    ) {
      this.getTotalHashrate();
    }
  }

  startMiningEvent = (e) => {
    const { MiningStore, cloudminingPool } = this.props;
    let { selectedCode } = this.state;
    if (cloudminingPool.length !== 0) {
      if (selectedCode === "") {
        this.setState({
          poolErrorMessage: true,
        });
      } else {
        this.setState({
          poolErrorMessage: false,
        });
      }
    }

    if (MiningStore.totalHashrate > 0) {
      if (e === "group") {
        this.props.startMiningEvent(e, selectedCode);
      }
      if (e === "solo") {
        this.setState(
          {
            poolErrorMessage: false,
            selectedCode: "",
          },
          () => {
            this.props.startMiningEvent(e, selectedCode);
          }
        );
      }
    }
  };

  getTotalHashrate = () => {
    setTimeout(() => {
      const { MiningStore, QuestStore } = this.props;
      let hashrates = [];

      MiningStore.defaultTokens.map((item, key) => {
        if (MiningStore.selectedNFT.includes(item._id.$oid)) {
          hashrates.push(item.hashrate);
        }
      });

      let newHashrate = hashrates.reduce(function (a, b) {
        return a + b;
      }, 0);

      MiningStore.setState("totalHashrate", newHashrate);
    });
  };
  selectOption = (e) => {
    this.setState({
      selectPoolCode: e,
      selectedCode: e.pool_code,
      poolErrorMessage: false,
    });
  };

  render = (props) => {
    const {
      title,
      selected,
      description,
      i18n,
      MiningStore,
      QuestStore,
      AuthStore,
      cloudminingPool,
      selectPoolCode,
    } = this.props;
    let { poolErrorMessage, userPool } = this.state;

    return (
      <ContainerWrapper>
        <Container {...this.props}>
          <Transition duration={0.4}>
            <ContainerInner {...this.props}>
              <SectionHeader>
                <SectionDescriptionGroup>
                  {title ? (
                    <Title
                      theme="light"
                      shadow={true}
                      tag="h2"
                      align="left"
                      spacing="smaller"
                      size="smaller"
                      color={variable.green}
                    >
                      <span>
                        {title} {MiningStore.selectedNFT.length} / {9}
                      </span>
                    </Title>
                  ) : null}

                  {/* {description ? (
                    <Text
                      tag="div"
                      color={variable.white}
                      spacing="smaller"
                      weight="500"
                      size="large"
                    >
                      {description}
                    </Text>
                  ) : null} 
                  */}
                  {description && MiningStore.totalHashrate > 0 ? (
                    <Text
                      tag="div"
                      color={variable.white}
                      spacing="smaller"
                      weight="500"
                      size="large"
                    >
                      {description}
                    </Text>
                  ) : (
                    <Text
                      tag="div"
                      color={variable.white}
                      spacing="smaller"
                      weight="500"
                      size="large"
                    >
                      Sorry, Hash rate is grater than zero.
                    </Text>
                  )}
                </SectionDescriptionGroup>

                <SectionHashrateGroup>
                  {MiningStore.totalHashrate > 0 ? (
                    <Title
                      theme="light"
                      shadow={true}
                      tag="h2"
                      align="left"
                      spacing="smaller"
                      size="smallest"
                      color={variable.white}
                    >
                      {i18n.t("dashboard.mining.hashrate")}
                      <Text
                        tag="span"
                        color={variable.purple}
                        spacing="smaller"
                        weight="500"
                        size="large"
                      >
                        {QuestStore.totalBoost > 1 ? (
                          <span>
                            <Strike>{MiningStore.totalHashrate}</Strike>{" "}
                            {MiningStore.totalHashrate * QuestStore.totalBoost}{" "}
                            🔥
                          </span>
                        ) : (
                          MiningStore.totalHashrate +
                          (AuthStore.user_boost ? AuthStore.user_boost : 0)
                        )}
                      </Text>
                    </Title>
                  ) : null}

                  {QuestStore.selectedQuests.length > 0 ? (
                    <Title
                      theme="light"
                      shadow={true}
                      tag="h2"
                      align="left"
                      spacing="smaller"
                      size="smallest"
                      color={variable.white}
                    >
                      {i18n.t("dashboard.mining.quests.boost")}:{" "}
                      <Text
                        tag="span"
                        color={variable.purple}
                        spacing="smaller"
                        weight="500"
                        size="large"
                      >
                        {QuestStore.totalBoost}x🔥
                      </Text>
                    </Title>
                  ) : null}
                </SectionHashrateGroup>
              </SectionHeader>

              {/* <ButtonWrapper onClick={(e) => this.startMiningEvent(e) } theme="purple" href="#" width="auto" size="wide">
                   {i18n.t('dashboard.mining.start') }
               </ButtonWrapper> */}

              {MiningStore.totalHashrate > 0 &&
              AuthStore.mm_address === null ? (
                <Title
                  theme="light"
                  shadow={true}
                  tag="h2"
                  align="left"
                  spacing="smaller"
                  size="smallest"
                  color={variable.white}
                >
                  <Text
                    tag="div"
                    color={variable.white}
                    spacing="smaller"
                    weight="500"
                    size="large"
                  >
                    Please connect with meta mask
                  </Text>
                </Title>
              ) : (
                <MiningDiv>
                  <ButtonWrapper
                    onClick={(e) => this.startMiningEvent("solo")}
                    theme="purple"
                    href="#"
                    width="auto"
                    size="wide"
                    style={{ display: "table" }}
                  >
                    Solo Mining
                  </ButtonWrapper>
                  {cloudminingPool.length !== 0 && (
                    <MiningSearch>
                      <Select
                        value={selectPoolCode}
                        placeholder={"Select pool name"}
                        handleChange={this.selectOption}
                        options={cloudminingPool}
                        border={`2px solid #8c14cf`}
                        color={`${variable.whiteColor}`}
                      />
                    </MiningSearch>
                  )}
                  {poolErrorMessage && (
                    <Message>Please select pool code</Message>
                  )}
                  {(userPool !== null || cloudminingPool.length !== 0) && (
                    <ButtonWrapper
                      onClick={(e) => this.startMiningEvent("group")}
                      theme="purple"
                      href="#"
                      width="auto"
                      size="wide"
                      style={{ display: "table" }}
                    >
                      Group Mining
                    </ButtonWrapper>
                  )}
                </MiningDiv>
              )}
            </ContainerInner>
          </Transition>
        </Container>
      </ContainerWrapper>
    );
  };
}
const MiningDiv = styled.div``;
const ButtonWrapper = styled(Button)`
  width: 100%;
  margin-bottom: 10px;
  ${media.tablet`
        width: auto;
    `}
`;
const Message = styled.div`
  display: flex;
  margin-bottom: 20px;
  margin-top: -10px;
`;
// const ButtonWrapper = styled(Button)`
//     width: 100%;

//     ${media.tablet`
//         width: auto;
//     `}
// `;
const MiningSearch = styled.div`
  display: block;
  color: ${variable.whiteColor};
  width: 100%;
  margin-bottom: 20px;
  margin-top: 20px;
  ${media.tablet`
    display: flex;
    width: 30%;
  `}
`;
const SectionDescriptionGroup = styled.div``;

const SectionHashrateGroup = styled.div`
  display: flex;
  justify-content: space-between;

  ${media.tablet`
        flex-direction: column;
        align-items: flex-end;
        margin-left: auto;
    `}
`;

const Strike = styled.span`
  text-decoration: line-through;
  display: inline-block;
  vertical-align: top;
  margin-left: ${variable.spacingSmaller};
  color: ${variable.green};
  font-size: ${variable.textSmall};
`;

const ContainerWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 999;
  overflow: hidden;

  ${media.desktop`
        position: static;

    `}
`;

const SectionHeader = styled.div`
  ${media.tablet`
        display: flex;
       justify-content: space-between;
    `}
`;

const Container = styled.div`
  width: 100%;
  display: table;
  text-align: center;
  cursor: pointer;
  padding: 0.4rem;
  background-color: rgba(0, 0, 0, 0.9);
  border-top: 1px solid ${variable.green};

  ${media.desktop`
        border: 0;
        margin-bottom: ${variable.spacingSmall};
        padding: 0.2rem;
        clip-path: polygon(0 0%,98% 0,100% 30px,100% 100%,2% 100%,0 100%,0 0%);
        background-image: linear-gradient(136deg, #8C14CF 0%, #01C3C5 100%);
    `}
`;

const ContainerInner = styled.div`
  font-family: ${variable.headingFontFamily};
  text-decoration: none;
  width: 100%;
  display: table;
  text-align: center;
  color: ${variable.light};
  font-size: ${variable.textMedium};
  padding: ${variable.spacingSmaller} ${variable.spacingSmaller};

  ${media.desktop`
        clip-path: polygon(0 0%,98% 0,100% 30px,100% 100%,2% 100%,0 100%,0 0%);
        background-color: #0f0a2b;
        padding: calc(${variable.spacingSmall} * 2.4);
        font-size: ${variable.textLarge};
    `}
`;

export default withTranslation()(PanelMining);
