import React from "react";
import styled from "styled-components";
import i18n from "Src/i18";
import i18next from "i18next";
import * as variable from "Base/Variables";
import { media } from "Base/Media";
import Button from "Components/Buttons/Button";
import SearchIcon from "./search.png";

const Container = styled.div`
  display: flex;
`;
const ButtonAllAssets = styled(Button)`
  background-color: ${variable.CheckboxBorder};
  color: ${variable.whiteColor};
  padding: 1.2rem;
`;
const FormRow = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  z-index: 9999;
  display: none;

  ${media.large_desktop`
  display: block;
	    position:fixed;
	    right: 120px;
      
    top: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
	    right: 120px;
      ${(props) =>
        props.assets
          ? `
              top: 50px;
          `
          : `
          top: 0;
      `}
	`}
`;
const Language = styled.div`
  position: absolute;
  right: 80px;
  z-index: 9999;

  ${(props) =>
    props.alignRight
      ? `
	    right: 0;
	`
      : null}
  ${(props) =>
    props.assets
      ? `
          top: 100px;
      `
      : `
      top: 0;
  `}

  ${media.large_desktop`
	    position:fixed;
	    
	    right: 0;
      ${(props) =>
        props.assets
          ? `
              top: 50px;
          `
          : `
          top: 0;
      `}
	`}
`;
const LanguageActive = styled.div`
  padding: ${variable.spacingSmall};
  color: ${variable.white};
  font-weight: bold;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: ${variable.green};
    color: ${variable.black};
  }

  ${media.large_desktop`
        border-left: 1px solid ${variable.green};
	`}
`;
const LanguageOption = styled.div`
  cursor: pointer;
  color: ${variable.white};
  transition: all 0.3s ease-in-out;
  margin-bottom: ${variable.spacingSmaller};

  ${(props) =>
    props.active
      ? `
	    color: ${variable.green};
	`
      : null}

  &:hover {
    color: ${variable.green};
    transform: translateX(10px);
  }
`;
const LanguageSubMenu = styled.div`
  background-color: rgba(0, 0, 0, 1);
  padding: ${variable.spacingSmall};
  position: absolute;
  right: 100px;
  display: none;
  width: 20rem;
  transform: translateX(100%);
  transition: all 0.3s ease-in-out;

  ${(props) =>
    props.open
      ? `
        display: block;
        right: 0;
        transform: translateX(0%);
    `
      : `
    `}
`;
const SearchBox = styled.div`
  display: flex;
  height: 40px;
  width: 100%;
  margin-right: 5px;
  background: black;
  border-radius: 5px;
  margin-bottom: 5px;
  ${media.large_desktop`
  margin-bottom: 0px;
	`}
`;
const SearchBoxDiv = styled.div`
  display: flex;
  width: 100%;
`;
const Searchbutton = styled.div`
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 35px;
  background: transparent;
  color: ${variable.whiteColor};
  border-right: none !important;
  border: 2px solid ${variable.CheckboxBorder};
  border-radius: 5px 0px 0px 5px;
  padding-left: 5px;
`;
const Input = styled.input`
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  width: 100%;
  height: 40px;
  margin-right: auto;
  padding-left: 5px;
  margin-bottom: 5px;
  background: transparent;
  color: ${variable.whiteColor};
  border-left: none !important;
  border: 2px solid ${variable.CheckboxBorder};
  border-radius: 0px 5px 5px 0px;
  font-size: ${variable.textLarge};

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
`;
export default class LanguageSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      search: "",
    };
  }
  /**
   * Change the language toggle cross site
   *  [ en, jp, cn, vm ]
   * */
  changeLanguageToggle = (lang = "en") => {
    const { open } = this.state;

    /** Force the language update on callback **/
    i18next.changeLanguage(lang, () => {
      this.getActiveLanguageMap(i18n.language);
      this.setState({ open: !open });
    });
  };

  getActiveLanguageMap = (language) => {
    const { languages } = this.props;
    let activeLang;

    languages.forEach((lang, key) => {
      if (lang === language) {
        activeLang = i18n.t("language." + lang);
      }
    });

    return activeLang;
  };

  toggleSubMenu = () => {
    const { open } = this.state;
    this.setState({ open: !open });
    this.forceUpdate();
  };

  handleSearch = (e) => {
    this.setState({
      search: e.target.value,
    });
  };

  searchRedirect = () => {
    let { search } = this.state;
    this.props.history.push({
      pathname: "/search",
      search_obj: search,
    });
  };
  render = (props) => {
    const { languages, alignRight, assets } = this.props;
    const { open, search } = this.state;

    return (
      <Container>
        {/* {assets && ( */}
        <FormRow alignRight={alignRight} assets={assets}>
          <SearchBox>
            <Searchbutton>
              <img src={SearchIcon} alt="" />
            </Searchbutton>
            <SearchBoxDiv>
              <Input
                type="text"
                placeholder="Search.."
                name="search"
                value={search}
                onChange={(e) => this.handleSearch(e)}
              />
            </SearchBoxDiv>
          </SearchBox>
          <ButtonAllAssets onClick={() => this.searchRedirect()}>
            Show all assets
          </ButtonAllAssets>
        </FormRow>
        {/* )} */}
        <Language alignRight={alignRight} assets={assets}>
          <LanguageActive onClick={() => this.toggleSubMenu()}>
            {this.getActiveLanguageMap(i18n.language)}
          </LanguageActive>
          <LanguageSubMenu open={open}>
            {languages.map((lang, key) => {
              return (
                <LanguageOption
                  key={key}
                  onClick={() => this.changeLanguageToggle(lang)}
                  lang={lang}
                  active={i18n.language === lang}
                >
                  {i18n.t("language." + lang)}
                </LanguageOption>
              );
            })}
          </LanguageSubMenu>
        </Language>
      </Container>
    );
  };
}
