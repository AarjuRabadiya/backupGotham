import React from "react";
import styled from "styled-components";
import { withTranslation } from "react-i18next";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import Loader from "Components/Loader/Loader";
import Panel from "Components/Panel/Panel";
import ExpandLandDetails from "./ExpandLandDetail";
import SubExpandLandDetails from "./SubExpandLandDetails";

class MiningTeamDetail extends React.PureComponent {
  constructor(props) {
    super();
    this.state = {
      isOpen: false,
      openData: {},
      isOpenSubPanel: false,
      openSubPanelData: {},
    };
  }
  open = (obj) => {
    this.setState({
      isOpen: true,
      openData: obj,
    });
  };
  clearState = () => {
    this.setState({
      isOpen: false,
      openData: {},
    });
  };
  openSubPanel = (obj) => {
    this.setState({
      isOpenSubPanel: true,
      openSubPanelData: obj,
    });
  };
  clearSubState = () => {
    this.setState({
      isOpenSubPanel: false,
      openSubPanelData: {},
    });
  };

  render = () => {
    const {
      miningTeamDetails,
      dataLoading,
      closePanel,
      sucessMes,
      isAttackLoading,
    } = this.props;
    const { isOpen, openData, openSubPanelData, isOpenSubPanel } = this.state;

    return (
      <Container>
        {isOpen && (
          <ExpandLandDetails
            clearState={() => this.clearState()}
            data={openData}
            openSubPanel={this.openSubPanel}
            attack={this.props.attack}
            closePanel={closePanel}
            isAttackLoading={isAttackLoading}
            sucessMes={sucessMes}
          />
        )}
        {isOpenSubPanel && (
          <SubExpandLandDetails
            data={openSubPanelData}
            clearState={() => this.clearSubState()}
          />
        )}
        {dataLoading ? (
          <Loader />
        ) : miningTeamDetails ? (
          miningTeamDetails.map((obj, key) => {
            return (
              <PanelWrapper key={key}>
                <Panel theme="purple">
                  <PanelInner
                    onClick={
                      obj.all_user_miner_details &&
                      obj.all_user_miner_details.length !== 0
                        ? () => this.open(obj.all_user_miner_details)
                        : null
                    }
                  >
                    <Table>
                      <TableRow>
                        <div style={{ width: "150px", margin: "10px auto" }}>
                          <img
                            src={
                              obj.image_preview_url
                                ? obj.image_preview_url
                                : obj.image
                            }
                            alt=""
                          />
                        </div>
                      </TableRow>
                      <TableRow>
                        <TableHeading>Category</TableHeading>
                        <TableHeading>:-</TableHeading>

                        <TableCol>{obj.category ? obj.category : "-"}</TableCol>
                      </TableRow>
                      <TableRow>
                        <TableHeading>Name</TableHeading>
                        <TableHeading>:-</TableHeading>

                        <TableCol>{obj.name ? obj.name : "-"}</TableCol>
                      </TableRow>

                      {obj.type && (
                        <TableRow>
                          <TableHeading>Type</TableHeading>
                          <TableHeading>:-</TableHeading>

                          <TableCol>{obj.type ? obj.type : "-"}</TableCol>
                        </TableRow>
                      )}
                      {obj.hashrate && (
                        <TableRow>
                          <TableHeading>Hashrate</TableHeading>
                          <TableHeading>:-</TableHeading>

                          <TableCol>
                            {obj.hashrate ? obj.hashrate : "-"}
                          </TableCol>
                        </TableRow>
                      )}
                      {(obj.assetDescriptor || obj.description) && (
                        <TableRow>
                          <TableHeading>Asset Descriptor</TableHeading>
                          <TableHeading>:-</TableHeading>

                          <TableCol>
                            {obj.assetDescriptor
                              ? obj.assetDescriptor
                              : obj.description
                              ? obj.description
                              : "-"}
                          </TableCol>
                        </TableRow>
                      )}
                      {obj.desc && (
                        <TableRow>
                          <TableHeading>Desc</TableHeading>
                          <TableHeading>:-</TableHeading>
                          <TableCol>{obj.desc ? obj.desc : "-"}</TableCol>
                        </TableRow>
                      )}
                      {obj.capacity && (
                        <TableRow>
                          <TableHeading>Capacity</TableHeading>
                          <TableHeading>:-</TableHeading>
                          <TableCol>
                            {obj.capacity ? obj.capacity : "-"}
                          </TableCol>
                        </TableRow>
                      )}
                    </Table>
                  </PanelInner>
                </Panel>
              </PanelWrapper>
            );
          })
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
