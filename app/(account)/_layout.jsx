import { Redirect, Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

// import { Loader } from "../../components";
// import { useGlobalContext } from "../../context/GlobalProvider";

const AccountLayout = () => {
//   const { loading, isLogged } = useGlobalContext();

//   if (!loading && isLogged) return <Redirect href="/home" />;

  return (
    <>
        <Stack>
            <Stack.Screen
                name="edit-account"
                options={{
                    headerShown: false,
                }}
            />
        </Stack>

        {/* <Loader isLoading={loading} /> */}
        <StatusBar backgroundColor="#FFFFFF" style="light" />
    </>
  );
};

export default AccountLayout;
