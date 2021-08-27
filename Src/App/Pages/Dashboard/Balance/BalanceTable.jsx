import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import { convertDate } from "Base/Utilities";
import { withTranslation } from "react-i18next";

class BalanceTable extends React.PureComponent {
  constructor(props) {
    super();
  }

  render = () => {
    const { i18n, data } = this.props;

    return (
      <Container>
        {data ? (
          <Table>
            <TableHead hiddenMobile>
              <TableHeading widthSmall>
                {i18n.t("dashboard.balance.table.amount")}
              </TableHeading>
              <TableHeading>
                {i18n.t("dashboard.balance.table.type")}
              </TableHeading>
              <TableHeading>
                {i18n.t("dashboard.balance.table.time")}
              </TableHeading>
            </TableHead>
            <Body>
              {data.map((item, key) => {
                return (
                  <TableBody key={key}>
                    <TableRow widthSmall>
                      <TableCol tableHeading mobileOnly>
                        {i18n.t("dashboard.balance.table.amount")}:
                      </TableCol>
                      <TableCol>{item.CGC}</TableCol>
                    </TableRow>
                    <TableRow>
                      <TableCol tableHeading mobileOnly>
                        {i18n.t("dashboard.balance.table.type")}:
                      </TableCol>
                      <TableCol>
                        {item.Rewards_Type === "block"
                          ? i18n.t("dashboard.balance.table.type.block")
                          : item.Rewards_Type === "game_cgc"
                          ? i18n.t("dashboard.balance.table.type.game_cgc")
                          : item.Rewards_Type === "welcome_token"
                          ? i18n.t("dashboard.balance.table.type.welcome_token")
                          : item.Rewards_Type}
                      </TableCol>
                    </TableRow>
                    <TableRow>
                      <TableCol tableHeading mobileOnly>
                        {i18n.t("dashboard.balance.table.time")}:
                      </TableCol>

                      {item.awarded_datetime ? (
                        <TableCol>
                          {/* date and time laravel */}
                          {typeof item.awarded_datetime === "string"
                            ? convertDate(item.awarded_datetime)
                            : convertDate(
                                item.awarded_datetime.$date.$numberLong
                              )}
                          {/* date and time phython */}
                          {/* {convertDate(item.awarded_datetime.$date.$numberLong)} */}
                        </TableCol>
                      ) : null}
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

export default withTranslation()(BalanceTable);
