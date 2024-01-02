import { SafeAreaView, Text, View } from "react-native";
import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";

const Cart = () => {
  const route = useRoute();
  console.log("Navigation Params", route.params);
  return (
    <SafeAreaView>
      <Text>Cart</Text>
    </SafeAreaView>
  );
};

export default Cart;
