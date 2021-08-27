import React from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import Loaderspinner from "react-loader-spinner";
import Input from "Components/Form/Input";
import Loader from "Components/Loader/Loader";
import Panel from "Components/Panel/Panel";
import Layout from "Components/Layout/Layout";
import "./JoinTeam.scss";

@inject("AuthStore", "TeamStore")
@observer
class JoinTeam extends React.Component {
  constructor(props) {
    super();

    this.state = {
      selectOption: "",
      page: 1,
      teamDetail: [],
      teamList: [],
      all_team_list: [],
      is_owner: true,
      name: "",
      data: [],
      dataLoading: true,
      alertmess: "",
      alert: false,
      isLoading: false,
      joinTeamLoader: false,
      id: "",
    };
  }

  componentDidMount() {
    this.getTeamDetails();
  }
  getTeamDetails = () => {
    const { TeamStore, AuthStore } = this.props;
    let { page } = this.state;

    TeamStore.getTeamDetails(AuthStore.token, page).then((res) => {
      this.setState({
        dataLoading: false,
        teamDetail: res.data,
        is_owner: res.data.is_owner,
        teamList:
          res.data &&
          res.data.team_member_list &&
          res.data.team_member_list.data,
        all_team_list: res.all_team_list && res.all_team_list.data,
        data: res.data,
      });
    });
  };
  createTeam = () => {
    const { TeamStore, AuthStore } = this.props;
    let { name } = this.state;
    this.setState({
      isLoading: true,
    });
    let payload = {
      name: name,
    };
    TeamStore.createTeam(payload, AuthStore.token).then((res) => {
      if (res.success) {
        this.setState(
          {
            selectOption: "",
            name: "",
            isLoading: false,
            all_team_list: [],
          },
          () => {
            this.getTeamDetails();
          }
        );
      }
      if (res.error) {
        this.setState({
          alertmess: res.message,
          alert: true,
          isLoading: false,
        });
      }
    });
  };
  joinTeam = (obj) => {
    const { TeamStore, AuthStore } = this.props;

    let payload = {
      id: obj,
    };
    this.setState({
      joinTeamLoader: true,
      id: obj,
    });
    TeamStore.joinTeam(payload, AuthStore.token).then((res) => {
      if (res.success) {
        this.setState(
          {
            joinTeamLoader: false,
            id: "",
          },
          () => {
            this.getTeamDetails();
          }
        );
      }
      if (res.error) {
        this.setState({
          alertmess: res.message,
          alert: true,
          joinTeamLoader: false,
          id: "",
        });
      }
    });
  };
  selectOption = (obj) => {
    let { selectOption } = this.state;
    if (obj !== selectOption) {
      this.setState({
        selectOption: obj,
      });
    }
  };
  onChange = (e) => {
    let name = e.target.value;
    this.setState({
      name: name,
    });
  };
  handleAlertClose = () => {
    this.setState({
      alertmess: "",
      alert: false,
    });
  };
  render = () => {
    let {
      selectOption,
      teamDetail,
      teamList,
      name,
      // is_owner,
      all_team_list,
      data,
      dataLoading,
      alertmess,
      alert,
      isLoading,
      joinTeamLoader,
      id,
      is_owner,
    } = this.state;

    return (
      <React.Fragment>
        <Layout title="Create/Join Team">
          {alert && (
            <div className="main-alert-div">
              <div className="alert">
                <div className="message">
                  <b>{alertmess}</b>
                </div>
                <div className="close" onClick={() => this.handleAlertClose()}>
                  ×
                </div>
              </div>
            </div>
          )}
          {dataLoading ? (
            <Loader />
          ) : (
            <div className="team">
              {data && data.length === 0 && (
                // && is_owner
                <div className="flex-div">
                  <button
                    className={`button ${
                      selectOption === "create" ? "green" : "purple"
                    }`}
                    onClick={() => this.selectOption("create")}
                  >
                    Create Team
                  </button>
                  {/* <button
                 className={`button ${
                   selectOption === "join" ? "green" : "purple"
                 }`}
                 onClick={() => this.selectOption("join")}
               >
                 Join Team
               </button> */}
                </div>
              )}
              {selectOption === "create" && (
                <div className="flex-div set-max-width">
                  <Input
                    className="margin"
                    type="text"
                    name="name"
                    placeholder="enter team name"
                    value={name}
                    onChange={(e) => this.onChange(e)}
                  />
                  <button
                    className="button blue"
                    onClick={() => this.createTeam()}
                  >
                    {isLoading ? (
                      <Loaderspinner
                        type="Oval"
                        color="#fff"
                        width="20"
                        height="20"
                      />
                    ) : (
                      "Create"
                    )}
                  </button>
                </div>
              )}

              <div>
                {teamDetail && teamDetail.length !== 0 && (
                  <div className="panel-wrapper">
                    <Panel theme="purple">
                      <div className="panel-inner">
                        {!is_owner && (
                          <div className="only-flex-div">
                            <div className="heading">
                              Owner Name :- {teamDetail.team.username}
                            </div>
                          </div>
                        )}
                        <div className="only-flex-div">
                          <div className="heading">
                            Team Name :- {teamDetail.team.name}
                          </div>
                        </div>
                        {/* <div>{teamDetail.team.username}</div> */}
                      </div>
                    </Panel>
                  </div>
                )}

                {teamList && teamList.length !== 0 && (
                  <div className="panel-wrapper">
                    <Panel theme="purple">
                      <div className="panel-inner">
                        <div className="margin center-flex-div green-font">
                          Team member list
                        </div>
                        <div className="table-row">
                          <div className="table-heading">User Name</div>
                          <div className="table-heading">Highest Hashrate</div>
                          <div className="table-heading">
                            Total Earn Capacity
                          </div>
                        </div>
                        {teamList.map((obj, key) => {
                          return (
                            <div key={key} className="full-width">
                              <div className="table-row">
                                <div className="table-col center-flex-div">
                                  <span className="span-heading">
                                    User Name :-
                                  </span>
                                  {` ${obj.username}`}
                                </div>
                                <div className="table-col center-flex-div">
                                  <span className="span-heading">
                                    Highest Hashrate :-
                                  </span>
                                  {obj.highest_hashrate
                                    ? ` ${obj.highest_hashrate}`
                                    : "-"}
                                </div>

                                <div className="table-col center-flex-div">
                                  <span className="span-heading">
                                    Total Earn Capacity :-
                                  </span>
                                  {obj.total_earn_capacity
                                    ? ` ${obj.total_earn_capacity}`
                                    : "-"}
                                </div>
                              </div>
                            </div>

                            // <div className="only-flex-div" key={key}>
                            //   <div className="center-flex-div"> {obj.username}</div>
                            // </div>
                          );
                        })}
                      </div>
                    </Panel>
                  </div>
                )}
                {all_team_list && all_team_list.length !== 0 && (
                  <div className="panel-wrapper">
                    <Panel theme="purple">
                      <div className="panel-inner">
                        <div className="table-row center-flex-div">
                          <div className="table-heading">Team member list</div>
                        </div>
                        {all_team_list.map((obj, key) => {
                          return (
                            <div className="only-flex-div" key={key}>
                              <div className="full-width">
                                <div className="table-row">
                                  {/* <div className="table-heading center-flex-div">
                                    User Name:
                                  </div> */}
                                  <div className="table-col center-flex-div">
                                    {obj.username}
                                  </div>
                                  <div className="table-col">
                                    <button
                                      className="button blue"
                                      onClick={() => this.joinTeam(obj._id)}
                                    >
                                      {id === obj._id && joinTeamLoader ? (
                                        <Loaderspinner
                                          type="Oval"
                                          color="#fff"
                                          width="20"
                                          height="20"
                                        />
                                      ) : (
                                        "join"
                                      )}
                                    </button>
                                  </div>
                                </div>
                              </div>

                              {/* <div className="center-flex-div"> {obj.username}</div>
                        <div style={{ width: "50%" }}>
                          <button
                            className="button blue"
                            onClick={() => this.joinTeam(obj._id)}
                          >
                            join
                          </button>
                        </div> */}
                            </div>
                          );
                        })}
                      </div>
                    </Panel>
                  </div>
                )}
              </div>
            </div>
          )}
        </Layout>
      </React.Fragment>
    );
  };
}

export default withTranslation()(JoinTeam);
