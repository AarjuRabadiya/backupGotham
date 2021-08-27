import React from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import Loader from "Components/Loader/Loader";
import { CopyToClipboard } from "react-copy-to-clipboard";

class ReferralTable extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      copied: false,
      selectedCode: "",
    };
  }
  copyClipboard = (item) => {
    this.setState(
      {
        copied: true,
        selectedCode: item._id,
      },
      () => {
        this.clearData();
      }
    );
  };
  clearData = () => {
    setTimeout(
      () =>
        this.setState({
          copied: false,
          selectedCode: "",
        }),
      500
    );
  };
  render = () => {
    const { data, dataLoading, button, userList, enableDisableButton } =
      this.props;
    let { selectedCode } = this.state;
    return (
      <Container>
        {dataLoading ? (
          <Loader />
        ) : data && data.length !== 0 ? (
          <Table>
            <TableHead hiddenMobile>
              <TableHeading>Pool Code</TableHeading>
              <TableHeading>Pool Name</TableHeading>
              <TableHeading>Referral link</TableHeading>
              <TableHeading>Pool Price(%)</TableHeading>
              <TableHeading>Maximum NFTs</TableHeading>
              <TableHeading>Minimum NFTs</TableHeading>
              <TableHeading>Minimum Hashrate</TableHeading>
              {userList && <TableHeading>....</TableHeading>}
              {button &&
                JSON.parse(localStorage.getItem("cloudminingPool")).length !==
                  0 && <TableHeading>Action</TableHeading>}
              {enableDisableButton &&
                JSON.parse(localStorage.getItem("cloudminingPool")).length !==
                  0 && <TableHeading> Enable / Disable</TableHeading>}
            </TableHead>
            <Body>
              {data.map((item, key) => {
                if (item.user_list) {
                  item.user_list &&
                    item.user_list.map((item, key) => {
                      return (
                        <TableBody key={key}>
                          <TableRow>
                            <TableCol>{item.pool_code}</TableCol>
                          </TableRow>
                          <TableRow>
                            <TableCol>{item.pool_name}</TableCol>
                          </TableRow>
                          <TableRow>
                            <TableCol>{item.username}</TableCol>
                          </TableRow>
                        </TableBody>
                      );
                    });
                }
                return (
                  <TableBody key={key}>
                    <TableRow>
                      <TableCol mobileOnly>Pool Code: </TableCol>
                      <TableCol>{item.pool_code}</TableCol>
                    </TableRow>
                    <TableRow>
                      <TableCol mobileOnly>Pool Name: </TableCol>
                      <TableCol>{item.pool_name}</TableCol>
                    </TableRow>
                    <TableRow>
                      <TableCol mobileOnly>Referral link: </TableCol>
                      <TableCol>
                        <CopyToClipboard
                          text={`www.nftmining.com/signUP?pool_code=${item.pool_code}`}
                          onCopy={() => this.copyClipboard(item)}
                        >
                          <span>
                            {`nftmining.com/signUP?pool_code=${item.pool_code}`}
                          </span>
                        </CopyToClipboard>
                        {this.state.copied && selectedCode === item._id ? (
                          <span style={{ color: "red" }}>Copied.</span>
                        ) : null}
                      </TableCol>
                    </TableRow>
                    <TableRow>
                      <TableCol mobileOnly>Pool Price(%): </TableCol>
                      <TableCol>
                        {item.pool_price ? `${item.pool_price}%` : 0}
                      </TableCol>
                    </TableRow>
                    <TableRow>
                      <TableCol mobileOnly>Maximum NFTs: </TableCol>
                      <TableCol>
                        {item.max_NFTs ? `${item.max_NFTs}` : 0}
                      </TableCol>
                    </TableRow>
                    <TableRow>
                      <TableCol mobileOnly>Minimum NFTs: </TableCol>
                      <TableCol>
                        {item.min_NFTs ? `${item.min_NFTs}` : 0}
                      </TableCol>
                    </TableRow>
                    <TableRow>
                      <TableCol mobileOnly>Minimum Hashrate: </TableCol>
                      <TableCol>
                        {item.min_hashrate ? `${item.min_hashrate}` : 0}
                      </TableCol>
                    </TableRow>
                    {userList && (
                      <TableRow>
                        <TableCol>
                          {item.user_list.length !== 0 ? "----" : ",,,,,"}
                        </TableCol>
                      </TableRow>
                    )}
                    {button &&
                      JSON.parse(localStorage.getItem("cloudminingPool"))
                        .length !== 0 && (
                        <TableRow>
                          <TableCol>
                            <Button
                              onClick={() => this.props.changePoolDetail(item)}
                            >
                              Edit
                            </Button>
                          </TableCol>
                        </TableRow>
                      )}
                    {enableDisableButton &&
                      JSON.parse(localStorage.getItem("cloudminingPool"))
                        .length !== 0 && (
                        <TableRow>
                          <TableCol mobileOnly>Enable / Disable:</TableCol>
                          <TableCol>
                            {item.is_enable ? (
                              "Enable"
                            ) : (
                              <Button
                                onClick={() => this.props.enableDisable(item)}
                              >
                                Enable
                              </Button>
                            )}
                          </TableCol>
                        </TableRow>
                      )}
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

export default withTranslation()(ReferralTable);
