import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("AuthStore", "GeneralStore", "MiningStore")
@observer
class Logout extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this._logout();
  }

  _logout() {
    const { AuthStore, history, GeneralStore, MiningStore } = this.props;

    AuthStore.setState("token", false);
    MiningStore.setState("selectedNFT", []);
    MiningStore.setState("nfts", []);
    MiningStore.setState("maximumSelected", false);
    MiningStore.setState("selectedCategory", null);
    AuthStore.setState("name", null);
    GeneralStore.setState("hasMenuLoaded", false);

    // Remove the bridge
    localStorage.removeItem("bearer_token_bridge");

    // Take them to the logout page
    window.location.href = "/logout";
  }

  render = (props) => {
    return <div>{this.props.children}</div>;
  };
}

export default withRouter(Logout);
