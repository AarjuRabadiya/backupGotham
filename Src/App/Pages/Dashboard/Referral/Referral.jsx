import React from "react";
import styled from "styled-components";
import { inject, observer } from "mobx-react";
import Loader from "react-loader-spinner";
import { withTranslation } from "react-i18next";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import Panel from "Components/Panel/Panel";
import Modal from "react-modal";
import Layout from "Components/Layout/Layout";
import ReactPagination from "Components/Pagination/Pagination";
import ReferralTable from "./ReferralTable";
import ReferralUserTable from "./ReferralUserTable";
import DataLoader from "Components/Loader/Loader";
import Select from "Components/Select/Select";
const customStyles = {
  overlay: {
    backgroundColor: "rgb(0 0 0 / 75%)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};
@inject("AuthStore", "MiningStore")
@observer
class Referral extends React.Component {
  constructor(props) {
    super();
    /**
     *
     * @type {{tokens: null}}
     */
    this.state = {
      tokens: null,
      referrer_code: null,
      sum: 0,
      searchListData: [],
      cloudminingPool: null,
      userPoolList: [],
      isSucess: false,
      dataLoading: false,
      isOpen: false,
      pool_name: "",
      pool_code: "",
      pool_price: 0,
      userList: false,
      pageCount: 0,
      page: 1,
      resetPagination: true,
      alert: false,
      alertmess: "",
      joinPoolLoading: false,
      randomJoinPoolLoading: false,
      per_page: 0,
      poolMembers: [],
      min_NFTs: 0,
      min_hashrate: 0,
      error: false,
      errorMess: "",
      oldData: {},
      isDefaultModal: false,
      optionsArray: [],
      options: [],
      selectedOption: { value: "", label: "Select Package" },
      isEditLoader: false,
      isSubmit: false,
    };
  }
  componentDidMount() {
    this.props.loadBg("balance");
    const { AuthStore } = this.props;
    this.setState({
      referrer_code: AuthStore.referrer_code,
      cloudminingPool: JSON.parse(localStorage.getItem("cloudminingPool")),
    });

    this.setState(
      {
        dataLoading: true,
        alert: false,
        alertmess: "",
        error: false,
        errorMess: "",
      },
      () => {
        this.userPoolList();
        this.fetchPoolUpgradePackage();
      }
    );
  }
  componentWillMount() {
    Modal.setAppElement("body");
  }
  fetchPoolUpgradePackage = () => {
    const { MiningStore, AuthStore } = this.props;
    MiningStore.poolUpgradePackage(AuthStore.token).then((res) => {
      if (res.data) {
        this.setState({
          optionsArray: res.data,
        });
      }
      if (res.error) {
        this.setState({
          alert: true,
          alertmess: res.error,
        });
      }
    });
  };
  userPoolList = () => {
    const { MiningStore, AuthStore } = this.props;
    let { page } = this.state;

    MiningStore.userPoolList(AuthStore.token, page).then((res) => {
      let userArray = [];

      if (JSON.parse(localStorage.getItem("cloudminingPool")).length === 0) {
        res.data.map((obj) => {
          userArray.push(obj);
          return null;
        });
        this.setState({
          userList: false,
        });
      } else {
        res.data.data.map((obj) => {
          userArray.push(obj);

          return null;
        });
        this.setState({
          userList: true,
        });
      }
      if (res.error) {
        this.setState({
          alert: true,
          alertmess: res.error,
        });
      }
      this.setState(
        {
          dataLoading: false,
          userPoolList: userArray,
          userPoolListLength: userArray.length,
          pageCount: res.data.last_page,
          page: res.data.current_page,
          per_page: res.data.per_page,
          resetPagination: false,
          isEditLoader: false,
        },
        () => {
          this.poolMember(1);
        }
      );
    });
  };
  poolMember = (page, data) => {
    let { userPoolList } = this.state;

    let allData = [];
    if (data === undefined) {
      userPoolList.forEach((obj, key) => {
        const { MiningStore, AuthStore } = this.props;
        let payload = {
          pool_code: obj.pool_code,
        };
        let pool_name = obj.pool_name;
        MiningStore.userPoolListMembar(page, payload, AuthStore.token).then(
          (res) => {
            let obj = {
              pool_code: payload.pool_code,
              pool_name: pool_name,
              data: res.data.data,
              pageCount: res.data.last_page,
              page: res.data.current_page,
              per_page: res.data.per_page,
              next_page_url: res.data.next_page_url,
            };
            allData.push(obj);
            this.setState({
              poolMembers: allData,
            });
          }
        );
      });
    } else {
      let { poolMembers } = this.state;
      userPoolList.forEach((obj, key) => {
        if (data.pool_code === obj.pool_code) {
          const { MiningStore, AuthStore } = this.props;
          let payload = {
            pool_code: obj.pool_code,
          };

          MiningStore.userPoolListMembar(page, payload, AuthStore.token).then(
            (res) => {
              poolMembers.forEach((obj) => {
                if (data.pool_code === obj.pool_code) {
                  obj.data = res.data.data;
                  obj.pageCount = res.data.last_page;
                  obj.page = res.data.current_page;
                  obj.per_page = res.data.per_page;
                }
              });
              this.setState({
                poolMembers,
              });
            }
          );
        }
      });
    }
  };
  onPoolMemberPageChange = (e, data) => {
    this.poolMember(e.selected + 1, data);
  };

  onChange = (e) => {
    this.handleAlertClose();
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  selectedName = (pool_code) => {
    this.setState({
      search: pool_code,
      openSearchBox: false,
    });
  };
  joinPool = (type) => {
    const { MiningStore, AuthStore } = this.props;
    let { search } = this.state;

    if (type === "random") {
      this.setState({
        randomJoinPoolLoading: true,
        search: "",
      });
    }
    if (type === "search") {
      this.setState({
        joinPoolLoading: true,
      });
    }
    let payload = {
      pool_code: parseInt(search),
    };
    if (type === "search" && (search === "" || search === undefined)) {
      this.setState({
        alert: true,
        alertmess: "please search and select any pool",
        joinPoolLoading: false,
        randomJoinPoolLoading: false,
      });
    } else {
      MiningStore.joinPool(payload, AuthStore.token).then((res) => {
        if (res.msg) {
          AuthStore.loginUserWithToken(AuthStore.token).then((res) => {
            if (res.username) {
              AuthStore.setState("name", res.username);
              AuthStore.setState("email", res.email);
              AuthStore.setState("userPool", res.userPool);
              AuthStore.setState("user_boost", res.boost);
              AuthStore.setState("mm_address", res.mm_address);
              AuthStore.setState(
                "user_team",
                res.user_team ? res.user_team._id : null
              );
              AuthStore.setState(
                "google_id",
                res.google_id ? res.google_id : null
              );
              AuthStore.setState(
                "facebook_id",
                res.facebook_id ? res.facebook_id : null
              );
              localStorage.setItem(
                "cloudminingPool",
                JSON.stringify(res.CloudminingPool)
              );
            }
          });
          this.setState(
            {
              dataLoading: true,
              page: 1,
            },
            () => {
              this.userPoolList();
            }
          );

          this.setState({
            search: "",
            joinPoolLoading: false,
            randomJoinPoolLoading: false,
          });
        }
        if (res.error) {
          this.setState({
            alert: true,
            alertmess: res.error,
            joinPoolLoading: false,
            randomJoinPoolLoading: false,
          });
        }
      });
    }
  };
  changePoolDetail = (obj) => {
    this.setState({
      isOpen: true,
      isDefaultModal: false,
      oldData: obj,
      pool_name: obj.pool_name,
      min_NFTs: obj.min_NFTs,
      min_hashrate: obj.min_hashrate,
      pool_code: obj.pool_code,
    });
  };
  closeModal = () => {
    this.setState({
      isOpen: false,
      isDefaultModal: false,
    });
  };
  pool_onChange = (e) => {
    this.setState({
      error: false,
      errorMess: "",
    });

    if (e.target.name === "min_NFTs" && e.target.value.length <= 1) {
      if (e.target.value.length === 0 || e.target.value <= 9) {
        this.setState({
          [e.target.name]: e.target.value,
        });
      }
    }
    if (e.target.name === "min_hashrate" && e.target.value.length <= 6) {
      this.setState({
        [e.target.name]: e.target.value,
      });
    }
    if (e.target.name === "pool_name") {
      let re = /^[A-Z0-9\[\]@!_-]+$/;

      if (e.target.value.length === 0 || e.target.value.match(re)) {
        this.setState({
          [e.target.name]: e.target.value,
        });
      }
    }
  };
  onSubmit = () => {
    let { pool_name, pool_code, min_hashrate, min_NFTs, oldData } = this.state;

    let payload = {
      pool_name: pool_name,
      pool_code: pool_code,
      min_hashrate: min_hashrate,
      min_NFTs: min_NFTs,
    };

    if (
      oldData.pool_name !== pool_name ||
      min_NFTs.toString() !== oldData.min_NFTs ||
      min_hashrate.toString() !== oldData.min_hashrate
    ) {
      const { MiningStore, AuthStore } = this.props;
      MiningStore.changePoolDetail(payload, AuthStore.token).then((res) => {
        if (res.data) {
          this.setState({
            // dataLoading: true,
            isOpen: false,
          });
          const { MiningStore, AuthStore } = this.props;
          let { page } = this.state;
          MiningStore.userPoolList(AuthStore.token, page).then((res) => {
            let userArray = [];

            if (
              JSON.parse(localStorage.getItem("cloudminingPool")).length === 0
            ) {
              res.data.map((obj) => {
                userArray.push(obj);
                return null;
              });
              this.setState({
                userList: false,
              });
            } else {
              res.data.data.map((obj) => {
                userArray.push(obj);
                return null;
              });
              this.setState({
                userList: true,
              });
            }
            if (res.error) {
              this.setState({
                alert: true,
                alertmess: res.error,
              });
            }
            this.setState({
              dataLoading: false,
              userPoolList: userArray,
              pageCount: res.data.last_page,
              page: res.data.current_page,
              per_page: res.data.per_page,
              resetPagination: false,
            });
          });
        }
        if (res.error) {
          this.setState({
            error: true,
            errorMess: res.error.min_NFTs
              ? res.error.min_NFTs
              : res.error.min_hashrate,
          });
        }
      });
    }
  };
  onPageChange = (e) => {
    this.setState(
      {
        page: e.selected + 1,
      },
      () => {
        this.setState(
          {
            dataLoading: true,
          },
          () => {
            this.userPoolList();
          }
        );
      }
    );
  };
  handleAlertClose = () => {
    this.setState({ alert: false, alertmess: "", search: "" });
  };
  enableDisable = (is_enable, item) => {
    // userPoolEnable
    this.setState({ isEditLoader: true });
    const { MiningStore, AuthStore } = this.props;
    let payload = {
      pool_code: item.pool_code,
      is_enable: is_enable,
    };

    MiningStore.userPoolEnable(payload, AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          alert: true,
          alertmess: res.error,
          isEditLoader: false,
        });
      } else {
        this.userPoolList();
      }
    });
  };
  upgradePool = (e) => {
    let { optionsArray } = this.state;

    let data = [];
    let newkey = -1;
    optionsArray.map((obj, key) => {
      if (e.packageDetails !== null) {
        if (e.packageDetails.package_id === obj._id) {
          newkey = key + 1;
        }
      } else {
        newkey = 0;
      }
      if (newkey === key) {
        let newobj = {
          value: obj._id,
          label: `${obj.name}, CGC:-${obj.CGC}, Bonus:-${obj.bonus}`,
        };
        data.push(newobj);
      }
    });

    this.setState(
      {
        options: data,
      },
      () => {
        this.setState({
          pool_code: e.pool_code,
          isDefaultModal: true,
          isOpen: false,
        });
      }
    );
  };
  closeUpgradePoolModal = () => {
    this.setState({
      isDefaultModal: false,
      selectedOption: { value: "", label: "Select Package" },
      error: false,
      errorMess: "",
      isSubmit: false,
    });
  };
  selectOption = (selectedOption) => {
    this.setState({
      error: false,
      errorMess: "",
      selectedOption: selectedOption,
    });
  };
  onSubmitUpgradePool = () => {
    let { pool_code, selectedOption } = this.state;
    this.setState({
      error: false,
      errorMess: "",
      isSubmit: true,
    });
    let payload = {
      pool_code: pool_code,
      id: selectedOption.value,
    };
    const { MiningStore, AuthStore } = this.props;
    MiningStore.upgradePool(payload, AuthStore.token).then((res) => {
      if (res.error) {
        this.setState({
          error: true,
          errorMess: res.error,
          isSubmit: false,
        });
      } else {
        this.userPoolList();
        this.closeUpgradePoolModal();
      }
    });
  };
  render = () => {
    let {
      search,
      cloudminingPool,
      userPoolList,
      dataLoading,
      isOpen,
      pool_name,
      isDefaultModal,
      userList,
      pageCount,
      resetPagination,
      joinPoolLoading,
      per_page,
      randomJoinPoolLoading,
      poolMembers,
      min_NFTs,
      min_hashrate,
      error,
      errorMess,
      options,
      selectedOption,
      isEditLoader,
      isSubmit,
    } = this.state;
    let disable =
      min_NFTs.length === 0 ||
      parseInt(min_NFTs) === 0 ||
      min_hashrate.length === 0 ||
      parseInt(min_hashrate) === 0 ||
      pool_name === ""
        ? true
        : false;
    return (
      <Layout title="Pool Mining">
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
          {isOpen && (
            <Modal
              isOpen={isOpen}
              onRequestClose={() => this.closeModal()}
              style={customStyles}
            >
              <ModalContainer>
                {error && <ModalError>{errorMess}</ModalError>}
                <InputDiv> Name:</InputDiv>
                <InputDiv>
                  <input
                    type="text"
                    placeholder="Please enter pool name"
                    name="pool_name"
                    onChange={(e) => this.pool_onChange(e)}
                    value={pool_name}
                    maxLength="31"
                  />
                </InputDiv>
                <InputDiv note>* Allow only A-Z 0-9 !@_-[] character.</InputDiv>
                <InputDiv> Minimum NFTs:</InputDiv>
                <InputDiv>
                  <input
                    type="number"
                    placeholder="Please enter minimum NFTs"
                    name="min_NFTs"
                    onChange={(e) => this.pool_onChange(e)}
                    value={min_NFTs}
                    min="1"
                  />
                </InputDiv>
                <InputDiv note>* Allow only 1 - 9.</InputDiv>

                <InputDiv> Minimum hashrate:</InputDiv>
                <InputDiv>
                  <input
                    type="number"
                    placeholder="Please enter minimum hashrate"
                    name="min_hashrate"
                    onChange={(e) => this.pool_onChange(e)}
                    value={min_hashrate}
                    min="0"
                  />
                </InputDiv>
                <InputDiv note>* Allow only 6 degits. </InputDiv>
                <ButtonDivSection>
                  <Submit onClick={() => this.onSubmit()} disabled={disable}>
                    Submit
                  </Submit>
                </ButtonDivSection>
              </ModalContainer>
            </Modal>
          )}
          {isDefaultModal && (
            <Modal
              isOpen={isDefaultModal}
              onRequestClose={() => this.closeUpgradePoolModal()}
              style={customStyles}
            >
              <ModalContainer>
                <InputDiv>Purchase the package</InputDiv>
                {error && <ModalError>{errorMess}</ModalError>}
                <Select
                  value={selectedOption}
                  placeholder={"Select Package"}
                  handleChange={this.selectOption}
                  options={options}
                  // border={`2px solid #8c14cf`}
                  color={`${variable.whiteColor}`}
                />

                <ButtonDivSection margin>
                  <Submit onClick={() => this.onSubmitUpgradePool()}>
                    {isSubmit ? (
                      <Loader
                        type="ThreeDots"
                        color="#fff"
                        width="18"
                        height="18"
                      />
                    ) : (
                      "Submit"
                    )}
                  </Submit>
                </ButtonDivSection>
              </ModalContainer>
            </Modal>
          )}
          {dataLoading ? (
            <DataLoader />
          ) : (
            <React.Fragment>
              <MainDiv>
                {cloudminingPool && cloudminingPool.length === 0 ? (
                  <Title>
                    To create a pool you must own a Captain Devex Attazer NFT{" "}
                    <ALink
                      href="https://opensea.io/assets/0x3cd41ec039c1f2dd1f76144bb3722e7b503f50ab/11"
                      target="_blank"
                    >
                      (look for one on the marketplace)
                    </ALink>
                  </Title>
                ) : (
                  ""
                )}
                {userPoolList && userPoolList.length === 0 ? (
                  <React.Fragment>
                    <ButtonSection>
                      <ButtonDiv>
                        <Button onClick={() => this.joinPool("random")}>
                          {randomJoinPoolLoading ? (
                            <Loader
                              type="Oval"
                              color="#CDD5DB"
                              width="18"
                              height="18"
                            />
                          ) : (
                            "Join Random Pool"
                          )}
                        </Button>
                      </ButtonDiv>
                    </ButtonSection>
                    <Title>OR</Title>
                    <DisplayFlex>
                      <SearchBox>
                        <InputForm>
                          <Input
                            type="text"
                            name="search"
                            placeholder="Search the pool"
                            onChange={(e) => this.onChange(e)}
                            value={search}
                          />
                        </InputForm>
                      </SearchBox>

                      <ButtonSection>
                        <ButtonDiv>
                          <Button onClick={() => this.joinPool("search")}>
                            {joinPoolLoading ? (
                              <Loader
                                type="Oval"
                                color="#CDD5DB"
                                width="18"
                                height="18"
                              />
                            ) : (
                              "Join Pool"
                            )}
                          </Button>
                        </ButtonDiv>
                      </ButtonSection>
                    </DisplayFlex>
                  </React.Fragment>
                ) : (
                  <BlankDiv></BlankDiv>
                )}
              </MainDiv>
              {userPoolList && userPoolList.length !== 0 && (
                <Title>Pool List</Title>
              )}
              {userPoolList && userPoolList.length !== 0 && (
                <PanelWrapper>
                  <Panel theme="purple">
                    <PanelInner>
                      <ReferralTable
                        button={true}
                        enableDisableButton={true}
                        data={userPoolList}
                        dataLoading={dataLoading}
                        cloudminingPool={cloudminingPool}
                        changePoolDetail={(e) => this.changePoolDetail(e)}
                        enableDisable={(e, item) => this.enableDisable(e, item)}
                        upgradePool={(e) => this.upgradePool(e)}
                        isEditLoader={isEditLoader}
                      />
                      {cloudminingPool && cloudminingPool.length !== 0 && (
                        <PaginationDiv>
                          {!resetPagination && per_page <= userPoolList.length && (
                            <ReactPagination
                              pageCount={pageCount}
                              onPageChange={(e) => this.onPageChange(e)}
                              // resetPagination={resetPagination}
                            />
                          )}
                        </PaginationDiv>
                      )}
                    </PanelInner>
                  </Panel>
                </PanelWrapper>
              )}
              {userList && (
                <React.Fragment>
                  <Title>Pool Members</Title>

                  {poolMembers &&
                    poolMembers.map((item, key) => {
                      return (
                        <ReferralUserTable
                          key={key}
                          data={item}
                          onPageChange={(e) =>
                            this.onPoolMemberPageChange(e, item)
                          }
                        />
                      );
                    })}
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </ReferralPage>
      </Layout>
    );
  };
}
const ModalError = styled.div`
  color: red;
  margin-bottom: 10px;
`;
const PaginationDiv = styled.div`
  margin-top: 15px;
`;
const PoolDiv = styled.div`
  margin: 10px;
`;
const PoolInputDiv = styled.div`
  width: 100%;
  margin: 0;
  display: flex;
  input {
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    width: 100%;
    height: 40px;
    padding-left: 5px;
    border-radius: 10px;
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    :focus {
      outline: none;
    }
    margin-bottom: 5px;
  }
`;
const PoolErrorMessage = styled.div`
  margin: 10px;
  margin-top: 0;
  color: #c51121;
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
const BlankDiv = styled.div`
  height: 2px;
  background-image: linear-gradient(136deg, #8c14cf 0%, #01c3c5 100%);
  margin: 20px 0;
`;
const SearchDropDown = styled.div`
  position: absolute;
  z-index: 1;
  width: 100%;
  height: auto;
  max-height: 500px;
  overflow-y: scroll;
`;
const ModalContainer = styled.div`
  display: block;
  margin: 10px;
  width: 300px;
  ${(props) =>
    props.minHeight
      ? `
      min-height:230px;
      height:100%;    
      margin-bottom: 0;
    `
      : null}
`;
const InputForm = styled.div`
  padding: 0.2rem;
  clip-path: polygon(0 0%, 96% 0, 100% 10px, 100% 100%, 2% 100%, 0 100%, 0 0%);
  background-image: linear-gradient(136deg, #8c14cf 0%, #01c3c5 100%);
`;
const InputDiv = styled.div`
  margin: 10px;
  display: flex;
  input {
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    width: 100%;
    height: 40px;
    padding-left: 5px;
    border-radius: 10px;
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    :focus {
      outline: none;
    }
    margin-bottom: 5px;
  }
  ${(props) =>
    props.note
      ? `
      color:blue;
      margin-top: -10px;
      margin-left:10px;
      margin-right:0; 
      margin-bottom: 5px;
      font-size: 12px;
    `
      : null}
`;
const InputSpan = styled.span`
  align-items: center;
  text-align: center;
  border-radius: 10px;
  height: 40px;
  display: flex;
  margin-left: -25px;
`;
const ButtonDivSection = styled.div`
  margin: 10px;
  display: flex;
  justify-content: center;
  ${(props) =>
    props.margin
      ? `
      margin:30px auto;
    `
      : null}
`;
const Submit = styled.button`
  height: 40px;
  border: none;
  background: ${variable.CheckboxBorder};
  color: ${variable.cancleButton};
  // border: 2px solid ${variable.CheckboxBorder};
  border: 2px solid ${variable.CheckboxBorder};
  font-weight: bold;
  border-radius: 0 10px;
  outline: none;
  width: 100%;
  cursor: pointer;
`;
const MainDiv = styled.div`
  margin: 10px 0;
`;
const SearchBox = styled.div`
  margin: 10px 10px 10px 0px;
  width: 100%;
  position: relative;
  display: inline-block;
  vertical-align: top;
  ${media.tablet`
    width: 30%;
  `}
`;
const ButtonSection = styled.div`
  margin: 10px 0;
  width: 100%;
  ${media.tablet`
    width: 30%;
  `}
`;
const ReferralPage = styled.div`
  color: ${variable.whiteColor};
`;
const Title = styled.div`
  color: ${variable.whiteColor};
  font-size: ${variable.textLarger};
  margin-bottom: 10px;
`;
const LoaderDiv = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  background: ${variable.Active};
  outline: none;
  padding: 5px 10px;
  font-size: ${variable.textMedium};
  color: white;
  border: 3px solid ${variable.CheckboxBorder};
`;
const SearchList = styled.div`
  width: 100%;
  background: ${variable.Active};
  outline: none;
  padding: 5px 10px;
  font-size: ${variable.textMedium};
  color: white;
  border: 3px solid ${variable.CheckboxBorder};
  cursor: pointer;
  border-top: none;
`;
const DisplayFlex = styled.div`
  display: block;

  ${media.tablet`
   display: flex;
  `}
`;
const PanelWrapper = styled.div`
  margin-bottom: 10px;
  display: inline-block;
  overflow: auto;
  width: 100%;
  vertical-align: top;

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
  `};
`;
const ButtonDiv = styled.div``;
const Button = styled.button`
  width: 100%;
  padding: 10px;
  clip-path: polygon(0 0%, 98% 0, 100% 12%, 100% 100%, 2% 100%, 0 87%, 0 0%);
  background: linear-gradient(to right, #f064c1 -106%, #6727cf 100%);
  color: ${variable.whiteColor};
  border: none;
  outline: none;
  cursor: pointer;
  font-size: ${variable.textSmall};
  padding: 12px;
  font-family: "erbaum", Open Sans, sans-serif;
  text-transform: uppercase;
`;
const Input = styled.input`
  height: 40px;
  width: 100%;
  background: ${variable.Active};
  outline: none;
  padding: 5px 10px;
  font-size: ${variable.textMedium};
  color: white;
  border: none;
  clip-path: polygon(0 0%, 96% 0, 100% 10px, 100% 100%, 2% 100%, 0 100%, 0 0%);
`;
const ALink = styled.a`
  color: ${variable.green};
  text-decoration: none;
`;
export default withTranslation()(Referral);
