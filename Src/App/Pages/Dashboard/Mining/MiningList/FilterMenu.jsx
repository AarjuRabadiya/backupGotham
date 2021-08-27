import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { withTranslation } from "react-i18next";
import { media } from "Base/Media";
import InputSearch from "Components/Form/InputSearch";
import Dropdown from "Components/Form/Dropdown";
import { inject, observer } from "mobx-react";
import Button from "Components/Buttons/Button";

@inject("MiningStore")
@observer
class FilterMenu extends React.Component {
  constructor(props) {
    super(props);

    const { selectedCategory, defaultTokens } = this.props;

    this.state = {
      selectedCategory: selectedCategory,
      defaultTokens: defaultTokens,
      niceName: null,
      filterMenuOpen: false,
    };
  }

  /**
   * FilterByText
   * Filter the input field by the relevent search term
   * we filter against the name of the asset
   * We don't modify the Object array to keep the indexes in check
   * Instead we callback the tokens with a hidden attribute for hidden fields
   * @param e
   */
  filterByText = (e) => {
    const { defaultTokens } = this.state;
    const { MiningStore } = this.props;

    const value = e.target.value.toLowerCase();

    let newTokens = defaultTokens.filter((item) => {
      const regexp = new RegExp(value, "i");

      if (
        regexp.test(item.name) &&
        (item.table_name === MiningStore.selectedCategory ||
          MiningStore.selectedCategory === "All")
      ) {
        return item;
      }
    });

    if (value === "") {
      newTokens = defaultTokens.filter((item) => {
        if (
          MiningStore.selectedCategory === "All" ||
          item.table_name === MiningStore.selectedCategory
        ) {
          return item;
        }
      });
    }

    MiningStore.setState("tokens", newTokens);
  };

  /**
   * Load the selected category and
   * filter the tokens based on the category
   */
  componentDidMount() {
    const { MiningStore } = this.props;

    if (MiningStore.selectedCategory) {
      let updatedTokens = MiningStore.defaultTokens.filter((item) => {
        return item.table_name === MiningStore.selectedCategory;
      });

      MiningStore.setState("tokens", updatedTokens);
    }
  }

  filterByHashRate = (tablename) => {
    const { defaultTokens } = this.state;
    const { MiningStore } = this.props;

    // numArray.sort((a, b) => a - b); // For ascending sort
    // numArray.sort((a, b) => b - a); // For descending sort

    let updatedTokens = MiningStore.tokens.sort(function (a, b) {
      if (tablename === "low") {
        return a["hashrate"] - b["hashrate"];
      }
      return b["hashrate"] - a["hashrate"];
    });

    MiningStore.setState("tokens", updatedTokens);
  };

  /**
   * Filter by Category
   * Once a category is selected we can filter the table
   * @param e
   * @param category
   */
  filterByCategory = (category) => {
    const { defaultTokens } = this.state;
    const { MiningStore } = this.props;

    let updatedTokens = MiningStore.defaultTokens.filter((item) => {
      return item.table_name === category;
    });

    MiningStore.setState("selectedCategory", category);
    MiningStore.setState("tokens", updatedTokens);
  };

  toggleFilterMenu = () => {
    const { filterMenuOpen } = this.state;
    this.setState({ filterMenuOpen: !filterMenuOpen });
  };

  /**
   * Clear Category
   * Will reset the category to a default state
   * @param e
   */
  clearCategory = (e) => {
    const { MiningStore } = this.props;
    MiningStore.setState("selectedCategory", "All");
    MiningStore.setState("tokens", MiningStore.defaultTokens);
  };

  render = () => {
    const { i18n, MiningStore } = this.props;
    const { filterMenuOpen } = this.state;

    return (
      <Container {...this.props}>
        <ButtonWrapper
          theme="green"
          href="#"
          width="100%"
          size="wide"
          onClick={(e) => this.toggleFilterMenu(e)}
        >
          Filter
        </ButtonWrapper>

        <FilterList active={filterMenuOpen}>
          <InputSearchContainer
            placeholder={i18n.t("dashboard.filter.input")}
            type="text"
            onKeyUp={(e) => this.filterByText(e)}
          />

          <DropdownGroupContainer>
            {MiningStore.categories ? (
              <DropdownContainer
                hasAllFilter={false}
                defaultValue={
                  MiningStore.selectedHashRate === null
                    ? i18n.t("dashboard.sort.hashrate")
                    : MiningStore.selectedHashRate
                }
                list={[
                  {
                    contract_name: i18n.t("dashboard.sort.hashratehigh"),
                    table_name: "high",
                  },
                  {
                    contract_name: i18n.t("dashboard.sort.hashratelow"),
                    table_name: "low",
                  },
                ]}
                event={(e) => this.filterByHashRate(e)}
              />
            ) : null}

            {MiningStore.categories ? (
              <DropdownContainer
                hasAllFilter={true}
                defaultValue={MiningStore.selectedCategory}
                list={MiningStore.categories}
                clear={() => this.clearCategory()}
                event={(e) => this.filterByCategory(e)}
              />
            ) : null}
          </DropdownGroupContainer>
        </FilterList>
      </Container>
    );
  };
}

const FilterList = styled.div`
  display: none;
  margin-top: ${variable.spacingSmall};

  ${media.tablet`
        display: flex;
        justify-content: space-between;
        width: 100%;
    `}

  ${(props) =>
    props.active
      ? `
        display: block;
    `
      : null}
`;

const ButtonWrapper = styled(Button)`
  ${media.tablet`
        display: none;
    `}
`;

const Container = styled.div`
  width: 100%;
  margin-bottom: ${variable.spacingSmall};

  ${media.tablet`
        display: flex;
        justify-content: space-between;
    `}

  ${media.larger_desktop`
        margin 0 0 ${variable.spacingMedium};
    `}
`;

const DropdownContainer = styled(Dropdown)`
  margin-top: ${variable.spacingSmall};

  ${media.tablet`
        margin-top: 0;
    `}
`;

const DropdownGroupContainer = styled.div`
  margin-left: auto;
  display: flex;
  flex-direction: column;

  > div {
    flex-grow: 1;
  }

  ${media.tablet`
        flex-direction: row;
        justify-content: flex-end;
    `}

  > div:first-of-type {
    ${media.tablet`
            margin-right: ${variable.spacingSmall};
        `}
  }
`;

const InputSearchContainer = styled(InputSearch)`
  ${media.tablet`
        width: 25%;
    `}
`;

const Memoized = React.memo(FilterMenu);

export default withTranslation()(Memoized);
