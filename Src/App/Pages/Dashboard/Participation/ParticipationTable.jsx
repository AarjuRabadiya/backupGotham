import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import { convertDate } from "Base/Utilities";
import { withTranslation } from "react-i18next";
import { inject, observer } from "mobx-react";
import MixieToken from "../../Dashboard/Mining/assets/mixie-token.png";
import CGCToken from "../../Dashboard/Mining/assets/cgc.png";
import CGGToken from "../../Dashboard/Mining/assets/cgg.png";
import BondlyToken from "../../Dashboard/Mining/assets/bondly.png";

@inject("AuthStore", "MiningStore", "ParticipationStore")
@observer
class ParticipationTable extends React.Component {
  constructor(props) {
    super();
    this.state = {
      active: null,
    };
  }

  /**
   * SelectUserResult
   * @param result
   * @param key
   */
  selectUserResult = (e, result, key = 0) => {
    e.preventDefault();

    const { ParticipationStore } = this.props;
    ParticipationStore.setState("clearActiveFilter", false);

    const res = {
      played_hashrate: result.played_hashrate,
      block_no: result.block_no,
    };
    this.props.selectUserResult(res);
    this.setActiveState(key);
  };

  selectReward = (e, result, key = 0) => {
    //cgc win details
    e.preventDefault();

    const { ParticipationStore } = this.props;
    ParticipationStore.setState("clearActiveFilter", false);

    const res = {
      userSelectCGCWin: result.cgc_win,
      userSelectedCGCWinBlock: result.block_no,
    };
    this.props.selectReward(res);
    this.setActiveState(key);
  };
  /**
   * Set the active state for the user result
   * @param key
   */
  setActiveState = (key) => {
    this.setState({ active: key });
  };

  /**
   * Update if necessary
   * @param prevProps
   */
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
              <TableHeading widthSmall>
                {i18n.t("dashboard.participation.table.block")}
              </TableHeading>
              <TableHeading widthSmall>
                {i18n.t("dashboard.balance.table.type")}
              </TableHeading>
              <TableHeading>
                {i18n.t("dashboard.participation.table.date")}
              </TableHeading>
              <TableHeading>
                {i18n.t("dashboard.participation.table.winner")}
              </TableHeading>
              <TableHeading widthSmall>
                {i18n.t("dashboard.participation.table.reward")}
              </TableHeading>
            </TableHead>
            <Body>
              {data.map((item, key) => {
                return (
                  <TableBody
                    key={key}
                    // onClick={(e) => this.selectUserResult(e, item, key)}
                  >
                    <TableRow
                      widthSmall
                      activeState={key === active}
                      onClick={(e) => this.selectUserResult(e, item, key)}
                    >
                      <TableCol
                        reward={item.Rewards_Type}
                        activeState={key === active}
                        tableHeading
                        mobileOnly
                      >
                        {i18n.t("dashboard.participation.table.block")}:
                      </TableCol>
                      <TableCol
                        reward={item.Rewards_Type}
                        activeState={key === active}
                      >
                        #{item.block_no}
                      </TableCol>
                    </TableRow>
                    <TableRow widthSmall activeState={key === active}>
                      <TableCol
                        reward={item.Rewards_Type}
                        activeState={key === active}
                        tableHeading
                        mobileOnly
                      >
                        {i18n.t("dashboard.balance.table.type")}:
                      </TableCol>
                      <TableCol
                        reward={item.Rewards_Type}
                        activeState={key === active}
                      >
                        {item.Rewards_Type}
                      </TableCol>
                    </TableRow>
                    <TableRow activeState={key === active}>
                      <TableCol
                        reward={item.Rewards_Type}
                        activeState={key === active}
                        tableHeading
                        mobileOnly
                      >
                        {i18n.t("dashboard.participation.table.date")}:
                      </TableCol>
                      <TableCol
                        reward={item.Rewards_Type}
                        activeState={key === active}
                      >
                        {/* date and time laravel */}
                        {typeof item.awarded_datetime === "string"
                          ? convertDate(item.awarded_datetime)
                          : item.awarded_datetime
                          ? convertDate(item.awarded_datetime.$date.$numberLong)
                          : null}
                        {/* {item.awarded_datetime
                          ? convertDate(item.awarded_datetime.$date.$numberLong)
                          : null} */}
                      </TableCol>
                    </TableRow>
                    <TableRow activeState={key === active}>
                      <TableCol
                        reward={item.Rewards_Type}
                        activeState={key === active}
                        tableHeading
                        mobileOnly
                      >
                        {i18n.t("dashboard.participation.table.winner")}:
                      </TableCol>
                      <TableCol
                        reward={item.Rewards_Type}
                        activeState={key === active}
                      >
                        {item.awarded_username}
                      </TableCol>
                    </TableRow>
                    <TableRow
                      widthSmall
                      activeState={key === active}
                      onClick={(e) => this.selectReward(e, item, key)}
                    >
                      <TableCol
                        activeState={key === active}
                        reward={item.Rewards_Type}
                        tableHeading
                        mobileOnly
                      >
                        {i18n.t("dashboard.participation.table.reward")}:
                      </TableCol>
                      <TableCol
                        activeState={key === active}
                        reward={item.Rewards_Type}
                      >
                        <Reward>
                          {item.Rewards_Type === "block"
                            ? item.CGC?.toFixed(2)
                            : item.amount?.toFixed(2)}
                        </Reward>

                        {item.Rewards_Type === "MIX" ? (
                          <MixHref
                            color="#FAF0AD"
                            href={`https://bscscan.com/search?f=0&q=${item.tx_hash}`}
                            target="_blank"
                          >
                            <MixieImage>
                              <MixType>MIX</MixType>
                              <img src={MixieToken} alt="" />
                            </MixieImage>
                          </MixHref>
                        ) : null}

                        {item.Rewards_Type === "CGG" ? (
                          <MixHref
                            color={variable.green}
                            href={`https://bscscan.com/search?f=0&q=${item.tx_hash}`}
                            target="_blank"
                          >
                            <MixieImage>
                              <MixType>CGG</MixType>
                              <img src={CGGToken} alt="" />
                            </MixieImage>
                          </MixHref>
                        ) : null}

                        {item.Rewards_Type === "BONDLY" ? (
                          <MixHref
                            color="#2547C9"
                            href={`https://bscscan.com/search?f=0&q=${item.tx_hash}`}
                            target="_blank"
                          >
                            <MixieImage>
                              <MixType>Bondly</MixType>
                              <img src={BondlyToken} alt="" />
                            </MixieImage>
                          </MixHref>
                        ) : null}

                        {item.Rewards_Type === "block" ? (
                          <MixHref
                            color={variable.white}
                            href="#"
                            target="_blank"
                          >
                            <MixieImage>
                              <MixType>CGC</MixType>
                              <img src={CGCToken} alt="" />
                            </MixieImage>
                          </MixHref>
                        ) : null}
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

const MixieImage = styled.span`
  margin-left: 2rem;
  display: flex;
  align-items: center;

  img {
    max-width: 30px;
  }
`;

const MixHref = styled.a`
  display: block;
  color: ${(props) => props.color};
`;

const MixType = styled.span`
  margin-right: 1rem;
  width: 60px;
`;

const Reward = styled.div`
  width: 70px;
`;

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
        width: 20%;
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
            width: 20%;
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
  font-size: 16px;
  display: flex;
  align-items: center;

  ${(props) =>
    props.activeState
      ? `
        color:${variable.black};
    `
      : null}

  ${(props) =>
    props.reward === "MIX"
      ? `
        color: #FAF0AD;
    `
      : null}
    
    
     ${(props) =>
    props.reward === "BONDLY"
      ? `
        color: #2547C9;
    `
      : null}
    
     ${(props) =>
    props.reward === "CGG"
      ? `
        color: ${variable.green};
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

const PanelInner = styled.div`
  padding: 0 ${variable.spacingMedium} ${variable.spacingMedium};

  ${media.tablet`
        padding: ${variable.spacingMedium};
    `}
`;

const Memoize = React.memo(ParticipationTable);
export default withTranslation()(Memoize);
