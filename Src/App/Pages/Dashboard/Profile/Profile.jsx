import React from "react";
import styled from "styled-components";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import { GoogleLogin } from "react-google-login";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import Loader from "react-loader-spinner";
import Modal from "react-modal";
import * as variable from "Base/Variables";
import Panel from "Components/Panel/Panel";
import Layout from "Components/Layout/Layout";
import { media } from "Base/Media";
import UserTable from "./UserTable";
// import Button from "Components/Buttons/Button";
import Google from "./assets/google.svg";
import Facebook from "./assets/facebook.svg";
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
  },
};
@inject("AuthStore", "MiningStore")
@observer
class Profile extends React.Component {
  constructor(props) {
    super();

    this.state = {
      mm_address: null,
      alert: false,
      isGoogleLoading: false,
      isFacebookLoading: false,
      email: "",
      facebook_id: null,
      google_id: null,
      boost: "",
      boostErrorMessage: false,
      isLoading: false,
      userDetail: {},
      dataLoading: true,
      isModal: false,
    };
  }

  componentDidMount() {
    const { AuthStore } = this.props;

    this.props.loadBg("balance");
    this.getUserDetail();
    this.setState({
      mm_address: AuthStore.mm_address,
      facebook_id: AuthStore.facebook_id,
      google_id: AuthStore.google_id,
    });
  }
  componentWillMount() {
    Modal.setAppElement("body");
  }
  getUserDetail = () => {
    this.setState({
      dataLoading: true,
    });
    const { AuthStore } = this.props;
    AuthStore.loginUserWithToken(AuthStore.token).then((res) => {
      this.setState({
        userDetail: res,
        dataLoading: false,
      });
    });
  };
  connectMetaMask = (e) => {
    // e.preventDefault();
    const { AuthStore } = this.props;
    // let token = AuthStore.token;
    // Retrieve the MetaMask Address from the user

    AuthStore.retrieveMetaMaskAddress().then((res) => {
      if (res.address) {
        let payload = {
          mm_address: res.address,
        };

        AuthStore.editUser(payload, AuthStore.token).then(async (response) => {
          const json = await response.json();
          if (response.status === 200) {
            AuthStore.setState("mm_address", json.mm_address);
            this.setState({
              mm_address: json.address,
            });
            this.getUserDetail();
            if (json.error) {
              this.setState({
                alert: true,
                alertmess: json.error,
              });
            }
          } else {
            this.setState({
              alert: true,
              alertmess: json[0],
            });
          }
          if (json.error) {
            this.setState({
              alert: true,
              alertmess: json.error,
            });
          }
        });
      } else {
        this.setState({
          alert: true,
          alertmess: res.error,
        });
      }
    });
  };
  handleAlertClose = () => {
    this.setState({
      alertmess: "",
      alert: false,
    });
  };
  responseGoogle = (response) => {
    if (!response.error) {
      this.setState({
        isGoogleLoading: true,
      });

      if (response) {
        let payload = { data: response, type: "google" };
        this.SocialLogin(payload);
      }
    }
  };
  responseFacebook = (response) => {
    if (!response.status) {
      this.setState({
        isFacebookLoading: true,
      });
      if (response) {
        let payload = { data: response, type: "facebook" };
        if (payload.type === "facebook") {
          if (payload.data.email === undefined) {
            this.setState({
              isModal: true,
              setFaceBookResponse: payload.data,
            });
          } else {
            this.SocialLogin(payload);
          }
        } else {
          this.SocialLogin(payload);
        }
      }
    }
  };
  SocialLogin = (payload) => {
    const { AuthStore } = this.props;
    AuthStore.editUser(payload, AuthStore.token).then(async (response) => {
      if (response.status === 200) {
        const json = await response.json();
        this.setState({
          isGoogleLoading: false,
          isFacebookLoading: false,
        });
        if (json.google_id) {
          AuthStore.setState("google_id", json.google_id);
          this.setState({
            google_id: json.google_id,
          });
          this.getUserDetail();
        }
        if (json.facebook_id) {
          AuthStore.setState("facebook_id", json.facebook_id);
          this.setState({
            facebook_id: json.facebook_id,
          });
          this.getUserDetail();
        }
        if (json.error) {
          this.setState({
            alert: true,
            alertmess: json.error,
          });
        }
      }
    });
  };
  closeModal = () => {
    this.setState({
      isModal: false,
    });
  };
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
      boostErrorMessage: false,
    });
  };
  onSubmit = () => {
    let { email, setFaceBookResponse } = this.state;
    if (email) {
      setFaceBookResponse["email"] = email;
      this.setState(
        {
          setFaceBookResponse,
          isModal: false,
        },
        () => {
          let { setFaceBookResponse } = this.state;
          let payload = {
            data: setFaceBookResponse,
            type: "facebook",
          };
          this.SocialLogin(payload);
        }
      );
    }
  };

  render = () => {
    const {
      isGoogleLoading,
      isFacebookLoading,
      mm_address,
      facebook_id,
      google_id,
      isModal,
      // boost,
      // boostErrorMessage,
      // isLoading,
      userDetail,
      dataLoading,
    } = this.state;

    const { i18n } = this.props;
    let mm_title = i18n.t("login.connect.mm")
      ? i18n.t("login.connect.mm")
      : null;

    return (
      <React.Fragment>
        {isModal && (
          <Modal
            isOpen={isModal}
            onRequestClose={() => this.closeModal()}
            style={customStyles}
          >
            <ModalContainer>
              <EmailInput>
                <input
                  type="email"
                  placeholder="Please enter email"
                  name="email"
                  onChange={(e) => this.onChange(e)}
                />
              </EmailInput>
              <EmailSubmit>
                <Submit onClick={() => this.onSubmit()}>Submit email</Submit>
              </EmailSubmit>
            </ModalContainer>
          </Modal>
        )}
        <Layout title="profile">
          {this.state.alert && (
            <MainAlertDiv>
              <Alert>
                <Message>
                  <b>{this.state.alertmess}</b>
                </Message>
                <Close onClick={() => this.handleAlertClose()}>×</Close>
              </Alert>
            </MainAlertDiv>
          )}

          <ProfilePage>
            {mm_address === null && (
              <ProfileButton>
                <SocialLink orange onClick={(e) => this.connectMetaMask(e)}>
                  <SocialBackground>
                    <ButtonMM>{mm_title}</ButtonMM>
                  </SocialBackground>
                </SocialLink>
              </ProfileButton>
            )}
            {google_id === null && (
              <ProfileButton>
                <SocialLink>
                  <SocialBackground>
                    {isGoogleLoading ? (
                      <Loader
                        type="Oval"
                        color="#CDD5DB"
                        width="18"
                        height="18"
                      />
                    ) : (
                      <GoogleLogin
                        // clientId={`${process.env.CLIENTID}`}
                        clientId="877884316890-hvdtvvjthd8sh0ednld3l2ak0fisrnu3.apps.googleusercontent.com"
                        buttonText="Login"
                        onSuccess={this.responseGoogle}
                        onFailure={this.responseGoogle}
                        cookiePolicy={"single_host_origin"}
                        render={(renderProps) => (
                          <SocialBackground onClick={renderProps.onClick}>
                            <SocialText>SIGN IN WITH</SocialText>
                            <SocialButton
                              type="button"
                              disabled={renderProps.isDisabled}
                            >
                              <img src={Google} alt="facebook" />
                            </SocialButton>
                          </SocialBackground>
                        )}
                      />
                    )}
                  </SocialBackground>
                </SocialLink>
              </ProfileButton>
            )}
            {facebook_id === null && (
              <ProfileButton>
                <SocialLink>
                  <SocialBackground>
                    {isFacebookLoading ? (
                      <Loader
                        type="Oval"
                        color="#CDD5DB"
                        width="18"
                        height="18"
                      />
                    ) : (
                      <FacebookLogin
                        // appId={`${process.env.APPID}`}
                        appId="786621485540466"
                        fields="name,email,picture"
                        callback={this.responseFacebook}
                        render={(renderProps) => (
                          <SocialBackground onClick={renderProps.onClick}>
                            <SocialText>SIGN IN WITH</SocialText>
                            <SocialButton
                              type="button"
                              disabled={renderProps.isDisabled}
                            >
                              <img src={Facebook} alt="facebook" />
                            </SocialButton>
                          </SocialBackground>
                        )}
                      />
                    )}
                  </SocialBackground>
                </SocialLink>
              </ProfileButton>
            )}

            {userDetail && userDetail !== 0 && (
              <PanelWrapper>
                <Panel theme="purple">
                  <PanelInner>
                    <UserTable
                      data={userDetail}
                      dataLoading={dataLoading}
                    ></UserTable>
                  </PanelInner>
                </Panel>
              </PanelWrapper>
            )}
          </ProfilePage>
        </Layout>
      </React.Fragment>
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
const PanelInner = styled.div`
  padding: 0 ${variable.spacingMedium} ${variable.spacingMedium};

  ${media.tablet`
      padding: 0 ${variable.spacingMedium};
  `}
`;
const ProfilePage = styled.div``;
const ModalContainer = styled.div`
  display: block;
  margin: 10px;
  width: 300px;
`;
const EmailInput = styled.div`
  margin: 10px;
  input {
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    width: 100%;
    height: 40px;
    padding-left: 5px;
    border-radius: 10px;
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    :focus {
      outline: none;
    }
    margin-bottom: 5px;
  }
`;
const EmailSubmit = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
`;
const Submit = styled.button`
  height: 40px;
  border: none;
  background: ${variable.CheckboxBorder};
  color: ${variable.cancleButton};
  border: 2px solid ${variable.CheckboxBorder};
  font-weight: bold;
  border-radius: 0 10px;
  outline: none;
  width: 100%;
  cursor: pointer;
`;
const SocialBackground = styled.div`
  width: 100%;
  margin: auto;
  background: ${variable.Active};
  margin: 3px;
  clip-path: polygon(0 0%, 98% 0, 100% 12%, 100% 100%, 2% 100%, 0 87%, 0 0%);
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  height: 66px;
`;
const ButtonMM = styled.div`
  display: flex;
  text-align: center;
  justify-content: center;
  align-items: center;
  margin: 20px;
  font-family: ${variable.headingFontFamily};
  font-size: ${variable.textSmall};
  text-transform: uppercase;
  color: #e8821f;
`;
const Message = styled.div`
  padding: 10px;
  width: 90%;
  font-size: ${variable.textLarger};
`;
const Close = styled.div`
  cursor: pointer;
  padding: 10px;
  width: 10%;
  text-align: center;
  font-size: 22px;
  font-weight: ${variable.bold};
`;
const MainAlertDiv = styled.div`
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  padding: 0.3rem;
  background: #da0c1f;
`;
const Alert = styled.div`
  background: rgba(0, 0, 0, 1);
  color: #da0c1f;
  display: flex;
  margin: auto;
  padding: 10px;
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  align-items: center;
`;
const SocialText = styled.span`
  font-size: ${variable.textSmall};
  padding: 20px 10px;
  font-family: "erbaum", Open Sans, sans-serif;
  text-transform: uppercase;
`;
const SocialButton = styled.button`
  padding: 0;
  width: 60px;
  height: 60px;
  background: 0 0;
  border: none;
  cursor: pointer;
  outline: none;
`;
const ProfileButton = styled.div`
  display: flex;
  text-align: center;
  align-items: center;
  margin: 20px 0;
`;
const SocialLink = styled.div`
  width: 100%;
  font-size: ${variable.textMedium};
  display: flex;
  text-align: center;
  align-items: center;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
  clip-path: polygon(0 0%, 98% 0, 100% 12%, 100% 100%, 2% 100%, 0 87%, 0 0%);
  cursor: pointer;
  justify-content: center;
  background-color: ${variable.CheckboxBorder};
  color: ${variable.whiteColor};
  ${(props) =>
    props.orange
      ? `
      background-color: #8f4904;
    `
      : null}
  ${media.tablet`
    width: 40%;
  `}
`;

const ErrorMeaage = styled.div`
  color: ${variable.purple};
  margin: 5px 0px 5px 0px;
`;
export default withTranslation()(Profile);
