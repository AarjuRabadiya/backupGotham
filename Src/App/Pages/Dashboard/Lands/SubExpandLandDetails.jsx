import React from "react";
import styled from "styled-components";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import gsap from "gsap";
import { withTranslation } from "react-i18next";
import Title from "Components/Typography/Title";
import Icon from "Components/Icons/Icons";
import { inject, observer } from "mobx-react";
// import Button from "Components/Buttons/Button";

@inject("ParticipationStore")
@observer
class SubExpandablePanel extends React.Component {
  constructor(props) {
    super(props);
    this.subExpandableElement = null;

    this.state = {
      open: false,
      data: null,
    };
  }

  componentDidMount() {
    document.body.addEventListener(
      "click",
      () => {
        this.closePanel();
      },
      true
    );
    this.openPanel();
  }

  openPanel = () => {
    this.setState({ open: true });
    gsap.fromTo(
      this.subExpandableElement,
      { x: "100%", opacity: 0 },
      { duration: 0.6, opacity: 1, x: 0, ease: "expo.inOut" }
    );
  };

  closePanel = () => {
    const { open } = this.state;

    if (open) {
      this.props.clearState();

      this.setState({ open: false });
      gsap.fromTo(
        this.subExpandableElement,
        { x: "0%", opacity: 1 },
        { duration: 0.6, opacity: 1, x: "100%", ease: "expo.inOut" }
      );
    }
  };

  render = () => {
    const { data } = this.props;
    return (
      <Container
        {...this.props}
        ref={(div) => (this.subExpandableElement = div)}
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
              Collection Details
            </Title>

            {this.props.component ? (
              <div>{this.props.component}</div>
            ) : (
              <>
                {data && data.length !== 0 && (
                  <>
                    <Table>
                      <TableHead hiddenMobile>
                        <TableHeading>Image</TableHeading>
                        <TableHeading>Name</TableHeading>
                        {data.hashrate && <TableHeading>Hashrate</TableHeading>}
                        {data.capacity && <TableHeading>Capacity</TableHeading>}
                        {data.luck && <TableHeading>Luck</TableHeading>}
                      </TableHead>
                      <Body>
                        <TableBody>
                          <TableRow>
                            <TableCol tableHeading mobileOnly>
                              Image:
                            </TableCol>
                            <TableCol>
                              <ImageDiv>
                                <img src={data.image} alt="" />
                              </ImageDiv>
                            </TableCol>
                          </TableRow>
                          <TableRow>
                            <TableCol tableHeading mobileOnly>
                              Name:
                            </TableCol>
                            <TableCol>{data.name}</TableCol>
                          </TableRow>
                          {data.hashrate && (
                            <TableRow>
                              <TableCol tableHeading mobileOnly>
                                Hashrate:
                              </TableCol>
                              <TableCol>{data.hashrate}</TableCol>
                            </TableRow>
                          )}
                          {data.capacity && (
                            <TableRow>
                              <TableCol tableHeading mobileOnly>
                                Capacity:
                              </TableCol>
                              <TableCol>{data.capacity}</TableCol>
                            </TableRow>
                          )}
                          {data.luck && (
                            <TableRow>
                              <TableCol tableHeading mobileOnly>
                                Luck:
                              </TableCol>
                              <TableCol>{data.luck}</TableCol>
                            </TableRow>
                          )}
                        </TableBody>
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
    );
  };
}
// const DisplayFlex = styled.div`
//   display: flex;
// `;
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

const ImageDiv = styled.div`
  height: 100px;
  width: 100px;
  margin: 10px;
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
  width: 80%;
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
        width: 40%;
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
  display: flex;
  align-items: center;

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
const Memoize = React.memo(SubExpandablePanel);

export default withTranslation()(Memoize);
