import React from "react";
import styled from "styled-components";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import * as variable from "Base/Variables";
import LoaderSpinner from "react-loader-spinner";
import { media } from "Base/Media";
import Panel from "Components/Panel/Panel";
import Layout from "Components/Layout/Layout";
import Loader from "Components/Loader/Loader";
import BoostDetails from "./BoostDetails";

@inject("AuthStore", "MiningStore")
@observer
class CloudMining extends React.Component {
  constructor(props) {
    super();
    /**
     *
     * @type {{tokens: null}}
     */
    this.state = {
      tokens: null,
      packageData: [],
      isLoader: true,
      alert: false,
      alertmess: "",
      boostDetails: [],
      dataLoading: false,
      id: "",
      paymentLoader: false,
    };
  }

  componentDidMount() {
    const { MiningStore, AuthStore } = this.props;

    this.props.loadBg("balance");

    MiningStore.getPackageList(AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          alertmess: res.error,
          alert: true,
        });
      }
      this.setState({
        packageData: res.data,
        isLoader: false,
      });
    });
    this.boostDetails();
  }
  boostDetails = () => {
    this.setState({
      dataLoading: true,
    });
    const { MiningStore, AuthStore } = this.props;
    MiningStore.boostDetails(AuthStore.token).then((res) => {
      // if (res.error) {
      //   this.setState({
      //     alertmess: res.error,
      //     alert: true,
      //   });
      // }
      this.setState({
        boostDetails: res.data,
        dataLoading: false,
      });
    });
  };
  addBoost = (id) => {
    const { MiningStore, AuthStore } = this.props;
    this.setState({
      paymentLoader: true,
      id: id,
    });
    let payload = {
      package_id: id,
    };
    MiningStore.addBoost(payload, AuthStore.token).then((res) => {
      this.setState({
        paymentLoader: false,
        id: "",
      });
      if (res.error) {
        this.setState({
          alertmess: res.error,
          alert: true,
        });
      } else {
        this.boostDetails();
      }
    });
  };
  handleAlertClose = () => {
    this.setState({ alert: false, alertmess: "" });
  };
  render = () => {
    let {
      packageData,
      isLoader,
      boostDetails,
      dataLoading,
      paymentLoader,
      id,
    } = this.state;
    return (
      <Layout title="Cloud Mining">
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

        <ReferralPage>
          {/* <MainDiv>
            <Title>Cloud Mining............</Title>
          </MainDiv> */}
          <MainDiv>
            {isLoader && <Loader />}
            {packageData.length !== 0 &&
              packageData.map((value, key) => {
                return (
                  <SectionDiv key={key}>
                    <SubDiv>
                      <HeadingTitle>
                        <Title>{value.name}</Title>
                      </HeadingTitle>
                      <SubHeading>
                        <Description>
                          {`+ ${value.hashrate} Hashrate = ${value.cgc} CGC`}
                        </Description>
                      </SubHeading>
                      <ButtonSection
                        style={{
                          display: "block",
                        }}
                      >
                        {paymentLoader && id === value._id ? (
                          <LoaderDiv>
                            <LoaderSpinner
                              type="Oval"
                              color="#CDD5DB"
                              width="18"
                              height="18"
                            />
                          </LoaderDiv>
                        ) : (
                          <Button onClick={() => this.addBoost(value._id)}>
                            Payment
                          </Button>
                        )}
                      </ButtonSection>
                    </SubDiv>
                  </SectionDiv>
                );
              })}
          </MainDiv>
        </ReferralPage>
        {boostDetails && boostDetails.length !== 0 && (
          <React.Fragment>
            <Title>Boost transaction</Title>
            <PanelWrapper>
              <Panel theme="purple">
                <PanelInner>
                  <BoostDetails data={boostDetails} dataLoading={dataLoading} />
                </PanelInner>
              </Panel>
            </PanelWrapper>
          </React.Fragment>
        )}
      </Layout>
    );
  };
}
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
const Title = styled.div`
  color: ${variable.whiteColor};
  font-size: ${variable.textLarger};
  margin-bottom: 10px;
`;
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
const MainDiv = styled.div`
  margin: 10px 0;
  display: block;
`;
const ReferralPage = styled.div`
  color: ${variable.whiteColor};
  // display: grid;
  display: flex;
  flex-direction: column;
`;

const SectionDiv = styled.div`
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-image: linear-gradient(136deg, #8c14cf 0%, #01c3c5 100%);
  // background: ${variable.Active};
  // border: 2px solid ${variable.CheckboxBorder};
  // border-radius: 10px;
  width: 100%;
  padding: 0.2rem;
  margin: 10px;
  float: left;
  ${media.tablet`
    width: 25%;
  `};
`;
const SubDiv = styled.div`
  width: 100%;
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background: ${variable.textColorDark};
  padding: 10px;
`;
const HeadingTitle = styled.div`
  padding: 10px 5px;
  font-size: ${variable.textLarger};
`;
const SubHeading = styled.div`
  margin: 10px 5px;
`;
const Description = styled.div`
  width: 90%;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
`;
const ButtonSection = styled.div`
  padding: 5px;
  // ${media.tablet`
  //   width: 20%;
  // `}
`;
const LoaderDiv = styled.div`
  width: 100%;
  padding: 10px;
  margin: 10px 0px;
  clip-path: polygon(0 0%, 98% 0, 100% 12%, 100% 100%, 2% 100%, 0 87%, 0 0%);
  background: linear-gradient(to right, #f064c1 -106%, #6727cf 100%);
  height: 40px;
  text-align: center;
`;
const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin: 10px 0px;
  clip-path: polygon(0 0%, 98% 0, 100% 12%, 100% 100%, 2% 100%, 0 87%, 0 0%);
  background: linear-gradient(to right, #f064c1 -106%, #6727cf 100%);
  color: ${variable.whiteColor};
  border: none;
  outline: none;
  cursor: pointer;
  font-size: ${variable.textSmall};
  padding: 10px;
  font-family: "erbaum", Open Sans, sans-serif;
  text-transform: uppercase;
`;
export default withTranslation()(CloudMining);
