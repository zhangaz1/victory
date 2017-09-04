import React from "react";
import { VictoryLegend } from "../src/index";

const containerStyle = {
  display: "flex",
  flexDirection: "row",
  flexWrap: "wrap",
  alignItems: "center",
  justifyContent: "center"
};

const legendStyle = {
  parent: { border: "1px solid #ccc", margin: "2%" },
  labels: { fontSize: 14, fontFamily: "Palatino" },
  border: { stroke: "black", strokeWidth: 2 }
};

const symbolSize = 5;
const symbolSpacer = 10;
const data = [{
  name: "Series 1",
  symbol: {
    size: symbolSize,
    type: "circle",
    fill: "green"
  }
}, {
  name: "Long Series Name -- so long",
  symbol: {
    size: symbolSize,
    type: "triangleUp",
    fill: "blue"
  }
}, {
  name: "Series 3",
  symbol: {
    size: symbolSize,
    type: "diamond",
    fill: "pink"
  }
}, {
  name: "Series 4",
  symbol: {
    size: symbolSize,
    type: "plus"
  }
}, {
  name: "Series 5",
  symbol: {
    size: symbolSize,
    type: "star",
    fill: "red"
  },
  labels: {
    fill: "purple"
  }
}, {
  name: "Series 6: also quite long",
  symbol: {
    size: symbolSize,
    type: "circle",
    fill: "orange"
  },
  labels: {
    fill: "blue"
  }
}];

const LegendDemo = () => (
  <div className="demo" style={containerStyle}>
    <svg
      height={800}
      width={1000}
      style={{ border: "1px solid #ccc", margin: "2%" }}
    >
      <VictoryLegend
        standalone={false}
        x={25} y={20}
        itemsPerRow={2}
        centerTitle
        title={["Yaaaas", "a title!"]}
        data={data}
        symbolSpacer={symbolSpacer}
        style={legendStyle}
        events={[{
          target: "data",
          eventHandlers: {
            onClick: () => {
              return [{
                mutation: () => ({ symbol: "star" })
              }];
            }
          }
        }]}
      />
      <VictoryLegend
        standalone={false}
        x={25} y={150}
        gutter={30}
        symbolSpacer={symbolSpacer}
        itemsPerRow={3}
        data={data}
        style={legendStyle}
      />
      <VictoryLegend
        orientation="horizontal"
        standalone={false}
        x={25} y={300}
        symbolSpacer={symbolSpacer}
        gutter={30}
        itemsPerRow={3}
        data={data}
        style={legendStyle}
      />

      <VictoryLegend
        standalone={false}
        x={600} y={20}
        symbolSpacer={symbolSpacer}
        gutter={30}
        data={data}
        style={legendStyle}
      />
      <VictoryLegend
        orientation="horizontal"
        standalone={false}
        x={25} y={400}
        gutter={30}
        data={data}
        style={legendStyle}
      />
    </svg>
  </div>
);

export default LegendDemo;
