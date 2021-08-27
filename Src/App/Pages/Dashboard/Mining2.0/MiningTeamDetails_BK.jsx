import React from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import Loader from "Components/Loader/Loader";
import Panel from "Components/Panel/Panel";

class MiningTeamDetail extends React.PureComponent {
  constructor(props) {
    super();
  }

  render = () => {
    const { miningTeamDetails, dataLoading } = this.props;

    return (
      <Container>
        {dataLoading ? (
          <Loader />
        ) : miningTeamDetails ? (
          <PanelWrapper>
            <Panel theme="purple">
              <PanelInner>
                <Table>
                  <TableRow>
                    <div style={{ width: "150px", margin: "auto" }}>
                      <img
                        src={
                          miningTeamDetails.image
                            ? miningTeamDetails.image
                            : miningTeamDetails.image_url
                        }
                        alt=""
                      />
                    </div>
                  </TableRow>
                  <TableRow>
                    <TableHeading>Category</TableHeading>
                    <TableHeading>:-</TableHeading>

                    <TableCol>
                      {miningTeamDetails.category
                        ? miningTeamDetails.category
                        : "-"}
                    </TableCol>
                  </TableRow>
                  <TableRow>
                    <TableHeading>Name</TableHeading>
                    <TableHeading>:-</TableHeading>

                    <TableCol>
                      {miningTeamDetails.name ? miningTeamDetails.name : "-"}
                    </TableCol>
                  </TableRow>

                  {miningTeamDetails.type && (
                    <TableRow>
                      <TableHeading>Type</TableHeading>
                      <TableHeading>:-</TableHeading>

                      <TableCol>
                        {miningTeamDetails.type ? miningTeamDetails.type : "-"}
                      </TableCol>
                    </TableRow>
                  )}
                  {miningTeamDetails.hashrate && (
                    <TableRow>
                      <TableHeading>Hashrate</TableHeading>
                      <TableHeading>:-</TableHeading>

                      <TableCol>
                        {miningTeamDetails.hashrate
                          ? miningTeamDetails.hashrate
                          : "-"}
                      </TableCol>
                    </TableRow>
                  )}
                  {miningTeamDetails.assetDescriptor && (
                    <TableRow>
                      <TableHeading>Asset Descriptor</TableHeading>
                      <TableHeading>:-</TableHeading>

                      <TableCol>
                        {miningTeamDetails.assetDescriptor
                          ? miningTeamDetails.assetDescriptor
                          : "-"}
                      </TableCol>
                    </TableRow>
                  )}
                  {miningTeamDetails.desc && (
                    <TableRow>
                      <TableHeading>Desc</TableHeading>
                      <TableHeading>:-</TableHeading>
                      <TableCol>
                        {miningTeamDetails.desc ? miningTeamDetails.desc : "-"}
                      </TableCol>
                    </TableRow>
                  )}
                  {miningTeamDetails.capacity && (
                    <TableRow>
                      <TableHeading>Capacity</TableHeading>
                      <TableHeading>:-</TableHeading>
                      <TableCol>
                        {miningTeamDetails.capacity
                          ? miningTeamDetails.capacity
                          : "-"}
                      </TableCol>
                    </TableRow>
                  )}
                </Table>
              </PanelInner>
            </Panel>
          </PanelWrapper>
        ) : null}
      </Container>
    );
  };
}
const PanelWrapper = styled.div`
  margin-bottom: 10px;
  margin-top: 10px;
  ${media.desktop`
      width: 80%;
    `}

  ${media.largest_desktop`
      width: 100%;
    `}
`;
const PanelInner = styled.div`
  padding: 0 ${variable.spacingMedium} ${variable.spacingMedium};

  ${media.tablet`
      padding: 0 ${variable.spacingMedium};
  `}
`;
const Table = styled.div``;

const TableHeading = styled.div`
  font-family: ${variable.bodyFontFamily};
  color: ${variable.white};
  opacity: 1;
  padding: ${variable.spacingSmall};
  text-align: left;
  font-weight: 600;
`;
const TableRow = styled.div`
  display: flex;
  border-bottom: 1px solid ${variable.green};
`;

const TableCol = styled.div`
  font-family: ${variable.bodyFontFamily};
  color: ${variable.white};
  opacity: 1;
  padding: ${variable.spacingSmall};
  text-align: left;
  font-weight: 600;
`;

const Container = styled.div``;

export default withTranslation()(MiningTeamDetail);
