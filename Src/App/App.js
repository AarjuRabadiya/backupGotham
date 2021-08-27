import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import { Helmet } from "react-helmet";
import * as variable from "Base/Variables";
import i18n from "../i18";
import "./app.scss";
import Auth from "Components/HOC/Auth";
import BgMining from "Pages/Dashboard/Mining/assets/bg-mining@2x.jpg";
import BgBalance from "Pages/Dashboard/Balance/assets/bg-balance@2x.jpg";

const Login = lazy(() => import("Pages/Login/Login_Old"));
const Mining = lazy(() => import("Pages/Dashboard/Mining/Mining"));
const Mining2 = lazy(() => import("Pages/Dashboard/Mining2.0/Mining2"));
const Profile = lazy(() => import("Pages/Dashboard/Profile/Profile"));
const History = lazy(() => import("Pages/Dashboard/History/History"));
const Participation = lazy(() =>
  import("Pages/Dashboard/Participation/Participation")
);
const Balance = lazy(() => import("Pages/Dashboard/Balance/Balance"));
const Partners = lazy(() => import("Pages/Dashboard/Partners/Partners"));
const Logout = lazy(() => import("Pages/Logout/Logout"));
const SignUp = lazy(() => import("Pages/Login/SignUp"));
const SignUpVerify = lazy(() => import("Pages/Login/SignUpVerify"));
const Stats = lazy(() => import("Pages/Dashboard/Stats/Stats"));
const Search = lazy(() => import("Pages/Search"));
// const AssetsDetail = lazy(() => import("Pages/Search/AssetDetails"));
const ForgotPassword = lazy(() => import("Pages/Login/Forgotpassword"));
const ChangePassword = lazy(() => import("Pages/Login/ChangePassword"));
const CloudMining = lazy(() =>
  import("Pages/Dashboard/CloudMining/CloudMining")
);
const Referral = lazy(() => import("Pages/Dashboard/Referral/Referral"));
const Land = lazy(() => import("Pages/Dashboard/Lands"));
const JoinTeam = lazy(() => import("Pages/Dashboard/JoinTeam"));
const Distance = lazy(() => import("Pages/Dashboard/Distance"));

const GlobalStyle = createGlobalStyle`
    html,body,p,ol,ul,li,dl,dt,dd,blockquote,figure,fieldset,legend,textarea,pre,iframe,hr,h1,h2,h3,h4,h5,h6{margin:0;padding:0}
    h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal}
    ul{list-style:none}
    button,input,select,textarea{margin:0}
    html{box-sizing:border-box}
    *,*:before,*:after{box-sizing:inherit}
    img,embed,iframe,object,audio,video{height:auto;max-width:100%}
    iframe{border:0}table{border-collapse:collapse;border-spacing:0}
    td,th{padding:0;text-align:left}
    body { font-family:${variable.bodyFontFamily}; background-color:${variable.black}; -webkit-font-smoothing:antialiased; font-size: ${variable.textMedium}; }
    html { font-size: 62.5%; /* Now 10px = 1rem! */ }

    html, body, #app { height: 100%; }
    html { height: 100%; }
	  body { min-height: 100%; }

    #app > div {
      height: 100%;
    }
`;

const AppContainer = styled.div``;

const Bg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: fixed;
  top: 0;
  right: 0;
  z-index: -1;
  opacity: 0;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.active
      ? `
		opacity: 1;
	`
      : null}
`;

export default class App extends React.Component {
  /**
   * Create the constructor
   * @param props
   *
   */
  constructor(props) {
    super(props);

    this.state = {
      background: BgMining,
    };
  }

  componentDidMount() {
    const imageList = [BgMining, BgBalance];
    imageList.forEach((image) => {
      new Image().src = image;
    });

    this.setState({ imageList: imageList });
  }

  /**
   *
   * Load the background for the page
   * */
  loadBg = (key) => {
    let backgrounds = {
      mining: BgMining,
      balance: BgBalance,
    };

    const keys = Object.keys(backgrounds);
    let index;

    keys.map(function (newKey, src) {
      if (key === newKey) {
        index = src;
      }
    });

    this.setState({ background: index });
  };

  render = (props) => {
    const { background, imageList } = this.state;
    const { AuthStore } = this.props;

    return (
      <AppContainer background={background}>
        {/*
					Helmet provides an update to all of our SEO routing
					SEO routing is all configured within the App.js file
					We shouldn't overwrite routing on specific pages unless absolutely necessary
				*/}
        <Helmet
          title=""
          meta={[
            { name: "description", content: "" },
            { name: "keywords", content: "" },
            { name: "geo.region", content: "UK" },
            { name: "geo.placename", content: "chainguardians" },
            { property: "og:type", content: "website" },
            { property: "og:locale", content: "en_GB" },
            { property: "og:url", content: "https://chainguardians.io" },
            { property: "og:title", content: "chainguardians" },
            { property: "og:description", content: "" },
            { property: "og:image", content: "/banner.png" },
            { property: "og:image:width", content: "862" },
            { property: "og:image:height", content: "485" },
            { property: "og:image:type", content: "image/jpeg" },
            { property: "og:site_name", content: "chainguardians" },
            {
              property: "og:see_also",
              content: "https://twitter.com/chainguardians",
            },
            {
              property: "og:see_also",
              content: "https://www.facebook.com/chainguardians",
            },
          ]}
        />

        <GlobalStyle />

        {imageList &&
          imageList.map((src, key) => {
            return (
              <Bg key={key} src={src} active={key === background} alt="" />
            );
          })}

        <Router
        //  basename={"/mining"}
        >
          <Suspense fallback="">
            <Switch>
              <Auth
                exact
                path="/login"
                render={(props) => <Login {...props} i18n={i18n} />}
              />
              <Route
                exact
                path="/signup"
                render={(props) => <SignUp {...props} i18n={i18n} />}
              />
              <Route
                exact
                path="/forgot-password"
                render={(props) => <ForgotPassword {...props} i18n={i18n} />}
              />
              <Route
                exact
                path="/change-password/:token"
                render={(props) => <ChangePassword {...props} i18n={i18n} />}
              />
              <Auth
                exact
                path="/dashboard/logout"
                render={(props) => <Logout {...props} i18n={i18n} />}
              />
              <Route
                exact
                path="/search"
                render={(props) => <Search {...props} i18n={i18n} />}
              />
              <Auth
                exact
                path="/dashboard/join_team"
                render={(props) => <JoinTeam {...props} i18n={i18n} />}
              />

              <Auth
                exact
                path="/dashboard/distance"
                render={(props) => <Distance {...props} i18n={i18n} />}
              />
              <Auth
                exact
                path="/dashboard/partners"
                render={(props) => (
                  <Partners
                    {...props}
                    i18n={i18n}
                    loadBg={(e) => this.loadBg(e)}
                  />
                )}
              />
              <Auth
                exact
                path="/dashboard/mining"
                render={(props) => (
                  <Mining
                    {...props}
                    i18n={i18n}
                    loadBg={(e) => this.loadBg(e)}
                  />
                )}
              />
              <Auth
                exact
                path="/dashboard/team_mining"
                render={(props) => (
                  <Mining2
                    {...props}
                    i18n={i18n}
                    loadBg={(e) => this.loadBg(e)}
                  />
                )}
              />
              <Auth
                exact
                path="/dashboard/profile"
                assets={false}
                render={(props) => (
                  <Profile
                    {...props}
                    i18n={i18n}
                    loadBg={(e) => this.loadBg(e)}
                  />
                )}
              />
              <Auth
                exact
                path="/dashboard/history"
                render={(props) => (
                  <History
                    {...props}
                    i18n={i18n}
                    loadBg={(e) => this.loadBg(e)}
                  />
                )}
              />
              <Auth
                exact
                path="/dashboard/participation"
                render={(props) => (
                  <Participation
                    {...props}
                    i18n={i18n}
                    loadBg={(e) => this.loadBg(e)}
                  />
                )}
              />
              <Auth
                exact
                path="/dashboard/balance"
                render={(props) => (
                  <Balance
                    {...props}
                    i18n={i18n}
                    loadBg={(e) => this.loadBg(e)}
                  />
                )}
              />
              <Auth
                exact
                path="/dashboard/stats"
                render={(props) => (
                  <Stats
                    {...props}
                    i18n={i18n}
                    loadBg={(e) => this.loadBg(e)}
                  />
                )}
              />
              <Auth
                exact
                path="/dashboard/lands"
                render={(props) => (
                  <Land {...props} i18n={i18n} loadBg={(e) => this.loadBg(e)} />
                )}
              />
              <Auth
                exact
                path="/dashboard/cloudMining"
                render={(props) => (
                  <CloudMining
                    {...props}
                    i18n={i18n}
                    loadBg={(e) => this.loadBg(e)}
                  />
                )}
              />
              <Auth
                exact
                path="/dashboard/referral"
                render={(props) => (
                  <Referral
                    {...props}
                    i18n={i18n}
                    loadBg={(e) => this.loadBg(e)}
                  />
                )}
              />
              <Redirect to="/login" />
            </Switch>
          </Suspense>
        </Router>
      </AppContainer>
    );
  };
}
