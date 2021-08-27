import React from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import Loaderspinner from "react-loader-spinner";
import Modal from "react-modal";
import Layout from "Components/Layout/Layout";
import LandDetails from "./LandDetails";
import Loader from "Components/Loader/Loader";
import ReactPagination from "Components/Pagination/Pagination";
import Input from "Components/Form/Input";
import "./lands.scss";

const customStyles = {
  overlay: {
    backgroundColor: "rgb(0 0 0 / 75%)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "20%",
  },
};
@inject("AuthStore", "LandStore", "MiningStore", "AssetStore")
@observer
class Lands extends React.Component {
  constructor(props) {
    super();

    this.state = {
      isLoading: true,
      landType: "all",
      page: 1,
      resource: 0,
      last_page: 1,
      landDetails: [],
      total_team_list: [],
      dataLoading: false,
      resetPagination: false,
      isModal: false,
      isConfirm: false,
      cgc: "",
      editPayload: {},
      error: false,
      errorMes: "",
      isPublic: false,
      isEdit: false,
      username: "",
      isAttackLoading: false,
      isOpenSubPanel: false,
      openSubPanelData: {},
      current_mining_team: {},
      isPanelOpen: false,
      coinDetail: [],
    };
  }

  componentDidMount() {
    this.props.loadBg("balance");
    const { AuthStore } = this.props;
    this.setState({
      username: AuthStore.name,
    });

    this.getLandDetails();
    this.getCoinDetails();
  }
  UNSAFE_componentWillMount() {
    Modal.setAppElement("body");
  }
  getLandDetails = () => {
    const { LandStore, AuthStore } = this.props;
    let { landType, page, resource } = this.state;
    let payload = {
      type: landType,
      page: page,
      resource: resource,
    };

    LandStore.getLandDetails(payload, AuthStore.token).then((res) => {
      this.setState({
        page: res.data.current_page,
        landDetails: res.data.data,
        total_team_list: res.total_team_list,
        last_page: res.data.last_page,
        isLoading: false,
        dataLoading: false,
        resetPagination: false,
        current_mining_team: res.current_mining_team,
      });
    });
  };
  getCoinDetails = () => {
    const { AssetStore, AuthStore } = this.props;
    AssetStore.getCoinDetails(AuthStore.token).then((res) => {
      if (res.data) {
        this.setState({
          coinDetail: res.data,
        });
      }
    });
  };
  changeResource = () => {
    let { resource } = this.state;

    this.setState(
      {
        resource: resource === 0 ? 1 : 0,
        page: 1,
        dataLoading: true,
        resetPagination: true,
      },
      () => {
        this.getLandDetails();
      }
    );
  };
  changeLandType = (landTypeObj) => {
    let { landType } = this.state;
    if (landTypeObj !== landType) {
      this.setState(
        {
          landType: landTypeObj,
          page: 1,
          dataLoading: true,
          resetPagination: true,
        },
        () => {
          this.getLandDetails();
        }
      );
    }
  };
  onPageChange = (e) => {
    this.setState(
      {
        page: e.selected + 1,
        dataLoading: true,
      },
      () => {
        this.getLandDetails();
      }
    );
  };
  editLandDetail = (obj) => {
    let payload = {
      contract_address: obj.contract_address,
      id: typeof obj._id === "string" ? obj._id : obj._id.$oid,
      action: !obj.is_public,
      cgc: 0,
    };
    this.setState({
      editPayload: payload,
      isPublic: true,
    });
    if (obj.is_public) {
      this.setState({
        isModal: true,
      });
    } else {
      this.setState({
        isConfirm: true,
      });
    }
  };
  selctLand = (obj) => {
    this.props.history.push({
      pathname: "/dashboard/team_mining",
      landData: { landObj: obj },
    });
  };
  editLandDetails = (payload) => {
    const { LandStore, AuthStore } = this.props;
    LandStore.editLandDetails(payload, AuthStore.token).then((res) => {
      if (res.errors && res.errors.cgc) {
        this.setState({
          error: true,
          errorMes: res.errors.cgc[0],
          isPublic: false,
          isEdit: false,
        });
      } else if (res.error) {
        this.setState({
          error: true,
          errorMes: res.error,
          isPublic: false,
          isEdit: false,
        });
      } else {
        this.setState({
          page: res.data.current_page,
          landDetails: res.data.data,
          total_team_list: res.data.total_team_list,
          last_page: res.data.last_page,
          isLoading: false,
          dataLoading: false,
          resetPagination: false,
          isPublic: false,
          isEdit: false,
        });
        this.closeConfirmModal();
      }
    });
  };
  closeModal = () => {
    this.setState({
      isModal: false,
      cgc: "",
      isPublic: false,
    });
  };
  closeConfirmModal = () => {
    this.setState({
      isConfirm: false,
      isPublic: false,
      isEdit: false,
    });
  };
  onChange = (e) => {
    let value = e.target.value;
    let re = /^[0-9]*$/g;

    value = value.replace("+", "");
    value = value.replace("-", "");

    if (value.match(re)) {
      let { editPayload } = this.state;
      editPayload.cgc = parseInt(value);

      this.setState({
        cgc: value,
        editPayload,
        error: false,
        errorMes: "",
      });
    }
  };
  onSubmit = () => {
    this.closeModal();
    this.setState({
      isConfirm: true,
    });
  };
  editConform = () => {
    let { editPayload } = this.state;

    this.setState(
      {
        editPayload,
        isEdit: true,
      },
      () => {
        let { editPayload } = this.state;
        this.editLandDetails(editPayload);
      }
    );
  };
  closeError = () => {
    this.setState({
      errorMes: "",
      error: false,
    });
  };

  render = () => {
    let {
      landType,
      landDetails,
      total_team_list,
      isLoading,
      last_page,
      dataLoading,
      resetPagination,
      page,
      isModal,
      cgc,
      isConfirm,
      error,
      errorMes,
      isPublic,
      isEdit,
      editPayload,
      resource,
      username,
      current_mining_team,
      coinDetail,
    } = this.state;
    const { AuthStore } = this.props;

    return (
      <div className="land">
        {isModal && (
          <Modal
            isOpen={isModal}
            onRequestClose={() => this.closeModal()}
            style={customStyles}
          >
            {error && (
              <div className="error">
                <div className="errorMess">{errorMes}</div>
                <div className="errorClose" onClick={() => this.closeError()}>
                  X
                </div>
              </div>
            )}
            <div className="formRow">
              <Input
                type="text"
                name="cgc"
                value={cgc}
                placeholder="Enter CGC"
                onChange={(e) => this.onChange(e)}
                maxLength="6"
              />
            </div>
            <div className="formRow">
              <button className="submit-button" onClick={() => this.onSubmit()}>
                Submit
              </button>
            </div>
          </Modal>
        )}
        {isConfirm && (
          <Modal
            isOpen={isConfirm}
            onRequestClose={() => this.closeConfirmModal()}
            style={customStyles}
          >
            {error && (
              <div className="error">
                <div className="errorMess">{errorMes}</div>
                <div
                  className="errorClose"
                  onClick={() => this.closeConfirmModal()}
                >
                  X
                </div>
              </div>
            )}
            <div className="formRow">
              Are you sure you want to make this land as
              {editPayload.action ? " private" : " public"}?
            </div>
            <div className="formRow">
              <button
                className="submit-button"
                onClick={() => this.editConform()}
              >
                {isEdit ? (
                  <Loaderspinner
                    type="Oval"
                    color="#fff"
                    width="20"
                    height="20"
                  />
                ) : (
                  "YES"
                )}
              </button>
            </div>
            <div className="formRow">
              <button
                className="reset-button"
                onClick={() => this.closeConfirmModal()}
              >
                NO
              </button>
            </div>
          </Modal>
        )}
        <Layout
          title="Land"
          description={
            landType === "all" ? "List of all lands" : "List of my lands"
          }
        >
          {isLoading ? (
            <Loader />
          ) : (
            <>
              <div className="land-content">
                <div className="displayFlex">
                  <div className="button-section">
                    <button
                      className={`land-type button-borderRadius ${
                        landType === "all" ? "purple" : "orange"
                      }`}
                      disabled={dataLoading}
                      onClick={() => this.changeLandType("My lands")}
                    >
                      <div className="removeTransform">
                        My lands
                        {/* {landType === "all" ? "My lands" : "All lands"} */}
                      </div>
                    </button>
                  </div>
                  <div className="button-section">
                    <button
                      className={`land-type button-borderRadius ${
                        landType === "all" ? "orange" : "purple"
                      }`}
                      disabled={dataLoading}
                      onClick={() => this.changeLandType("all")}
                    >
                      <div className="removeTransform">
                        All lands
                        {/* {landType === "all" ? "My lands" : "All lands"} */}
                      </div>
                    </button>
                  </div>
                  <div className="button-section">
                    <button
                      className="resource button-borderRadius green"
                      onClick={() => this.changeResource()}
                      disabled={dataLoading}
                    >
                      <div className="removeTransform">
                        Resource via
                        {resource === 1 ? " ascending" : " desending"}
                      </div>
                    </button>
                  </div>
                </div>
              </div>
              <div className="land-details">
                {dataLoading && (
                  <div className="loader-div">
                    <Loaderspinner
                      type="ThreeDots"
                      color="#fff"
                      width="80"
                      height="80"
                    />
                  </div>
                )}
                {!dataLoading && landDetails && (
                  <LandDetails
                    data={landDetails}
                    total_team_list={total_team_list}
                    landType={landType}
                    editLandDetail={(obj) => this.editLandDetail(obj)}
                    selctLand={(obj) => this.selctLand(obj)}
                    isPublic={isPublic}
                    editPayload={editPayload}
                    username={username}
                    current_mining_team={current_mining_team}
                    user_team_id={AuthStore.user_team}
                    coinDetail={coinDetail}
                  />
                )}
                {!resetPagination &&
                  landDetails &&
                  landDetails.length !== 0 &&
                  last_page >= page && (
                    <ReactPagination
                      pageCount={last_page}
                      onPageChange={(e) => this.onPageChange(e)}
                    />
                  )}
                {!isLoading && !dataLoading && landDetails.length === 0 && (
                  <div className="message">Sorry, Lands are not available.</div>
                )}
              </div>
            </>
          )}
        </Layout>
      </div>
    );
  };
}

export default withTranslation()(Lands);
