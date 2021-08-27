import React from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import Loader from "react-loader-spinner";
import ExpandLandDetails from "./ExpandLandDetails";
import SubExpandLandDetails from "./SubExpandLandDetails";
import "./lands.scss";
@inject("AuthStore", "LandStore", "MiningStore")
@observer
class LandDetails extends React.Component {
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
  attack = (obj) => {
    this.setState({
      isAttackLoading: true,
      sucessMes: "",
    });
    let { current_mining_team } = this.props;

    let payload = {
      attacker_id: current_mining_team._id,
      defender_id: obj,
    };

    const { MiningStore, AuthStore } = this.props;

    MiningStore.attack(payload, AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          alertmess: res.msg,
          alert: true,
          isAttackLoading: false,
        });
        setTimeout(() => {
          this.setState({
            alertmess: "",
            alert: false,
          });
        }, 5000);
      } else {
        this.setState({
          sucessMes: res.msg,
          isAttackLoading: false,
        });
        setTimeout(() => {
          this.setState({
            sucessMes: "",
            // isPanelOpen: true,
            // isOpen: false,
            // openData: {},
            // isOpenSubPanel: false,
            // openSubPanelData: {},
          });
        }, 5000);
      }
    });
  };
  render = () => {
    const {
      data,
      landType,
      isPublic,
      editPayload,
      total_team_list,
      username,
      user_team_id,
      current_mining_team,
      coinDetail,
    } = this.props;

    let {
      isOpen,
      openData,
      isOpenSubPanel,
      openSubPanelData,
      isAttackLoading,
      sucessMes,
      alertmess,
    } = this.state;

    return (
      <>
        {data.length !== 0 &&
          data.map((obj, key) => {
            // let allreadyUse = false;
            // let name = "";
            // total_team_list &&
            //   total_team_list.length !== 0 &&
            //   total_team_list.map((subObj, key) => {
            //     if (subObj.land && obj.assetId === subObj.land.id) {
            //       allreadyUse = true;
            //     }
            //     return allreadyUse;
            //   });
            // if (allreadyUse) {
            //   name = "Already used in team";
            // }
            let token = {};
            if (obj.related_nft_contract) {
              token = coinDetail.find(
                (o) => o.contract_address === obj.related_nft_contract
              );
            }
            return (
              <div
                className="main-section"
                key={key}
                onClick={(e) => this.open(obj)}
              >
                <div className="sub-section" key={key}>
                  <div className="image-div">
                    <img src={obj.image_preview_url} alt="" />
                  </div>
                  <div className="description">
                    <b>Name: </b>
                    {obj.name ? obj.name : "-"}
                  </div>
                  <div className="description">
                    <b>Regeneration: </b>
                    {obj.regeneration ? obj.regeneration : "-"}
                  </div>
                  <div className="description">
                    <b>CGG Resource: </b>
                    {obj.CGG_Resource ? obj.CGG_Resource : "-"}
                  </div>
                  <div className="description blankDiv green-text">
                    {token && token.token_name && (
                      <b> {token.token_name} token</b>
                    )}
                  </div>
                  <div className="formRow">
                    {/* {name === "" ? ( */}
                    {current_mining_team === null && (
                      <button
                        className="green"
                        onClick={() => this.props.selctLand(obj)}
                      >
                        Select for team
                      </button>
                    )}

                    {/* ) : (
                      <div className="description greenText">
                        Already used in team.
                      </div>
                    )} */}
                  </div>
                  {landType === "my_land" && (
                    <div className="formRow">
                      <button
                        className="green"
                        onClick={() => this.props.editLandDetail(obj)}
                      >
                        {(typeof obj._id === String
                          ? editPayload.id === obj._id
                          : editPayload.id === obj._id.$oid) && isPublic ? (
                          <Loader
                            type="Oval"
                            color="#000"
                            width="20"
                            height="20"
                          />
                        ) : obj.is_public ? (
                          "private"
                        ) : (
                          "public"
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        {landType !== "my_land" && isOpen && (
          <ExpandLandDetails
            clearState={() => this.clearState()}
            openSubPanel={(obj) => this.openSubPanel(obj)}
            data={openData}
            username={username}
            attack={(obj) => this.attack(obj)}
            isAttackLoading={isAttackLoading}
            sucessMes={sucessMes}
            alertmess={alertmess}
            user_team_id={user_team_id}
          />
        )}
        {isOpenSubPanel && (
          <SubExpandLandDetails
            data={openSubPanelData}
            clearState={() => this.clearSubState()}
          />
        )}
      </>
    );
  };
}

export default withTranslation()(LandDetails);
