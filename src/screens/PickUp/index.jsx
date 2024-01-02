import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
  Alert,
} from "react-native";
import React, { useState, useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import HorizontalDatepicker from "@awrminkhodaei/react-native-horizontal-datepicker";
import { times, deliveryTime } from "../../data/data";

const PickUp = () => {
  const navigation = useNavigation();
  const cart = useSelector((state) => state.cart.cart);
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState([]);
  const [delivery, setDelivery] = useState([]);

  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");

  const formattedDate = useMemo(() => {
    return `${year}-${month}-${day}`;
  }, [year, month, day]);

  const lastDate = new Date(year, currentDate.getMonth() + 1, 0);
  const lastMonth = String(lastDate.getMonth() + 1).padStart(2, "0");
  const lastDay = String(lastDate.getDate()).padStart(2, "0");

  const formattedLastDay = useMemo(() => {
    return `${year}-${lastMonth}-${lastDay}`;
  }, [year, lastMonth, lastDay]);

  const proceedToCart = () => {
    if (!selectedDate || !selectedTime || !delivery) {
      Alert.alert(
        "Empty or invalid",
        "Please select all the fields",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }
    if (selectedDate && selectedTime && delivery) {
      navigation.navigate("Cart", {
        pickUpDate: JSON.stringify(selectedDate)
          .replace(/^"|"T00:00:00.000Z"$/g, "")
          .slice(0, 10),
        selectedTime: selectedTime,
        no_Of_days: delivery,
      });
    }
  };

  return (
    <>
      <SafeAreaView>
        <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
          Enter Address
        </Text>

        <TextInput
          multiline={true}
          numberOfLines={4}
          style={[
            {
              padding: 10,
              margin: 10,
              textAlignVertical: "top",
              borderRadius: 7,
              height: 120,
            },
            {
              borderColor: isFocused ? "black" : "#C0C0C0",
              borderWidth: isFocused ? 1 : 0.8,
            },
          ]}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => {
            setIsFocused(false);
          }}
          placeholder="Address..."
        />

        <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
          Pick Up Date
        </Text>
        <HorizontalDatepicker
          mode="gregorian"
          startDate={formattedDate}
          endDate={formattedLastDay}
          initialSelectedDate={new Date("2024-01-22")}
          onSelectedDateChange={(date) => setSelectedDate(date)}
          selectedItemWidth={170}
          unselectedItemWidth={38}
          itemHeight={38}
          itemRadius={10}
          selectedItemTextStyle={styles.selectedItemTextStyle}
          unselectedItemTextStyle={styles.selectedItemTextStyle}
          selectedItemBackgroundColor="#222831"
          unselectedItemBackgroundColor="#ececec"
          flatListContainerStyle={styles.flatListContainerStyle}
        />
        <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
          Select Time
        </Text>

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={times}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedTime(item.time)}
              style={[
                { margin: 10, borderRadius: 7, padding: 15 },
                selectedTime.includes(item.time)
                  ? {
                      borderColor: "red",
                      borderWidth: 1,
                    }
                  : {
                      borderColor: "gray",
                      borderWidth: 0.7,
                    },
              ]}
            >
              <Text
                style={selectedTime.includes(item.time) && { fontWeight: 600 }}
              >
                {item.time}
              </Text>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />

        <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
          Delivery Date
        </Text>

        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={deliveryTime}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setDelivery(item.name)}
              style={[
                { margin: 10, borderRadius: 7, padding: 15 },
                delivery.includes(item.name)
                  ? {
                      borderColor: "red",
                      borderWidth: 1,
                    }
                  : {
                      borderColor: "gray",
                      borderWidth: 0.7,
                    },
              ]}
            >
              <Text style={delivery.includes(item.name) && { fontWeight: 600 }}>
                {item.name}
              </Text>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      </SafeAreaView>

      {total === 0 ? null : (
        <Pressable
          style={{
            backgroundColor: "#088F8F",
            marginTop: "auto",
            padding: 10,
            marginBottom: 40,
            margin: 15,
            borderRadius: 7,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
              {cart.length} items | $ {total}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: "400",
                color: "white",
                marginVertical: 6,
              }}
            >
              Extra charges might apply
            </Text>
          </View>

          <Pressable
            onPress={proceedToCart}
            style={{
              borderWidth: 0.8,
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 7,
              borderColor: "#fff",
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
              Proceed to Cart
            </Text>
          </Pressable>
        </Pressable>
      )}
    </>
  );
};

export default PickUp;

const styles = StyleSheet.create({});
