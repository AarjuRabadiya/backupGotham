import React from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import Loader from "Components/Loader/Loader";

class BoostDetails extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {};
  }

  render = () => {
    const { data, dataLoading } = this.props;

    return (
      <Container>
        {dataLoading ? (
          <Loader />
        ) : data && data.length !== 0 ? (
          <Table>
            <TableHead hiddenMobile>
              <TableHeading>Package name</TableHeading>
              <TableHeading>Total Boost</TableHeading>
              {/* <TableHeading>Created at</TableHeading> */}
            </TableHead>
            <Body>
              {data.map((item, key) => {
                return (
                  <TableBody key={key}>
                    <TableRow>
                      <TableCol>{item.package_name}</TableCol>
                    </TableRow>
                    <TableRow>
                      <TableCol>{item.boost * item.total}</TableCol>
                    </TableRow>
                    {/* <TableRow>
                      <TableCol>{item.created_at}</TableCol>
                    </TableRow> */}
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
const Button = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 0px 10px;
  color: ${variable.CancleButtonColor};
  border: 3px solid #6988a2;
  background: ${variable.Active};
  outline: none;
  cursor: pointer;
  font-size: ${variable.textSmall};
  padding: 8px;
  font-family: "erbaum", Open Sans, sans-serif;
  text-transform: uppercase;
  :hover {
    background: ${variable.CheckboxBorder};
  }
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

export default withTranslation()(BoostDetails);
