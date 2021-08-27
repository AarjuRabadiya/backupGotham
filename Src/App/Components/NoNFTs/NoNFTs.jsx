import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import { withTranslation } from "react-i18next";
import { withRouter } from "react-router";
import Text from "Components/Typography/Text";
import Title from "Components/Typography/Title";
import { inject, observer } from "mobx-react";
import Button from "Components/Buttons/Button";

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

const Container = styled.div`
  border: 1px solid ${variable.purple};
  padding: ${variable.spacingMedium};
  margin-top: ${variable.spacingMedium};

  ${media.tablet`
        padding: ${variable.spacingLarge};
        margin-top: ${variable.spacingLarge};
    `}
`;

const NFT = styled.div`
  margin-bottom: ${variable.spacingSmallest};
  border-bottom: 1px solid ${variable.green};
  display: table;
  margin-left: ${variable.spacingMedium};
  padding-bottom: ${variable.spacingSmallest};
`;

const ButtonContainer = styled(Button)`
  margin-bottom: ${variable.spacingSmall};
`;

@inject("AuthStore", "MiningStore")
@observer
class NoNFTs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nfts: null,
      isSyncing: false,
    };
  }

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

  componentDidMount() {
    const { MiningStore, AuthStore } = this.props;
    MiningStore.getAvailableNFTs(AuthStore.token).then((res) => {
      if (res.data && res.data.length > 0) {
        this.setState({ nfts: res.data });
      }
    });
  }

  render = () => {
    const { i18n } = this.props;
    const { nfts, isSyncing, syncError } = this.state;

    return (
      <Container>
        <Title
          theme="light"
          shadow={true}
          tag="h2"
          align="left"
          spacing="small"
          size="medium"
          color={variable.green}
        >
          {i18n.t("dashboard.mining.partners")}
        </Title>
        <Text
          tag="div"
          color={variable.white}
          spacing="small"
          align="left"
          weight="normal"
          size="large"
          width="100%"
        >
          {i18n.t("dashboard.mining.nonfts")}
        </Text>

        {/*
                    SyncAssets
                    Will be used as a button to sync between the cron and the server
                  */}
        <React.Fragment>
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
        </React.Fragment>

        <Text
          tag="div"
          color={variable.white}
          spacing="small"
          align="left"
          weight="normal"
          size="large"
          width="100%"
        >
          {nfts &&
            nfts.length > 0 &&
            nfts.map((res, key) => {
              return <NFT key={key}>{res.name}</NFT>;
            })}
        </Text>
      </Container>
    );
  };
}

const router = withRouter(NoNFTs);
const Memoize = React.memo(router);

export default withTranslation()(Memoize);
