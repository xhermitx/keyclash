import React from "react";
import { Results } from "../utils/types";
import Chart from "react-google-charts";

const ResultsChart: React.FC<{ results: Results }> = (props) => {
  const data = [
    ["Label", "Accuracy"],
    ["Correct Words", props.results.accuracy],
    ["Incorrect Words", 100 - props.results.accuracy],
  ];

  const options = {
    title: "",
    pieHole: 0.4, // Creates a Donut Chart. Does not do anything when is3D is enabled
    // is3D: true,
    pieStartAngle: 100, // Rotates the chart
    sliceVisibilityThreshold: 0.02, // Hides slices smaller than 2%
    legend: {
      position: "bottom",
      alignment: "center",
      textStyle: {
        color: "#233238",
        fontSize: 14,
      },
    },
    animation: {
      duration: 1000,
      easing: "out",
    },
    colors: ["#284b63", "#f57878"],
  };

  return (
    <div className="transition-all ease-in-out duration-1000">
      <Chart
        className="text-center"
        chartType="PieChart"
        data={data}
        options={options}
        width={"100%"}
        height={"400px"}
      />
    </div>
  );
};

export default ResultsChart;
