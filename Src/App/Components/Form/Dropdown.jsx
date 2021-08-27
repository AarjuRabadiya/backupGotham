import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import Icon from "Components/Icons/Icons";

const Container = styled.div`
  width: 100%;
  display: table;
  text-align: center;
  padding: 0.2rem;
  clip-path: polygon(0 0%, 96% 0, 100% 10px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-image: linear-gradient(136deg, #8c14cf 0%, #01c3c5 100%);
  cursor: pointer;
  min-width: 20rem;
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

const ContainerInner = styled.div`
  text-decoration: none;
  width: 100%;
  display: table;
  text-align: center;
  padding: ${variable.spacingSmaller};
  clip-path: polygon(0 0%, 96% 0, 100% 10px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-color: rgba(0, 0, 0, 0.9);

  ${media.tablet`
        font-size: ${variable.textLarge};
    `}
`;

const DropdownList = styled.div``;

const SubMenu = styled.ul`
  background-color: rgba(0, 0, 0, 0.9);
  position: absolute;
  top: 100%;
  z-index: 999;
  right: 0;
  width: 100%;
  user-select: none;
  min-width: 20rem;
  padding: ${variable.spacingSmall};

  ${(props) =>
    props.hidden
      ? `
        display: none;
    `
      : null}
`;

const SubMenuListItem = styled.li`
  padding: ${variable.spacingSmaller} ${variable.spacingSmallest}
    ${variable.spacingSmallest};
  color: ${variable.white};
  cursor: pointer;

  &:hover {
    color: ${variable.green};
  }
`;

const SubMenuItem = styled.span``;

const Active = styled.div`
  color: ${variable.white};
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${variable.textSmall};
  user-select: none;
`;

const IconWrapper = styled(Icon)`
  margin-left: ${variable.spacingSmall};
`;

export default class Dropdown extends React.Component {
  constructor(props) {
    super();

    const { defaultValue } = props;

    this.state = {
      hidden: true,
      defaultValue: defaultValue,
    };
  }

  /**
   * Toggle Dropdown
   */
  toggleDropdown = () => {
    const { hidden } = this.state;

    this.setState({ hidden: !hidden });
  };

  /**
   * Component Did Mount
   */
  componentDidMount() {
    const { list, defaultValue } = this.props;
    let newDefaultValue = null;

    list.map((item) => {
      if (item.table_name === defaultValue) {
        newDefaultValue = item.contract_name;
      }
    });

    this.setState({ defaultValue: newDefaultValue });
  }

  /**
   *
   * @param e
   * @param table_name
   * @param category
   */
  event = (e, table_name, category) => {
    e.preventDefault();
    this.props.event(table_name);
    this.setState({ defaultValue: category, hidden: true });
  };

  clear = () => {
    this.setState({ hidden: true, defaultValue: null });
    this.props.clear();
  };

  render = () => {
    const {
      list,
      // clear,
      hasAllFilter,
    } = this.props;
    const { hidden, defaultValue } = this.state;

    return (
      <DropdownWrapper onClick={() => this.toggleDropdown()}>
        <Container {...this.props}>
          <ContainerInner>
            <DropdownList>
              <Active>
                {defaultValue === null ? this.props.defaultValue : defaultValue}{" "}
                <IconWrapper
                  path="M18.7109817 4L20 5.26126266 10 16 0 5.26126266 1.28901832 4 10 13.3538339z"
                  fill={variable.white}
                  height={20}
                  width={20}
                />
              </Active>
            </DropdownList>
          </ContainerInner>
        </Container>
        <SubMenu hidden={hidden}>
          {hasAllFilter ? (
            <SubMenuListItem onClick={(e) => this.clear(e)}>
              All
            </SubMenuListItem>
          ) : null}
          {list.map((category, i) => {
            return category.table_name !== defaultValue ? (
              <SubMenuListItem
                key={i}
                onClick={(e) =>
                  this.event(e, category.table_name, category.contract_name)
                }
              >
                <SubMenuItem>{category.contract_name}</SubMenuItem>
              </SubMenuListItem>
            ) : null;
          })}
        </SubMenu>
      </DropdownWrapper>
    );
  };
}
