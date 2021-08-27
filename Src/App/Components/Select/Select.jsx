import React, { Component } from "react";
import Select from "react-select";
import * as variable from "Base/Variables";

export default class SelectBox extends Component {
  render() {
    const { value, options, handleChange, placeholder, border } = this.props;

    return (
      <>
        <Select
          isSearchable={false}
          value={value}
          onChange={handleChange}
          options={options}
          placeholder={placeholder}
          styles={{
            container: (base) => ({
              ...base,
              display: "block",
              width: "100%",
              border: border ? border : "none",
              borderLeft: border
                ? "2px solid #8c14cf"
                : `2px solid ${variable.green}`,
              background: variable.formBackground,
            }),
            control: (base) => ({
              ...base,
              border: "none",
              height: 50,
              boxShadow: "none",
              background: variable.formBackground,
              // backgroundColor: "rgba(255,255,255,0.8)",
            }),
            placeholder: (base) => ({
              ...base,
              fontWeight: variable.bold,
              fontSize: variable.textMedium,
              color: variable.selectPlaceholder,
              background: variable.formBackground,
            }),
            singleValue: (base) => ({
              ...base,
              fontWeight: variable.bold,
              fontSize: variable.textMedium,
              // color: "#5A596B",
              color: variable.selectColor,
              background: variable.formBackground,
            }),
            menu: (base) => ({
              ...base,
              border: "none",
              boxShadow: "none",
              marginTop: 0,
              background: variable.formBackground,
            }),
            menuList: (base) => ({
              ...base,
              border: "none",
              boxShadow: "none",
              padding: 0,
              background: variable.formBackground,
            }),
            option: (base) => ({
              ...base,
              fontWeight: variable.bold,
              fontSize: variable.textMedium,
              // color: "#5A596B",
              color: variable.selectColor,
              border: "none",
              boxShadow: "none",
              background: variable.formBackground,
            }),
            indicatorSeparator: (base) => ({
              ...base,
              display: "none",
            }),

            dropdownIndicator: (base) => ({
              ...base,
              backgroundRepeat: "no-repeat",
              zoom: "0.5",
              width: "60px",
              height: "30px",
            }),
          }}
          theme={(theme) => ({
            ...theme,
            border: "none",
            colors: {
              ...theme.colors,
              primary25: "white",
              primary: "#f7f7f8",
            },
          })}
        />
      </>
    );
  }
}
