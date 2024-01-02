import { StatusBar } from "expo-status-bar";
import StackNavigator from "./src/navigation/StackNavigator";
import { Provider } from "react-redux";
import store from "./src/redux/store/store";

export default function App() {
  return (
    <>
      <Provider store={store}>
        <StackNavigator />
        <StatusBar style="auto" />
      </Provider>
    </>
  );
}
