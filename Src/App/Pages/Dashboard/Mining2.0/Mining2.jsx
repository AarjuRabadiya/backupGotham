import React from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import styled from "styled-components";
import Loaderspinner from "react-loader-spinner";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import moment from "moment";
import GIF from "./running-char.gif";
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
  // { type: "land" },
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
      startMiningPayload: {},
      startMiningobj: {},
      alertmess: "",
      alert: "",
      assetTitle: "",
      participating: false,
      earn_capacity: 0,
      miningTime: "",
      isLoading: false,
      isCreateTeramLoading: false,
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
      sec: 0,
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
    let { landObjProps, coinDetail, contract_address, participating } =
      this.state;
    let { MiningStore } = this.props;
    let nfts = MiningStore.nfts.length !== 0 && JSON.parse(MiningStore.nfts);

    if (!participating && landObjProps && this.props.location.landData) {
      let {
        startMiningPayload,
        startMiningobj,
        // miningPayload,
        // miningobj,
        land,
      } = this.state;
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
        name: landObj.name,
        image: landObj.image_thumbnail_url,
      };
      startMiningPayload.land = lands;
      startMiningobj.land = landObj;
      startMiningPayload.token_name = token_name;
      startMiningobj.token_name = token_name;
      if (landObj.table_name === "decentraland_estate") {
        let dis = null;
        landObj.parcels.forEach((parcel) => {
          if (dis === null || dis > parcel.distance) {
            dis = parcel.distance;
          }
        });
        startMiningPayload.distance = dis;
        startMiningobj.distance = dis;
      } else {
        startMiningPayload.distance = landObj.distance;
        startMiningobj.distance = landObj.distance;
      }
      this.setState(
        {
          ...(startMiningPayload && { startMiningPayload }),
          ...(startMiningobj && { startMiningobj }),
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

    let hours = diffDuration.hours();
    let min = diffDuration.minutes();
    let sec = diffDuration.seconds();
    let days = diffDuration.days();

    let time = `${
      Math.abs(hours) <= 9 ? `0${Math.abs(hours)}` : Math.abs(hours)
    }:${Math.abs(min) <= 9 ? `0${Math.abs(min)}` : Math.abs(min)}:${
      Math.abs(sec) <= 9 ? `0${Math.abs(sec)}` : Math.abs(sec)
    }`;

    this.setState({
      currentCount: `${
        sec > 0 ? "Total mining duration " : "Arrival Time "
      } : Days: ${days}, Time: ${time}`,
      sec: sec,
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
      startMiningPayload,
      startMiningobj,
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
        contract_address: obj.contract_address,
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
        contract_address: obj.contract_address,
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
        contract_address: obj.contract_address,
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

      startMiningPayload.land = land;
      startMiningPayload.token_name = token_name;
      startMiningobj.land = obj;
      startMiningobj.token_name = token_name;
      if (selectLand_TableName === "decentraland_estate") {
        let dis = null;
        obj.parcels.forEach((parcel) => {
          if (dis === null || dis > parcel.distance) {
            dis = parcel.distance;
          }
        });
        startMiningPayload.distance = dis;
        startMiningobj.distance = dis;
      } else {
        startMiningPayload.distance = obj.distance;
        startMiningobj.distance = obj.distance;
      }
      // miningPayload.distance = obj.distance;
      // miningobj.distance = obj.distance;
      this.setState({
        ...(startMiningPayload && { startMiningPayload }),
        ...(startMiningobj && { startMiningobj }),
      });
    }
  };
  ContinueMining = () => {
    let { selectedTeam, startMiningPayload } = this.state;

    startMiningPayload.id = selectedTeam.value;
    const { MiningStore, AuthStore } = this.props;
    this.setState(
      {
        ...(startMiningPayload && { startMiningPayload }),
        isLoading: true,
        // dataLoading: true,
        miningteamDetailLoading: true,
      },
      () => {
        MiningStore.startTeamMining(startMiningPayload, AuthStore.token).then(
          (res) => {
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
                  sec: 0,
                },
                () => {
                  this.fetchMiningList();
                }
              );
              // this.resetState();
            }
          }
        );
      }
    );
  };
  CreateTeam = () => {
    let { miningPayload } = this.state;
    const { MiningStore, AuthStore } = this.props;
    this.setState({
      isCreateTeramLoading: true,
      // dataLoading: true,
    });
    let payload = miningPayload;
    // payload = payload.token_name = "CGC";

    MiningStore.createTeam(payload, AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          alertmess: res.msg,
          alert: true,
          isCreateTeramLoading: false,
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
            isCreateTeramLoading: false,
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
            sec: 0,
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
        isCreateTeramLoading: false,
        isStopMining: false,
        selectedValue: { value: "", label: "Selec assets" },
        miningTeamDetails: [],
        assetLoading: false,
        options: [],
        sec: 0,
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
      let {
        land,
        // miningPayload,
        startMiningPayload,
      } = this.state;

      this.setState({
        assetLoading: false,
      });
      let options = [];
      land.map((obj) => {
        if (startMiningPayload && startMiningPayload.land !== undefined) {
          if (startMiningPayload.land.table_name === obj.table_name) {
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
            startMiningPayload && startMiningPayload.land !== undefined
              ? true
              : false,
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
          isCreateTeramLoading: false,
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
          sec: 0,
        });
      }
    });
  };
  back = (obj) => {
    let { startMiningobj, startMiningPayload, contract_address } = this.state;

    if (obj === "character_avatar") {
      if (
        startMiningobj.land &&
        startMiningobj.land.related_nft_contract &&
        startMiningobj.character_avatar.contract_address ===
          startMiningobj.land.related_nft_contract
      ) {
        contract_address.splice(
          contract_address.findIndex(
            ({ contract_address }) =>
              contract_address == startMiningobj.land.related_nft_contract
          ),
          1
        );

        delete startMiningPayload["land"];
        delete startMiningobj["land"];
        delete startMiningPayload[obj];
        delete startMiningobj[obj];
        this.setState({
          contract_address,
        });
      }
      delete startMiningPayload[obj];
      delete startMiningobj[obj];
      this.setState({
        assetDetails: [],
        selectAssets: false,
        ...(startMiningPayload && { startMiningPayload }),
        ...(startMiningobj && { startMiningobj }),
        selectedValue: { value: "", label: "Select assets" },
      });
    }
    if (obj === "craft") {
      if (
        startMiningobj.land &&
        startMiningobj.land.related_nft_contract &&
        startMiningobj.craft.contract_address ===
          startMiningobj.land.related_nft_contract
      ) {
        contract_address.splice(
          contract_address.findIndex(
            ({ contract_address }) =>
              contract_address == startMiningobj.land.related_nft_contract
          ),
          1
        );
        this.setState({
          ...(contract_address && { contract_address }),
        });
        delete startMiningPayload["land"];
        delete startMiningobj["land"];
        delete startMiningPayload[obj];
        delete startMiningobj[obj];
      }
      delete startMiningPayload[obj];
      delete startMiningobj[obj];
      this.setState({
        ...(startMiningPayload && { startMiningPayload }),
        ...(startMiningobj && { startMiningobj }),
        craftDetails: [],
        selectCraft: false,
        selectedValue: { value: "", label: "Select assets" },
      });
    }
    if (obj === "symbolics_Art") {
      if (
        startMiningobj.land &&
        startMiningobj.land.related_nft_contract &&
        startMiningobj.symbolics_Art.contract_address ===
          startMiningobj.land.related_nft_contract
      ) {
        contract_address.splice(
          contract_address.findIndex(
            ({ contract_address }) =>
              contract_address == startMiningobj.land.related_nft_contract
          ),
          1
        );
        this.setState({
          ...(contract_address && { contract_address }),
        });
        delete startMiningPayload["land"];
        delete startMiningobj["land"];
        delete startMiningPayload[obj];
        delete startMiningobj[obj];
      }
      delete startMiningPayload[obj];
      delete startMiningobj[obj];
      this.setState({
        artDetails: [],
        ...(startMiningPayload && { startMiningPayload }),
        ...(startMiningobj && { startMiningobj }),
        selectArt: false,
        selectedValue: { value: "", label: "Select assets" },
      });
    }
    if (obj === "land") {
      delete startMiningPayload[obj];
      delete startMiningobj[obj];
      this.setState({
        landDetails: [],
        next_page_url: "",
        pageCount: 0,
        selectLand: false,
        ...(startMiningPayload && { startMiningPayload }),
        ...(startMiningobj && { startMiningobj }),
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
  changeCreateTeamState = (e) => {
    e.preventDefault();
    this.setState({
      selectTable: "",
      selectedTeam: { value: "", label: "Select team" },
    });
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
    this.setState(
      {
        contract_address: [],
      },
      () => {
        this.checkContract_address(selectedOption);
      }
    );
  };
  checkContract_address = (selectedOption) => {
    let { coinDetail, contract_address, startMiningobj } = this.state;
    this.setState({
      alert: false,
      alertmess: "",
      selectedTeam: { value: "", label: "Select team" },
    });
    if (selectedOption.character_avatar.contract_address) {
      coinDetail.map((newObj) => {
        if (
          contract_address.some((i) =>
            i.contract_address.includes(newObj.contract_address)
          ) === false
        ) {
          if (
            newObj.contract_address ===
            selectedOption.character_avatar.contract_address
          ) {
            contract_address.push(newObj);
            this.setState({
              contract_address,
            });
          }
        }
      });
    }
    if (selectedOption.craft.contract_address) {
      coinDetail.map((newObj) => {
        if (
          contract_address.some((i) =>
            i.contract_address.includes(newObj.contract_address)
          ) === false
        ) {
          if (
            newObj.contract_address === selectedOption.craft.contract_address
          ) {
            contract_address.push(newObj);
            this.setState({
              contract_address,
            });
          }
        }
      });
    }
    if (selectedOption.symbolics_Art.contract_address) {
      coinDetail.map((newObj) => {
        if (
          contract_address.some((i) =>
            i.contract_address.includes(newObj.contract_address)
          ) === false
        ) {
          if (
            newObj.contract_address ===
            selectedOption.symbolics_Art.contract_address
          ) {
            contract_address.push(newObj);
            this.setState({
              contract_address,
            });
          }
        }
      });
    }
    if (this.props.location.landData) {
      if (
        startMiningobj &&
        ((startMiningobj.land.related_nft_contract &&
          startMiningobj.land.related_nft_contract ===
            selectedOption.character_avatar.contract_address) ||
          (startMiningobj.land.related_nft_contract &&
            startMiningobj.land.related_nft_contract ===
              selectedOption.craft.contract_address) ||
          (startMiningobj.land.related_nft_contract &&
            startMiningobj.land.related_nft_contract ===
              selectedOption.symbolics_Art.contract_address))
      ) {
        this.setState(
          {
            selectedTeam: selectedOption,
          },
          () => {
            this.selectTable("land");
          }
        );
      } else {
        this.setState({
          selectedTeam: { value: "", label: "Select team" },
          alert: true,
          alertmess:
            "Selected land's token are not available in this team Please select another team.",
        });
      }
    } else {
      this.setState(
        {
          selectedTeam: selectedOption,
        },
        () => {
          this.selectTable("land");
        }
      );
    }
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
      startMiningPayload,
      isLandLoading,
      isCreateTeramLoading,
      sec,
      currentCount,
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
                  {(selectedTeam.value !== "" || selectTable === "land") && (
                    <ButtonSection>
                      <Button
                        theme="green"
                        onClick={(e) => this.changeCreateTeamState(e)}
                      >
                        Create team
                      </Button>
                    </ButtonSection>
                  )}
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
                        {startMiningPayload &&
                          startMiningPayload.land !== undefined && (
                            <TeamImageDiv
                              data-mdb-toggle="tooltip"
                              data-mdb-placement="top"
                              title={startMiningPayload.land.name}
                            >
                              <img src={startMiningPayload.land.image} alt="" />
                            </TeamImageDiv>
                          )}
                        {/* <TeamImageDiv
                          data-mdb-toggle="tooltip"
                          data-mdb-placement="top"
                          title={selectedTeam.land.name}
                        >
                          <img src={selectedTeam.land.image} alt="" />
                        </TeamImageDiv> */}
                      </ImageSection>
                      {startMiningPayload &&
                        startMiningPayload.land !== undefined && (
                          <ButtonSection>
                            <Button
                              theme="green"
                              onClick={
                                isLoading ? null : (e) => this.ContinueMining(e)
                              }
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
                        )}
                    </div>
                  )}
                </>
              )}
            <Mining style={{ marginBottom: "10px" }}>
              {selectTable !== "land" &&
                miningPayload &&
                miningPayload.character_avatar !== undefined && (
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
              {selectTable !== "land" &&
                miningPayload &&
                miningPayload.craft !== undefined && (
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
                      <BackDiv onClick={() => this.back("craft")}>
                        Remove
                      </BackDiv>
                    </SubSectionDiv>
                  </SelectedSection>
                )}
              {selectTable !== "land" &&
                miningPayload &&
                miningPayload.symbolics_Art !== undefined && (
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
              {/* {miningPayload && miningPayload.land !== undefined && (
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
              )} */}
            </Mining>

            {selectTable !== "" &&
              selectTable === "land" &&
              selectedTeam.value !== "" && (
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
              )}

            {selectTable === "land" && selectedTeam.value !== "" && (
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
                {selectTable === "land" &&
                  selectedTeam.value !== "" &&
                  !assetLoading && (
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
                                  if (
                                    subObj.land &&
                                    obj.assetId === subObj.land.id
                                  ) {
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
                                    startMiningPayload.land !== undefined &&
                                    obj.assetId === startMiningPayload.land.id
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
                                          : (e) =>
                                              this.miningTeam(e, obj, "land")
                                        : null
                                    }
                                  >
                                    <ImageDiv isLandLoading>
                                      {isLandLoading ? (
                                        <SkeletonTheme
                                          color={variable.Active}
                                          highlightColor={
                                            variable.CheckboxBorder
                                          }
                                        >
                                          <Skeleton count={1} height={200} />
                                        </SkeletonTheme>
                                      ) : (
                                        <img
                                          src={obj.image_preview_url}
                                          alt=""
                                        />
                                      )}
                                    </ImageDiv>
                                    <Description>
                                      {isLandLoading ? (
                                        <SkeletonTheme
                                          color={variable.Active}
                                          highlightColor={
                                            variable.CheckboxBorder
                                          }
                                        >
                                          <Skeleton count={1} height={40} />
                                        </SkeletonTheme>
                                      ) : obj.name ? (
                                        obj.name
                                      ) : (
                                        "-"
                                      )}
                                    </Description>

                                    {isLandLoading ? (
                                      <SkeletonTheme
                                        color={variable.Active}
                                        highlightColor={variable.CheckboxBorder}
                                      >
                                        <Skeleton count={1} height={40} />
                                      </SkeletonTheme>
                                    ) : name === "" ? (
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
                    {typeof currentCount === "string" && currentCount}
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
                {!miningteamDetailLoading && (
                  <>
                    {miningPayload.character_avatar !== undefined &&
                      miningPayload.craft !== undefined &&
                      miningPayload.symbolics_Art !== undefined &&
                      selectTable !== "land" && (
                        // miningPayload.land !== undefined &&
                        <SpaceingDiv>
                          <div>
                            <Button
                              theme="green"
                              onClick={
                                isCreateTeramLoading
                                  ? null
                                  : (e) => this.CreateTeam(e)
                              }
                            >
                              {isCreateTeramLoading ? (
                                <Loaderspinner
                                  type="Oval"
                                  color="#000"
                                  width="18"
                                  height="18"
                                />
                              ) : (
                                "Create Team"
                              )}
                            </Button>
                          </div>
                        </SpaceingDiv>
                      )}
                    {
                      // !participating &&
                      selectTable !== "land"
                        ? assetType.map((obj, key) => {
                            return (
                              <SpaceingDiv key={key}>
                                <SelectSection
                                  active={
                                    selectTable === obj.type ? true : false
                                  }
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
                        : selectedTeam.value !== "" && (
                            <SpaceingDiv>
                              <SelectSection
                                active={selectTable === "land" ? true : false}
                              >
                                <SubSection
                                  onClick={() => this.selectTable("land")}
                                >
                                  <div>Select land</div>
                                </SubSection>
                              </SelectSection>
                            </SpaceingDiv>
                          )
                    }
                    {participating && (
                      <SpaceingDiv>
                        <div>
                          <Button
                            theme="green"
                            onClick={
                              isStopMining || sec <= 0
                                ? null
                                : (e) => this.StopMining(e)
                            }
                            disabled={isStopMining || sec <= 0}
                          >
                            {isStopMining ? (
                              <Loaderspinner
                                type="Oval"
                                color="#000"
                                width="18"
                                height="18"
                              />
                            ) : sec <= 0 ? (
                              <GIFDiv>
                                <img src={GIF} alt="" />
                              </GIFDiv>
                            ) : (
                              "Stop Mining"
                            )}
                          </Button>
                        </div>
                      </SpaceingDiv>
                    )}
                  </>
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
//for display gif in button
const GIFDiv = styled.div`
  width: 50px;
  height: 50px;
  margin: auto;
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
  ${(props) => (props.isLandLoading ? `display: block` : null)}
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
