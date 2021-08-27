import React from "react";
import styled, { keyframes } from "styled-components";
import * as variable from "Base/Variables";
import { withTranslation } from "react-i18next";
import { media } from "Base/Media";
import FilterMenu from "./FilterMenu";
import {
  mergeNFTArray,
  removeValueFromArray,
  createParticipationString,
} from "Base/Utilities";
import PanelNFTs from "Components/Panel/PanelNFTs";
import PanelMining from "Components/Panel/PanelMining";
import SelectedNFTs from "../SelectedNFTs/SelectedNFTs";
import Transition from "Components/Transition/Transition";
import Loader from "Components/Loader/Loader";
import Quests from "Pages/Dashboard/Mining/Quests/Quests";
import { inject, observer } from "mobx-react";
import Button from "Components/Buttons/Button";
import BackgroundMix from "Pages/Dashboard/Mining/assets/mixie-bg@2x.jpg";
import MixieImg from "Pages/Dashboard/Mining/assets/mixie-mining@2x.png";
import Title from "Components/Typography/Title";
import Text from "Components/Typography/Text";

@inject("AuthStore", "MiningStore", "QuestStore")
@observer
class MiningList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: [],
      tokens: null,
      participating: false,
      isSyncing: false,
      maximumSelection: false,
      loaded: 50,
      mix_balance: 0,
      userBoost: 0,
    };
  }

  /**
   * Once we've mounted we need to merge the NFT categories into a single object
   */
  componentDidMount() {
    const { tokens, MiningStore, AuthStore } = this.props;
    let { userBoost } = this.state;
    MiningStore.setState("categories", tokens);

    const tokenList = mergeNFTArray(tokens);

    MiningStore.setState("tokens", tokenList);
    MiningStore.setState("defaultTokens", tokenList);

    MiningStore.getMixBalance(AuthStore.token).then((res) => {
      if (res.sum) {
        this.setState({ mix_balance: res.sum });
      }
    });
    this.setState({
      userBoost: AuthStore.user_boost ? AuthStore.user_boost : userBoost,
    });
  }
  /**
   * Start the mining Event
   * this will send a request to the MiningStore to particpate
   * @param e
   */
  startMiningEvent = (e, selectedCode) => {
    const { MiningStore, AuthStore, QuestStore } = this.props;
    let participationString = createParticipationString(
      MiningStore.defaultTokens,
      MiningStore.selectedNFT
    );
    if (MiningStore.totalHashrate <= 0) {
      return null;
    }
    if (Array.isArray(participationString) && participationString.length) {
      let participate = MiningStore.participate(
        AuthStore.token,
        participationString,
        QuestStore.selectedQuests,
        e,
        selectedCode,
        QuestStore.totalBoost
      );
      participate.then((res) => {
        if (res.success) {
          const { history } = this.props;
          history.push("/dashboard/participation");
        }
      });
    }
  };

  /**
   * FilterTokens
   * @param tokens
   */
  filterTokens = (tokens) => {
    const { MiningStore } = this.props;
    MiningStore.setState("tokens", tokens);
  };

  loadMoreNFTs = (e, loaded) => {
    this.setState({ loaded: this.state.loaded + 50 });
  };

  /**
   * Select NFT
   * @param e
   * @param token
   */
  selectNFT = (e, token = null) => {
    const { MiningStore } = this.props;

    // Shouldnt select NFTs with 0 hashrate
    if (token.hashrate === 0) {
      return;
    }

    if (MiningStore.selectedNFT.length === MiningStore.selectionLimit) {
      MiningStore.setState("maximumSelected", true);
    }

    if (MiningStore.selectedNFT.includes(token._id.$oid)) {
      MiningStore.removeSelectedNFT(token);
      MiningStore.setState("maximumSelected", false);
    } else {
      if (MiningStore.selectedNFT.length < MiningStore.selectionLimit) {
        MiningStore.addSelectedNFT(token);
        MiningStore.setState("currentNFT", token);
        MiningStore.setState("maximumSelected", false);
      } else {
        MiningStore.setState("maximumSelected", true);
      }
    }
  };

  syncAssets = () => {
    this.setState({ isSyncing: true });

    const { MiningStore, AuthStore } = this.props;

    MiningStore.syncAssets(AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({ syncError: true, isSyncing: false });
      } else {
        this.setState({ syncError: false, isSyncing: true });
      }
    });
  };

  /**
   * Clear the Filter Category
   */
  clearCategory = () => {
    this.setState({ selectedCategory: null });
  };

  render = () => {
    const { i18n, MiningStore, cloudminingPool } = this.props;
    const {
      tokens,
      participating,
      isSyncing,
      syncError,
      mix_balance,
      userBoost,
    } = this.state;

    return (
      <Container {...this.props}>
        {/*
           Show the Panel mining
           This appears once the user has NFTs selected and ready to mine
        */}
        {MiningStore.selectedNFT &&
        MiningStore.selectedNFT.length > 0 &&
        !participating ? (
          <PanelMining
            {...this.props}
            startMiningEvent={(e, y) => this.startMiningEvent(e, y)}
            i18n={i18n}
            description={i18n.t("dashboard.mining.ready")}
            tokens={tokens}
            title={i18n.t("dashboard.mining.selected")}
            selected={MiningStore.selectedNFT}
            cloudminingPool={cloudminingPool}
          />
        ) : null}

        {/*
          SyncAssetsMobile
          Will be used as a button to sync between the cron and the server
        */}

        <Transition delay={0} duration={1}>
          <SyncMobile>
            {!isSyncing ? (
              <ButtonContainer theme="green" onClick={() => this.syncAssets()}>
                {i18n.t("dashboard.button.sync")}
              </ButtonContainer>
            ) : null}
            {isSyncing ? (
              <Syncing>{i18n.t("dashboard.sync.time")}</Syncing>
            ) : null}

            {syncError ? (
              <Syncing error={true}>{i18n.t("dashboard.sync.error")}</Syncing>
            ) : null}
          </SyncMobile>
        </Transition>

        {/*
           The filtering takes place ont he tokens
        */}
        {MiningStore.tokens ? (
          <FilterMenu
            filterTokens={(e) => this.filterTokens(e)}
            tokens={MiningStore.tokens}
            defaultTokens={MiningStore.tokens}
          />
        ) : null}

        <Mixie>
          <MixContent>
            <Title
              theme="light"
              shadow={false}
              tag="h2"
              align="left"
              spacing="small"
              size="medium"
              color="#FAF0AD"
            >
              ADD MIXIE TO YOUR HASHRATE FIREPOWER
            </Title>

            <Text
              tag="div"
              color={variable.white}
              spacing="small"
              align="left"
              weight="bold"
              size="small"
              width="100%"
            >
              Earn MIX to redeem a collectable NFT Mixie Card. You can earn MIX
              by staking CAKE over at our friends on Pancake swap,
              alternatively, every 6th Block mined will receive 595.33 MIX
              token.
            </Text>

            <ButtonContainer
              theme="purple"
              target="_blank"
              href="https://mixie.chainguardians.io/"
            >
              FULL DETAILS
            </ButtonContainer>
          </MixContent>
          <MixImage src={MixieImg} alt="" />
        </Mixie>

        <Transition delay={0} duration={1}>
          <QuestsMobile>
            <Quests
              selectedNFTs={MiningStore.selectedNFT}
              currentNFT={MiningStore.currentNFT}
              i18n={i18n}
            />
          </QuestsMobile>
        </Transition>

        <SectionContainer>
          <SectionWrapper>
            {MiningStore.tokens ? (
              <React.Fragment>
                {MiningStore.tokens.map((token, i) => {
                  return (
                    <React.Fragment key={i}>
                      {i < this.state.loaded ? (
                        <SectionCol
                          hidden={token.hidden}
                          key={i}
                          onClick={(e) => this.selectNFT(e, token)}
                        >
                          <Transition delay={0.2} duration={0.6}>
                            <PanelNFTs
                              selected={MiningStore.selectedNFT.includes(
                                token._id.$oid
                              )}
                              image={token.image_preview_url}
                              maxSelected={MiningStore.maximumSelected}
                              title={token.name}
                              hashrate={token.hashrate}
                              selectButton={i18n.t("dashboard.mining.select")}
                            />
                          </Transition>
                        </SectionCol>
                      ) : null}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            ) : (
              <Loader />
            )}

            {MiningStore.tokens &&
            MiningStore.tokens.length >= this.state.loaded ? (
              <ButtonContainer
                theme="green"
                onClick={(e) => this.loadMoreNFTs(e, this.state.loaded)}
              >
                LOAD MORE NFTs
              </ButtonContainer>
            ) : null}
          </SectionWrapper>
          <SectionAside>
            <Mixie>
              <MixContent size="small">
                <Title
                  theme="light"
                  shadow={false}
                  tag="h2"
                  align="center"
                  spacing="small"
                  size="small"
                  color="#FAF0AD"
                >
                  MIX Rewards
                </Title>

                <Text
                  tag="div"
                  color={variable.white}
                  spacing="small"
                  align="center"
                  weight="bold"
                  size="small"
                  width="100%"
                >
                  View the Mining Stats to view your rewards
                </Text>

                <Title
                  theme="light"
                  shadow={false}
                  tag="h2"
                  align="center"
                  spacing="small"
                  size="large"
                  color="#FAF0AD"
                >
                  {mix_balance > 0 ? mix_balance.toFixed(2) : 0}
                </Title>
              </MixContent>
            </Mixie>

            {/*
              SyncAssets
              Will be used as a button to sync between the cron and the server
            */}
            <Boost>
              <BoostContent>
                <Title
                  theme="light"
                  shadow={false}
                  tag="h2"
                  align="center"
                  spacing="small"
                  size="small"
                  color="#9bb0ff"
                >
                  Your boost
                </Title>
                <Title
                  theme="light"
                  shadow={false}
                  tag="h2"
                  align="center"
                  spacing="small"
                  size="large"
                  color={variable.white}
                >
                  {userBoost}
                </Title>
              </BoostContent>
            </Boost>

            <Transition delay={0} duration={1}>
              {!isSyncing ? (
                <ButtonContainer
                  theme="green"
                  onClick={() => this.syncAssets()}
                >
                  {i18n.t("dashboard.button.sync")}
                </ButtonContainer>
              ) : null}
              {isSyncing ? (
                <Syncing>{i18n.t("dashboard.sync.time")}</Syncing>
              ) : null}

              {syncError ? (
                <Syncing error={true}>{i18n.t("dashboard.sync.error")}</Syncing>
              ) : null}
            </Transition>
            {MiningStore.selectedNFT && MiningStore.selectedNFT.length > 0 ? (
              <Transition delay={0} duration={1}>
                <SelectedNFTs
                  removeNFT={(e) => MiningStore.removeSelectedNFT(e)}
                  tokens={MiningStore.tokens}
                  title={i18n.t("dashboard.mining.selected_nft")}
                  selected={MiningStore.selectedNFT}
                />
              </Transition>
            ) : null}

            {/* <Transition delay={0} duration={1}>
              <Quests
                selectedNFTs={MiningStore.selectedNFT}
                currentNFT={MiningStore.currentNFT}
                i18n={i18n}
              />
            </Transition> */}
          </SectionAside>
        </SectionContainer>
      </Container>
    );
  };
}

const MixContent = styled.div`
  padding: ${variable.spacingLarge};

  ${(props) =>
    props.size === "small"
      ? `
        padding: ${variable.spacingMedium};
    `
      : null}
`;

const MixImage = styled.img`
  max-width: 490px;
  width: 100%;
  object-fit: cover;
  display: none;
  max-height: 360px;

  ${media.large_desktop`
        display: flex;
    `}
`;

const Mixie = styled.div`
  border: 2px solid orange;
  width: 100%;
  color: #fff;
  display: flex;
  justify-content: space-between;
  background: url(${BackgroundMix}) no-repeat;
  background-size: cover;
  margin-bottom: ${variable.spacingSmall};

  ${media.desktop`
        display: flex;
    `}
`;
const Boost = styled.div`
  border: 2px solid #2547c9;
  width: 100%;
  color: #fff;
  display: flex;
  justify-content: space-between;
  background: url(${BackgroundMix}) no-repeat;
  background-size: cover;
  margin-bottom: ${variable.spacingSmall};

  ${media.desktop`
      display: flex;
  `}
`;

const BoostContent = styled.div`
  padding: ${variable.spacingMedium};
  width: 100%;
`;
const SyncMobile = styled.div`
  ${media.tablet`
        display: none;
    `}
`;

const Syncing = styled.div`
  border: 1px solid ${variable.green};
  padding: 1rem;
  color: ${variable.green};
  background-color: rgba(0, 0, 0, 0.8);
  border-radius: 4px;
  margin-bottom: ${variable.spacingSmall};

  ${(props) =>
    props.error
      ? `
        border: 1px solid red;
        color: red;
    `
      : null}
`;

const ButtonContainer = styled(Button)`
  margin-bottom: ${variable.spacingSmall};
`;

const QuestsMobile = styled.div`
  display: block;
  margin-bottom: ${variable.spacingSmall};

  ${media.tablet`
        display: none;
    `}
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const SectionContainer = styled.div`
  width: 100%;

  ${media.desktop`
        display: flex;
        justify-content: space-between;
    `};
`;

const SectionWrapper = styled.div`
  ${media.tablet`
        display: flex;
        flex-wrap: wrap;
        align-self: flex-start;
        margin: 0 -${variable.spacingSmall};
    `}

  ${media.desktop`
        width: 70%;
    `};
`;

const SectionCol = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-bottom: ${variable.spacingSmall};
  opacity: 1;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.hidden
      ? `
         display: none;
    `
      : null}

  ${media.larger_desktop`
        width: 50%;
        padding: 0 ${variable.spacingSmall} ${variable.spacingSmall};
    `};
`;

const SectionAside = styled.aside`
  width: 100%;
  display: none;

  ${media.desktop`
        display: block;
        width: 30%;
        margin-left: ${variable.spacingMedium};
        position: sticky;
        align-self: flex-start;
        top: 0;
    `};
`;

export default withTranslation()(MiningList);
