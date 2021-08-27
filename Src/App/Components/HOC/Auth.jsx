import React from "react";
import { inject, observer } from "mobx-react";
import { withRouter } from "react-router-dom";

@inject("AuthStore", "MiningStore")
@observer
class Authentication extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // this._checkAndRedirect();
  }
  /**
   *
   *
   * @param prevProps
   */
  componentDidUpdate(prevProps) {
    const { AuthStore } = this.props;
    if (
      prevProps.path !== "/login" &&
      AuthStore.token &&
      AuthStore.name === null
    ) {
      this._checkAndRedirect();
    }
  }
  _checkAndRedirect() {
    const { AuthStore, history, MiningStore } = this.props;
    //stop redirection after google login
    // if (window.ethereum) {
    //   window.ethereum.on("accountsChanged", () => {
    //     AuthStore.logout();
    //     history.push("/login");
    //   });
    // }

    // setTimeout(() => {
    if (!AuthStore.token) {
      history.push("/login");
    }

    if (AuthStore.token && AuthStore.name === null) {
      const token = AuthStore.token;
      AuthStore.loginUserWithToken(token).then((res) => {
        if (res.username) {
          AuthStore.setState("name", res.username);
          AuthStore.setState("email", res.email);
          AuthStore.setState("userPool", res.userPool);
          AuthStore.setState("user_boost", res.boost);
          AuthStore.setState("mm_address", res.mm_address);
          AuthStore.setState(
            "user_team",
            res.user_team ? res.user_team._id : null
          );
          AuthStore.setState("google_id", res.google_id ? res.google_id : null);
          AuthStore.setState(
            "facebook_id",
            res.facebook_id ? res.facebook_id : null
          );
          localStorage.setItem(
            "cloudminingPool",
            JSON.stringify(res.CloudminingPool)
          );
          MiningStore.getAvailableNFTs(AuthStore.token).then((res) => {
            if (res.data && res.data.length > 0) {
              MiningStore.setState("nfts", JSON.stringify(res.data));
            }
          });
        } else {
          history.push("/login");
        }
      });
    }
    // });
  }
  //   _checkAndRedirect() {
  //     const { AuthStore, history } = this.props;

  //     /**
  //      * Create the bridge between the Login system
  //      * We check for local storage bearer_token_bridge
  //      * If this exists we can auto login the user based on this token
  //      */
  //     if (localStorage.getItem("bearer_token_bridge") !== null) {
  //       const ls = JSON.parse(localStorage.getItem("bearer_token_bridge"));

  //       if (ls.token) {
  //         const { history } = this.props;
  //         const token = ls.token;

  //         // We only allow users to login via token now
  //         // Trying to consolidate the signup process to only the website
  //         AuthStore.loginUserWithToken(token).then((res) => {
  //           if (res.username) {
  //             AuthStore.setState("name", res.username);
  //             AuthStore.setState("token", ls.token);
  //             history.push("/dashboard/mining");
  //           } else {
  //             history.push("/login");
  //           }
  //         });
  //       }
  //     } else {
  //       history.push("/login");
  //     }
  //   }

  render = () => {
    return this.props.render(this.props);
  };
}

export default withRouter(Authentication);
