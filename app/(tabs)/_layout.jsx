import { StatusBar } from "expo-status-bar";
import { Redirect, Tabs } from "expo-router";
import { Image, Platform, Text, View } from "react-native";

import { icons } from "../../constants";
import { useGlobalContext } from "@/context/GlobalProvider";
import { useEffect } from "react";

import * as NavigationBar from "expo-navigation-bar"
import { useFocusEffect } from "expo-router";
const TabIcon = ({ icon, color, name, focused, darkTheme }) => {
  return (
    <View className="flex items-center justify-center gap-1 pt-10">
      <Image
        source={icon}
        resizeMode="contain"
      />
      <Text
        className={`${focused ? "font-psans" : "font-pregular"} text-xs text-center w-16`}
        style={{ color: (darkTheme === "dark" && focused) ? "#CBF5B8" : color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabLayout = () => {
  const { darkTheme, loading , isLogged } = useGlobalContext();
  // useEffect(() => {
  //   if(Platform.OS === "android"){
  //     NavigationBar.setVisibilityAsync('hidden');
  //   }
  // }, [])
  // useFocusEffect(() => {
  //   let timeout;
  //   if (Platform.OS === 'android') {
  //     NavigationBar.setBehaviorAsync('inset-swipe');
  //     NavigationBar.setVisibilityAsync('visible');

  //     timeout = setTimeout(() => {
  //       NavigationBar.setVisibilityAsync('hidden');
  //     }, 3000);
  //   }

  //   return () => {
  //     if (timeout) clearTimeout(timeout);
  //   };
  // })
  
  if (!loading && !isLogged) return <Redirect href="/sign-in" />;

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: darkTheme === "dark" ? "#1D1E25" : "#014148",
          tabBarInactiveTintColor: "#737373",
          tabBarShowLabel: false,
          tabBarHideOnKeyboard:true,
          tabBarStyle: {
            backgroundColor: darkTheme === "dark" ? "#1D1E25" : "#FFFFFF",
            // borderTopWidth: 1,
            borderTopColor: darkTheme === "dark" ? "#1D1E25" : "#FFFFFF",
            // boxShadow: "0px 4px 14px 0px #000000",
            height: 80,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                darkTheme={darkTheme}
                icon={focused ? icons.home : icons.home_thin}
                color={color}
                name="Home"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="explore"
          options={{
            title: "Explore",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                darkTheme={darkTheme}
                icon={focused ? icons.location : icons.location_thin}
                color={color}
                name="Explore"
                focused={focused}
              />
            ),
          }}
        />
         <Tabs.Screen
          name="dollars"
          options={{
            title: "Dollar",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                darkTheme={darkTheme}
                icon={focused ? icons.dollar_active : icons.dollar}
                color={color}
                name="Dollar"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="portfolio"
          options={{
            title: "Portfolio",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                darkTheme={darkTheme}
                icon={focused ? icons.portfolio : icons.portfolio_thin}
                color={color}
                name="Portfolio"
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "Account",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                darkTheme={darkTheme}
                icon={focused ? icons.user : icons.user_thin}
                color={color}
                name="Account"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>

      {/* <Loader isLoading={loading} /> */}
      <StatusBar 
        backgroundColor={darkTheme === "dark" ? "#1D1E25" : "#EAF6E4"} 
        style={darkTheme === "dark" ? "light" : "dark"}
      />
      {/* <StatusBar backgroundColor={darkTheme === "dark" ? "#1D1E25" : "#EAF6E4"} style={Platform.OS === 'ios' ? `${darkTheme === "dark" ? "light" : "dark"}` : `${darkTheme === "dark" ? "light" : "dark"}` }/> */}
    </>
  );
};

export default TabLayout;
