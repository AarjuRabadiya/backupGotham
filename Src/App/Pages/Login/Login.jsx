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

import Title from "Components/Typography/Title";
import Input from "Components/Form/Input";
import Link from "Components/Buttons/Link";
import Button from "Components/Buttons/Button";

import Background from "./assets/login-bg.jpg";
import SignInBackground from "./assets/sign-in@2x.png";
import SignInBackgroundMobile from "./assets/sign-in-mobile@2x.png";
import LanguageSelector from "Components/LanguageSelector/LanguageSelector";
import Logo from "Pages/Login/assets/brand-login@2x.png";
import Text from "Components/Typography/Text";

gsap.registerPlugin(RoughEase);

@inject("AuthStore")
@observer
class LoginContainer extends React.Component {
  constructor(props) {
    super();
    this.flickerElement = null;
    this.lottie = null;
    this.env = process.env.NODE_ENV;
    this.state = {
      username: "",
      password: "",
      errorMessage: false,
    };
  }

  /**
   * Sign in using standard username and password
   * @param e
   */
  signIn = (e) => {
    e.preventDefault();
    const { AuthStore } = this.props;
    AuthStore.login(this.state).then((res) => {
      if (res.error === 2) {
        this.setState({
          errorMessage: "please check your email to verify account",
          exists: 0,
        });
      } else if (res.success) {
        window.localStorage.setItem(
          "bearer_token_bridge",
          JSON.stringify({
            token: res.success,
            email: this.state.username,
          })
        );
        AuthStore.setState("token", res.success);
        const { history } = this.props;
        history.push("/dashboard/mining");
      } else {
        AuthStore.setState("token", false);
        this.setState({ errorMessage: true });
      }
    });
  };
  /**
   * Login Via Meta Mask
   * @param e
   */
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
          this.setState({ errorMessage: res.error });
        }
      } else if (res.success) {
        window.localStorage.setItem(
          "bearer_token_bridge",
          JSON.stringify({
            token: res.success,
          })
        );
        AuthStore.setState("token", res.success);
        const { history } = this.props;
        history.push("/dashboard/mining");
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
      this.signIn(e);
    }
    this.setState({ [e.target.name]: e.target.value });
  };
  /**
   * Create some initial animations on the component did mount layer
   */
  componentDidMount() {
    // Logout on initial mount
    const { AuthStore } = this.props;
    AuthStore.logout();

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

  render = () => {
    const { i18n, history } = this.props;
    const { errorMessage } = this.state;

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
            <Brand onClick={() => (window.location = process.env.BASE_URL)}>
              Chain Guardians
            </Brand>
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

              <FormRow>
                <Input
                  name="username"
                  type="text"
                  placeholder={i18n.t("login.email")}
                  onKeyUp={(e) => this.setField(e)}
                />
              </FormRow>
              <FormRow>
                <Input
                  type="password"
                  placeholder={i18n.t("login.password")}
                  onKeyUp={(e) => this.setField(e)}
                  name="password"
                />
                {
                  // <LinkWrapper>
                  // <Link href="https://safename.io/resetpw">{i18n.t('login.forgot')}</Link>
                  // </LinkWrapper>
                }
              </FormRow>
              <FormRow>
                <Button onClick={(e) => this.signIn(e)} theme="purple" href="#">
                  {i18n.t("login.signin")}
                </Button>
                <LinkWrapper>
                  {i18n.t("login.account")}
                  <Link onClick={(e) => this.props.history.push("/signup")}>
                    {" "}
                    {i18n.t("login.signup")}
                  </Link>
                </LinkWrapper>
              </FormRow>
              <FormRow>
                <ButtonMetaMask
                  onClick={(e) => this.loginMetaMask(e)}
                  theme="green"
                  href="#"
                >
                  {i18n.t("login.signin.mm")}
                </ButtonMetaMask>
              </FormRow>
            </FormContainer>
          </ImageContainer>
        </Login>
      </Container>
    );
  };
}

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

export default withTranslation()(LoginContainer);
