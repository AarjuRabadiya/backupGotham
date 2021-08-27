import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import { media } from "Base/Media";
import SelectNFTs from "./SelectNFTs/SelectNFTs";
import MiningList from "./MiningList/MiningList";
import Transition from "Components/Transition/Transition";
import Layout from "Components/Layout/Layout";
import PanelParticipating from "Components/Panel/PanelParticipating";
import Loader from "Components/Loader/Loader";
import NoNFTs from "Components/NoNFTs/NoNFTs";

@inject("AuthStore", "MiningStore", "QuestStore")
@observer
class MiningContainer extends React.Component {
  constructor(props) {
    super();
    /**
     *
     * @type {{selectedCategory: null, tokens: null, participating: boolean}}
     */
    this.state = {
      selectedCategory: null,
      tokens: null,
      participating: false,
      cloudminingPool: [],
      alert: false,
      alertmess: "",
      mining_type: "SOLO",
    };
  }

  /**
   * componentDidMount
   * We want to fetch the NFTs via the mining store
   * We recieve the tokens and also check if the user is currently participating
   */
  componentDidMount() {
    const { MiningStore, AuthStore, history } = this.props;

    this.props.loadBg("mining");
    this.setState(
      {
        cloudminingPool: JSON.parse(localStorage.getItem("cloudminingPool")),
      },
      () => {
        let { cloudminingPool } = this.state;
        cloudminingPool &&
          cloudminingPool.length !== 0 &&
          cloudminingPool.forEach((obj) => {
            obj.value = obj.pool_code;
            obj.label = `${obj.pool_name} (${obj.pool_code})`;
          });
        this.setState({
          cloudminingPool,
        });
      }
    );

    MiningStore.get(AuthStore.token).then((res) => {
      this.setState({ hasLoaded: true });

      if (res.tokens) {
        var tks = [];
        for (var i = 0; i < Object.keys(res.tokens).length; i++) {
          var key = Object.keys(res.tokens)[i];
          var tk_array = res.tokens[key];
          for (var k = 0; k < tk_array.length; k++) {
            tks.push(tk_array[k]);
          }
        }

        let firstKey = Object.keys(res.tokens)[1];

        this.setState({ tokens: tks });
      } else {
        this.setState({ tokens: [] });
      }

      if (res.next_window && res.ago && res.hr && res.participating) {
        this.setState({
          nextWindow: res.next_window,
          ago: res.ago,
          hashrate: res.hr,
          participating: true,
          mining_type: res.mining_type,
        });
      }
    });

    MiningStore.getAvailableNFTs(AuthStore.token).then((res) => {
      if (res.data && res.data.length > 0) {
        this.setState({ nfts: res.data });
      }
    });
  }

  /**
   *  Select the NFT
   *  and update the state to show the selected state
   *  we then switch the component to show the list NFT view with a preselect for filtering
   * */
  selectNFT = (key) => {
    const { MiningStore } = this.props;
    if (key === null) return;
    MiningStore.setState("selectedCategory", key);
  };
  connectMetaMask = (e) => {
    // e.preventDefault();
    const { AuthStore } = this.props;
    let token = AuthStore.token;
    // Retrieve the MetaMask Address from the user
    AuthStore.retrieveMetaMaskAddress().then((res) => {
      if (res.error) {
        this.setState({
          alert: true,
          alertmess: res.error.message,
        });
      }
      if (res.address) {
        let payload = {
          mm_address: res.address,
        };
        AuthStore.editUser(payload, AuthStore.token).then(async (response) => {
          if (response.status === 200) {
            const json = await response.json();
            AuthStore.setState("mm_address", json.mm_address);
            this.setState({
              mm_address: json.address,
            });
            if (json.error) {
              this.setState({
                alert: true,
                alertmess: json.error,
              });
            }
          } else {
            const json = await response.json();

            this.setState({
              alert: true,
              alertmess: json.error ? json.error : json[0],
            });
          }
        });
      }
      //  else {
      //   this.setState({
      //     alert: true,
      //     alertmess: res.error,
      //   });
      // }
    });
  };
  handleAlertClose = () => {
    this.setState({
      alertmess: "",
      alert: false,
    });
  };
  render = () => {
    const { i18n, MiningStore, history } = this.props;
    const {
      selectedCategory,
      tokens,
      participating,
      nextWindow,
      ago,
      hashrate,
      hasLoaded,
      nfts,
      mm_address,
      cloudminingPool,
      alert,
      alertmess,
      mining_type,
    } = this.state;

    let meta = hasLoaded ? i18n.t("dashboard.mining.meta") : null;
    let title = hasLoaded ? i18n.t("dashboard.mining.title") : null;
    let description = hasLoaded ? i18n.t("dashboard.mining.description") : null;
    let mm_title = hasLoaded ? i18n.t("login.connect.mm") : null;
    return (
      <Layout
        meta={meta}
        title={title}
        description={description}
        mm_address={
          this.props.AuthStore ? this.props.AuthStore.mm_address : mm_address
        }
        mm_title={mm_title}
        connectMetaMask={() => this.connectMetaMask()}
      >
        {alert && (
          <MainAlertDiv>
            <Alert>
              <Message>
                <b>{alertmess}</b>
              </Message>
              <Close onClick={() => this.handleAlertClose()}>×</Close>
            </Alert>
          </MainAlertDiv>
        )}
        {tokens && tokens.length === 0 ? (
          <NoNFTs i18n={i18n} />
        ) : participating ? (
          <Transition duration={2}>
            <SectionContent>
              {participating ? (
                <PanelParticipating
                  history={history}
                  i18n={i18n}
                  // title={i18n.t("dashboard.mining.currently_mining")}
                  title={`You are currently ${mining_type} mining...`}
                  nextWindow={nextWindow}
                  hashrate={hashrate}
                  ago={ago}
                />
              ) : null}
            </SectionContent>
          </Transition>
        ) : (
          <Transition duration={2}>
            {/* Create the SectionContent wrapper */}
            {/* Once user Selects an NFT we show them the mining list */}
            {MiningStore.selectedCategory === null && tokens ? (
              <SectionContent>
                {/* Allows user to Select the filtered NFT first */}
                <SelectNFTs
                  chooseNFT={(e) => this.selectNFT(e)}
                  tokens={tokens}
                />
              </SectionContent>
            ) : tokens ? (
              <MiningList
                {...this.props}
                history={history}
                MiningStore={MiningStore}
                selectedCategory={selectedCategory}
                tokens={tokens}
                cloudminingPool={cloudminingPool}
              />
            ) : (
              <Loader />
            )}
          </Transition>
        )}
      </Layout>
    );
  };
}

const SectionContent = styled.div`
  ${media.larger_desktop`
        width: 85%;
    `}
  ${media.largest_desktop`
        width: 70%;
    `}
`;
const Message = styled.div`
  padding: 10px;
  width: 90%;
  font-size: ${variable.textLarger};
`;
const Close = styled.div`
  cursor: pointer;
  padding: 10px;
  width: 10%;
  text-align: center;
  font-size: 22px;
  font-weight: ${variable.bold};
`;
const MainAlertDiv = styled.div`
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  padding: 0.3rem;
  background: #da0c1f;
  margin-bottom: 10px;
`;
const Alert = styled.div`
  background: rgba(0, 0, 0, 1);
  color: #da0c1f;
  display: flex;
  margin: auto;
  padding: 10px;
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  align-items: center;
`;

export default withTranslation()(MiningContainer);
