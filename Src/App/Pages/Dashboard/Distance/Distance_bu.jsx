import React from "react";
import { inject, observer } from "mobx-react";
import { withTranslation } from "react-i18next";
import Graph from "react-graph-vis";
import Loader from "Components/Loader/Loader";
import Layout from "Components/Layout/Layout";
import { random } from "gsap/src/all";

@inject("AuthStore", "GraphStore")
@observer
class Distance extends React.Component {
  constructor(props) {
    super();

    this.state = {
      dataLoading: true,
      graph: {
        nodes: [],
        edges: [],
      },
    };
  }

  componentDidMount() {
    this.setState({
      dataLoading: false,
    });
    this.getGraphDetails();
  }
  getGraphDetails = () => {
    const { GraphStore, AuthStore } = this.props;
    let payload = {
      table_name: "decentraland",
      // record: 50,
    };
    GraphStore.getGraphDetails(payload, AuthStore.token).then((res) => {
      if (res.data) {
        let newResArray = [];
        newResArray = res.data.data;
        let nodes = [];
        let edges = [];
        let distanceArray = [];
        newResArray.forEach((key, objId) => {
          if (distanceArray.indexOf(key.distance) <= -1) {
            distanceArray.push(key.distance);
            let arrayLenght = distanceArray.length;
            let obj = {
              id: key.distance,
              label: key.name ? key.name : "Parcel",
              title: key.name ? key.name : "Parcel",
            };
            nodes.push(obj);
            if (objId > 0) {
              let newObj = {
                from: key.distance,
                to: distanceArray[Math.floor(Math.random() * arrayLenght)],
              };
              edges.push(newObj);
            }
          }
        });
        console.log("====================================");
        console.log(edges);
        console.log("====================================");
        this.setState({
          graph: {
            nodes: nodes,
            edges: edges,
          },
        });
      }
    });
  };
  render = () => {
    let { dataLoading, graph } = this.state;
    // const graph = {
    //   nodes: [
    //     { id: 1, label: "Node 1", title: "node 1 tootip text" },
    //     { id: 2, label: "Node 2", title: "node 2 tootip text" },
    //     { id: 2.05, label: "Node 2.02", title: "node 2 tootip text" },
    //     { id: 3, label: "Node 3", title: "node 3 tootip text" },
    //     { id: 4, label: "Node 4", title: "node 4 tootip text" },
    //     { id: 5, label: "Node 5", title: "node 5 tootip text" },
    //   ],
    //   edges: [
    //     { from: 1, to: 2 },
    //     { from: 1, to: 2.05 },
    //     { from: 1, to: 3 },
    //     { from: 2, to: 4 },
    //     { from: 2, to: 5 },
    //   ],
    // };

    const options = {
      layout: {
        hierarchical: true,
      },
      edges: {
        color: "#000000",
      },
      height: "500px",
    };

    const events = {
      select: function (event) {
        var { nodes, edges } = event;
      },
    };
    return (
      <React.Fragment>
        <Layout title="Distance graph">
          {dataLoading ? (
            <Loader />
          ) : (
            <div className="distance">
              <Graph
                graph={graph}
                options={options}
                events={events}
                getNetwork={(network) => {
                  //  if you want access to vis.js network api you can set the state in a parent component using this property
                }}
              />
            </div>
          )}
        </Layout>
      </React.Fragment>
    );
  };
}

export default withTranslation()(Distance);
