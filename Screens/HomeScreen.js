import React from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  ScrollView,
  FlatList,
  TouchableNativeFeedback,
  NetInfo,
  Dimensions,
  Platform
} from "react-native";

const { width } = Dimensions.get("window");

// import {
//   AdMobBanner,
//   AdMobInterstitial,
//   PublisherBanner,
//   AdMobRewarded
// } from "react-native-admob";

import LinearGradient from "react-native-linear-gradient";
import firebase from "react-native-firebase";

import verCheck from "./verCheck";
import OfflineNotice from "./OfflineNotice";

import "../adMob";

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    title: "Matka Tips Today",
    headerStyle: {
      backgroundColor: "#f3d104"
    },
    headerTintColor: "#721f00",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  };

  constructor() {
    super();
    this.unsubscribe = null;
    this.state = {
      isLoading: true,
      categories: []
    };
    this.ref = firebase.firestore().collection("categories");
  }

  componentDidMount() {
    verCheck();
    const advert = firebase.admob().interstitial(global.adMobIds.interstitial);
    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();
    advert.loadAd(request.build());

    advert.on("onAdLoaded", () => {
      advert.show();
    });

    this.unsubscribe = this.ref.onSnapshot(querySnapshot => {
      const categories = [];
      querySnapshot.forEach(doc => {
        const { name, title, result } = doc.data();
        categories.push({
          key: doc.id,
          doc,
          name,
          title,
          result
        });
      });
      this.setState({
        categories,
        loading: false
      });
    });
  }

  pressRow(item) {
    this.props.navigation.navigate("ResultsScreen", item);
  }

  render() {
    const Banner = firebase.admob.Banner;

    const AdRequest = firebase.admob.AdRequest;
    const request = new AdRequest();

    return (
      <View style={{ flex: 1 }}>
        <LinearGradient
          colors={["#f3d104", "#7b3c15"]}
          style={{ height: "100%" }}
        >
          <StatusBar backgroundColor="#f3d104" barStyle="dark-content" />
          <OfflineNotice />
          <ScrollView style={styles.scroll}>
            <View>
              <FlatList
                data={this.state.categories}
                renderItem={({ item }) => (
                  <View style={styles.buttonview}>
                    <TouchableNativeFeedback
                      style={{ borderRadius: 20 }}
                      background={TouchableNativeFeedback.Ripple(
                        "#ececec",
                        true
                      )}
                      useForeground={true}
                      onPress={() => {
                        this.pressRow(item);
                      }}
                    >
                      <View style={styles.button}>
                        <Text style={styles.buttontext}>{item.name}</Text>
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                )}
              />
            </View>
          </ScrollView>
          <Banner
            unitId={global.adMobIds.banner}
            size={"SMART_BANNER"}
            request={request.build()}
          />
          <View style={styles.addView}>
            {/* <AdMobBanner
              adSize="banner"
              adUnitID="ca-app-pub-3940256099942544/6300978111"
              // testDevices={[AdMobBanner.simulatorId]}
              onAdFailedToLoad={error => console.error(error)}
            /> */}
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "white",
    padding: 12,
    width: 350,
    height: 63,
    borderRadius: 20,
    alignItems: "center",
    shadowOpacity: 0.2,
    elevation: 20
  },

  buttonview: {
    marginTop: 20,
    marginBottom: 10,
    alignItems: "center"
  },
  scroll: {
    width: "100%",
    height: "100%"
  },

  buttontext: {
    color: "grey",
    fontSize: 25,

    fontWeight: "700"
  },
  addView: {
    justifyContent: "center",
    alignItems: "center"
  },
  addText: {
    color: "white",
    textAlign: "center"
  },
  offlineContainer: {
    backgroundColor: "#b52424",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width,
    position: "absolute",
    top: 30
  },
  offlineText: {
    color: "#fff"
  }
});
