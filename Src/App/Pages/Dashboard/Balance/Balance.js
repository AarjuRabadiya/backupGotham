import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";

import Layout from "Components/Layout/Layout";
import Transition from "Components/Transition/Transition";
import Panel from "Components/Panel/Panel";
import Loader from "Components/Loader/Loader";
import Button from "Components/Buttons/Button";
import Text from "Components/Typography/Text";

import BalanceTable from "Pages/Dashboard/Balance/BalanceTable";
import SnapScreen from "./assets/snap-screen@2x.png";

@inject("AuthStore", "MiningStore", "BalanceStore")
@observer
class BalanceContainer extends React.Component {
  constructor(props) {
    super();
    /**
     *
     * @type {{selectedNFT: null, tokens: null, participating: boolean}}
     */
    this.state = {
      loading: false,
      sum: "",
      list: null,
    };
  }

  /**
   * componentDidMount
   * We want to fetch the NFTs via the mining store
   * We recieve the tokens and also check if the user is currently participating
   */
  componentDidMount() {
    this.props.loadBg("balance");
    this.getBalance();
  }

  /**
   * Load more REsults
   * @param e
   */
  loadMoreResults = (e) => {
    e.preventDefault();

    this.setState({ loading: true });

    const { BalanceStore, AuthStore } = this.props;
    let { currentPage, list } = this.state;
    let incrementCurrentPage = parseInt(currentPage + 1);

    BalanceStore.get(AuthStore.token, incrementCurrentPage).then((res) => {
      if (res.result.data.length > 0) {
        this.setState({
          loading: false,
          list: list.concat(res.result.data),
          currentPage: res.result.current_page,
          last: res.result.last_page,
          total: res.result.total,
          to: res.result.to,
          lastPage: res.result.last_page,
          perPage: res.result.per_page,
          sum: res.sum,
        });
      }
    });
  };

  /**
   * Get Balance
   * @param page
   */
  getBalance = (page = 1) => {
    const { BalanceStore, AuthStore } = this.props;

    this.setState({ loading: true });

    BalanceStore.get(AuthStore.token, page).then((res) => {
      let newList = res.result.data;
      newList.length !== 0 &&
        newList.forEach((obj) => {
          if (obj.cgc_win) {
            obj.cgc_win.map((cgc) => {
              obj.CGC = cgc.cgc;
            });
          }
        });

      this.setState({
        loading: false,
        list: newList,
        currentPage: res.result.current_page,
        last: res.result.last_page,
        total: res.result.total,
        to: res.result.to,
        lastPage: res.result.last_page,
        perPage: res.result.per_page,
        sum: res.sum,
      });
    });
  };

  render = () => {
    const { i18n } = this.props;
    const { list, currentPage, lastPage, loading, sum } = this.state;

    return (
      <Layout
        title={i18n.t("dashboard.balance.title")}
        description={
          i18n.t("dashboard.balance.description") + " " + sum + " CGC"
        }
      >
        <Transition duration={2}>
          <PanelWrapper>
            <Panel theme="purple">
              <PanelInner>
                {list && list.length > 0 ? (
                  <BalanceTable
                    selectUserResult={(e) => this.selectUserResult(e)}
                    data={list}
                  />
                ) : list && list.length === 0 ? (
                  <Text
                    tag="p"
                    color={variable.white}
                    spacing="large"
                    weight="500"
                    size="large"
                    spacing="smallest"
                  >
                    {i18n.t("dashboard.general.noentries")}
                  </Text>
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

            <Amount>
              <Transition duration={2} delay={2}>
                <ImageWrapper>
                  <Img src={SnapScreen} alt="" />
                  <Sum>{sum ? sum.toFixed(2) : 0} CGC</Sum>
                </ImageWrapper>
              </Transition>
            </Amount>
          </PanelWrapper>
        </Transition>
      </Layout>
    );
  };
}

const Amount = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 30vw;
  display: none;

  ${media.desktop`
        display: block;
    `}
`;

const Sum = styled.div`
  text-align: center;
  height: 14rem;
  width: 22rem;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 11rem 0 0 8rem;
  font-size: calc(${variable.textLargest} * 1.3);
  font-weight: bold;
  color: ${variable.black};
`;

const ImageWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 43rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const Img = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
`;

const PanelWrapper = styled.div`
  ${media.desktop`
      width: 80%;
    `}

  ${media.largest_desktop`
      width: 100%;
    `}
`;

const PanelInner = styled.div`
  padding: 0 ${variable.spacingMedium} ${variable.spacingMedium};

  ${media.tablet`
        padding: 0 ${variable.spacingMedium};
    `}
`;

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

export default withTranslation()(BalanceContainer);
