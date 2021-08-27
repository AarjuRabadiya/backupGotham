import { action, observable, autorun } from "mobx";
import { create, persist } from "mobx-persist";

class GraphStore {
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
  @action getGraphDetails = async (data, token) => {
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        "Access-Control-Allow-Origin": "*",
        mode: "cors",
      },
      body: JSON.stringify(data),
    };

    let response = await fetch(
      `${process.env.API_URL}/land/chart/details`,
      settings
    );

    const json = await response.json();
    return json;
  };
}

const store = new GraphStore();

export default store;

const hydrate = create({
  storage: localStorage,
  jsonify: true,
});

hydrate("GraphStore", store);
