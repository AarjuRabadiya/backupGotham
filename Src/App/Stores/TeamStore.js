import { action, observable, autorun } from "mobx";
import { create, persist } from "mobx-persist";

class TeamStore {
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
  @action getTeamDetails = async (token, page) => {
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
      `${process.env.API_URL}/user/team/list?page=${page}`,
      settings
    );
    const json = await response.json();
    return json;
  };
  @action createTeam = async (data, token) => {
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Access-Control-Allow-Origin": "*",
        mode: "cors",
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    };

    let response = await fetch(
      `${process.env.API_URL}/user/team/create`,
      settings
    );
    const json = await response.json();
    return json;
  };
  @action joinTeam = async (data, token) => {
    const settings = {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + token,
        "Access-Control-Allow-Origin": "*",
        mode: "cors",
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    };

    let response = await fetch(
      `${process.env.API_URL}/user/team/join`,
      settings
    );
    const json = await response.json();
    return json;
  };
}

const store = new TeamStore();

export default store;

const hydrate = create({
  storage: localStorage,
  jsonify: true,
});

hydrate("TeamStore", store);
