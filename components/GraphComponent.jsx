import React, { useState, useRef } from "react";
import { View, Text, Dimensions, StyleSheet, PanResponder, TouchableOpacity } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { SelectList } from "react-native-dropdown-select-list";

const screenWidth = Dimensions.get("window").width;

const GraphScreen = ({chartData,chartDataLoading}) => {
  if (chartDataLoading){
    return <View className="py-10"><Text className="text-muted-200 dark:text-[#FFFFFF99] font-psemibold text-lg">Loading...</Text></View>;
  }
  if(!chartData["Last 7 Days"]){
    return null;
  }
  const [selectedRange, setSelectedRange] = useState("Last 7 Days");
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, value: 0 });

  // const chartData = {
  //   "Last 7 Days": {
  //     "labels": ["9th May", "8th May", "6th May", "5th May", "4th May", "3rd May", "2nd May"],
  //     "data": [10.5, 1.5, 1.2, 1.8, 25, 30, 2.7]
  //   },
  //   "1 Month": {
  //     "labels": ["12th Apr", "16 Apr", "21st Apr", "25th Apr", "30th Apr", "2nd May", "9th May"],
  //     "data": [6.5, 8, 4.6, 5, 12, 25, 30]
  //   },
  //   "1 Year": {
  //     "labels": ["21st Jun", "1st Aug", "12th Oct", "4th Dec", "2nd Feb", "14th Mar", "9th May"],
  //     "data": [10, 20, 30, 18, 12, 6, 9]
  //   }
  // };

  const dataPoints = chartData[selectedRange].data;
  const labels = chartData[selectedRange].labels;
  const numPoints = dataPoints.length;
  const graphWidth = screenWidth + screenWidth / 5.7; // ✅ Your exact width
  const sectionWidth = graphWidth / numPoints;

  // PanResponder for touch dragging
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        let touchX = gestureState.moveX;

        // Ensure within graph bounds
        touchX = Math.max(0, Math.min(graphWidth, touchX));

        // Find closest index
        const index = Math.round((touchX / graphWidth) * (numPoints - 1));
        const value = dataPoints[index];

        // Update tooltip
        setTooltip({
          visible: true,
          x: index * sectionWidth,
          y: 50, // Position tooltip above graph
          value,
        });
      },
      onPanResponderRelease: () => {
        setTooltip((prev) => ({ ...prev, visible: false }));
      },
    })
  ).current;

  // Function to handle x-axis label click
  const handleLabelPress = (index) => {
    const value = dataPoints[index];

    setTooltip({
      visible: true,
      x: index * sectionWidth,
      y: 50, // Position above the graph
      value,
    });
  };
  const presentRIO=chartData["Last 7 Days"]?.data?.slice(-1)[0]
  const presentRIOPrevious=chartData["Last 7 Days"]?.data?.slice(-2)[0]
  const RIODiff= presentRIO - presentRIOPrevious
  
  return (
    <View className="flex-1 pt-5 pb-3 mb-2 bg-white border-border dark:border-[#3B3C43] border-b">
      <View className="px-5">
        <View className="flex-row justify-between relative z-20">
          <View>
            <Text className="text-base text-muted">ROI History</Text>
            <Text className="text-4xl py-1 font-bold">{presentRIO}%</Text>
            <Text className="text-[#009C6A] bg-[#009C6A26] px-2 text-center w-14 py-0.5 text-sm font-psemibold rounded-xl ">
              {RIODiff > 0 ? `+${RIODiff}` : RIODiff}%
            </Text>
          </View>
          <View className="absolute right-0 mt-5">
            <SelectList
              className="py-0"
              setSelected={(val) => setSelectedRange(val)}
              data={[
                { key: "Last 7 Days", value: "Last 7 Days" },
                { key: "1 Month", value: "1 Month" },
                { key: "1 Year", value: "1 Year" },
              ]}
              save="value"
              boxStyles={{ width: 120 }}
              dropdownStyles={{ width: 120 }}
              defaultOption={{ key: "Last 7 Days", value: "Last 7 Days" }}
            />
          </View>
        </View>

        {/* Dropdown */}
      </View>

      {/* Chart Container with Touch Tracking */}
      <View className="items-center mt-4 overflow-x-hidden" {...panResponder.panHandlers}>
        <LineChart
          data={{
            labels,
            datasets: [{ data: dataPoints }],
          }}
          width={graphWidth} // ✅ Your exact width restored
          height={220}
          withVerticalLabels={true}
          withHorizontalLabels={false}
          withInnerLines={false}
          withOuterLines={false}
          yAxisLabelWidth={0}
          chartConfig={{
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(72, 209, 122, ${opacity})`,
            strokeWidth: 2,
            propsForDots: { r: "0" }, // ✅ No dots
            decimalPlaces: 0,
          }}
          bezier
        />

        {/* Tooltip */}
        {tooltip.visible && (
          <View
            style={[
              styles.tooltip,
              { left: tooltip.x - 20, top: tooltip.y },
            ]}
          >
            <Text style={styles.tooltipText}>{tooltip.value}%</Text>
          </View>
        )}
      </View>

      {/* Clickable X-axis labels */}
      {/* <View style={styles.labelContainer}>
        {labels.map((label, index) => (
          <TouchableOpacity key={index} onPress={() => handleLabelPress(index)} style={[styles.label, { width: sectionWidth }]}>
            <Text style={styles.labelText}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    position: "absolute",
    backgroundColor: "black",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    alignItems: "center",
  },
  tooltipText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  labelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth + screenWidth / 4, // ✅ Match graph width
    paddingHorizontal: 15,
    marginTop: 10,
  },
  label: {
    alignItems: "center",
  },
  labelText: {
    fontSize: 12,
    color: "black",
    fontWeight: "600",
  },
});

export default GraphScreen;
