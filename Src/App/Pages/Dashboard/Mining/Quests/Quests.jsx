import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";

import Panel from "Components/Panel/Panel";
import Title from "Components/Typography/Title";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import Text from "Components/Typography/Text";
import { media } from "Base/Media";

@inject("QuestStore", "AuthStore", "MiningStore")
@observer
class Quests extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      quests: null,
      completedQuests: null,
      selectedQuests: null,
    };
  }

  getQuests = () => {
    let { AuthStore, QuestStore } = this.props;

    QuestStore.getCompletedQuests(AuthStore.token).then((res) => {
      QuestStore.setState("completedQuests", res.data);
      this.setState({ completedQuests: res.data }, () => {
        QuestStore.getQuests(AuthStore.token).then((res) => {
          if (res.data.length > 0) {
            this.setState({ quests: res.data });
          }
        });
      });
    });
  };

  componentDidMount() {
    this.getQuests();
  }

  /**
   * Filter By table
   * @param table
   * @returns {*}
   */
  filterByTable = (table) => {
    const { MiningStore } = this.props;

    /**
     * Filter the default tokens to find the selected assets
     */
    let selected = MiningStore.defaultTokens.filter((item, key) => {
      if (MiningStore.selectedNFT.includes(item._id.$oid)) {
        return item;
      }
    });

    return selected.filter((item, key) => {
      // TODO: REMOVING CGNFT option
      // if(item.table_name === table || item.table_name === 'cgnft' || item.table_name === 'cgnft_le') {

      if (item.table_name === "cgnft_le") {
        item.table_name = "cgnft";
      }

      if (item.table_name === table) {
        return item;
      }
    });
  };

  /**
   *  Checks if a selected Quest has been updated
   *  and then adds it to the QuestStore
   */
  updateSelectedQuests = () => {
    const { QuestStore } = this.props;
    const { quests } = this.state;

    let totalBoost = 0;

    if (quests === null) return;

    // TODO: Save for later
    // (!completedQuests.includes(item._id) && !QuestStore.selectedQuests.includes(item._id))
    quests.map((item, key) => {
      let countSelectedAsset = this.filterByTable(item.assetname);

      if (
        countSelectedAsset.length >= item.quantity &&
        !QuestStore.selectedQuests.includes(item._id)
      ) {
        QuestStore.addQuest(item._id);
      } else if (
        countSelectedAsset.length < item.quantity &&
        QuestStore.selectedQuests.includes(item._id)
      ) {
        let index = QuestStore.selectedQuests.indexOf(item._id);
        QuestStore.removeQuest(index);
      }
    });

    // Find the total boost
    QuestStore.selectedQuests.forEach((questItem) => {
      quests.map((item, key) => {
        if (item._id === questItem) {
          totalBoost = totalBoost + item.boost;
        }
      });
    });

    QuestStore.setState("totalBoost", totalBoost);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.selectedNFTs !== this.props.selectedNFTs) {
      this.updateSelectedQuests();
    }
  }

  /**
   * Check if the quest is completed for the list view
   * @param item
   * @returns {boolean|*}
   */
  isQuestCompleted = (item) => {
    const { selectedNFTs, currentNFT, QuestStore } = this.props;

    // Check we first have an NFT to work from
    if (currentNFT && selectedNFTs) {
      let countSelectedAsset = this.filterByTable(item.assetname);
      return countSelectedAsset.length >= item.quantity;
    }

    return false;
  };

  render = () => {
    const { quests } = this.state;
    const { i18n, QuestStore } = this.props;

    return (
      <QuestWrapper>
        {quests !== null ? (
          <PanelContainer theme="green">
            <Title
              shadow={false}
              tag="h4"
              align="left"
              spacing="small"
              size="smaller"
              color={variable.greenLight}
            >
              {i18n.t("dashboard.mining.quests")}
            </Title>

            <Text size="medium">
              {i18n.t("dashboard.mining.quests.description")}
            </Text>

            {quests.length > 0 &&
              quests.map((item, key) => {
                return item.quantity > 0 ? (
                  <ListItem key={key} completed={this.isQuestCompleted(item)}>
                    <Icon
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 22 21"
                    >
                      <path
                        fill={variable.green}
                        d="M10.8 20.92c1.88 0 3.63-.47 5.23-1.4a10.57 10.57 0 005.23-9.06A10.57 10.57 0 0010.8 0 10.57 10.57 0 00.34 10.46 10.57 10.57 0 0010.8 20.92zM9.11 16.2a.56.56 0 01-.46-.21L4.26 11.6a.56.56 0 01-.21-.46c0-.2.07-.35.21-.47l.93-.97a.67.67 0 01.97 0l2.95 2.96 6.33-6.33a.67.67 0 01.97 0l.93.97c.14.11.21.27.21.46 0 .2-.07.35-.21.47l-7.76 7.76a.56.56 0 01-.47.21z"
                      ></path>
                    </Icon>
                    <span>
                      {i18n.t(
                        `dashboard.mining.${item.questname.toLowerCase()}`
                      )}
                    </span>
                  </ListItem>
                ) : null;
              })}
          </PanelContainer>
        ) : null}
      </QuestWrapper>
    );
  };
}

const Icon = styled.svg`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
`;

const ListItem = styled.div`
  margin-bottom: ${variable.spacingSmall};
  font-size: ${variable.textSmall};
  font-family: ${variable.bodyFontFamily};
  text-align: left;
  display: flex;
  align-items: center;
  border-top: 1px solid ${variable.green};
  padding-top: ${variable.spacingSmall};

  svg {
    width: 18px;
    height: 18px;
    margin-right: ${variable.spacingSmaller};
    align-self: flex-start;

    path {
      fill: ${variable.white};
      opacity: 0.4;
    }
  }

  ${(props) =>
    props.completed
      ? `
        color: ${variable.green};
        text-decoration: line-through;

        svg path {
            fill: ${variable.green};
            opacity: 1;

        }

    `
      : null}
`;

const PanelContainer = styled(Panel)``;

const QuestWrapper = styled.div`
  ${media.tablet`
        margin-top: ${variable.spacingSmall};
     `}
`;

export default withTranslation()(Quests);
