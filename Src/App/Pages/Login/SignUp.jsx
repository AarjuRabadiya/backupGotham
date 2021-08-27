import React from "react";
import styled from "styled-components";
import gsap from "gsap";
import { RoughEase } from "gsap/EasePack";
import { withTranslation } from "react-i18next";
import { media } from "Base/Media";
import { inject, observer } from "mobx-react";
import { validateEmail, truncate } from "Base/Utilities";
import lottie from "lottie-web";
import * as animationData from "./json/data.json";
import * as variable from "Base/Variables";
import Background from "./assets/login-bg.jpg";
import SignInBackground from "./assets/sign-in@2x.png";
import SignInBackgroundMobile from "./assets/sign-in-mobile@2x.png";
import Social from "./Social";
import Title from "Components/Typography/Title";
import Text from "Components/Typography/Text";
import Input from "Components/Form/Input";
import Button from "Components/Buttons/Button";
import LanguageSelector from "Components/LanguageSelector/LanguageSelector";
import Logo from "Pages/Login/assets/brand-login@2x.png";
gsap.registerPlugin(RoughEase);

@inject("AuthStore")
@observer
class SignUpContainer extends React.Component {
  constructor(props) {
    super();
    this.state = {
      email: "",
      validEmail: false,
      password: null,
      errorMessage: false,
      signupConfirmed: false,
      username: "",
      mm_signature: "",
      pool_code: "",
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
  /**
   * Create some initial animations on the component did mount layer
   */
  componentDidMount() {
    const { AuthStore, history } = this.props;

    if (history.location.search) {
      this.setState({
        pool_code: history.location.search.substring(
          history.location.search.indexOf("=") + 1
        ),
      });
    }

    // GSAP animations
    // We want these to trigger once the component is mounted
    gsap.fromTo(
      this.loginElement,
      { x: "-100%" },
      { duration: 2, x: 0, ease: "expo.inOut" }
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

    // Load some lottie animations also
    lottie.loadAnimation({
      container: this.lottie, // the dom element
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData.default,
      rendererSettings: {
        preserveAspectRatio: "xMinYMin slice",
      },
    });

    /** ACCOUNT change trigger MM address change **/
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (res) => {
        AuthStore.setState("mm_address", res[0]);
      });
    }
  }
  connectMetaMask = (e) => {
    e.preventDefault();
    const { AuthStore } = this.props;
    const { email } = this.state;

    // Retrieve the MetaMask Address from the user
    AuthStore.retrieveMetaMaskAddress().then((res) => {
      if (res.address) {
        this.setState({ validEmail: true });
        AuthStore.setState("email", email);
        AuthStore.setState("mm_address", res.address);
      }
      if (res.error) {
        this.setState({ validEmail: false });
        this.setState({ errorMessage: res.error.message });
      }
    });
  };

  /**
   * Sign the Signature
   * @returns {Promise<*>}
   */
  signSignature = async () => {
    const { AuthStore } = this.props;

    await AuthStore.initWeb3();

    if (window.ethereum) {
      await ethereum.enable();
    }

    let address = await AuthStore.getAddress();

    // let val = await AuthStore.getSignature(address);
    // this.setState({
    //   mm_signature: val,
    // });

    return await AuthStore.getSignature(address, "register");
  };

  /**
   * Sign up using email
   * @param e
   */
  signUp = (e) => {
    e.preventDefault();

    const { AuthStore, i18n } = this.props;
    const { email, password, username } = this.state;

    if (!AuthStore.mm_address) {
      this.setState({ errorMessage: i18n.t("login.connect.mm") });
      return false;
    }

    if (!password || password.length <= 7) {
      this.setState({ errorMessage: i18n.t("login.signup.error.minlength") });
      return false;
    }

    if (!validateEmail(email)) {
      this.setState({
        errorMessage: i18n.t("login.signup.error.invalidemail"),
        validEmail: false,
      });
      AuthStore.setState("email", null);
    }

    if (!AuthStore.mm_address) {
      this.setState({ errorMessage: i18n.t("login.connect.mm") });
      AuthStore.setState("email", null);
    }

    let signSignature = this.signSignature();

    signSignature.then((res) => {
      if (res) {
        let mm_signature = res;

        // Check if the user exists in the Safename DB
        AuthStore.emailExists(email).then((res) => {
          if (res.exists === 1) {
            this.setState({
              errorMessage: i18n.t("login.signup.error.emailexists"),
              validEmail: false,
            });
            AuthStore.setState("email", null);
          } else if (res.exists === 0) {
            let signupData = {
              email: email,
              password: password,
              mm_address: AuthStore.mm_address,
              mm_signature: mm_signature,
              username: username,
              ...(this.state.pool_code !== "" && {
                pool_code: this.state.pool_code,
              }),
            };

            AuthStore.signUp(signupData).then((res) => {
              if (res.error === 2) {
                this.setState({
                  errorMessage: "ETH address already exists",
                  validEmail: false,
                });
                AuthStore.setState("email", null);
              } else if (res.access_token) {
                this.setState({ signupConfirmed: true });
                AuthStore.setState("email", null);
              } else if (res.error) {
                this.setState({ errorMessage: i18n.t(res.error) });
              }
            });
          }
        });
      }
    });
  };
  /**
   * Set a field
   * Return key to submit
   * @param e
   */
  setField = (e) => {
    if (e.key === "Enter") {
      this.signUp(e);
    }
    this.setState({ [e.target.name]: e.target.value });
  };

  render = () => {
    const { i18n, history, AuthStore } = this.props;
    const { errorMessage, signupConfirmed } = this.state;
    return (
      <Container>
        <LanguageSelector
          i18n={i18n}
          alignRight={true}
          languages={i18n.options.languageOptions}
          history={history}
          assets={true}
        />

        {/* Lottie canvas for the background animtion */}
        <LottieCanvas
          className="lottie"
          ref={(div) => (this.lottie = div)}
        ></LottieCanvas>
        <Login ref={(div) => (this.loginElement = div)}>
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
            <Brand onClick={() => history.push("/login")}>
              Chain Guardians
            </Brand>
            {/* Form Container */}

            {signupConfirmed ? (
              <FormContainer
                ref={(div) => (this.formContainerElement = div)}
                onSubmit={(e) => this.signUp(e)}
              >
                <FormRow>
                  <Text
                    tag="p"
                    color={variable.white}
                    spacing="large"
                    weight="500"
                    size="large"
                    spacing="smallest"
                    align="center"
                  >
                    {i18n.t("login.signup.thankyou")}
                  </Text>
                </FormRow>
                <FormRow>
                  <Button theme="purple" href="/login">
                    {i18n.t("login.title")}
                  </Button>
                </FormRow>
              </FormContainer>
            ) : (
              <FormContainer
                ref={(div) => (this.formContainerElement = div)}
                onSubmit={(e) => this.signUp(e)}
              >
                <React.Fragment>
                  <Title
                    theme="light"
                    shadow={true}
                    tag="h1"
                    align="center"
                    spacing="small"
                    size="large"
                  >
                    {i18n.t("login.signup")}
                  </Title>
                  <Text
                    textTransform=""
                    tag="div"
                    color={variable.white}
                    align="center"
                    weight="500"
                    size="medium"
                    spacing="smaller"
                  >
                    {i18n.t("login.signup.description")}
                  </Text>

                  {errorMessage ? <Error>{errorMessage}</Error> : null}

                  <FormRow>
                    <Input
                      name="email"
                      type="text"
                      placeholder={i18n.t("login.email")}
                      onKeyUp={(e) => this.setField(e)}
                    />
                  </FormRow>

                  <FormRow>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      onKeyUp={(e) => this.setField(e)}
                    />
                  </FormRow>
                  <FormRow>
                    <Input
                      name="username"
                      type="text"
                      placeholder="Display name"
                      onKeyUp={(e) => this.setField(e)}
                    />
                  </FormRow>
                  <FormRow disabled={!AuthStore.mm_address}>
                    <Button
                      onClick={(e) => this.signUp(e)}
                      theme="purple"
                      href="#"
                    >
                      {i18n.t("login.signup")}
                    </Button>
                  </FormRow>
                  <Social history={history} pool_code={this.state.pool_code} />
                  <FormRow>
                    {!AuthStore.mm_address ? (
                      <ButtonMM
                        onClick={(e) => this.connectMetaMask(e)}
                        theme="metamask"
                        href="#"
                      >
                        {i18n.t("login.connect.mm")}
                      </ButtonMM>
                    ) : (
                      <Text
                        tag="div"
                        color={variable.green}
                        spacing="large"
                        weight="500"
                        size="medium"
                        spacing="smallest"
                      >
                        {i18n.t("login.connect.connected")} :{" "}
                        <strong>{truncate(AuthStore.mm_address, 22)}</strong>
                      </Text>
                    )}
                  </FormRow>
                </React.Fragment>
              </FormContainer>
            )}
          </ImageContainer>
        </Login>
      </Container>
    );
  };
}

// const ChangeMM = styled.a`
//   color: ${variable.green};
//   font-weight: bold;
//   cursor: pointer;
// `;

const ButtonMM = styled(Button)`
  font-size: ${variable.textSmall};
  margin-left: auto;
`;

const ImageContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // height: calc(100vh - 8rem);
  // height: auto;
  height: 100vh;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  // max-height: 600px;
  zoom: 90%;

  ${media.tablet`
    // max-width: 650px;
    max-width: 700px;
    height: auto;
  `};
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
  width: 60%;
  left: 50%;
  transform: translateX(-50%);

  ${media.tablet`
    width: 60%;
  `}
`;

const Login = styled.div`
  width: 100%;
  color: ${variable.light};
  font-size: ${variable.textSmall};
  transform: none !important;
`;

const FormRow = styled.div`
  margin: ${variable.spacingSmaller};

  ${(props) =>
    props.disabled
      ? `
        opacity: 0.4;
    `
      : null}
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

// const LinkWrapper = styled.div`
//   display: flex;
//   align-items: center;
//   margin-top: ${variable.spacingSmaller};
//   justify-content: flex-end;
//   flex-wrap: wrap;
// `;

// const ButtonMetaMask = styled(Button)`
//   font-size: ${variable.textSmaller};
//   ${media.tablet`
//         margin-top: ${variable.spacingSmall};
//         font-size: ${variable.textMedium};
//     `};
// `;

export default withTranslation()(SignUpContainer);
