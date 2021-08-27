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
import * as variable from "Base/Variables";
import Background from "./assets/login-bg.jpg";
import SignInBackground from "./assets/sign-in@2x.png";
import SignInBackgroundMobile from "./assets/sign-in-mobile@2x.png";
import Logo from "Pages/Login/assets/brand-login@2x.png";
import Title from "Components/Typography/Title";
import Button from "Components/Buttons/Button";
import LanguageSelector from "Components/LanguageSelector/LanguageSelector";
import Input from "Components/Form/Input";

gsap.registerPlugin(RoughEase);

@inject("AuthStore")
@observer
class ForgotPassword extends React.Component {
  constructor(props) {
    super();
    this.state = {
      email: "",
      resMessage: "",
      isLoading: false,
    };
    this.flickerElement = null;
    this.lottie = null;
  }

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
  setField = (e) => {
    if (e.key === "Enter") {
      this.signIn(e);
    }
    this.setState({ [e.target.name]: e.target.value });
  };
  forgotPassword = () => {
    const { AuthStore } = this.props;
    const { email } = this.state;
    this.setState({
      isLoading: true,
    });
    let payload = {
      email: email,
    };

    if (email !== "") {
      AuthStore.forgotPassword(payload).then((res) => {
        if (res.success === true) {
          this.setState({
            resMessage:
              "WE HAVE SENT YOU AN EMAIL WITH YOUR RESET PASSWORD LINK",
            email: "",
            isLoading: false,
          });
        } else {
          this.setState({
            resMessage: "SORRY, PLEASE TRY AGAIN!!",
            isLoading: false,
          });
        }
      });
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
      email: "",
      resMessage: "",
      isLoading: false,
    });
  };
  render = () => {
    const { i18n, history } = this.props;
    const { resMessage, isLoading } = this.state;
    return (
      <Container>
        <LanguageSelector
          i18n={i18n}
          alignRight={true}
          languages={i18n.options.languageOptions}
          assets={true}
          history={history}
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
            <FormContainer ref={(div) => (this.formContainerElement = div)}>
              <Title
                theme="light"
                shadow={true}
                tag="h1"
                align="center"
                spacing="small"
                size="large"
              >
                Forgot password
              </Title>
              {isLoading ? (
                <LoaderContainer>
                  <Loader type="Oval" color="#CDD5DB" width="50" height="50" />
                </LoaderContainer>
              ) : (
                <React.Fragment>
                  {resMessage !== "" ? (
                    <ResponseMessage>
                      <UserMessage>{resMessage}</UserMessage>
                    </ResponseMessage>
                  ) : (
                    <FormRow>
                      <UserMessage>
                        Enter your email address and we'll send you a link to
                        reset your password.
                      </UserMessage>
                    </FormRow>
                  )}
                  <FormRow>
                    <Input
                      name="email"
                      type="text"
                      placeholder="Please enter email"
                      onKeyUp={(e) => this.setField(e)}
                    />
                  </FormRow>
                  <FormRow>
                    <ResetButton onClick={() => this.forgotPassword()}>
                      Reset password
                    </ResetButton>
                  </FormRow>
                  <FormRow>
                    <Button
                      style={{ marginTop: "5px" }}
                      onClick={() => this.redirect()}
                      theme="green"
                      href="#"
                    >
                      Back
                    </Button>
                  </FormRow>
                </React.Fragment>
              )}
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
  //   height: calc(100vh - 8rem);
  height: auto;
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

const ResetButton = styled(Button)`
  font-size: ${variable.textSmaller};
  background: linear-gradient(310deg, #6727cf, #f064c1);

  ${media.tablet`
    margin-top: ${variable.spacingSmall};
    font-size: ${variable.textMedium};
  `};
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

const Login = styled.div`
  width: 100%;
  color: ${variable.light};
  font-size: ${variable.textSmall};
`;

const FormRow = styled.div`
  margin: ${variable.spacingSmaller};
`;

const ResponseMessage = styled.div`
  margin: ${variable.spacingSmaller};
  border: 2px solid;
  color: ${variable.forgetPassword};
`;

const UserMessage = styled.div`
  display: flex;
  text-align: center;
  font-size: ${variable.textLarger};
  margin: ${variable.spacingSmall};
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
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

export default withTranslation()(ForgotPassword);
