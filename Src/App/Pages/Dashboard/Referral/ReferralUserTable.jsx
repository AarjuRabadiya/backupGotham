import React from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
// import { CopyToClipboard } from "react-copy-to-clipboard";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import ReactPagination from "Components/Pagination/Pagination";
// import Loader from "Components/Loader/Loader";
import Panel from "Components/Panel/Panel";
class ReferralTable extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      userPoolList: [],
    };
  }

  render = () => {
    const { data } = this.props;

    return (
      <Container>
        <Table>
          <Body>
            <PanelWrapper>
              <Panel theme="purple">
                <PanelInner>
                  {`${data.pool_code} (${data.pool_name})`}
                  {data.data && data.data.length !== 0 ? (
                    data.data.map((item, key) => {
                      return (
                        <React.Fragment key={key}>
                          {key === 0 && (
                            <TableHead hiddenMobile>
                              <TableHeading widthSmall>Pool Code</TableHeading>
                              <TableHeading>Pool Name</TableHeading>
                              <TableHeading>Hashrate</TableHeading>
                              <TableHeading>User Name</TableHeading>
                            </TableHead>
                          )}
                          <TableBody>
                            <TableRow widthSmall>
                              <TableCol>{item.pool_code}</TableCol>
                            </TableRow>
                            <TableRow>
                              <TableCol>{item.pool_name}</TableCol>
                            </TableRow>
                            <TableRow>
                              <TableCol>{item.hashrate_count}</TableCol>
                            </TableRow>
                            <TableRow>
                              <TableCol>{item.username}</TableCol>
                            </TableRow>
                          </TableBody>
                        </React.Fragment>
                      );
                    })
                  ) : (
                    <TableBody>
                      <TableRow>
                        <TableCol>Sorry members are not available.</TableCol>
                      </TableRow>
                    </TableBody>
                  )}
                  {data.data &&
                    data.data.length !== 0 &&
                    data.next_page_url !== null && (
                      <TableRow>
                        <ReactPagination
                          pageCount={data.pageCount}
                          onPageChange={(e) => this.props.onPageChange(e, data)}
                        />
                      </TableRow>
                    )}
                </PanelInner>
              </Panel>
            </PanelWrapper>
          </Body>
        </Table>
      </Container>
    );
  };
}
const PanelWrapper = styled.div`
  margin-bottom: 10px;
  ${media.desktop`
      width: 80%;
    `}

  ${media.largest_desktop`
      width: 100%;
    `}
`;

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
`;

export default withTranslation()(ReferralTable);
