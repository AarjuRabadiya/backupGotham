import { action, observable, autorun } from "mobx";
import { create, persist } from "mobx-persist";

class AssetStore {
  @persist @observable name = null;
  /**
   * Set the State
   * @param name
   * @param state
   * @returns {*}
   */
  @action setState = (name, state) => {
    return (this[name] = state);
  };

  /**
   * Get User Available Quests
   * @param token
   * @returns {Promise<any>}
   */
  @action getCoinDetails = async (token, page) => {
    const settings = {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Access-Control-Allow-Origin": "*",
        mode: "cors",
      },
      body: null,
    };

    let response = await fetch(
      `${process.env.API_URL}/user/multi/coin/list`,
      settings
    );
    const json = await response.json();
    return json;
  };
}

const store = new AssetStore();

export default store;

const hydrate = create({
  storage: localStorage,
  jsonify: true,
});

hydrate("AssetStore", store);
