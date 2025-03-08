import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const dataSets = {
  week: {
    labels: ["S", "M", "T", "W", "T", "F", "S"],
    data: [10, 12, 8, 15, 14, 18, 16],
  },
  month: {
    labels: ["W1", "W2", "W3", "W4"],
    data: [40, 55, 65, 70],
  },
  year: {
    labels: ["J", "F", "M", "A", "M", "J", "J", "A", "S", "O", "N", "D"],
    data: [30, 35, 40, 50, 45, 55, 65, 60, 70, 75, 80, 85],
  },
};

const GraphComponent = () => {
  const [selectedFilter, setSelectedFilter] = useState("week");
  const [tooltip, setTooltip] = useState(null);

  const chartConfig = {
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#ffffff",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(0, 128, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#008000",
    },
  };

  const handleDataPointClick = ({ index, value, x, y }) => {
    setTooltip({ value, x, y });
    setTimeout(() => setTooltip(null), 2000); // Hide tooltip after 2 seconds
  };

  return (
    <View style={{ padding: 10 }}>
      {/* Filter Options */}
      <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 10 }}>
        {["week", "month", "year"].map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => setSelectedFilter(option)}
            style={{
              padding: 8,
              margin: 5,
              backgroundColor: selectedFilter === option ? "#008000" : "#ddd",
              borderRadius: 5,
            }}
          >
            <Text style={{ color: selectedFilter === option ? "#fff" : "#000" }}>
              {option.toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Line Chart */}
      <View>
        <LineChart
          data={{
            labels: dataSets[selectedFilter].labels,
            datasets: [{ data: dataSets[selectedFilter].data }],
          }}
          width={screenWidth - 20}
          height={220}
          chartConfig={chartConfig}
          bezier
          onDataPointClick={handleDataPointClick}
          style={{
            borderRadius: 10,
          }}
        />

        {/* Tooltip */}
        {tooltip && (
          <View
            style={{
              position: "absolute",
              left: tooltip.x - 15,
              top: tooltip.y - 30,
              backgroundColor: "black",
              padding: 5,
              borderRadius: 5,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>{tooltip.value}%</Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default GraphComponent;
