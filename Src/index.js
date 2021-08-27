import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "mobx-react";
import App from "./App/App";
import AuthStore from "Stores/AuthStore";
import MiningStore from "Stores/MiningStore";
import ParticipationStore from "Stores/ParticipationStore";
import BalanceStore from "Stores/BalanceStore";
import HistoryStore from "Stores/HistoryStore";
import GeneralStore from "Stores/GeneralStore";
import QuestStore from "Stores/QuestStore";
import LandStore from "Stores/LandStore";
import TeamStore from "Stores/TeamStore";
import AssetStore from "Stores/AssetStore";
import GraphStore from "Stores/GraphStore";

import "./index.scss";

const app = (
  <Provider
    AuthStore={AuthStore}
    MiningStore={MiningStore}
    ParticipationStore={ParticipationStore}
    HistoryStore={HistoryStore}
    GeneralStore={GeneralStore}
    QuestStore={QuestStore}
    BalanceStore={BalanceStore}
    LandStore={LandStore}
    TeamStore={TeamStore}
    AssetStore={AssetStore}
    GraphStore={GraphStore}
  >
    <App AuthStore={AuthStore} />
  </Provider>
);
ReactDOM.render(app, document.getElementById("app"));

module.hot.accept();
