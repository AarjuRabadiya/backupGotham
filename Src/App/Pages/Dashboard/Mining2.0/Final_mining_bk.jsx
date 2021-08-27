import React from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import Loaderspinner from "react-loader-spinner";
import { media } from "Base/Media";
import * as variable from "Base/Variables";
import Layout from "Components/Layout/Layout";
import Button from "Components/Buttons/Button";
import Loader from "Components/Loader/Loader";
import Select from "Components/Select/Select";
import ReactPagination from "Components/Pagination/Pagination";
import MiningDetail from "./MiningTeamDetail";

@inject("AuthStore", "MiningStore", "QuestStore")
@observer
class MiningContainer extends React.Component {
  constructor(props) {
    super();

    this.state = {
      dataLoading: false,
      characterAssets: [],
      assetDetails: [],
      craft: [],
      craftDetails: [],
      symbolics_Art: [],
      artDetails: [],
      land: [],
      landDetails: [],
      selectAssets: false,
      selectCraft: false,
      selectArt: false,
      selectLand: false,
      selectAssets_TableName: "",
      selectCraft_TableName: "",
      selectArt_TableName: "",
      selectLand_TableName: "",
      miningPayload: {},
      miningobj: {},
      alertmess: "",
      alert: "",
      assetTitle: "",
      participating: false,
      earn_capacity: 0,
      selectLandTable: false,
      selectCartTable: false,
      selectCharacterTable: false,
      selectArtTable: false,
      miningTime: "",
      isLoading: false,
      isStopMining: false,
      selectedTable: "",
      options: [],
      owner_changed: false,
      selectedValue: { value: "", label: "Select assets" },
      miningTeamDetails: [],
      page: 1,
      pageCount: 10,
      assetLoading: false,
      next_page_url: "",
    };
  }
  componentDidMount() {
    this.props.loadBg("mining");
    this.fetchMiningList();
  }
  fetchMiningList = () => {
    this.setState({
      dataLoading: true,
    });
    const { MiningStore, AuthStore } = this.props;

    MiningStore.getMiningList(AuthStore.token).then((res) => {
      this.setState({
        dataLoading: false,
      });
      if (res.participating) {
        this.setState({
          participating: res.participating,
          earn_capacity: res.earn_capacity,
          dataLoading: false,
          miningTime: res.ago,
          owner_changed: res.owner_changed,
          miningTeamDetails: res.mining_team,
        });
      }
      if (res.tokens === undefined && res.participating === undefined) {
        this.setState({
          assetTitle: "Assets are not available for mining...",
          dataLoading: false,
        });
      }
    });
  };
  checkImageExists = (url) => {
    let img;

    try {
      img = require(`Pages/Dashboard/Mining/assets/${url}@2x.png`);
    } catch (e) {
      img = require(`Pages/Dashboard/Mining/assets/default@2x.png`);
    }

    return img;
  };
  openAsset = (assetDetails, key) => {
    if (key === "characterAssets") {
      let options = {
        value: assetDetails.table_name,
        label: `${assetDetails.table_name} (${assetDetails.items.length})`,
        item: assetDetails.items,
      };
      this.setState({
        selectAssets: true,
        assetDetails: assetDetails.items,
        selectAssets_TableName: assetDetails.table_name,
        selectedValue: options,
      });
    }
    if (key === "craft") {
      let options = {
        value: assetDetails.table_name,
        label: `${assetDetails.table_name} (${assetDetails.items.length})`,
        item: assetDetails.items,
      };
      this.setState({
        selectCraft: true,
        craftDetails: assetDetails.items,
        selectedValue: options,
        selectCraft_TableName: assetDetails.table_name,
      });
    }
    if (key === "symbolics_Art") {
      let options = {
        value: assetDetails.table_name,
        label: `${assetDetails.table_name} (${assetDetails.items.length})`,
        item: assetDetails.items,
      };
      this.setState({
        selectArt: true,
        artDetails: assetDetails.items,
        selectArt_TableName: assetDetails.table_name,
        selectedValue: options,
      });
    }
    if (key === "land") {
      let options = {
        value: assetDetails.table_name,
        label: `${assetDetails.table_name} (${assetDetails.items.data.length})`,
        item: assetDetails.items.data,
      };

      this.setState({
        selectLand: true,
        selectedValue: options,
        landDetails: assetDetails.items.data,
        next_page_url: assetDetails.items.next_page_url,
        selectLand_TableName: assetDetails.table_name,
      });
    }
  };
  startMining = (e, obj, key) => {
    e.preventDefault();
    let {
      miningPayload,
      selectLand_TableName,
      miningobj,
      selectAssets_TableName,
      selectCraft_TableName,
      selectArt_TableName,
    } = this.state;
    if (key === "characterAssets") {
      let character_avatar = {
        id: obj.token_id ? obj.token_id : obj.assetId,
        hashrate: obj.hashrate,
        capacity: obj.capacity,
        table_name: selectAssets_TableName,
        owner_changed: false,
      };
      miningPayload.character_avatar = character_avatar;
      miningobj.character_avatar = obj;
      this.setState({
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
      });
    }
    if (key === "craft") {
      let craft = {
        id: obj.token_id ? obj.token_id : obj.assetId,
        hashrate: obj.hashrate,
        capacity: obj.capacity,
        owner_changed: false,
        table_name: selectCraft_TableName,
      };
      miningPayload.craft = craft;
      miningobj.craft = obj;
      this.setState({
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
      });
    }
    if (key === "symbolics_Art") {
      let symbolics_Art = {
        id: obj.token_id ? obj.token_id : obj.assetId,
        hashrate: obj.hashrate,
        luck: obj.luck,
        owner_changed: false,
        table_name: selectArt_TableName,
      };
      miningPayload.symbolics_Art = symbolics_Art;
      miningobj.symbolics_Art = obj;
      this.setState({
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
      });
    }
    if (key === "land") {
      let land = {
        id: obj.token_id ? obj.token_id : obj.assetId,
        isPublic: true,
        owner_changed: false,
        table_name: selectLand_TableName,
      };
      miningPayload.land = land;
      miningobj.land = obj;
      this.setState({
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
      });
    }
  };
  ContinueMining = () => {
    let { miningPayload } = this.state;
    const { MiningStore, AuthStore } = this.props;
    this.setState({
      isLoading: true,
      dataLoading: true,
    });
    MiningStore.startTeamMining(miningPayload, AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          alertmess: res.msg,
          alert: true,
          isLoading: false,
          dataLoading: false,
        });
      } else {
        this.resetState();
      }
    });
  };
  handleAlertClose = () => {
    this.setState({
      alertmess: "",
      alert: false,
    });
  };
  resetState = () => {
    this.setState(
      {
        characterAssets: [],
        assetDetails: [],
        craft: [],
        craftDetails: [],
        symbolics_Art: [],
        artDetails: [],
        land: [],
        landDetails: [],
        next_page_url: "",
        selectAssets: false,
        selectCraft: false,
        selectArt: false,
        selectLand: false,
        selectAssets_TableName: "",
        selectCraft_TableName: "",
        selectArt_TableName: "",
        selectLand_TableName: "",
        miningPayload: {},
        miningobj: {},
        alertmess: "",
        alert: "",
        participating: false,
        earn_capacity: 0,
        page: 1,
        selectLandTable: false,
        selectCartTable: false,
        selectCharacterTable: false,
        selectArtTable: false,
        miningTime: "",
        owner_changed: false,
        isLoading: false,
        isStopMining: false,
        selectedTable: "",
        selectedValue: { value: "", label: "Selec assets" },
        miningTeamDetails: [],
        assetLoading: false,
        options: [],
      },
      () => {
        this.fetchMiningList();
      }
    );
  };
  selectAssetDetails = (isAddress) => {
    if (isAddress === "address") {
      this.setState({
        assetLoading: false,
        characterAssets: [],
        options: [],
        selectedValue: { value: "", label: "Select assets" },
        selectAssets: false,
        selectCharacterTable: true,
        selectCartTable: false,
        selectArtTable: false,
        selectLandTable: false,
      });
    } else {
      let { characterAssets } = this.state;
      this.setState({
        assetLoading: false,
      });
      let options = [];
      characterAssets.map((obj) => {
        let newObj = {
          value: obj.table_name,
          label: `${obj.table_name} (${obj.items.length})`,
          item: obj.items,
        };
        options.push(newObj);
        this.setState({
          selectCharacterTable: true,
          selectCartTable: false,
          selectArtTable: false,
          selectLandTable: false,
          options: options,
          selectedValue: { value: "", label: "Select assets" },
        });
      });
    }
  };
  selectCraftDetails = (isAddress) => {
    if (isAddress === "address") {
      this.setState({
        assetLoading: false,
        craft: [],
        selectCraft: false,
        selectedValue: { value: "", label: "Select assets" },
        selectCartTable: true,
        selectCharacterTable: false,
        selectArtTable: false,
        selectLandTable: false,
        options: [],
      });
    } else {
      let { craft } = this.state;
      this.setState({
        assetLoading: false,
      });
      let options = [];
      craft.map((obj) => {
        let newObj = {
          value: obj.table_name,
          label: `${obj.table_name} (${obj.items.length})`,
          item: obj.items,
        };
        options.push(newObj);
        this.setState({
          selectCartTable: true,
          options: options,
          selectedValue: { value: "", label: "Select assets" },
          selectCharacterTable: false,
          selectArtTable: false,
          selectLandTable: false,
        });
      });
    }
  };
  selectLandDetails = (isAddress) => {
    if (isAddress === "address") {
      this.setState({
        assetLoading: false,
        options: [],
        land: [],
        selectedValue: { value: "", label: "Select assets" },
        selectLand: false,
        selectLandTable: true,
        selectCartTable: false,
        selectArtTable: false,
        assetLoading: false,
      });
    } else {
      let { land } = this.state;
      this.setState({
        assetLoading: false,
      });
      let options = [];
      land.map((obj) => {
        let newObj = {
          value: obj.table_name,
          label: `${obj.table_name} (${obj.items.data.length})`,
          item: obj.items.data,
        };
        options.push(newObj);
        this.setState({
          selectLandTable: true,
          options: options,
          selectedValue: { value: "", label: "Select assets" },
          selectCharacterTable: false,
          selectCartTable: false,
          selectArtTable: false,
          assetLoading: false,
        });
      });
    }
  };
  selectArtDetails = (isAddress) => {
    if (isAddress === "address") {
      this.setState({
        assetLoading: false,
        symbolics_Art: [],
        selectArt: false,
        selectArtTable: true,
        selectedValue: { value: "", label: "Select assets" },
        selectCharacterTable: false,
        selectCartTable: false,
        selectLandTable: false,
        options: [],
      });
    } else {
      let options = [];
      this.setState({
        assetLoading: false,
      });
      let { symbolics_Art } = this.state;

      symbolics_Art.map((obj) => {
        let newObj = {
          value: obj.table_name,
          label: `${obj.table_name} (${obj.items.length})`,
          item: obj.items,
        };
        options.push(newObj);
        this.setState({
          selectArtTable: true,
          options: options,
          selectedValue: { value: "", label: "Select assets" },
          selectCharacterTable: false,
          selectCartTable: false,
          selectLandTable: false,
        });
      });
    }
  };

  selectTable = (table_name) => {
    let { MiningStore, AuthStore } = this.props;
    let { miningPayload, page } = this.state;
    this.setState({
      selectedTable: table_name,
      assetLoading: true,
    });

    if (table_name === "character_avatar") {
      let payload = { type: "character_avatar" };

      if (miningPayload.character_avatar === undefined) {
        MiningStore.miningLists(payload, AuthStore.token).then((res) => {
          if (res.addresses) {
            this.selectAssetDetails("address");
          }
          for (var i = 0; i < Object.keys(res.tokens).length; i++) {
            var key = Object.keys(res.tokens)[i];
            var tk_array = res.tokens[key];

            this.setState(
              {
                characterAssets: tk_array.character_avatar,
                assetLoading: false,
              },
              () => {
                this.selectAssetDetails("");
              }
            );
          }
        });
      } else {
        this.selectAssetDetails("");
      }
    }
    if (table_name === "craft") {
      let payload = { type: "craft" };

      if (miningPayload.craft === undefined) {
        MiningStore.miningLists(payload, AuthStore.token).then((res) => {
          if (res.addresses) {
            this.selectCraftDetails("address");
          }
          for (var i = 0; i < Object.keys(res.tokens).length; i++) {
            var key = Object.keys(res.tokens)[i];
            var tk_array = res.tokens[key];

            this.setState(
              {
                craft: tk_array.craft,
                assetLoading: false,
              },
              () => {
                this.selectCraftDetails("");
              }
            );
          }
        });
      } else {
        this.selectCraftDetails("");
      }
    }
    if (table_name === "land") {
      let payload = { type: "land" };

      if (miningPayload.land === undefined) {
        MiningStore.miningLists(payload, AuthStore.token, page).then((res) => {
          if (res.addresses) {
            this.selectLandDetails("address");
          }
          for (var i = 0; i < Object.keys(res.tokens).length; i++) {
            var key = Object.keys(res.tokens)[i];
            var tk_array = res.tokens[key];

            this.setState(
              {
                land: tk_array.land,
                assetLoading: false,
              },
              () => {
                this.selectLandDetails("");
              }
            );
          }
        });
      } else {
        this.selectLandDetails("");
      }
    }
    if (table_name === "art") {
      let payload = { type: "symbolics_Art" };

      if (miningPayload.symbolics_Art === undefined) {
        MiningStore.miningLists(payload, AuthStore.token).then((res) => {
          if (res.addresses) {
            this.selectArtDetails("address");
          }
          for (var i = 0; i < Object.keys(res.tokens).length; i++) {
            var key = Object.keys(res.tokens)[i];
            var tk_array = res.tokens[key];

            this.setState(
              {
                symbolics_Art: tk_array.symbolics_Art,
                assetLoading: false,
              },
              () => {
                this.selectArtDetails("");
              }
            );
          }
        });
      } else {
        this.selectArtDetails("");
      }
    }
  };
  StopMining = (e) => {
    this.setState({
      isStopMining: true,
      dataLoading: true,
    });
    const { MiningStore, AuthStore } = this.props;
    MiningStore.stopMining(AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          alertmess: res.msg,
          alert: true,
          isStopMining: false,
          dataLoading: false,
        });
      } else {
        this.resetState();
      }
    });
  };
  back = (obj) => {
    let { miningPayload, miningobj } = this.state;

    if (obj === "character_avatar") {
      delete miningPayload[obj];
      delete miningobj[obj];
      this.setState({
        assetDetails: [],
        selectAssets: false,
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
        selectedValue: { value: "", label: "Select assets" },
      });
    }
    if (obj === "craft") {
      delete miningPayload[obj];
      delete miningobj[obj];
      this.setState({
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
        craftDetails: [],
        selectCraft: false,
        selectedValue: { value: "", label: "Select assets" },
      });
    }
    if (obj === "symbolics_Art") {
      delete miningPayload[obj];
      delete miningobj[obj];
      this.setState({
        artDetails: [],
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
        selectArt: false,
        selectedValue: { value: "", label: "Select assets" },
      });
    }
    if (obj === "land") {
      delete miningPayload[obj];
      delete miningobj[obj];
      this.setState({
        landDetails: [],
        next_page_url: "",
        selectLand: false,
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
        selectedValue: { value: "", label: "Select assets" },
        page: 1,
      });
    }
  };
  selectOption = (selectedOption) => {
    let { selectedTable } = this.state;
    if (selectedTable === "character_avatar") {
      this.setState({
        assetDetails: selectedOption.item,
        selectedValue: selectedOption,
        selectAssets_TableName: selectedOption.value,
      });
    }
    if (selectedTable === "craft") {
      this.setState({
        selectedValue: selectedOption,
        craftDetails: selectedOption.item,
        selectCraft_TableName: selectedOption.value,
      });
    }
    if (selectedTable === "art") {
      this.setState({
        selectedValue: selectedOption,
        artDetails: selectedOption.item,
        selectArt_TableName: selectedOption.value,
      });
    }
    if (selectedTable === "land") {
      this.setState({
        selectedValue: selectedOption,
        landDetails: selectedOption.item,
        selectLand_TableName: selectedOption.value,
      });
    }
  };
  onPageChange = (e) => {
    let { MiningStore, AuthStore } = this.props;
    this.setState(
      {
        page: e.selected + 1,
      },
      () => {
        let { page } = this.state;
        let payload = { type: "land" };
        let options = [];
        MiningStore.miningLists(payload, AuthStore.token, page).then((res) => {
          for (var i = 0; i < Object.keys(res.tokens).length; i++) {
            var key = Object.keys(res.tokens)[i];
            var tk_array = res.tokens[key];

            this.setState(
              {
                land: tk_array.land,
              },
              () => {
                let { land } = this.state;

                land.map((obj) => {
                  let newObj = {
                    value: obj.table_name,
                    label: `${obj.table_name} (${obj.items.data.length})`,
                    item: obj.items.data,
                  };
                  options.push(newObj);
                  this.setState({
                    options: options,
                  });
                });
                this.setState({
                  landDetails: land[0].items.data,
                  next_page_url: land[0].items.next_page_url,
                });
              }
            );
          }
        });
      }
    );
  };
  render = () => {
    let {
      dataLoading,
      characterAssets,
      land,
      symbolics_Art,
      craft,
      selectArt,
      selectCraft,
      selectAssets,
      selectLand,
      landDetails,
      next_page_url,
      craftDetails,
      assetDetails,
      artDetails,
      miningPayload,
      miningobj,
      selectLandTable,
      selectCartTable,
      selectCharacterTable,
      selectArtTable,
      participating,
      earn_capacity,
      assetTitle,
      miningTime,
      owner_changed,
      isLoading,
      isStopMining,
      selectedTable,
      options,
      selectedValue,
      miningTeamDetails,
      assetLoading,
    } = this.state;
    let { history } = this.props;
    return (
      <Layout title="Mining 2.0">
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
        {dataLoading ? (
          <Loader />
        ) : assetTitle ? (
          <Mining>
            <Title>{assetTitle}</Title>
          </Mining>
        ) : (
          <React.Fragment>
            <Mining style={{ marginBottom: "10px" }}>
              {miningPayload && miningPayload.character_avatar !== undefined && (
                <SelectedSection>
                  <SubSectionDiv>
                    <SelectTitle changeColor={false}>
                      Selected Character
                    </SelectTitle>
                    <SelectTitle changeColor={true}>
                      {miningPayload &&
                        miningPayload.character_avatar !== undefined &&
                        miningobj.character_avatar.name}
                    </SelectTitle>
                    <BackDiv onClick={() => this.back("character_avatar")}>
                      Remove
                    </BackDiv>
                  </SubSectionDiv>
                </SelectedSection>
              )}
              {miningPayload && miningPayload.craft !== undefined && (
                <SelectedSection>
                  <SubSectionDiv>
                    <SelectTitle changeColor={false}>
                      Selected Craft
                    </SelectTitle>
                    <SelectTitle changeColor={true}>
                      {miningPayload &&
                        miningPayload.craft !== undefined &&
                        miningobj.craft.name}
                    </SelectTitle>
                    <BackDiv onClick={() => this.back("craft")}>Remove</BackDiv>
                  </SubSectionDiv>
                </SelectedSection>
              )}
              {miningPayload && miningPayload.symbolics_Art !== undefined && (
                <SelectedSection>
                  <SubSectionDiv>
                    <SelectTitle changeColor={false}>
                      Selected Symbolic
                    </SelectTitle>
                    <SelectTitle changeColor={true}>
                      {miningPayload &&
                        miningPayload.symbolics_Art !== undefined &&
                        miningobj.symbolics_Art.name}
                    </SelectTitle>
                    <BackDiv onClick={() => this.back("symbolics_Art")}>
                      Remove
                    </BackDiv>
                  </SubSectionDiv>
                </SelectedSection>
              )}
              {miningPayload && miningPayload.land !== undefined && (
                <SelectedSection>
                  <SubSectionDiv>
                    <SelectTitle changeColor={false}>Selected Land</SelectTitle>
                    <SelectTitle changeColor={true}>
                      {miningPayload &&
                        miningPayload.land !== undefined &&
                        miningobj.land.name}
                    </SelectTitle>
                    <BackDiv onClick={() => this.back("land")}>Remove</BackDiv>
                  </SubSectionDiv>
                </SelectedSection>
              )}
            </Mining>
            {!participating && (
              <MiningSearch>
                <Select
                  value={selectedValue}
                  placeholder={"Select Assets"}
                  handleChange={this.selectOption}
                  options={options}
                  border={`2px solid #8c14cf`}
                  color={`${variable.whiteColor}`}
                />
              </MiningSearch>
            )}
            <Mining>
              <LeftSection>
                {participating && <Title>Start mining: {miningTime}</Title>}
                {participating && earn_capacity > 0 && (
                  <Title>Earn Capacity: {earn_capacity}</Title>
                )}
                {participating &&
                  miningTeamDetails &&
                  miningTeamDetails.length !== 0 && (
                    <React.Fragment>
                      <Mining>
                        <Title SubTitle={true}>Mining Team Details</Title>
                      </Mining>
                      {miningTeamDetails.map((obj, key) => {
                        return (
                          <MiningDetail
                            key={key}
                            miningTeamDetails={obj}
                            dataLoading={dataLoading}
                          />
                        );
                      })}
                    </React.Fragment>
                  )}
                {owner_changed && <Title>Your mining team distroyed....</Title>}
                {assetLoading && <Loader />}
                {selectCharacterTable && (
                  <Section>
                    {selectedTable === "character_avatar" && (
                      <div>CharacterAssets</div>
                    )}
                    {selectedTable === "character_avatar" ? (
                      !selectAssets ? (
                        characterAssets && characterAssets.length !== 0 ? (
                          characterAssets.map((obj, key) => {
                            return (
                              <MainSection
                                key={key}
                                onClick={(e) =>
                                  this.openAsset(obj, "characterAssets")
                                }
                              >
                                <SubSection>
                                  <ImageDiv>
                                    <img
                                      src={this.checkImageExists(
                                        obj.table_name
                                      )}
                                      alt=""
                                    />
                                  </ImageDiv>
                                  <Description>
                                    {obj.table_name ? obj.table_name : "-"}
                                  </Description>
                                </SubSection>
                              </MainSection>
                            );
                          })
                        ) : (
                          <SpaceingDiv>
                            <SelectSection
                              onClick={() =>
                                history.push({
                                  pathname: "/search",
                                  state: "character_avatar",
                                  category: true,
                                })
                              }
                            >
                              <SubSection>
                                Character assets are not available click here
                                for show assets
                              </SubSection>
                            </SelectSection>
                          </SpaceingDiv>
                        )
                      ) : (
                        assetDetails &&
                        assetDetails.length !== 0 &&
                        assetDetails.map((obj, key) => {
                          return (
                            <MainSection
                              key={key}
                              onClick={(e) =>
                                this.startMining(e, obj, "characterAssets")
                              }
                              active={
                                miningPayload.character_avatar !== undefined &&
                                obj.assetId ===
                                  miningPayload.character_avatar.id
                                  ? true
                                  : false
                              }
                            >
                              <SubSection>
                                <ImageDiv>
                                  <img src={obj.image_url} alt="" />
                                </ImageDiv>
                                <Description>
                                  {obj.name ? obj.name : "-"}
                                </Description>
                              </SubSection>
                            </MainSection>
                          );
                        })
                      )
                    ) : (
                      ""
                    )}
                  </Section>
                )}

                {selectCartTable && (
                  <Section>
                    {selectedTable === "craft" && <div>Craft</div>}
                    {selectedTable === "craft" ? (
                      !selectCraft ? (
                        craft && craft.length !== 0 ? (
                          craft.map((obj, key) => {
                            return (
                              <MainSection
                                key={key}
                                onClick={(e) => this.openAsset(obj, "craft")}
                              >
                                <SubSection>
                                  <ImageDiv>
                                    <img
                                      src={this.checkImageExists(
                                        obj.table_name
                                      )}
                                      alt=""
                                    />
                                  </ImageDiv>
                                  <Description>
                                    {obj.table_name ? obj.table_name : "-"}
                                  </Description>
                                </SubSection>
                              </MainSection>
                            );
                          })
                        ) : (
                          <SpaceingDiv>
                            <SelectSection
                              onClick={() =>
                                history.push({
                                  pathname: "/search",
                                  state: "craft",
                                  category: true,
                                })
                              }
                            >
                              <SubSection>
                                Craft assets are not available click here for
                                show assets
                              </SubSection>
                            </SelectSection>
                          </SpaceingDiv>
                        )
                      ) : (
                        craftDetails &&
                        craftDetails.length !== 0 &&
                        craftDetails.map((obj, key) => {
                          return (
                            <MainSection
                              key={key}
                              onClick={(e) => this.startMining(e, obj, "craft")}
                              active={
                                miningPayload.craft !== undefined &&
                                obj.assetId === miningPayload.craft.id
                                  ? true
                                  : false
                              }
                            >
                              <SubSection>
                                <ImageDiv>
                                  <img src={obj.image_url} alt="" />
                                </ImageDiv>
                                <Description>
                                  {obj.name ? obj.name : "-"}
                                </Description>
                              </SubSection>
                            </MainSection>
                          );
                        })
                      )
                    ) : (
                      ""
                    )}
                  </Section>
                )}
                {selectArtTable && (
                  <Section>
                    {selectedTable === "art" && <div> Symbolics Art</div>}
                    {selectedTable === "art" ? (
                      !selectArt ? (
                        symbolics_Art && symbolics_Art.length !== 0 ? (
                          symbolics_Art.map((obj, key) => {
                            return (
                              <MainSection
                                key={key}
                                onClick={(e) =>
                                  this.openAsset(obj, "symbolics_Art")
                                }
                              >
                                <SubSection>
                                  <ImageDiv>
                                    <img
                                      src={this.checkImageExists(
                                        obj.table_name
                                      )}
                                      alt=""
                                    />
                                  </ImageDiv>
                                  <Description>
                                    {obj.table_name ? obj.table_name : "-"}
                                  </Description>
                                </SubSection>
                              </MainSection>
                            );
                          })
                        ) : (
                          <SpaceingDiv>
                            <SelectSection
                              onClick={() =>
                                history.push({
                                  pathname: "/search",
                                  state: "art",
                                  category: true,
                                })
                              }
                            >
                              <SubSection>
                                Symbolic assets are not available click here for
                                show assets
                              </SubSection>
                            </SelectSection>
                          </SpaceingDiv>
                        )
                      ) : (
                        artDetails &&
                        artDetails.length !== 0 &&
                        artDetails.map((obj, key) => {
                          return (
                            <MainSection
                              key={key}
                              onClick={(e) =>
                                this.startMining(e, obj, "symbolics_Art")
                              }
                              active={
                                miningPayload.symbolics_Art !== undefined &&
                                obj.assetId === miningPayload.symbolics_Art.id
                                  ? true
                                  : false
                              }
                            >
                              <SubSection>
                                <ImageDiv>
                                  <img src={obj.image_url} alt="" />
                                </ImageDiv>
                                <Description>
                                  {obj.name ? obj.name : "-"}
                                </Description>
                              </SubSection>
                            </MainSection>
                          );
                        })
                      )
                    ) : (
                      ""
                    )}
                  </Section>
                )}
                {selectLandTable && (
                  <Section>
                    {selectedTable === "land" && <div>Land</div>}
                    {selectedTable === "land" ? (
                      !selectLand ? (
                        land && land.length !== 0 ? (
                          land.map((obj, key) => {
                            return (
                              <MainSection
                                key={key}
                                onClick={(e) => this.openAsset(obj, "land")}
                              >
                                <SubSection>
                                  <ImageDiv>
                                    <img
                                      src={this.checkImageExists(
                                        obj.table_name
                                      )}
                                      alt=""
                                    />
                                  </ImageDiv>
                                  <Description>
                                    {obj.table_name ? obj.table_name : "-"}
                                  </Description>
                                </SubSection>
                              </MainSection>
                            );
                          })
                        ) : (
                          <SpaceingDiv>
                            <SelectSection
                              onClick={() =>
                                history.push({
                                  pathname: "/search",
                                  state: "land",
                                  category: true,
                                })
                              }
                            >
                              <SubSection>
                                Land assets are not available click here for
                                show assets
                              </SubSection>
                            </SelectSection>
                          </SpaceingDiv>
                        )
                      ) : (
                        landDetails &&
                        landDetails.length !== 0 && (
                          <React.Fragment>
                            {landDetails.map((obj, key) => {
                              return (
                                <MainSection
                                  key={key}
                                  onClick={(e) =>
                                    this.startMining(e, obj, "land")
                                  }
                                  active={
                                    miningPayload.land !== undefined &&
                                    obj.assetId === miningPayload.land.id
                                      ? true
                                      : false
                                  }
                                >
                                  <SubSection>
                                    <ImageDiv>
                                      <img src={obj.image_url} alt="" />
                                    </ImageDiv>
                                    <Description>
                                      {obj.name ? obj.name : "-"}
                                    </Description>
                                  </SubSection>
                                </MainSection>
                              );
                            })}
                            {next_page_url !== null && (
                              <ReactPagination
                                pageCount={12}
                                onPageChange={(e) => this.onPageChange(e)}
                              />
                            )}
                          </React.Fragment>
                        )
                      )
                    ) : (
                      ""
                    )}
                  </Section>
                )}
              </LeftSection>
              <RightSection>
                {!participating ? (
                  <SpaceingDiv>
                    <SelectSection active={selectCharacterTable ? true : false}>
                      <SubSection
                        onClick={() => this.selectTable("character_avatar")}
                      >
                        <div>Select Character</div>
                      </SubSection>
                    </SelectSection>
                  </SpaceingDiv>
                ) : null}
                {!participating ? (
                  <SpaceingDiv>
                    <SelectSection active={selectCartTable ? true : false}>
                      <SubSection onClick={() => this.selectTable("craft")}>
                        <div>Select Craft</div>
                      </SubSection>
                    </SelectSection>
                  </SpaceingDiv>
                ) : null}
                {!participating ? (
                  <SpaceingDiv>
                    <SelectSection active={selectArtTable ? true : false}>
                      <SubSection onClick={() => this.selectTable("art")}>
                        <div>Select Symbolic</div>
                      </SubSection>
                    </SelectSection>
                  </SpaceingDiv>
                ) : null}
                {!participating ? (
                  <SpaceingDiv>
                    <SelectSection active={selectLandTable ? true : false}>
                      <SubSection onClick={() => this.selectTable("land")}>
                        <div>Select Land</div>
                      </SubSection>
                    </SelectSection>
                  </SpaceingDiv>
                ) : null}

                {miningPayload.character_avatar !== undefined &&
                  miningPayload.craft !== undefined &&
                  miningPayload.symbolics_Art !== undefined &&
                  miningPayload.land !== undefined && (
                    <SpaceingDiv>
                      <div>
                        <Button
                          theme="green"
                          onClick={(e) => this.ContinueMining(e)}
                        >
                          {isLoading ? (
                            <Loaderspinner
                              type="Oval"
                              color="#000"
                              width="18"
                              height="18"
                            />
                          ) : (
                            "Continue"
                          )}
                        </Button>
                      </div>
                    </SpaceingDiv>
                  )}
                {participating && (
                  <SpaceingDiv>
                    <div>
                      <Button theme="green" onClick={(e) => this.StopMining(e)}>
                        {isStopMining ? (
                          <Loaderspinner
                            type="Oval"
                            color="#000"
                            width="18"
                            height="18"
                          />
                        ) : (
                          "Stop Mining"
                        )}
                      </Button>
                    </div>
                  </SpaceingDiv>
                )}
              </RightSection>
            </Mining>
          </React.Fragment>
        )}
      </Layout>
    );
  };
}
const Title = styled.div`
  margin-top: 22px;
  font-size: 30px;
  ${(props) =>
    props.SubTitle
      ? `
      color:#D375FF;
      font-size: 25px;
    `
      : null}
`;
const SelectTitle = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #d290f6;
  margin-bottom: 5px;
  width: 194px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin: auto;
  text-align: center;
  @media (min-width: 768px) and (max-width: 1280px) {
    width: 100px;
  }
  @media (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
    width: 100px;
  }

  ${(props) =>
    props.changeColor
      ? `
      color:#fff 
    `
      : `color: #d290f6`}
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
  margin-bottom: 10px;
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
const MiningSearch = styled.div`
  display: block;
  color: ${variable.whiteColor};
  width: 100%;
  margin-bottom: 20px;
  margin-top: 20px;
  ${media.tablet`
    display: flex;
    width: 30%;
  `}
`;
const Mining = styled.div`
  display: block;
  color: ${variable.whiteColor};
  width: 100%;
  ${media.tablet`
    display: flex;
  `}
`;
const ImageDiv = styled.div`
  width: 200px;
  height: 200px;
  display: flex;
  justify-content: center;
`;
const LeftSection = styled.div`
  width: 100%;
  ${media.tablet`
    width: 70%;
  `}
`;
const RightSection = styled.div`
  width: 100%;
  ${media.tablet`
    width: 30%;
  `}
`;
const Description = styled.div`
  margin-top: 10px;
`;
const SubSection = styled.div`
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1.6rem 1.6rem;
  cursor: pointer;
  text-align: center;
`;
const MainSection = styled.div`
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-image: linear-gradient(136deg, #8c14cf 0%, #01c3c5 100%);
  padding: 0.2rem;
  display: inline-block;
  vertical-align: top;
  margin: 10px;
  ${(props) =>
    props.active
      ? `
      background-image: linear-gradient(to right,#00ffe6 0%,#00fffd 100%)
    `
      : null}
`;
const SelectedSection = styled.div`
  background-image: linear-gradient(136deg, #8c14cf 0%, #01c3c5 100%);
  padding: 0.2rem;
  width: 100%;
  margin-right: 10px;
  ${media.tablet`
  // width: calc(100% / 4);
  width:calc(calc(100% / 4) - 10px);
`}
`;
const SubSectionDiv = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1.6rem 1.6rem;
  cursor: pointer;
  text-align: center;
`;
const SelectSection = styled.div`
  clip-path: polygon(0 0%, 95% 0, 100% 30px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-image: linear-gradient(136deg, #8c14cf 0%, #01c3c5 100%);
  padding: 0.2rem;
  ${(props) =>
    props.active
      ? `
      background-image: linear-gradient(to right,#00ffe6 0%,#00fffd 100%);
    `
      : null}
`;
const Section = styled.div``;
const SpaceingDiv = styled.div`
  margin: 10px;
  ${(props) =>
    props.margin
      ? `
      margin: 10px 0;
    `
      : null}
`;
const BackDiv = styled.div`
  color: ${variable.greenLight};
  margin-top: 5px;
`;
// const HR = styled.hr`
//   border: 1px solid #40c6bc;
//   margin: 10px;
// `;
export default withTranslation()(MiningContainer);
