import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import { convertDate } from "Base/Utilities";
import { withTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";

@inject("AuthStore", "HistoryStore")
@observer
class HistoryCGCWinTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      active: null,
    };
  }

  //   selectUserResult = (result, key = 0) => {
  //     const { ParticipationStore } = this.props;
  //     ParticipationStore.setState("clearActiveFilter", false);

  //     const res = {
  //       played_hashrate: result.played_hashrate,
  //       block_no: result.block_no,
  //     };
  //     this.props.selectUserResult(res);
  //     this.setActiveState(key);
  //   };
  setActiveState = (key) => {
    this.setState({ active: key });
  };

  componentDidUpdate(prevProps) {
    if (this.props.clear && this.state.active !== null) {
      this.setState({ active: null });
    }
  }

  render = () => {
    const { i18n, data } = this.props;
    const { active } = this.state;

    return (
      <Container>
        {data ? (
          <Table>
            <TableHead hiddenMobile>
              <TableHeading>
                {i18n.t("dashboard.history.table.user")}
              </TableHeading>
              <TableHeading>
                {i18n.t("dashboard.history.table.hashrates")}
              </TableHeading>
              <TableHeading>
                {i18n.t("dashboard.balance.table.type")}
              </TableHeading>
              <TableHeading widthSmall>
                CGC
                {/* {i18n.t("dashboard.history.table.chances")} */}
              </TableHeading>
            </TableHead>
            <Body>
              {data.map((item, key) => {
                return (
                  <TableBody
                    key={key}
                    // onClick={(e) => this.selectUserResult(item, key)}
                  >
                    <TableRow activeState={key === active}>
                      <TableCol
                        activeState={key === active}
                        tableHeading
                        mobileOnly
                      >
                        {i18n.t("dashboard.history.table.user")}:
                      </TableCol>
                      <TableCol activeState={key === active}>
                        #{item.username ? item.username : "-"}
                      </TableCol>
                    </TableRow>
                    <TableRow activeState={key === active}>
                      <TableCol
                        activeState={key === active}
                        tableHeading
                        mobileOnly
                      >
                        {i18n.t("dashboard.history.table.hashrates")}:
                      </TableCol>
                      <TableCol activeState={key === active}>
                        {item.hashrate ? item.hashrate : "-"}
                      </TableCol>
                    </TableRow>
                    <TableRow activeState={key === active}>
                      <TableCol
                        activeState={key === active}
                        tableHeading
                        mobileOnly
                      >
                        {i18n.t("dashboard.balance.table.type")}:
                      </TableCol>
                      <TableCol activeState={key === active}>
                        {item.type ? item.type : "-"}
                      </TableCol>
                    </TableRow>
                    <TableRow widthSmall activeState={key === active}>
                      <TableCol
                        activeState={key === active}
                        tableHeading
                        mobileOnly
                      >
                        CGC:
                      </TableCol>
                      <TableCol activeState={key === active}>
                        {item.cgc ? item.cgc : "-"}
                      </TableCol>
                    </TableRow>
                  </TableBody>
                );
              })}
            </Body>
          </Table>
        ) : null}
      </Container>
    );
  };
}

const Table = styled.div``;
const Body = styled.div``;

const TableHeading = styled.div`
  font-family: ${variable.bodyFontFamily};
  color: ${variable.white};
  opacity: 1;
  padding: ${variable.spacingSmall};
  border-bottom: 1px solid ${variable.green};
  text-align: left;
  font-weight: 600;

  ${(props) =>
    props.widthSmall
      ? `
        width: 15%;
        flex-grow: 0;
    `
      : `
       flex-grow: 1;
        flex-basis: 0;
    `}
`;
const TableHead = styled.div`
  ${(props) =>
    props.hiddenMobile
      ? `
        display: none;
    `
      : null}

  ${media.tablet`
        ${(props) =>
          props.hiddenMobile
            ? `
            display: flex;
        `
            : null}
    `}
`;

const TableBody = styled.div`
  border-bottom: 1px solid ${variable.green};
  padding-bottom: ${variable.spacingSmall};
  padding-top: ${variable.spacingSmall};
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${variable.green};
    * {
      color: ${variable.black} !important;
    }
  }

  ${media.tablet`
        display: flex;
        flex-wrap: wrap;
        border: 0;
        padding: 0;
    `}
`;
const TableRow = styled.div`
  padding: ${variable.spacingSmallest} 0;
  display: flex;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.activeState
      ? `
        background-color:${variable.green};
    `
      : null}

  ${media.tablet`
        display: flex;
        border-bottom: 1px solid ${variable.green};
        padding: ${variable.spacingSmall};
                
        ${(props) =>
          props.widthSmall
            ? `
            width: 15%;
            flex-grow: 0;
        `
            : `
           flex-grow: 1;
            flex-basis: 0;
        `}
    
    `}
`;

const TableCol = styled.div`
  font-family: ${variable.bodyFontFamily};
  color: ${variable.white};
  opacity: 1;
  text-align: left;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.activeState
      ? `
        color:${variable.black};
    `
      : null}

  ${(props) =>
    props.tableHeading
      ? `
        font-weight: bold;
        margin-right: ${variable.spacingSmall};
        width: 40%;
        flex-shrink: 0;
    `
      : null}
    
    ${media.tablet`
        ${(props) =>
          props.mobileOnly
            ? `
            display: none;
        `
            : null}
    `}
`;

const Container = styled.div``;

export default withTranslation()(HistoryCGCWinTable);
