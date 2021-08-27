import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import lottie from "lottie-web";
import * as animationData from "./json/data.json";
import gsap from "gsap";
import { RoughEase } from "gsap/EasePack";

import { withTranslation } from "react-i18next";
import { media } from "Base/Media";
import { inject, observer } from "mobx-react";
import { validateUsername, minLength, truncate } from "Base/Utilities";

import Text from "Components/Typography/Text";
import Input from "Components/Form/Input";
import Button from "Components/Buttons/Button";

import Background from "./assets/login-bg.jpg";
import SignInBackground from "./assets/sign-in@2x.png";
import SignInBackgroundMobile from "./assets/sign-in-mobile@2x.png";
import Link from "Components/Buttons/Link";

import LanguageSelector from "Components/LanguageSelector/LanguageSelector";
import Logo from "Pages/Login/assets/brand-login@2x.png";

gsap.registerPlugin(RoughEase);

@inject("AuthStore")
@observer
class SignUpVerify extends React.Component {
  constructor(props) {
    super();
    this.state = {
      username: null,
      password: null,
      passwordverify: null,
      errorMessage: false,
      signupConfirmed: false,
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
   * Sign up using email
   * @param e
   */
  signUp = (e) => {
    e.preventDefault();

    const { AuthStore, i18n } = this.props;
    const { username, password, passwordverify } = this.state;

    if (!minLength(5, username)) {
      this.setState({
        errorMessage: i18n.t("login.signup.error.username.minlength"),
        validEmail: false,
      });
      return false;
    }

    if (!validateUsername(username)) {
      this.setState({
        errorMessage: i18n.t("login.signup.error.invalidusername"),
        validEmail: false,
      });
      return false;
    }

    if (!password || password.length <= 7) {
      this.setState({
        errorMessage: i18n.t("login.signup.error.minlength"),
        validEmail: false,
      });
      return false;
    }

    // Check if the username already exists
    AuthStore.safenameExists(username).then((res) => {
      // Exists so we can't add them
      if (res.exists === 1) {
        this.setState({
          errorMessage: i18n.t("login.signup.error.usernameexists"),
        });
        return false;
      } else {
        let signupData = {
          address_safename: username,
          email: AuthStore.email,
          password: password,
          mm_address: AuthStore.mm_address,
        };

        AuthStore.signUp(signupData).then((res) => {
          if (res.access_token) {
            this.setState({ signupConfirmed: true });
            AuthStore.setState("email", null);
          } else if (res.error) {
            this.setState({
              errorMessage: i18n.t("login.signup.error.emailexists"),
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

  /**
   * Create some initial animations on the component did mount layer
   */
  componentDidMount() {
    const { AuthStore, history } = this.props;

    if (AuthStore.email === null || AuthStore.mm_address === null) {
      history.push("/signup");
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
  }

  changeEmail = (e) => {
    e.preventDefault();

    const { AuthStore, history } = this.props;

    AuthStore.setState("email", null);
    history.push("/signup");
  };

  render = () => {
    const { i18n, AuthStore, history } = this.props;
    const { errorMessage, signupConfirmed } = this.state;

    return (
      <Container>
        <LanguageSelector
          i18n={i18n}
          alignRight={true}
          languages={i18n.options.languageOptions}
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
                <FormRow highlighted>
                  <Text
                    tag="p"
                    color={variable.white}
                    spacing="large"
                    weight="500"
                    size="medium"
                    spacing="smallest"
                  >
                    {i18n.t("login.email")} : <strong>{AuthStore.email}</strong>
                  </Text>

                  <MM>
                    <Text
                      tag="div"
                      color={variable.white}
                      spacing="large"
                      weight="500"
                      size="medium"
                      spacing="smallest"
                    >
                      MetaMask:{" "}
                      <strong>{truncate(AuthStore.mm_address, 22)}</strong>
                    </Text>
                  </MM>

                  <Link onClick={(e) => this.changeEmail(e)}>
                    {i18n.t("login.signup.changeemail")}
                  </Link>
                </FormRow>

                <FormRow>
                  <Text
                    tag="p"
                    color={variable.white}
                    spacing="large"
                    weight="500"
                    size="medium"
                    spacing="medium"
                  >
                    {i18n.t("login.signup.chooseusername")}
                  </Text>

                  {errorMessage ? <Error>{errorMessage}</Error> : null}
                </FormRow>

                <FormRow>
                  <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    onKeyUp={(e) => this.setField(e)}
                  />
                  {/*<Verify>-ETH</Verify>*/}
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
                  <Button
                    onClick={(e) => this.signUp(e)}
                    theme="purple"
                    href="#"
                  >
                    {i18n.t("login.signup")}
                  </Button>
                </FormRow>
              </FormContainer>
            )}
          </ImageContainer>
        </Login>
      </Container>
    );
  };
}

const MM = styled.div`
  margin-top: 4px;
  display: block;
  color: ${variable.green};
  word-wrap: break-word;
`;

const Verify = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  font-weight: bold;
  margin: 2rem;
  color: ${variable.green};
`;

const ImageContainer = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100vh - 8rem);
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  max-height: 600px;

  ${media.tablet`
        max-width: 650px;
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
        width: 100vw;
        height: 100%;
        z-index: 0;
    `}
`;

const Container = styled.section`
  background: url(${Background}) no-repeat;
  background-size: cover;
  background-attachment: fixed;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;

  ${media.tablet`
        width: 100vw;
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

const Login = styled.div`
  width: 100%;
  color: ${variable.light};
  font-size: ${variable.textSmall};
`;

const FormRow = styled.div`
  margin: ${variable.spacingSmaller};
  position: relative;

  ${(props) =>
    props.highlighted
      ? `
        border: 1px solid ${variable.green};
        padding: ${variable.spacingSmaller};
        border-radius: 2px;
        background-color: rgba(0,0,0,0.1);
        margin-bottom: ${variable.spacingSmall};
    `
      : null}
`;

const LinkWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${variable.spacingSmaller};
  justify-content: flex-end;
  flex-wrap: wrap;
`;

const ButtonMetaMask = styled(Button)`
  font-size: 12px;
  ${media.tablet`
        margin-top: ${variable.spacingSmall};
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

export default withTranslation()(SignUpVerify);
