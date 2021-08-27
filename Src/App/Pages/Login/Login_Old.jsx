import React from "react";
import styled from "styled-components";
import lottie from "lottie-web";
import * as animationData from "./json/data.json";
import gsap from "gsap";
import { RoughEase } from "gsap/EasePack";
import { withTranslation } from "react-i18next";
import { media } from "Base/Media";
import { inject, observer } from "mobx-react";
import Loader from "react-loader-spinner";
import Arkane from "@arkane-network/web3-arkane-provider";
import * as variable from "Base/Variables";
import Background from "./assets/login-bg.jpg";
import SignInBackgroundMobile from "./assets/sign-in-mobile@2x.png";
import Logo from "Pages/Login/assets/brand-login@2x.png";
import SignInBackground from "./assets/sign-in@2x.png";
import Title from "Components/Typography/Title";
import Input from "Components/Form/Input";
import Link from "Components/Buttons/Link";
import Button from "Components/Buttons/Button";
import Social from "./Social";
import LanguageSelector from "Components/LanguageSelector/LanguageSelector";
import Select from "Components/Select/Select";
import Web3 from "web3";

gsap.registerPlugin(RoughEase);

@inject("AuthStore")
@observer
class LoginContainer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      username: "",
      password: "",
      errorMessage: false,
      isGoogleLoading: false,
      isFacebookLoading: false,
      options: [
        // { value: "NFT_MCH", label: "NFT_MCH" },
        { value: "Chainguardian", label: "Chainguardian" },
        { value: "NFT_Ethermon", label: "NFT_Ethermon" },
        { value: "NFT_WarRider", label: "NFT_WarRider" },
      ],
      isSelect: false,
      selectOption: null,
      error: "",
      isError: false,
      isLoading: false,
    };

    /**
     * Initial setup for some elements
     * @type {null}
     */
    this.loginElement = null;
    this.formContainerElement = null;
    this.flickerElement = null;
    this.lottie = null;
  }

  signIn = (e) => {
    e.preventDefault();
    const { AuthStore } = this.props;
    const { username, password } = this.state;
    let payload = {
      username: username,
      password: password,
    };
    AuthStore.login(payload).then((res) => {
      if (res.error === 2) {
        this.setState({
          errorMessage: "please check your email to verify account",
          exists: 0,
        });
      } else if (res.success) {
        AuthStore.setState("token", res.success);
        const { history } = this.props;

        history.push("/dashboard/mining");
      } else {
        AuthStore.setState("token", false);
        this.setState({ errorMessage: true });
      }
    });
  };

  loginMetaMask = (e) => {
    const { AuthStore, i18n } = this.props;

    AuthStore.loginMetaMask().then((res) => {
      if (res.exists === 0) {
        this.setState({
          errorMessage: i18n.t("login.signup.error.signupfirst"),
          exists: 0,
        });
      } else if (res.exists === 1) {
        this.setState({ exists: 1 });
      } else if (res.error) {
        if (res.error === 2) {
          this.setState({
            errorMessage: "please check your email to verify account",
          });
        } else {
          this.setState({ errorMessage: res.error.message });
        }
      } else if (res.success) {
        AuthStore.setState("token", res.success);

        const { history } = this.props;

        history.push("/dashboard/mining");
      }
    });
  };

  setField = (e) => {
    if (e.key === "Enter") {
      this.signIn(e);
    }
    this.setState({ [e.target.name]: e.target.value, isError: false });
  };

  componentDidMount() {
    const { AuthStore } = this.props;
    AuthStore.logout();
    if (
      this.props.location &&
      this.props.location.search.substr(
        this.props.location.search.indexOf("=") + 1
      )
    ) {
      let email = this.props.location.search.substr(
        this.props.location.search.indexOf("=") + 1
      );
      let a = email.slice(0, email.indexOf("&"));
      // let mm_address = this.props.location.search.substr(
      //   this.props.location.search.indexOf("&") + 1
      // );
      // let address = mm_address.substr(mm_address.indexOf("=") + 1);

      let payload = {
        type: "CG",
        email: a,
        // mm_address: address,
      };
      this.LoginWithSelect(payload);
    }

    if (localStorage.getItem("bearer_token_bridge") !== null) {
      const ls = JSON.parse(localStorage.getItem("bearer_token_bridge"));

      if (ls.token) {
        AuthStore.setState("token", ls.token);
        const { history } = this.props;
        history.push("/dashboard/mining");
      }
    }

    gsap.fromTo(
      this.loginElement,
      { x: "-100%" },
      {
        duration: 2,
        x: 0,
        ease: "expo.inOut",
      }
    );
    gsap.to(this.flickerElement, {
      duration: 3,
      opacity: 0,
      delay: 2,
      ease: "rough({strength: 2, points: 50, clamp: true })",
      yoyo: true,
      repeat: -1,
      repeatDelay: 4,
    });
    gsap.fromTo(
      this.formContainerElement,
      { x: "-100%", opacity: 0, stagger: { each: 0.3 } },
      { duration: 2, x: 0, opacity: 1, ease: "expo.inOut" }
    );

    lottie.loadAnimation({
      container: this.lottie,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: "xMinYMin slice",
      },
    });
  }
  LoginWithSelect = (payload) => {
    const { AuthStore } = this.props;

    AuthStore.googleLogin(payload).then((res) => {
      this.setState({
        isGoogleLoading: false,
        isFacebookLoading: false,
      });
      if (res.access_token) {
        AuthStore.setState("token", res.access_token);
        AuthStore.setState("email", res.email);
        const { history } = this.props;
        history.push("/dashboard/mining");
      }
    });
  };
  selectLoginOptin = (selectedOption) => {
    this.setState({
      isSelect: true,
      // isError: false,
      selectOption: selectedOption,
    });
  };
  loginWithSelectOption = (e) => {
    e.preventDefault();
    this.setState({
      isLoading: true,
    });
    let { selectOption } = this.state;
    if (selectOption.value === "Chainguardian") {
      window.location.replace("https://partner.nftmining.com/login");
    }
  };
  redirect = () => {
    const { history } = this.props;
    if (history.location.pathname === "/login") {
      this.reset();
    } else {
      history.push("/login");
    }
  };
  reset = () => {
    this.setState({
      username: "",
      password: "",
      errorMessage: false,
      isGoogleLoading: false,
      isFacebookLoading: false,
      options: [
        // { value: "NFT_MCH", label: "NFT_MCH" },
        { value: "Chainguardian", label: "Chainguardian" },
        { value: "NFT_Ethermon", label: "NFT_Ethermon" },
        { value: "NFT_WarRider", label: "NFT_WarRider" },
      ],
      isSelect: false,
      selectOption: null,
      error: "",
      isError: false,
      isLoading: false,
    });
  };
  // loginArkane = (e) => {
  //   e.preventDefault();
  //   const Arkane = window.Arkane;
  //   Arkane.createArkaneProviderEngine({
  //     clientId: "Arketype",
  //     rpcUrl: "https://kovan.infura.io",
  //     environment: "qa",
  //     signMethod: "POPUP",
  //   }).then((provider) => {
  //     web3 = new Web3(provider);

  //     // get account
  //     window.web3.eth.getAccounts((err, wallets) => {
  //     });
  //   });
  // };

  render = () => {
    const { i18n, history } = this.props;
    const {
      errorMessage,
      isSelect,
      isError,
      error,
      isLoading,
      selectOption,
      username,
      password,
    } = this.state;

    return (
      <Container>
        <LanguageSelector
          i18n={i18n}
          alignRight={true}
          languages={i18n.options.languageOptions}
          history={history}
          assets={true}
        />

        <LottieCanvas
          className="lottie"
          ref={(div) => (this.lottie = div)}
        ></LottieCanvas>
        <Login_Old ref={(div) => (this.loginElement = div)}>
          <ImageContainer>
            <GreenBlurWrapper
              ref={(div) => (this.flickerElement = div)}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 127 309"
            >
              <defs>
                <radialGradient
                  id="a"
                  cx="50%"
                  cy="50%"
                  r="90.351%"
                  fx="50%"
                  fy="50%"
                  gradientTransform="matrix(0 .5534 -.40992 0 .705 .223)"
                >
                  <stop offset="0%" stopColor="#14E33A" />
                  <stop offset="100%" stopColor="#022E49" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse
                cx="63.5"
                cy="154.5"
                fill="url(#a)"
                fillRule="evenodd"
                opacity="0.666"
                rx="85.5"
                ry="154.5"
              />
            </GreenBlurWrapper>
            <BgImageMobile src={SignInBackgroundMobile} alt="" />
            <BgImage src={SignInBackground} alt="" />
            <Brand onClick={() => this.redirect()}>NFT Mining</Brand>
            {/* Form Container */}
            <FormContainer ref={(div) => (this.formContainerElement = div)}>
              <Title
                theme="light"
                shadow={true}
                tag="h1"
                align="center"
                spacing="small"
                size="large"
              >
                {i18n.t("login.title")}
              </Title>

              {/* Display the error message */}
              {errorMessage && errorMessage === true ? (
                <Error>
                  {/* Default Message */}
                  {i18n.t("login.error")}
                </Error>
              ) : errorMessage ? (
                <Error>
                  {/* Specific Message */}
                  {errorMessage}
                </Error>
              ) : null}
              {isError && <Error>{error}</Error>}
              <FormRow>
                <Select
                  value={selectOption}
                  handleChange={this.selectLoginOptin}
                  options={this.state.options}
                  placeholder={"Sign in with..."}
                />
              </FormRow>
              {!isSelect && (
                <React.Fragment>
                  <FormRow>
                    <Input
                      name="username"
                      type="text"
                      placeholder={i18n.t("login.email")}
                      onChange={(e) => this.setField(e)}
                      value={username}
                    />
                  </FormRow>
                  <FormRow>
                    <Input
                      type="password"
                      placeholder={i18n.t("login.password")}
                      onChange={(e) => this.setField(e)}
                      name="password"
                      value={password}
                    />
                    {
                      // <LinkWrapper>
                      // <Link href="https://safename.io/resetpw">{i18n.t('login.forgot')}</Link>
                      // </LinkWrapper>
                    }
                  </FormRow>
                </React.Fragment>
              )}
              {isSelect && (
                <FormRow>
                  <Button
                    onClick={(e) => this.loginWithSelectOption(e)}
                    theme="purple"
                    href="#"
                  >
                    {isLoading ? (
                      <Loader
                        type="Oval"
                        color="#CDD5DB"
                        width="18"
                        height="18"
                      />
                    ) : (
                      `Sign in via ${selectOption.value}`
                    )}
                  </Button>
                  <Button
                    style={{ marginTop: "5px" }}
                    onClick={() => this.redirect()}
                    theme="green"
                    href="#"
                  >
                    Back
                  </Button>
                </FormRow>
              )}
              {!isSelect && (
                <React.Fragment>
                  <FormRow>
                    <ForgotPassword
                      onClick={() =>
                        this.props.history.push("/forgot-password")
                      }
                    >
                      Forgot Password?
                    </ForgotPassword>
                  </FormRow>

                  <FormRow>
                    <Button
                      onClick={(e) => this.signIn(e)}
                      theme="purple"
                      href="#"
                    >
                      {i18n.t("login.signin")}
                    </Button>
                  </FormRow>

                  <Social history={history} />

                  <FormRowDisplayFlex>
                    <ButtonLink>
                      <ButtonMetaMask
                        onClick={(e) => this.loginMetaMask(e)}
                        theme="metamask"
                        href="#"
                      >
                        {i18n.t("login.signin.mm")}
                      </ButtonMetaMask>
                    </ButtonLink>
                    {/* <ButtonLink>
                      <ButtonMetaMask
                        onClick={(e) => this.loginArkane(e)}
                        theme="green"
                      >
                        Arkane Network
                      </ButtonMetaMask>
                    </ButtonLink> */}
                  </FormRowDisplayFlex>
                  <FormRow>
                    <LinkWrapper>
                      {i18n.t("login.account")}
                      <SignupLink
                        onClick={(e) => this.props.history.push("/signup")}
                      >
                        {i18n.t("login.signup")}
                      </SignupLink>
                    </LinkWrapper>
                  </FormRow>
                </React.Fragment>
              )}
            </FormContainer>
          </ImageContainer>
        </Login_Old>
      </Container>
    );
  };
}

// const ButtonAllAssets = styled(Button)`
//   background-color: ${variable.CheckboxBorder};
//   color: ${variable.whiteColor};
// `;

const ImageContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // height: calc(100vh - 8rem);
  // height: 100vh;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  // max-height: 600px;
  zoom: 90%;
  height: 650px;
  max-height: 100vh;

  ${media.tablet`
    // max-width: 650px;
    // max-width: 730px;
    width: 730px;
    // max-width: 800px;
    height: auto;
  `}
`;

const BgImage = styled.img`
  height: 100%;
  width: 100%;
  display: none;

  ${media.tablet`
    display: block;
  `}
`;

const BgImageMobile = styled.img`
  height: 100%;
  width: 100%;
  display: block;

  ${media.tablet`
    display: none;
  `}
`;

// const SocialIcon = styled.i`
//   margin: auto 10px;
//   cursor: pointer;
//   background-color: #908a8461;
//   /* padding: 11px 15px; */
//   width: 53px;
//   height: 53px;
//   justify-content: center;
//   align-items: center;
//   display: flex;
//   border-radius: 0 10px;
// `;

const Error = styled.div`
  font-family: ${variable.bodyFontFamily};
  font-size: ${variable.textSmaller};
  font-weight: bold;
  color: red;
  margin: 0 0 ${variable.spacingSmaller};
  text-align: center;

  ${media.tablet`
    font-size: ${variable.textSmall};
    margin: 0 0 ${variable.spacingSmall} ;
  `}
`;

const LottieCanvas = styled.div`
  display: none;

  ${media.tablet`
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    // width: 100vw;
    width: 100%;
    height: 100%;
    z-index: 0;
  `}
`;

const Container = styled.section`
  background: url(${Background}) no-repeat;
  background-size: cover;
  background-attachment: fixed;
  // width: 100vw;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;

  ${media.tablet`
    // width: 100vw;
    width: 100%;
    min-height: 100vh;
    height: 100%;
    display: flex;
    margin: auto;
    justify-content: center;
  `}
`;

const FormContainer = styled.form`
  position: absolute;
  width: 65%;
  left: 50%;
  transform: translateX(-50%);

  ${media.tablet`
    width: 60%;
  `}
`;

const Login_Old = styled.div`
  width: 100%;
  color: ${variable.light};
  font-size: ${variable.textSmall};
  transform: none !important;
`;

const ButtonLink = styled.div`
  margin-bottom: ${variable.spacingSmaller};
  width: 100%;
  display: flex;
  ${media.tablet`
    // width: calc(50% - 5px);
    // margin: 5px;
 `}
`;

const FormRow = styled.div`
  margin: ${variable.spacingSmaller};
`;

const FormRowDisplayFlex = styled.div`
  margin: ${variable.spacingSmaller};
  display: block;

  ${media.tablet`
    display: flex;
  `};
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${variable.spacingSmaller};
  justify-content: flex-end;
  flex-wrap: wrap;
  cursor: pointer;
  width: 100%;
`;

const SignupLink = styled(Link)`
  font-size: ${variable.textMedium} !important;
  padding: 0 0 0 5px;
`;

// const SearchLink = styled(Link)`
//   text-decoration: none !important;
//   font-size: ${variable.textMedium} !important;
//   color: ${variable.CancleButtonColor} !important;
// `;

const ForgotPassword = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: ${variable.textMedium};
  cursor: pointer;
  color: ${variable.green};
`;

const ButtonMetaMask = styled(Button)`
  font-size: ${variable.textSmaller};
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  //   padding: 1.2rem;
  padding: 1.6rem;

  ${media.tablet`
    // margin-top: ${variable.spacingSmall};
    font-size: ${variable.textMedium};
  `};
`;

const GreenBlurWrapper = styled.svg`
  display: none;

  ${media.tablet`
    pointer-events: none;
    display: block;
    position: absolute;
    top: 0;
    right: -60px;
    width: 170px;
    z-index: 99;
  `}
`;

const Brand = styled.div`
  background: url(${Logo}) no-repeat;
  width: calc(7rem * 1.2);
  height: calc(10rem * 1.2);
  background-size: contain;
  text-indent: 100%;
  white-space: nowrap;
  overflow: hidden;
  cursor: pointer;
  position: absolute;
  z-index: 9999;
  cursor: pointer;
  top: -4rem;
  left: 50%;
  transform: translateX(-50%);

  ${media.desktop`
    margin-bottom: ${variable.spacingLarge};
    width: calc(7rem * 2);
    height: calc(10rem * 2);
    transform: translateX(0);
    left: auto;
    top: -40px;
    right: -40px;
  `};
`;

export default withTranslation()(LoginContainer);
