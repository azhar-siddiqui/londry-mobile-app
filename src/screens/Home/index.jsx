import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { services } from "../../data/data";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import * as Location from "expo-location";
import { Carousel, DressItem, Services } from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { getProducts } from "../../redux/slices/ProductReducer";

const Home = () => {
  const cart = useSelector((state) => state.cart.cart);
  // const [items, setItems] = useState([]);
  const product = useSelector((state) => state.product.product);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [displayCurrentAddress, setDisplayCurrentAddress] =
    useState("Loading....");
  const [locationServicesEnabled, setLocationServicesEnabled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    checkLocationEnabled();
    getCurrentLocation();
  }, [displayCurrentAddress, locationServicesEnabled]);

  const checkLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();

    if (!enabled) {
      Alert.alert(
        "Location services not enabled",
        "Please enable the location services",
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
    } else {
      setLocationServicesEnabled(enabled);
    }
  };

  const getCurrentLocation = async () => {
    let { status, granted, canAskAgain } =
      await Location.requestForegroundPermissionsAsync();

    if (!status && !granted) {
      Alert.alert(
        "Permission denied",
        "allow the app to use the location services",
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

    const { coords } = await Location.getCurrentPositionAsync();
    // console.log(coords);

    if (coords) {
      const { latitude, longitude } = coords;

      let response = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      //  country, name, postalCode

      for (let item of response) {
        const address = `${item.name}, ${item.country}, ${item.postalCode}`;
        setDisplayCurrentAddress(address);
      }
    }
  };

  useEffect(() => {
    if (product.length > 0) return;

    const fetchProducts = async () => {
      //   const colRef = collection(db, "types");
      //   const docsSnap = await getDocs(colRef);

      //   docsSnap.forEach((doc) => {
      //     items.push(doc.data());
      //   });

      services?.map((service) => dispatch(getProducts(service)));
    };

    fetchProducts();
  }, []);

  return (
    <SafeAreaView style={{ backgroundColor: "#F0F0F0", flex: 1 }}>
      <View style={{ flexDirection: "row", alignItems: "center", padding: 10 }}>
        <MaterialIcons name="location-on" size={30} color="#fd5c63" />
        <View>
          <Text style={{ fontSize: 18, fontWeight: "600" }}>Home</Text>
          <Text>{displayCurrentAddress}</Text>
        </View>
        <Pressable
          onPress={() => navigation.navigate("Profile")}
          style={{ marginLeft: "auto", marginRight: 7 }}
        >
          <Image
            style={{ width: 40, height: 40, borderRadius: 20 }}
            source={{
              uri: "https://lh3.googleusercontent.com/ogw/AAEL6sh_yqHq38z35QMy5Fnb8ZIxicdxCIVM9PeBD2j-=s64-c-mo",
            }}
          />
        </Pressable>
      </View>
      {/* Search Bar */}

      <View
        style={[
          {
            padding: 10,
            margin: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            borderRadius: 7,
          },
          {
            borderColor: isFocused ? "black" : "#C0C0C0",
            borderWidth: isFocused ? 1 : 0.8,
          },
        ]}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Feather name="search" size={24} color="#fd5c63" />
          <TextInput
            placeholder="Search for items or More"
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
          />
        </View>
        <Pressable>
          <Feather name="mic" size={24} color="#fd5c63" />
        </Pressable>
      </View>
      <ScrollView>
        {/* Image Carousel */}
        <Carousel />

        {/* Services Component */}
        <Services />

        {/* Render all the Products */}
        {product.map((item, index) => (
          <DressItem item={item} key={index} />
        ))}
      </ScrollView>

      {total === 0 ? null : (
        <Pressable
          style={{
            backgroundColor: "#088F8F",
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
            onPress={() => navigation.navigate("PickUp")}
            style={{
              borderWidth: 0.8,
              paddingVertical: 5,
              paddingHorizontal: 10,
              borderRadius: 7,
              borderColor: "#fff",
            }}
          >
            <Text style={{ fontSize: 17, fontWeight: "600", color: "white" }}>
              Proceed to Pickup
            </Text>
          </Pressable>
        </Pressable>
      )}
    </SafeAreaView>
  );
};

export default Home;
