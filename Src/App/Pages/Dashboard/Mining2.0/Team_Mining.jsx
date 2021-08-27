import React from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import Loaderspinner from "react-loader-spinner";
import moment from "moment";
import { media } from "Base/Media";
import * as variable from "Base/Variables";
import Layout from "Components/Layout/Layout";
import Button from "Components/Buttons/Button";
import Loader from "Components/Loader/Loader";
import Select from "Components/Select/Select";
import ReactPagination from "Components/Pagination/Pagination";
import MiningDetail from "./MiningTeamDetail";
import AssetDetails from "./AssetDetails";

const assetType = [
  { type: "character_avatar" },
  { type: "craft" },
  { type: "art" },
  { type: "land" },
];
@inject("AuthStore", "MiningStore", "QuestStore", "AssetStore")
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
      miningTime: "",
      isLoading: false,
      isStopMining: false,
      options: [],
      owner_changed: false,
      selectedValue: { value: "", label: "Select assets" },
      miningTeamDetails: [],
      page: 1,
      assetLoading: false,
      next_page_url: "",
      pageCount: 0,

      selectTable: "",
      resetPagination: false,
      shortingOptions: [
        { value: 0, label: "asc" },
        { value: 1, label: "desc" },
      ],
      selectShortValue: { value: 1, label: "asc" },
      owner_changed: false,
      teamSelectOption: [],
      selectedTeam: { value: "", label: "Select team" },
      current_mining_team: [],
      closePanel: false,
      sucessMes: "",
      isAttackLoading: false,
      landObjProps: false,
      intervalId: 0,
      currentCount: 0,
      miningteamDetailLoading: false,
      coinDetail: [],
      contract_address: [],
    };
  }
  componentDidMount() {
    this.props.loadBg("mining");
    this.setState(
      {
        dataLoading: true,
        landObjProps: true,
      },
      () => {
        this.getCoinDetails();
        this.fetchMiningList();
        this.characterList();
        this.craftList();
        this.artList();
        this.landList();
      }
    );
  }
  getCoinDetails = () => {
    const { AssetStore, AuthStore } = this.props;
    AssetStore.getCoinDetails(AuthStore.token).then((res) => {
      if (res.data) {
        this.setState({
          coinDetail: res.data,
        });
      }
    });
  };
  landPageDetails = () => {
    let { landObjProps, coinDetail, contract_address } = this.state;
    let { MiningStore } = this.props;
    let nfts = MiningStore.nfts.length !== 0 && JSON.parse(MiningStore.nfts);
    if (landObjProps && this.props.location.landData) {
      let { miningPayload, miningobj, land } = this.state;
      let landObj = this.props.history.location.landData.landObj;
      nfts &&
        nfts.length !== 0 &&
        nfts.forEach((obj) => {
          if (
            obj.contract_address ===
            this.props.history.location.landData.landObj.contract_address
          ) {
            landObj.table_name = obj.mongo_table;
          }
        });
      let token_name = "CGC";
      if (landObj.related_nft_contract) {
        coinDetail.map((newObj) => {
          if (
            contract_address.some((i) =>
              i.contract_address.includes(newObj.contract_address)
            ) === false
          ) {
            if (newObj.contract_address === landObj.related_nft_contract) {
              contract_address.push(newObj);
              token_name = newObj.token_name;
              this.setState({
                contract_address,
              });
            }
          }
        });
      }
      let assetDetails = {};

      land &&
        land.forEach((obj) => {
          if (obj.table_name === landObj.table_name) {
            assetDetails = obj.items;
          }
        });

      let lands = {
        id: landObj.token_id ? landObj.token_id : landObj.assetId,
        isPublic: true,
        owner_changed: false,
        table_name: landObj.table_name,
      };
      miningPayload.land = lands;
      miningobj.land = landObj;
      miningPayload.token_name = token_name;
      miningobj.token_name = token_name;
      if (landObj.table_name === "decentraland_estate") {
        let dis = null;
        landObj.parcels.forEach((parcel) => {
          if (dis === null || dis > parcel.distance) {
            dis = parcel.distance;
          }
        });
        miningPayload.distance = dis;
        miningobj.distance = dis;
      } else {
        miningPayload.distance = landObj.distance;
        miningobj.distance = landObj.distance;
      }
      this.setState(
        {
          ...(miningPayload && { miningPayload }),
          ...(miningobj && { miningobj }),
          selectTable: "land",
          selectLand_TableName: landObj.table_name,
          selectedValue: {
            value: landObj.table_name,
            label: `${landObj.table_name} (${assetDetails.data.length})`,
            // label: `${landObj.table_name} `,
            item: assetDetails,
          },
          // dataLoading: false,
          next_page_url: assetDetails.next_page_url,
          page: assetDetails.current_page,
          pageCount: assetDetails.last_page,
        },
        () => {}
      );
      this.selectLandDetails();
    } else {
      this.setState({
        dataLoading: false,
      });
    }
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
  fetchMiningList = () => {
    const { MiningStore, AuthStore } = this.props;
    this.setState({
      closePanel: false,
    });
    MiningStore.getMiningList(AuthStore.token).then((res) => {
      if (res.participating) {
        var intervalId = setInterval(this.timer, 1000);

        this.setState({
          participating: res.participating,
          earn_capacity: res.earn_capacity,
          miningTime: res.ago,
          intervalId: intervalId,
          owner_changed: res.owner_changed,
          miningTeamDetails: res.mining_team,
          current_mining_team: res.current_mining_team,
          miningteamDetailLoading: false,
        });
      }
      if (res.total_team_list) {
        let team = res.total_team_list;
        team.forEach((obj, key) => {
          obj.value = obj._id;
          obj.label = `Team ${key + 1}`;
        });
        this.setState({
          teamSelectOption: team,
        });
      }
      // if (res.tokens === undefined && res.participating === undefined) {
      //   this.setState({
      //     assetTitle: "Assets are not available for mining...",
      //     dataLoading: false,
      //   });
      // }
    });
  };
  componentWillUnmount = () => {
    // use intervalId from the state to clear the interval
    clearInterval(this.state.intervalId);
  };
  timer = () => {
    // setState method is used to update the state

    let { current_mining_team } = this.state;

    let startDate = moment.utc(current_mining_team.mining_start_date).format();
    let newDate = moment.utc(new Date()).format();
    let diffDuration = moment.duration(moment(newDate).diff(moment(startDate)));

    let hours = diffDuration.hours().toString();

    let min = diffDuration.minutes().toString();
    let sec = diffDuration.seconds().toString();

    // console.log("=============================");
    console.log(hours);
    console.log(min.length < 2 ? `0${min}` : min);
    let displaysec = sec.startsWith("-") ? sec.replace("-", "") : sec;
    console.log(displaysec);
    // console.log("=============================");

    // let time = `${hours}:${min}:${sec}`;

    let time =
      // ? `Days: ${diffDuration.days()}, arrival Time: ${time} -${displayHours}:${displayMin}:${displaySec}`
      // :
      `${hours.length < 2 ? `0${hours}` : hours}:${
        min.length < 2 ? `0${min}` : min
      }:${sec.length < 2 ? `0${sec}` : sec}`;

    this.setState({
      currentCount: `Days: ${diffDuration.days()}, Time: ${time}`,
    });
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
        page: assetDetails.items.current_page,
        pageCount: assetDetails.items.last_page,
        selectLand_TableName: assetDetails.table_name,
      });
    }
  };
  miningTeam = (e, obj, key) => {
    e.preventDefault();

    let {
      miningPayload,
      selectLand_TableName,
      miningobj,
      selectAssets_TableName,
      selectCraft_TableName,
      selectArt_TableName,
      contract_address,
      coinDetail,
    } = this.state;

    if (key === "characterAssets") {
      if (obj.contract_address) {
        coinDetail.map((newObj) => {
          if (
            contract_address.some((i) =>
              i.contract_address.includes(newObj.contract_address)
            ) === false
          ) {
            if (newObj.contract_address === obj.contract_address) {
              contract_address.push(newObj);
              this.setState({
                contract_address,
              });
            }
          }
        });
      }
      let character_avatar = {
        id: obj.token_id ? obj.token_id : obj.assetId,
        hashrate: obj.hashrate,
        capacity: obj.capacity,
        table_name: selectAssets_TableName,
        owner_changed: false,
        name: obj.name,
        image: obj.image_thumbnail_url,
      };
      miningPayload.character_avatar = character_avatar;
      miningobj.character_avatar = obj;
      this.setState({
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
      });
    }
    if (key === "craft") {
      if (obj.contract_address) {
        coinDetail.map((newObj) => {
          if (
            contract_address.some((i) =>
              i.contract_address.includes(newObj.contract_address)
            ) === false
          ) {
            if (newObj.contract_address === obj.contract_address) {
              contract_address.push(newObj);
              this.setState({
                contract_address,
              });
            }
          }
        });
      }
      let craft = {
        id: obj.token_id ? obj.token_id : obj.assetId,
        hashrate: obj.hashrate,
        capacity: obj.capacity,
        owner_changed: false,
        table_name: selectCraft_TableName,
        name: obj.name,
        image: obj.image_thumbnail_url,
      };
      miningPayload.craft = craft;
      miningobj.craft = obj;
      this.setState({
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
      });
    }
    if (key === "symbolics_Art") {
      if (obj.contract_address) {
        coinDetail.map((newObj) => {
          if (
            contract_address.some((i) =>
              i.contract_address.includes(newObj.contract_address)
            ) === false
          ) {
            if (newObj.contract_address === obj.contract_address) {
              contract_address.push(newObj);
              this.setState({
                contract_address,
              });
            }
          }
        });
      }

      let symbolics_Art = {
        id: obj.token_id ? obj.token_id : obj.assetId,
        hashrate: obj.hashrate,
        luck: obj.luck,
        owner_changed: false,
        table_name: selectArt_TableName,
        name: obj.name,
        image: obj.image_thumbnail_url,
      };
      miningPayload.symbolics_Art = symbolics_Art;
      miningobj.symbolics_Art = obj;
      this.setState({
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
      });
    }
    if (key === "land") {
      let token_name = "CGC";
      if (obj.related_nft_contract) {
        coinDetail.map((newObj) => {
          if (
            contract_address.some((i) =>
              i.contract_address.includes(newObj.contract_address)
            ) === false
          ) {
            if (newObj.contract_address === obj.related_nft_contract) {
              contract_address.push(newObj);
              token_name = newObj.token_name;
              this.setState({
                contract_address,
              });
            }
          }
        });
      }
      let land = {
        id: obj.token_id ? obj.token_id : obj.assetId,
        isPublic: true,
        owner_changed: false,
        table_name: selectLand_TableName,
        name: obj.name,
        image: obj.image_thumbnail_url,
      };
      miningPayload.land = land;
      miningPayload.token_name = token_name;
      miningobj.land = obj;
      miningobj.token_name = token_name;
      if (selectLand_TableName === "decentraland_estate") {
        let dis = null;
        obj.parcels.forEach((parcel) => {
          if (dis === null || dis > parcel.distance) {
            dis = parcel.distance;
          }
        });
        miningPayload.distance = dis;
        miningobj.distance = dis;
      } else {
        miningPayload.distance = obj.distance;
        miningobj.distance = obj.distance;
      }
      // miningPayload.distance = obj.distance;
      // miningobj.distance = obj.distance;
      this.setState({
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
      });
    }
  };
  ContinueMining = () => {
    let { selectedTeam } = this.state;
    const { MiningStore, AuthStore } = this.props;
    this.setState({
      isLoading: true,
      // dataLoading: true,
      miningteamDetailLoading: true,
    });
    let payload = {
      id: selectedTeam.value,
    };
    MiningStore.startTeamMining(payload, AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          alertmess: res.msg,
          alert: true,
          isLoading: false,
          dataLoading: false,
          miningteamDetailLoading: false,
        });
      }
      if (res.data) {
        this.setState(
          {
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
            participating: true,
            earn_capacity: res.data.earn_capacity,
            page: 1,
            miningTime: "",
            owner_changed: false,
            isLoading: false,
            isStopMining: false,
            selectedValue: { value: "", label: "Selec assets" },
            assetLoading: false,
            options: [],
            selectTable: "",
            selectShortValue: { value: 1, label: "asc" },
            selectedTeam: { value: "", label: "Select team" },
            sucessMes: "",
            isAttackLoading: false,
            landObjProps: false,
          },
          () => {
            this.fetchMiningList();
          }
        );
        // this.resetState();
      }
    });
  };
  CreateTeam = () => {
    let { miningPayload } = this.state;
    const { MiningStore, AuthStore } = this.props;
    this.setState({
      isLoading: true,
      // dataLoading: true,
    });
    let payload = miningPayload;
    // payload = payload.token_name = "CGC";

    MiningStore.createTeam(payload, AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          alertmess: res.msg,
          alert: true,
          isLoading: false,
          // dataLoading: false,
        });
      } else {
        this.setState(
          {
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
            miningTime: "",
            owner_changed: false,
            isLoading: false,
            isStopMining: false,
            selectedValue: { value: "", label: "Selec assets" },
            miningTeamDetails: [],
            assetLoading: false,
            options: [],
            selectTable: "",
            selectShortValue: { value: 1, label: "asc" },
            sucessMes: "",
            isAttackLoading: false,
            landObjProps: false,
          },
          () => {
            this.fetchMiningList();
          }
        );
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
        pageCount: 0,
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
        miningTime: "",
        owner_changed: false,
        isLoading: false,
        isStopMining: false,
        selectedValue: { value: "", label: "Selec assets" },
        miningTeamDetails: [],
        assetLoading: false,
        options: [],
        selectTable: "",
        selectShortValue: { value: 1, label: "asc" },
        teamSelectOption: [],
        selectedTeam: { value: "", label: "Select team" },
        current_mining_team: [],
        sucessMes: "",
        isAttackLoading: false,
        landObjProps: false,
        coinDetail: [],
      },
      () => {
        this.fetchMiningList();
        this.characterList();
        this.craftList();
        this.landList();
        this.artList();
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
        selectTable: "character_avatar",
      });
    } else {
      let { characterAssets, miningPayload } = this.state;

      this.setState({
        assetLoading: false,
      });
      let options = [];
      characterAssets &&
        characterAssets.map((obj) => {
          if (miningPayload && miningPayload.character_avatar !== undefined) {
            if (miningPayload.character_avatar.table_name === obj.table_name) {
              this.setState({
                selectedValue: {
                  value: obj.table_name,
                  label: `${obj.table_name} (${obj.items.length})`,
                  item: obj.items,
                },
                assetDetails: obj.items,
              });
            }
          } else {
            this.setState({
              selectedValue: { value: "", label: "Select assets" },
            });
          }
          let newObj = {
            value: obj.table_name,
            label: `${obj.table_name} (${obj.items.length})`,
            item: obj.items,
          };
          options.push(newObj);
          this.setState({
            selectTable: "character_avatar",
            options: options,
            selectAssets:
              //  false,
              miningPayload && miningPayload.character_avatar !== undefined
                ? true
                : false,
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
        selectTable: "craft",
        options: [],
      });
    } else {
      let { craft, miningPayload } = this.state;

      this.setState({
        assetLoading: false,
      });
      let options = [];
      craft.map((obj) => {
        if (miningPayload && miningPayload.craft !== undefined) {
          if (miningPayload.craft.table_name === obj.table_name) {
            this.setState({
              selectedValue: {
                value: obj.table_name,
                label: `${obj.table_name} (${obj.items.length})`,
                item: obj.items,
              },
              craftDetails: obj.items,
            });
          }
        } else {
          this.setState({
            selectedValue: { value: "", label: "Select assets" },
          });
        }
        let newObj = {
          value: obj.table_name,
          label: `${obj.table_name} (${obj.items.length})`,
          item: obj.items,
        };
        options.push(newObj);
        this.setState({
          selectTable: "craft",
          options: options,
          selectCraft:
            // false,
            miningPayload && miningPayload.craft !== undefined ? true : false,
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
        selectTable: "land",
        assetLoading: false,
      });
    } else {
      let { land, miningPayload } = this.state;

      this.setState({
        assetLoading: false,
      });
      let options = [];
      land.map((obj) => {
        if (miningPayload && miningPayload.land !== undefined) {
          if (miningPayload.land.table_name === obj.table_name) {
            this.setState({
              selectedValue: {
                value: obj.table_name,
                label: `${obj.table_name} (${obj.items.data.length})`,
                item: obj.items,
              },
              landDetails: obj.items.data,
            });
          }
        } else {
          this.setState({
            selectedValue: { value: "", label: "Select assets" },
          });
        }
        let newObj = {
          value: obj.table_name,
          label: `${obj.table_name} (${obj.items.data.length})`,
          item: obj.items.data,
        };
        options.push(newObj);
        this.setState({
          selectTable: "land",
          options: options,
          selectLand:
            // false,
            miningPayload && miningPayload.land !== undefined ? true : false,
          assetLoading: false,
          dataLoading: false,
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
        selectTable: "art",
        selectedValue: { value: "", label: "Select assets" },
        options: [],
      });
    } else {
      let options = [];
      this.setState({
        assetLoading: false,
      });
      let { symbolics_Art, miningPayload } = this.state;

      symbolics_Art.map((obj) => {
        if (miningPayload && miningPayload.symbolics_Art !== undefined) {
          if (miningPayload.symbolics_Art.table_name === obj.table_name) {
            this.setState({
              selectedValue: {
                value: obj.table_name,
                label: `${obj.table_name} (${obj.items.length})`,
                item: obj.items,
              },
              artDetails: obj.items,
            });
          }
        } else {
          this.setState({
            selectedValue: { value: "", label: "Select assets" },
          });
        }
        let newObj = {
          value: obj.table_name,
          label: `${obj.table_name} (${obj.items.length})`,
          item: obj.items,
        };
        options.push(newObj);
        this.setState({
          selectTable: "art",
          options: options,
          selectArt:
            //  false,
            miningPayload && miningPayload.symbolics_Art !== undefined
              ? true
              : false,
        });
      });
    }
  };
  selectTable = (table_name) => {
    let { characterAssets, craft, land, symbolics_Art } = this.state;

    if (table_name === "character_avatar") {
      if (characterAssets.length === 0) {
        this.selectAssetDetails("address");
      } else {
        this.selectAssetDetails("");
      }
    }
    if (table_name === "craft") {
      if (craft.length === 0) {
        this.selectCraftDetails("address");
      } else {
        this.selectCraftDetails("");
      }
    }
    if (table_name === "land") {
      if (land.length === 0) {
        this.selectLandDetails("address");
      } else {
        this.selectLandDetails("");
      }
    }
    if (table_name === "art") {
      if (symbolics_Art.length === 0) {
        this.selectArtDetails("address");
      } else {
        this.selectArtDetails("");
      }
    }
  };
  characterList = () => {
    let { MiningStore, AuthStore } = this.props;

    let payload = { type: "character_avatar" };
    MiningStore.miningLists(payload, AuthStore.token).then((res) => {
      if (res.tokens) {
        for (var i = 0; i < Object.keys(res.tokens).length; i++) {
          var key = Object.keys(res.tokens)[i];
          var tk_array = res.tokens[key];

          this.setState({
            characterAssets: tk_array.character_avatar,
            assetLoading: false,
          });
        }
      }
    });
  };
  craftList = () => {
    let { MiningStore, AuthStore } = this.props;

    let payload = { type: "craft" };
    MiningStore.miningLists(payload, AuthStore.token).then((res) => {
      if (res.tokens) {
        for (var i = 0; i < Object.keys(res.tokens).length; i++) {
          var key = Object.keys(res.tokens)[i];
          var tk_array = res.tokens[key];

          this.setState({
            craft: tk_array.craft,
            assetLoading: false,
          });
        }
      }
    });
  };
  landList = () => {
    let { MiningStore, AuthStore } = this.props;

    let { page, selectShortValue } = this.state;
    let payload = { type: "land", sort: selectShortValue.value };
    MiningStore.miningLists(payload, AuthStore.token, page).then((res) => {
      if (res.tokens) {
        for (var i = 0; i < Object.keys(res.tokens).length; i++) {
          var key = Object.keys(res.tokens)[i];
          var tk_array = res.tokens[key];

          this.setState(
            {
              land: tk_array.land,
              assetLoading: false,
            },
            () => {
              this.landPageDetails();
            }
          );
        }
      }
    });
  };
  artList = () => {
    let { MiningStore, AuthStore } = this.props;

    let payload = { type: "symbolics_Art" };
    MiningStore.miningLists(payload, AuthStore.token).then((res) => {
      if (res.tokens) {
        for (var i = 0; i < Object.keys(res.tokens).length; i++) {
          var key = Object.keys(res.tokens)[i];
          var tk_array = res.tokens[key];

          this.setState({
            symbolics_Art: tk_array.symbolics_Art,
            assetLoading: false,
          });
        }
      }
    });
  };
  StopMining = (e) => {
    this.setState({
      isStopMining: true,
      // dataLoading: true,
    });
    const { MiningStore, AuthStore } = this.props;
    MiningStore.stopMining(AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          alertmess: res.msg,
          alert: true,
          isStopMining: false,
          // dataLoading: false,
        });
      } else {
        this.setState({
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
          miningTime: "",
          owner_changed: false,
          isLoading: false,
          isStopMining: false,
          selectedValue: { value: "", label: "Selec assets" },
          miningTeamDetails: [],
          assetLoading: false,
          options: [],
          selectTable: "",
          selectShortValue: { value: 1, label: "asc" },
          selectedTeam: { value: "", label: "Select team" },
          current_mining_team: [],
          sucessMes: "",
          isAttackLoading: false,
          landObjProps: false,
        });
      }
    });
  };
  back = (obj) => {
    let { miningPayload, miningobj, contract_address } = this.state;

    if (obj === "character_avatar") {
      if (
        miningobj.land &&
        miningobj.land.related_nft_contract &&
        miningobj.character_avatar.contract_address ===
          miningobj.land.related_nft_contract
      ) {
        contract_address.splice(
          contract_address.findIndex(
            ({ contract_address }) =>
              contract_address == miningobj.land.related_nft_contract
          ),
          1
        );

        delete miningPayload["land"];
        delete miningobj["land"];
        delete miningPayload[obj];
        delete miningobj[obj];
        this.setState({
          contract_address,
        });
      }
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
      if (
        miningobj.land &&
        miningobj.land.related_nft_contract &&
        miningobj.craft.contract_address === miningobj.land.related_nft_contract
      ) {
        contract_address.splice(
          contract_address.findIndex(
            ({ contract_address }) =>
              contract_address == miningobj.land.related_nft_contract
          ),
          1
        );
        this.setState({
          ...(contract_address && { contract_address }),
        });
        delete miningPayload["land"];
        delete miningobj["land"];
        delete miningPayload[obj];
        delete miningobj[obj];
      }
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
      if (
        miningobj.land &&
        miningobj.land.related_nft_contract &&
        miningobj.symbolics_Art.contract_address ===
          miningobj.land.related_nft_contract
      ) {
        contract_address.splice(
          contract_address.findIndex(
            ({ contract_address }) =>
              contract_address == miningobj.land.related_nft_contract
          ),
          1
        );
        this.setState({
          ...(contract_address && { contract_address }),
        });
        delete miningPayload["land"];
        delete miningobj["land"];
        delete miningPayload[obj];
        delete miningobj[obj];
      }
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
        pageCount: 0,
        selectLand: false,
        ...(miningPayload && { miningPayload }),
        ...(miningobj && { miningobj }),
        selectedValue: { value: "", label: "Select assets" },
        page: 1,
      });
    }
  };
  selectOption = (selectedOption) => {
    let { selectTable } = this.state;

    if (selectTable === "character_avatar") {
      this.setState({
        assetDetails: selectedOption.item,
        selectedValue: selectedOption,
        selectAssets_TableName: selectedOption.value,
        selectAssets: true,
      });
    }
    if (selectTable === "craft") {
      this.setState({
        selectedValue: selectedOption,
        craftDetails: selectedOption.item,
        selectCraft_TableName: selectedOption.value,
        selectCraft: true,
      });
    }
    if (selectTable === "art") {
      this.setState({
        selectedValue: selectedOption,
        artDetails: selectedOption.item,
        selectArt_TableName: selectedOption.value,
        selectArt: true,
      });
    }
    if (selectTable === "land") {
      this.setState(
        {
          selectedValue: selectedOption,
          // landDetails: selectedOption.item,
          selectLand_TableName: selectedOption.value,
          selectLand: true,
          resetPagination: true,
        },
        () => {
          this.onPageChange({ selected: 0 });
        }
      );
    }
  };
  onPageChange = (e) => {
    let { MiningStore, AuthStore } = this.props;
    let { selectShortValue } = this.state;
    this.setState(
      {
        page: e.selected + 1,
        isLandLoading: true,
      },
      () => {
        let { page } = this.state;
        let payload = { type: "land", sort: selectShortValue.value };
        let options = [];
        MiningStore.miningLists(payload, AuthStore.token, page).then((res) => {
          this.setState({
            isLandLoading: false,
          });
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
                    resetPagination: false,
                  });

                  if (this.state.selectedValue.value === obj.table_name) {
                    this.setState({
                      landDetails: obj.items.data,
                      next_page_url: obj.items.next_page_url,
                      page: obj.items.current_page,
                      pageCount: obj.items.last_page,
                    });
                  }
                });

                // this.setState({
                //   landDetails: land.items.data,
                //   next_page_url: land.items.next_page_url,
                // });
              }
            );
          }
        });
      }
    );
  };
  selectshortOption = (selectedOption) => {
    let { selectTable, selectLand_TableName } = this.state;

    if (selectTable === "land" && selectLand_TableName !== "") {
      this.setState(
        {
          selectShortValue: selectedOption,
          selectLand: true,
          resetPagination: true,
        },
        () => {
          this.onPageChange({ selected: 0 });
        }
      );
    }
    if (selectTable === "land" && selectLand_TableName === "") {
      this.setState(
        {
          page: 1,
          assetLoading: true,
          selectShortValue: selectedOption,
        },
        () => {
          this.landList();
        }
      );
    }
  };
  selectTeam = (selectedOption) => {
    this.setState({
      selectedTeam: selectedOption,
    });
  };
  attack = (obj) => {
    this.setState({
      isAttackLoading: true,
      sucessMes: "",
    });
    let { current_mining_team } = this.state;

    let payload = {
      attacker_id: current_mining_team._id,
      defender_id: obj,
    };

    const { MiningStore, AuthStore } = this.props;

    MiningStore.attack(payload, AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          alertmess: res.msg,
          alert: true,
          isAttackLoading: false,
        });
        setTimeout(() => {
          this.setState({
            alertmess: "",
            alert: false,
          });
        }, 2000);
      } else {
        this.setState({
          closePanel: true,
          sucessMes: res.msg,
          isAttackLoading: false,
        });
        setTimeout(() => {
          this.setState({
            sucessMes: "",
          });
        }, 2000);
      }
    });
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
      // next_page_url,
      page,
      pageCount,
      craftDetails,
      assetDetails,
      artDetails,
      miningPayload,
      miningobj,
      selectTable,
      participating,
      earn_capacity,
      assetTitle,
      // miningTime,
      owner_changed,
      isLoading,
      isStopMining,
      isAttackLoading,
      options,
      selectedValue,
      miningTeamDetails,
      assetLoading,
      resetPagination,
      selectShortValue,
      shortingOptions,
      teamSelectOption,
      selectedTeam,
      closePanel,
      sucessMes,
      miningteamDetailLoading,
      coinDetail,
      contract_address,
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
              {!participating && (
                // (miningPayload.character_avatar === undefined ||
                //   miningPayload.craft === undefined ||
                //   miningPayload.symbolics_Art === undefined ||
                //   miningPayload.land === undefined) &&
                <Title>Select your team to start mining..</Title>
              )}
            </Mining>
            {!participating &&
              teamSelectOption &&
              teamSelectOption.length !== 0 && (
                <>
                  <MiningSearch>
                    <Select
                      value={selectedTeam}
                      placeholder={"Select team"}
                      handleChange={this.selectTeam}
                      options={teamSelectOption}
                      border={`2px solid #8c14cf`}
                      color={"#fff"}
                    />
                  </MiningSearch>
                  {!participating && selectedTeam.value !== "" && (
                    <div>
                      <ImageSection>
                        <TeamImageDiv
                          data-mdb-toggle="tooltip"
                          data-mdb-placement="top"
                          title={selectedTeam.character_avatar.name}
                        >
                          <img
                            src={selectedTeam.character_avatar.image}
                            alt=""
                          />
                        </TeamImageDiv>
                        <TeamImageDiv
                          data-mdb-toggle="tooltip"
                          data-mdb-placement="top"
                          title={selectedTeam.craft.name}
                        >
                          <img src={selectedTeam.craft.image} alt="" />
                        </TeamImageDiv>
                        <TeamImageDiv
                          data-mdb-toggle="tooltip"
                          data-mdb-placement="top"
                          title={selectedTeam.symbolics_Art.name}
                        >
                          <img src={selectedTeam.symbolics_Art.image} alt="" />
                        </TeamImageDiv>
                        <TeamImageDiv
                          data-mdb-toggle="tooltip"
                          data-mdb-placement="top"
                          title={selectedTeam.land.name}
                        >
                          <img src={selectedTeam.land.image} alt="" />
                        </TeamImageDiv>
                      </ImageSection>
                      <ButtonSection>
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
                            "Start Mining"
                          )}
                        </Button>
                      </ButtonSection>
                    </div>
                  )}
                </>
              )}
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

            {
              // !participating &&
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
            }

            {selectTable === "land" && (
              <MiningSearch>
                <Select
                  value={selectShortValue}
                  placeholder={"Resource shorting"}
                  handleChange={this.selectshortOption}
                  options={shortingOptions}
                  border={`2px solid #8c14cf`}
                  color={`${variable.whiteColor}`}
                />
              </MiningSearch>
            )}

            <Mining>
              <LeftSection>
                {assetLoading && <Loader />}

                {selectTable === "character_avatar" && !assetLoading && (
                  <Section>
                    <div>CharacterAssets</div>

                    {!selectAssets ? (
                      characterAssets && characterAssets.length !== 0 ? (
                        <AssetDetails
                          assets={characterAssets}
                          selectTable={"characterAssets"}
                          openAsset={this.openAsset}
                          checkImageExists={this.checkImageExists}
                        />
                      ) : (
                        !participating && (
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
                      )
                    ) : (
                      assetDetails &&
                      assetDetails.length !== 0 &&
                      assetDetails.map((obj, key) => {
                        let allreadyUse = false;
                        let name = "";
                        teamSelectOption &&
                          teamSelectOption.length !== 0 &&
                          teamSelectOption.map((subObj, key) => {
                            if (obj.assetId === subObj.character_avatar.id) {
                              allreadyUse = true;
                            }
                            return allreadyUse;
                          });
                        if (allreadyUse) {
                          name = "Already used in team";
                        }
                        return (
                          <MainSection
                            key={key}
                            active={
                              miningPayload.character_avatar !== undefined &&
                              obj.assetId === miningPayload.character_avatar.id
                                ? true
                                : false
                            }
                          >
                            <SubSection
                              key={key}
                              onClick={
                                name === ""
                                  ? (e) =>
                                      this.miningTeam(e, obj, "characterAssets")
                                  : null
                              }
                            >
                              <ImageDiv>
                                <img src={obj.image_preview_url} alt="" />
                              </ImageDiv>
                              <Description>
                                {obj.name ? obj.name : "-"}
                              </Description>

                              {name === "" ? (
                                <Description blank></Description>
                              ) : (
                                <Description dark>
                                  Already used in team
                                </Description>
                              )}
                            </SubSection>
                          </MainSection>
                        );
                      })
                    )}
                  </Section>
                )}
                {selectTable === "craft" && !assetLoading && (
                  <Section>
                    <div>Craft</div>
                    {!selectCraft ? (
                      craft && craft.length !== 0 ? (
                        <AssetDetails
                          assets={craft}
                          selectTable={"craft"}
                          openAsset={this.openAsset}
                          checkImageExists={this.checkImageExists}
                        />
                      ) : (
                        !participating && (
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
                      )
                    ) : (
                      craftDetails &&
                      craftDetails.length !== 0 &&
                      craftDetails.map((obj, key) => {
                        let allreadyUse = false;
                        let name = "";
                        teamSelectOption &&
                          teamSelectOption.length !== 0 &&
                          teamSelectOption.map((subObj, key) => {
                            if (obj.assetId === subObj.craft.id) {
                              allreadyUse = true;
                            }
                            return allreadyUse;
                          });
                        if (allreadyUse) {
                          name = "Already used in team";
                        }
                        return (
                          <MainSection
                            key={key}
                            active={
                              miningPayload.craft !== undefined &&
                              obj.assetId === miningPayload.craft.id
                                ? true
                                : false
                            }
                          >
                            <SubSection
                              key={key}
                              onClick={
                                name === ""
                                  ? (e) => this.miningTeam(e, obj, "craft")
                                  : null
                              }
                            >
                              <ImageDiv>
                                <img src={obj.image_preview_url} alt="" />
                              </ImageDiv>
                              <Description>
                                {obj.name ? obj.name : "-"}
                              </Description>

                              {name === "" ? (
                                <Description blank></Description>
                              ) : (
                                <Description dark>
                                  Already used in team
                                </Description>
                              )}
                            </SubSection>
                          </MainSection>
                        );
                      })
                    )}
                  </Section>
                )}
                {selectTable === "art" && !assetLoading && (
                  <Section>
                    <div> Symbolics Art</div>
                    {!selectArt ? (
                      symbolics_Art && symbolics_Art.length !== 0 ? (
                        <AssetDetails
                          assets={symbolics_Art}
                          selectTable={"symbolics_Art"}
                          openAsset={this.openAsset}
                          checkImageExists={this.checkImageExists}
                        />
                      ) : (
                        !participating && (
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
                      )
                    ) : (
                      artDetails &&
                      artDetails.length !== 0 &&
                      artDetails.map((obj, key) => {
                        let allreadyUse = false;
                        let name = "";
                        teamSelectOption &&
                          teamSelectOption.length !== 0 &&
                          teamSelectOption.map((subObj, key) => {
                            if (obj.assetId === subObj.symbolics_Art.id) {
                              allreadyUse = true;
                            }
                            return allreadyUse;
                          });
                        if (allreadyUse) {
                          name = "Already used in team";
                        }
                        return (
                          <MainSection
                            key={key}
                            active={
                              miningPayload.symbolics_Art !== undefined &&
                              obj.assetId === miningPayload.symbolics_Art.id
                                ? true
                                : false
                            }
                          >
                            <SubSection
                              key={key}
                              onClick={
                                name === ""
                                  ? (e) =>
                                      this.miningTeam(e, obj, "symbolics_Art")
                                  : null
                              }
                            >
                              <ImageDiv>
                                <img src={obj.image_preview_url} alt="" />
                              </ImageDiv>
                              <Description>
                                {obj.name ? obj.name : "-"}
                              </Description>

                              {name === "" ? (
                                <Description blank></Description>
                              ) : (
                                <Description dark>
                                  Already used in team
                                </Description>
                              )}
                            </SubSection>
                          </MainSection>
                        );
                      })
                    )}
                  </Section>
                )}
                {selectTable === "land" && !assetLoading && (
                  <Section>
                    <div>Land</div>

                    {!selectLand ? (
                      land && land.length !== 0 ? (
                        <AssetDetails
                          assets={land}
                          selectTable={"land"}
                          openAsset={this.openAsset}
                          checkImageExists={this.checkImageExists}
                        />
                      ) : (
                        !participating && (
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
                      )
                    ) : resetPagination ? (
                      <Loaderspinner
                        type="ThreeDots"
                        color="#fff"
                        width="80"
                        height="80"
                      />
                    ) : (
                      landDetails &&
                      landDetails.length !== 0 && (
                        <React.Fragment>
                          {landDetails.map((obj, key) => {
                            let token = {};
                            if (obj.related_nft_contract) {
                              token = coinDetail.find(
                                (o) =>
                                  o.contract_address ===
                                  obj.related_nft_contract
                              );
                            }

                            let allreadyUse = false;
                            let name = "";
                            teamSelectOption &&
                              teamSelectOption.length !== 0 &&
                              teamSelectOption.map((subObj, key) => {
                                if (obj.assetId === subObj.land.id) {
                                  allreadyUse = true;
                                }
                                return allreadyUse;
                              });
                            if (allreadyUse) {
                              name = "Already used in team";
                            }

                            return (
                              <MainSection
                                key={key}
                                active={
                                  miningPayload.land !== undefined &&
                                  obj.assetId === miningPayload.land.id
                                    ? true
                                    : false
                                }
                              >
                                <SubSection
                                  key={key}
                                  onClick={
                                    name === ""
                                      ? obj.related_nft_contract
                                        ? contract_address &&
                                          contract_address.length !== 0 &&
                                          contract_address.some((i) =>
                                            i.contract_address.includes(
                                              obj.related_nft_contract
                                            )
                                          )
                                          ? (e) =>
                                              this.miningTeam(e, obj, "land")
                                          : null
                                        : (e) => this.miningTeam(e, obj, "land")
                                      : null
                                  }
                                >
                                  <ImageDiv>
                                    <img src={obj.image_preview_url} alt="" />
                                  </ImageDiv>
                                  <Description>
                                    {obj.name ? obj.name : "-"}
                                  </Description>

                                  {name === "" ? (
                                    token && token.token_name ? (
                                      <Description dark>
                                        {token.token_name} token
                                      </Description>
                                    ) : (
                                      <Description blank></Description>
                                    )
                                  ) : (
                                    <Description dark>
                                      Already used in team
                                    </Description>
                                  )}
                                </SubSection>
                              </MainSection>
                            );
                          })}

                          {page <= pageCount && (
                            <ReactPagination
                              pageCount={pageCount}
                              onPageChange={(e) => this.onPageChange(e)}
                              // resetPagination={resetPagination}
                            />
                          )}
                        </React.Fragment>
                      )
                    )}
                  </Section>
                )}
                {/* {participating && <Title>Start mining: {miningTime}</Title>} */}
                {participating && (
                  <Title>
                    Total mining duration: {this.state.currentCount}
                  </Title>
                )}
                {participating && earn_capacity > 0 && (
                  <Title>Earn Capacity: {earn_capacity}</Title>
                )}
                {miningteamDetailLoading ? (
                  <Loaderspinner
                    type="Oval"
                    color="#fff"
                    width="25"
                    height="25"
                  />
                ) : (
                  participating &&
                  miningTeamDetails &&
                  miningTeamDetails.length !== 0 && (
                    <React.Fragment>
                      <Mining>
                        <Title SubTitle={true}>Mining Team Details</Title>
                      </Mining>

                      <MiningDetail
                        miningTeamDetails={miningTeamDetails}
                        dataLoading={miningteamDetailLoading}
                        attack={this.attack}
                        closePanel={closePanel}
                        sucessMes={sucessMes}
                        isAttackLoading={isAttackLoading}
                      />
                    </React.Fragment>
                  )
                )}
                {owner_changed && <Title>Your mining team distroyed....</Title>}
              </LeftSection>
              <RightSection>
                {miningPayload.character_avatar !== undefined &&
                  miningPayload.craft !== undefined &&
                  miningPayload.symbolics_Art !== undefined &&
                  miningPayload.land !== undefined && (
                    <SpaceingDiv>
                      <div>
                        <Button
                          theme="green"
                          onClick={(e) => this.CreateTeam(e)}
                        >
                          Create Team
                          {/* {isLoading ? (
                        <Loaderspinner
                          type="Oval"
                          color="#000"
                          width="18"
                          height="18"
                        />
                      ) : (
                        "Continue"
                      )} */}
                        </Button>
                      </div>
                    </SpaceingDiv>
                  )}
                {
                  // !participating &&

                  assetType.map((obj, key) => {
                    return (
                      <SpaceingDiv key={key}>
                        <SelectSection
                          active={selectTable === obj.type ? true : false}
                        >
                          <SubSection
                            onClick={() => this.selectTable(obj.type)}
                          >
                            <div>Select {obj.type}</div>
                          </SubSection>
                        </SelectSection>
                      </SpaceingDiv>
                    );
                  })
                }
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
const ImageSection = styled.div`
  display: flex;
`;
const TeamImageDiv = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  margin: 20px 10px;
  ${media.tablet`
  width: 100px;
  height: 100px;
`}
`;
const ButtonSection = styled.div`
  width: 90%;
  marginbottom: 20px;
  ${media.tablet`
  width: 30%;
  height: 100px;
`}
`;
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
  flex-direction: column-reverse;
  ${media.tablet`
    display: flex;
    width: 30%;
  `}
`;
const Mining = styled.div`
  display: grid;
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
  margin: auto;
`;
const LeftSection = styled.div`
  width: 100%;
  order: 2;
  ${media.tablet`
    width: 70%;
    order:unset;
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
  white-space: nowrap;
  width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  ${(props) => (props.dark ? `color:#43C1BF` : null)}
  ${(props) => (props.blank ? `padding:10px` : null)}
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
  margin: 10px;
  vertical-align: top;
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
