import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import { inject, observer } from "mobx-react";

// Component imports
import { withTranslation } from "react-i18next";
import Transition from "Components/Transition/Transition";

import Panel from "Components/Panel/Panel";
import Loader from "Components/Loader/Loader";
import Button from "Components/Buttons/Button";

import ParticipationTable from "Pages/Dashboard/Participation/ParticipationTable";
import HistoryTable from "Pages/Dashboard/History/HistoryTable";
import HistoryCGCWinTable from "Pages/Dashboard/History/HistoryCGCWinTable";
import Layout from "Components/Layout/Layout";
import ExpandablePanel from "Components/Panel/ExpandablePanel";

@inject("AuthStore", "HistoryStore")
@observer
class HistoryContainer extends React.Component {
  constructor(props) {
    super();

    this.state = {
      list: null,
      selectedNFT: null,
      tokens: null,
      participating: false,
      checkParticipating: false,
      userSelectedBlock: null,
      userSelectedCGCWinBlock: null,
      userSelectedResult: [],
      userSelectCGCWin: [],
      isSelectResult: true,
      isSelectCgc: false,
    };
  }

  /**
   * componentDidMount
   * We want to fetch the NFTs via the mining store
   * We recieve the tokens and also check if the user is currently participating
   */
  componentDidMount() {
    this.props.loadBg("mining");
    this.getHistory();
  }

  getHistory = (page = 1) => {
    const { HistoryStore, AuthStore } = this.props;

    HistoryStore.get(AuthStore.token, page).then((res) => {
      if (res.data.length > 0) {
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
      }
    });
  };

  /**
   * Load More Results
   * @param e
   */
  loadMoreResults = (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    const { HistoryStore, AuthStore } = this.props;
    let { currentPage, list } = this.state;
    let incrementCurrentPage = parseInt(currentPage + 1);

    HistoryStore.get(AuthStore.token, incrementCurrentPage).then((res) => {
      if (res.data.length > 0) {
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
    });
  };

  /**
   * SelectUserResult
   * @param result
   */
  selectUserResult = (result) => {
    const { played_hashrate, block_no } = result;
    let {
      //  isSelectResult,
      userSelectedBlock,
    } = this.state;
    this.setState({
      userSelectedResult: played_hashrate,
      userSelectedBlock: block_no,
      isSelectResult:
        // isSelectResult &&
        userSelectedBlock !== block_no ? true : false,
      isSelectCgc: false,
    });
  };
  selectReward = (result) => {
    const { userSelectCGCWin, userSelectedCGCWinBlock } = result;
    let { isSelectCgc } = this.state;
    this.setState({
      userSelectCGCWin: userSelectCGCWin,
      userSelectedCGCWinBlock: userSelectedCGCWinBlock,
      isSelectCgc:
        isSelectCgc &&
        userSelectedCGCWinBlock !== this.state.userSelectedCGCWinBlock
          ? true
          : !isSelectCgc,
      isSelectResult: false,
    });
  };
  clearState = () => {
    this.setState({
      isSelectCgc: false,
      isSelectResult: false,
    });
  };
  render = () => {
    const { i18n, HistoryStore } = this.props;
    const {
      userSelectedResult,
      userSelectedBlock,
      userSelectedCGCWinBlock,
      list,
      currentPage,
      lastPage,
      loading,
      userSelectCGCWin,
      isSelectResult,
      isSelectCgc,
    } = this.state;

    return (
      <Layout
        title={i18n.t("dashboard.history.title")}
        description={i18n.t("dashboard.history.description")}
      >
        <Transition duration={2}>
          <Panel theme="purple">
            <PanelInner>
              {list ? (
                <ParticipationTable
                  clear={HistoryStore.clearActiveFilter}
                  selectUserResult={(e) => this.selectUserResult(e)}
                  selectReward={(e) => this.selectReward(e)}
                  data={list}
                />
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

          {isSelectResult &&
          userSelectedResult &&
          userSelectedResult.length > 0 ? (
            <ExpandablePanel
              title={`${userSelectedBlock} Participation`}
              data={userSelectedResult}
              isSelectResult={isSelectResult}
              HistoryTable={true}
              component={<HistoryTable data={userSelectedResult} />}
              clearState={() => this.clearState()}
            />
          ) : null}

          {/* cgc win details */}
          {isSelectCgc && userSelectCGCWin && userSelectCGCWin.length > 0 ? (
            <ExpandablePanel
              title={`${userSelectedCGCWinBlock} Winners`}
              data={userSelectCGCWin}
              clearState={() => this.clearState()}
              isSelectCgc={isSelectCgc}
              HistoryTable={true}
              component={<HistoryCGCWinTable data={userSelectCGCWin} />}
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

export default withTranslation()(HistoryContainer);
