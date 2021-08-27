import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import Transition from "Components/Transition/Transition";
import PanelParticipating from "Components/Panel/PanelParticipating";
import Panel from "Components/Panel/Panel";
import Loader from "Components/Loader/Loader";
import Button from "Components/Buttons/Button";

import ParticipationTable from "Pages/Dashboard/Participation/ParticipationTable";
import ExpandablePanel from "Components/Panel/ExpandablePanel";

import Layout from "Components/Layout/Layout";
import Text from "Components/Typography/Text";

@inject("AuthStore", "MiningStore", "ParticipationStore")
@observer
class ParticipationContainer extends React.Component {
  constructor(props) {
    super();

    /**
     *
     * @type {{selectedNFT: null, tokens: null, participating: boolean}}
     */
    this.state = {
      selectedNFT: null,
      tokens: null,
      participating: false,
      checkParticipating: false,
      userSelectedBlock: null,
      hashrate: 0,
      list: null,
      userSelectedResult: [],
    };
  }

  /**
   * componentDidMount
   * We want to fetch the NFTs via the mining store
   * We recieve the tokens and also check if the user is currently participating
   */
  componentDidMount() {
    this.props.loadBg("mining");
    this.checkIfParticipating();
    this.getParticipation();
  }

  checkIfParticipating = () => {
    const { MiningStore, AuthStore } = this.props;

    MiningStore.get(AuthStore.token).then((res) => {
      this.setState({ checkParticipating: true });

      if (res.tokens) {
        let firstKey = Object.keys(res.tokens)[0];
        this.setState({ tokens: res.tokens[firstKey] });
      }

      if (res.next_window && res.ago && res.hr && res.participating) {
        this.setState({
          nextWindow: res.next_window,
          ago: res.ago,
          hashrate: res.hr,
          participating: true,
        });
      }
    });
  };

  /**
   * Get Participation data
   * Check if the user is currently participating
   * @param page
   */
  getParticipation = (page = 1) => {
    const { ParticipationStore, AuthStore } = this.props;

    ParticipationStore.get(AuthStore.token, page).then((res) => {
      this.setState({
        loading: false,
        list: res.data,
        currentPage: res.current_page,
        last: res.last_page,
        total: res.total,
        to: res.to,
        lastPage: res.last_page,
        perPage: res.per_page,
      });
    });
  };

  /**
   * Load more results
   * this is a pagination function
   * @param e
   */
  loadMoreResults = (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    const { ParticipationStore, AuthStore } = this.props;
    let { currentPage, list } = this.state;
    let incrementCurrentPage = parseInt(currentPage + 1);

    ParticipationStore.get(AuthStore.token, incrementCurrentPage).then(
      (res) => {
        this.setState({
          loading: false,
          list: list.concat(res.data),
          currentPage: res.current_page,
          last: res.last_page,
          total: res.total,
          to: res.to,
          lastPage: res.last_page,
          perPage: res.per_page,
        });
      }
    );
  };

  /**
   * Select the current user to show more hashrate data
   * @param result
   */
  selectUserResult = (result) => {
    const { played_hashrate, block_no } = result;
    this.setState({
      userSelectedResult: played_hashrate,
      userSelectedBlock: block_no,
    });
  };
  selectReward = (result) => {
    const { userSelectCGCWin, userSelectedCGCWinBlock } = result;
    this.setState({
      userSelectCGCWin: userSelectCGCWin,
      userSelectedCGCWinBlock: userSelectedCGCWinBlock,
    });
  };
  render = () => {
    const { i18n, ParticipationStore, history } = this.props;
    const {
      participating,
      nextWindow,
      checkParticipating,
      userSelectedResult,
      userSelectedBlock,
    } = this.state;
    const { list, currentPage, lastPage, loading, ago, hashrate } = this.state;

    return (
      <Layout
        title={i18n.t("dashboard.participation.title")}
        description={i18n.t("dashboard.participation.description")}
      >
        <Transition duration={2}>
          {participating && checkParticipating ? (
            <PanelParticipating
              history={history}
              i18n={i18n}
              title={i18n.t("dashboard.mining.currently_mining")}
              nextWindow={nextWindow}
              hashrate={hashrate}
              ago={ago}
            />
          ) : null}

          <Panel theme="purple">
            <PanelInner>
              {list && list.length > 0 ? (
                <ParticipationTable
                  clear={ParticipationStore.clearActiveFilter}
                  selectUserResult={(e) => this.selectUserResult(e)}
                  selectReward={(e) => this.selectReward(e)}
                  data={list}
                />
              ) : list && list.length === 0 ? (
                <NoEntries
                  tag="p"
                  color={variable.white}
                  spacing="large"
                  weight="500"
                  size="large"
                  spacing="smallest"
                >
                  {i18n.t("dashboard.general.noentries")}
                </NoEntries>
              ) : (
                <Loader />
              )}

              {list && currentPage !== lastPage ? (
                <ButtonWrapper>
                  {loading ? (
                    <Loader />
                  ) : (
                    <Button
                      theme="purple"
                      href="#"
                      width="100%"
                      size="wide"
                      onClick={(e) => this.loadMoreResults(e)}
                    >
                      Load More
                    </Button>
                  )}
                </ButtonWrapper>
              ) : null}
            </PanelInner>
          </Panel>

          {userSelectedResult && userSelectedResult.length > 0 ? (
            <ExpandablePanel
              title={userSelectedBlock}
              data={userSelectedResult}
            />
          ) : null}
        </Transition>
      </Layout>
    );
  };
}

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: ${variable.spacingMedium};

  ${media.tablet`
        width:60%;
        margin: auto;
    `}
`;

const PanelInner = styled.div`
  padding: 0 ${variable.spacingMedium} ${variable.spacingMedium};

  ${media.tablet`
        padding: 0 ${variable.spacingMedium};
    `}
`;

const NoEntries = styled(Text)`
  margin-top: ${variable.spacingSmall};
  margin-bottom: 0;

  ${media.tablet`
        padding-left: ${variable.spacingMedium};
        margin-top: ${variable.spacingLarge};
    `}
`;

export default withTranslation()(ParticipationContainer);
