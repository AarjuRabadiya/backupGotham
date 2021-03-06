import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import gsap from "gsap";
import { withTranslation } from "react-i18next";
import Loaderspinner from "react-loader-spinner";
import Title from "Components/Typography/Title";
import Icon from "Components/Icons/Icons";
import Button from "Components/Buttons/Button";
import { inject, observer } from "mobx-react";

/**
 * The Main Panel to expand out
 * This device can be used to show extra content or data onscreen
 */
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
      alertmess: "",
    };
  }

  componentDidMount() {
    // document.body.addEventListener(
    //   "click",
    //   () => {
    //     this.closePanel();
    //   },
    //   true
    // );
    this.openPanel();
  }

  openPanel = () => {
    this.setState({ open: true, sucessMes: "", alertmess: "" });
    gsap.fromTo(
      this.expandableElement,
      { x: "100%", opacity: 0 },
      { duration: 0.6, opacity: 1, x: 0, ease: "expo.inOut" }
    );
  };

  componentWillReceiveProps = (props) => {
    this.setState({
      sucessMes: props.sucessMes,
      alertmess: props.alertmess,
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
  render = () => {
    const { data, isAttackLoading, user_team_id } = this.props;
    let { sucessMes, alertmess } = this.state;
    return (
      <Container {...this.props} ref={(div) => (this.expandableElement = div)}>
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
            {alertmess !== "" && (
              <Title
                theme="light"
                shadow={true}
                tag="h6"
                align="left"
                spacing="small"
                size="smaller"
                color={variable.purple}
              >
                {alertmess}
              </Title>
            )}
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
                <Data>
                  <b>CGC Resource: </b>
                  {data.CGG_Resource}
                  <br />
                  <br />
                  <b> Regeneration: </b>
                  {data.regeneration}
                </Data>
                {data.all_user_miner_details &&
                  data.all_user_miner_details.length !== 0 && (
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
                        {
                          data.all_user_miner_details.map((obj, key) => {
                            let newId =
                              user_team_id !== null
                                ? obj.user.team_join
                                  ? obj.user.team_join.user_team_id
                                  : obj.user.team
                                  ? obj.user.team._id
                                  : null
                                : null;

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
                                    {user_team_id !== newId ? (
                                      <Button
                                        theme="purple"
                                        size="wide"
                                        data-toggle="tooltip"
                                        data-placement="top"
                                        title="(Attacker Luck - Defender Luck) / (Attacker Luck +
                          Defender Luck)"
                                        // data-custom-class={TooltipInfo}
                                        onClick={() =>
                                          this.props.attack(obj._id)
                                        }
                                      >
                                        {isAttackLoading ? (
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
                                    ) : (
                                      "can't attack"
                                    )}
                                  </TableCol>
                                </TableRow>
                              </TableBody>
                            );
                          })
                          // map((obj, key) => {
                          //   return (
                          //     <TableBody key={key}>
                          //       <TableRow active={username === obj.username}>
                          //         <TableCol
                          //           tableHeading
                          //           mobileOnly
                          //           active={username === obj.username}
                          //         >
                          //           User name:
                          //         </TableCol>
                          //         <TableCol active={username === obj.username}>
                          //           {obj.username}
                          //         </TableCol>
                          //       </TableRow>
                          //       <TableRow active={username === obj.username}>
                          //         <TableCol
                          //           tableHeading
                          //           mobileOnly
                          //           active={username === obj.username}
                          //         >
                          //           Earn capacity:
                          //         </TableCol>
                          //         <TableCol active={username === obj.username}>
                          //           {obj.earn_capacity}
                          //         </TableCol>
                          //       </TableRow>
                          //     </TableBody>
                          //   );
                          // })
                        }
                      </Body>
                    </Table>
                  )}
              </>
              //   data.map((item, key) => {
              //     return (
              //       <Data key={key}>
              //         {item.username} with a hashrate of {item.total_hashrate}
              //       </Data>
              //     );
              //   })
            )}
          </ContainerInner>
        ) : (
          this.props.children
        )}
      </Container>
    );
  };
}

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
const DisplayFlex = styled.div`
  display: flex;
`;
const ImageDiv = styled.div`
  display: flex;
  justify-content: center;
  height: 50px;
  width: 50px;
  margin: 10px;
  cursor: pointer;
`;
const Data = styled.div`
  border-bottom: 1px solid ${variable.green};
  font-family: ${variable.bodyFontFamily};
  color: #fff;
  padding-top: ${variable.spacingSmall};
  padding-bottom: ${variable.spacingSmall};
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
    props.active
      ? `
        background-color:${variable.green};
    `
      : null}
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
    props.active
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
    `}
`;
const Memoize = React.memo(ExpandablePanel);

export default withTranslation()(Memoize);
