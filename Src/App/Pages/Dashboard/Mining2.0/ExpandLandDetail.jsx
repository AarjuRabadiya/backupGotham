import React from "react";
import styled from "styled-components";
import { inject, observer } from "mobx-react";
import gsap from "gsap";
import { withTranslation } from "react-i18next";
import Loaderspinner from "react-loader-spinner";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import Title from "Components/Typography/Title";
import Icon from "Components/Icons/Icons";
import Button from "Components/Buttons/Button";

@inject("ParticipationStore")
@observer
class ExpandablePanel extends React.Component {
  constructor(props) {
    super(props);
    this.expandableElement = null;

    this.state = {
      open: false,
      openData: {},
      isOpen: false,
      sucessMes: "",
      openToolTip: false,
      id: "",
    };
  }

  componentDidMount() {
    // document.body.addEventListener(
    //   "click",
    //   () => {
    //     this.setState({ openToolTip: false });
    //     // this.closePanel();
    //   },
    //   true
    // );
    this.openPanel();
  }

  openPanel = () => {
    this.setState({ open: true, sucessMes: "" });
    gsap.fromTo(
      this.expandableElement,
      { x: "100%", opacity: 0 },
      { duration: 0.6, opacity: 1, x: 0, ease: "expo.inOut" }
    );
  };

  componentWillReceiveProps = (props) => {
    this.setState({
      sucessMes: props.sucessMes,
    });
  };
  closePanel = () => {
    const { open } = this.state;

    if (open) {
      this.props.clearState();

      this.setState({ open: false });
      gsap.fromTo(
        this.expandableElement,
        { x: "0%", opacity: 1 },
        { duration: 0.6, opacity: 1, x: "100%", ease: "expo.inOut" }
      );
    }
  };
  openToolTip = () => {
    let { openToolTip } = this.state;

    this.setState({
      openToolTip: openToolTip === true ? false : true,
    });
  };
  attack = (obj) => {
    this.setState(
      {
        id: obj,
      },
      () => {
        this.props.attack(obj);
        setTimeout(() => {
          this.setState({
            id: "",
          });
        }, 1500);
      }
    );
  };
  render = () => {
    const { data, isAttackLoading } = this.props;
    let { sucessMes, openToolTip, id } = this.state;

    return (
      <React.Fragment>
        <Container
          {...this.props}
          ref={(div) => (this.expandableElement = div)}
        >
          <Close onClick={() => this.closePanel()}>
            <Icon
              fill={variable.black}
              path="M16.6464466.6464466l.7071068.70710679L9.707 9l7.6465534 7.6464466-.7071068.7071068L9 9.707l-7.64644661 7.6465534-.70710678-.7071068L8.293 9 .6464466 1.35355339 1.3535534.64644661 9 8.293z"
              width={20}
              height={20}
            />
          </Close>
          {data && data !== undefined ? (
            <ContainerInner>
              <Title
                theme="light"
                shadow={true}
                tag="h6"
                align="left"
                spacing="small"
                size="smaller"
                color={variable.greenLight}
              >
                {data.name}
              </Title>

              {sucessMes !== "" && (
                <Title
                  theme="light"
                  shadow={true}
                  tag="h6"
                  align="left"
                  spacing="small"
                  size="smaller"
                  color={variable.purple}
                >
                  {sucessMes}
                </Title>
              )}
              {this.props.component ? (
                <div>{this.props.component}</div>
              ) : (
                <>
                  {data && data.length !== 0 && (
                    <>
                      <Data>
                        <TextSection>
                          <b>All user miner details</b>
                        </TextSection>
                        {/* <ToolTipSection> */}
                        <ToolTipDiv active={openToolTip}>
                          (Attacker Luck - Defender Luck) / (Attacker Luck +
                          Defender Luck)
                        </ToolTipDiv>
                        <ButtonSection
                          data-toggle="tooltip"
                          data-placement="top"
                          title="(Attacker Luck - Defender Luck) / (Attacker Luck +
                          Defender Luck)"
                          onClick={() => this.openToolTip()}
                          active={openToolTip}
                        >
                          How attack works
                        </ButtonSection>
                        {/* </ToolTipSection> */}
                      </Data>
                      <Table>
                        <TableHead hiddenMobile>
                          <TableHeading>User name</TableHeading>
                          <TableHeading>Collection</TableHeading>
                          <TableHeading>Earned capacity</TableHeading>
                          <TableHeading>Total capacity</TableHeading>
                          <TableHeading>Hashrate</TableHeading>
                          <TableHeading>Action</TableHeading>
                        </TableHead>
                        <Body>
                          {data.map((obj, key) => {
                            return (
                              <TableBody key={key}>
                                <TableRow onClick={() => this.closePanel()}>
                                  <TableCol tableHeading mobileOnly>
                                    User name:
                                  </TableCol>
                                  <TableCol>{obj.username}</TableCol>
                                </TableRow>
                                <TableRow>
                                  <TableCol tableHeading mobileOnly>
                                    Collection:
                                  </TableCol>
                                  <TableCol>
                                    <DisplayFlex>
                                      <ImageDiv
                                        onClick={() =>
                                          this.props.openSubPanel(
                                            obj.character_avatar
                                          )
                                        }
                                      >
                                        <img
                                          src={obj.character_avatar.image}
                                          alt=""
                                        />
                                      </ImageDiv>
                                      <ImageDiv
                                        onClick={() =>
                                          this.props.openSubPanel(obj.craft)
                                        }
                                      >
                                        <img src={obj.craft.image} alt="" />
                                      </ImageDiv>
                                    </DisplayFlex>
                                    <DisplayFlex>
                                      <ImageDiv
                                        onClick={() =>
                                          this.props.openSubPanel(
                                            obj.symbolics_Art
                                          )
                                        }
                                      >
                                        <img
                                          src={obj.symbolics_Art.image}
                                          alt=""
                                        />
                                      </ImageDiv>
                                      <ImageDiv
                                        onClick={() =>
                                          this.props.openSubPanel(obj.land)
                                        }
                                      >
                                        <img src={obj.land.image} alt="" />
                                      </ImageDiv>
                                    </DisplayFlex>
                                  </TableCol>
                                </TableRow>
                                <TableRow onClick={() => this.closePanel()}>
                                  <TableCol tableHeading mobileOnly>
                                    Earn capacity:
                                  </TableCol>
                                  <TableCol>
                                    {obj.earn_capacity >= 0
                                      ? obj.earn_capacity
                                      : "-"}
                                  </TableCol>
                                </TableRow>
                                <TableRow onClick={() => this.closePanel()}>
                                  <TableCol tableHeading mobileOnly>
                                    Total capacity:
                                  </TableCol>
                                  <TableCol>
                                    {obj.total_capacity
                                      ? obj.total_capacity
                                      : "-"}
                                  </TableCol>
                                </TableRow>
                                <TableRow onClick={() => this.closePanel()}>
                                  <TableCol tableHeading mobileOnly>
                                    Hashrate:
                                  </TableCol>
                                  <TableCol>
                                    {obj.total_hashrate
                                      ? obj.total_hashrate
                                      : "-"}
                                  </TableCol>
                                </TableRow>
                                <TableRow>
                                  <TableCol tableHeading mobileOnly>
                                    Action
                                  </TableCol>
                                  <TableCol>
                                    <Button
                                      theme="purple"
                                      size="wide"
                                      data-toggle="tooltip"
                                      data-placement="top"
                                      title={
                                        obj.earn_capacity === 0
                                          ? "Earn capacity is zero So you can't attack"
                                          : "(Attacker Luck - Defender Luck) / (Attacker Luck + Defender Luck)"
                                      }
                                      // data-custom-class={TooltipInfo}

                                      onClick={
                                        obj.earn_capacity === 0
                                          ? null
                                          : () => this.attack(obj._id)
                                      }
                                    >
                                      {id === obj._id && isAttackLoading ? (
                                        <Loaderspinner
                                          type="Oval"
                                          color="#000"
                                          width="18"
                                          height="18"
                                        />
                                      ) : (
                                        "Attack"
                                      )}
                                    </Button>
                                  </TableCol>
                                </TableRow>
                              </TableBody>
                            );
                          })}
                        </Body>
                      </Table>
                    </>
                  )}
                </>
              )}
            </ContainerInner>
          ) : (
            this.props.children
          )}
        </Container>
      </React.Fragment>
    );
  };
}
// const TooltipInfo = styled.a`
//   font-weight: bold !important;
//   font-size: 20px !important;
// `;
const DisplayFlex = styled.div`
  display: flex;
`;
const Close = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  width: 50px;
  cursor: pointer;
  height: 50px;
  background-color: ${variable.green};
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Data = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid ${variable.green};
  font-family: ${variable.bodyFontFamily};
  color: #43c1bf;
  padding-top: ${variable.spacingSmall};
  padding-bottom: ${variable.spacingSmall};
`;

const TextSection = styled.div`
  width: 70%;
`;

const ButtonSection = styled.div`
  width: 30%;
  padding: 10px;
  cursor: pointer;

  font-weight: bold;
  text-align: center;

  ${(props) =>
    props.active
      ? `
      background: linear-gradient(to right,#64f0a1 0%,#27a8cf 100%);
      color:#000;
    `
      : `
      background: linear-gradient(to right, #f064c1 -106%, #6727cf 100%);
      color: ${variable.white};
    `}
`;
const ToolTipDiv = styled.div`
  ${(props) =>
    props.active
      ? `
      display: block;
    `
      : `
      display: none;
    `}
`;
const ImageDiv = styled.div`
  height: 50px;
  width: 50px;
  margin: 10px;
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

const ContainerInner = styled.div`
  height: 100%;
  max-height: 100%;
  overflow: scroll;

  &::-webkit-scrollbar {
    display: none;
  }
`;

const Container = styled.aside`
  width: 90%;
  height: 100%;
  position: fixed;
  padding: ${variable.spacingSmall};
  top: 0;
  right: 0;
  z-index: 9999999;
  border: 0;
  border-left: 1px solid ${variable.purple};
  background-color: rgba(0, 0, 0, 0.9);
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  transform: translateX(0);

  ${media.tablet`
        width: 50%;
        padding: ${variable.spacingLarge};
    `}
`;
const Table = styled.div``;
const Body = styled.div``;

const TableHeading = styled.div`
  font-family: ${variable.bodyFontFamily};
  color: ${variable.white};
  opacity: 1;
  padding: ${variable.spacingSmall};
  border-bottom: 1px solid ${variable.green};
  text-align: left;
  font-weight: 600;

  ${(props) =>
    props.widthSmall
      ? `
        width: 15%;
        flex-grow: 0;
    `
      : `
       flex-grow: 1;
        flex-basis: 0;
    `}
`;
const TableHead = styled.div`
  ${(props) =>
    props.hiddenMobile
      ? `
        display: none;
    `
      : null}

  ${media.tablet`
        ${(props) =>
          props.hiddenMobile
            ? `
            display: flex;
        `
            : null}
    `}
`;

const TableBody = styled.div`
  //border-bottom: 1px solid ${variable.green};
  padding-bottom: ${variable.spacingSmall};
  padding-top: ${variable.spacingSmall};
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${variable.green};
    * {
      color: ${variable.black} !important;
    }
  }

  ${media.tablet`
        display: flex;
        flex-wrap: wrap;
        border: 0;
        padding: 0;
    `}
`;
const TableRow = styled.div`
  padding: ${variable.spacingSmallest} 0;
  display: flex;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.activeState
      ? `
        background-color:${variable.green};
    `
      : null}

  ${media.tablet`
        display: flex;
        border-bottom: 1px solid ${variable.green};
        padding: ${variable.spacingSmall};
                
        ${(props) =>
          props.widthSmall
            ? `
            width: 15%;
            flex-grow: 0;
        `
            : `
           flex-grow: 1;
            flex-basis: 0;
        `}
    
    `}
`;

const TableCol = styled.div`
  font-family: ${variable.bodyFontFamily};
  color: ${variable.white};
  opacity: 1;
  text-align: left;
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.activeState
      ? `
        color:${variable.black};
    `
      : null}
  ${(props) =>
    props.tableHeading
      ? `
        font-weight: bold;
        margin-right: ${variable.spacingSmall};
        width: 40%;
        flex-shrink: 0;
    `
      : null}
    ${media.tablet`
        ${(props) =>
          props.mobileOnly
            ? `
            display: none;
        `
            : null}
    `};
`;
const Memoize = React.memo(ExpandablePanel);

export default withTranslation()(Memoize);
