import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// import { useGlobalContext } from "../../context/GlobalProvider";

const NotificationLayout = () => {
//   const { loading, isLogged } = useGlobalContext();

//   if (!loading && isLogged) return <Redirect href="/home" />;

    return (
        <>
            <Stack>
                <Stack.Screen
                    name="notification"
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack>

            {/* <Loader isLoading={loading} /> */}
            <StatusBar style="auto" />
        </>
    );
};

export default NotificationLayout;
