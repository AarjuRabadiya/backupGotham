import React from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import Loader from "Components/Loader/Loader";
import Loaderspinner from "react-loader-spinner";
import { CopyToClipboard } from "react-copy-to-clipboard";

class ReferralTable extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      copied: false,
      selectedCode: "",
      enable: false,
      pool_code: "",
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
  enableDisable = (e, item) => {
    this.setState({
      pool_code: item.pool_code,
    });
    this.props.enableDisable(e.target.checked, item);
  };
  render = () => {
    const {
      data,
      dataLoading,
      button,
      userList,
      enableDisableButton,
      isEditLoader,
    } = this.props;
    let { selectedCode, pool_code } = this.state;
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

              <TableHeading>Minimum NFTs</TableHeading>
              <TableHeading>Minimum Hashrate</TableHeading>
              {userList && <TableHeading>....</TableHeading>}
              {button &&
                JSON.parse(localStorage.getItem("cloudminingPool")).length !==
                  0 && <TableHeading>Action</TableHeading>}
              {enableDisableButton &&
                JSON.parse(localStorage.getItem("cloudminingPool")).length !==
                  0 && <TableHeading> Enable/ Disable</TableHeading>}
              {JSON.parse(localStorage.getItem("cloudminingPool")).length !==
                0 && <TableHeading> Upgrade Pool</TableHeading>}
              <TableHeading>Your Package</TableHeading>
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
                          {item.user_list && item.user_list.length !== 0
                            ? "----"
                            : ",,,,,"}
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
                            {isEditLoader && pool_code === item.pool_code ? (
                              <Loaderspinner
                                type="ThreeDots"
                                color="#fff"
                                width="18"
                                height="18"
                              />
                            ) : (
                              <CheckBoxWrapper>
                                <CheckBox
                                  id={item.pool_code}
                                  type="checkbox"
                                  checked={item.is_enable}
                                  onChange={(e) => this.enableDisable(e, item)}
                                />
                                <CheckBoxLabel htmlFor={item.pool_code} />
                              </CheckBoxWrapper>
                            )}
                          </TableCol>
                        </TableRow>
                      )}
                    {JSON.parse(localStorage.getItem("cloudminingPool"))
                      .length !== 0 && (
                      <TableRow>
                        <TableCol mobileOnly>Enable / Disable:</TableCol>
                        <TableCol>
                          <Button onClick={() => this.props.upgradePool(item)}>
                            Upgrade
                          </Button>
                        </TableCol>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCol mobileOnly>Your Package: </TableCol>
                      <TableCol>
                        {item.packageDetails
                          ? item.packageDetails.package_name
                          : "-"}
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
const CheckBoxWrapper = styled.div`
  position: relative;
`;
const CheckBoxLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 25px;
  border-radius: 15px;
  background: #858383;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;
const CheckBox = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;

  &:checked + ${CheckBoxLabel} {
    background: ${variable.CheckboxBorder};
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

const Table = styled.div`
  display: table;
`;
const Body = styled.div`
  display: block;
  ${media.tablet`
  display: table-row-group;
    `}
`;
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
  display: table-cell;
`;
const TableHead = styled.div`
  display: table-row;
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
            display: table-row;
        `
            : null}
    `}
`;

const TableBody = styled.div`
  border-bottom: 1px solid ${variable.green};
  padding-bottom: ${variable.spacingSmall};
  padding-top: ${variable.spacingSmall};

  ${media.tablet`
       
        display: table-row;
        border: 0;
        padding: 0;
    `}
`;
const TableRow = styled.div`
  padding: ${variable.spacingSmallest} 0;

  display: flex;
  ${media.tablet`
          display: table-cell;
        border-bottom: 1px solid ${variable.green};
        padding: ${variable.spacingSmall};
                
        
    
    `};
`;

const TableCol = styled.div`
  font-family: ${variable.bodyFontFamily};
  color: ${variable.white};
  opacity: 1;
  text-align: left;
  display: block;
  ${(props) =>
    props.tableHeading
      ? `
        font-weight: bold;
        margin-right: ${variable.spacingSmall};
        
    `
      : null}

  ${media.tablet`
  display: table-cell;
        ${(props) =>
          props.mobileOnly
            ? `
            display: none;
           
        `
            : null}
    `}
`;

const Container = styled.div``;

export default withTranslation()(ReferralTable);
