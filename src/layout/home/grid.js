import { useState } from "react";
import { Dimensions, Image, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Compare, { Before, After, DefaultDragger, Dragger } from 'react-native-before-after-slider-v2';
import { colors, ui } from "../../utils/styles";
import { TouchableWithoutFeedback } from "@gorhom/bottom-sheet";
import { router } from "expo-router";

const deviceWidth = Dimensions.get("window").width;

const CONTAINER_PADDING = 16;
const WRAPPER_GAP = 12;
const BOX_PADDING = 8;

const CONTAINER_TOTAL_PADDING = CONTAINER_PADDING * 2;
const BOX_WIDTH = (deviceWidth - CONTAINER_TOTAL_PADDING - WRAPPER_GAP) / 2;
const IMAGE_WIDTH = (deviceWidth - CONTAINER_TOTAL_PADDING - WRAPPER_GAP - BOX_PADDING) / 2;


export default function Grid({ records }) {

    console.log(records);

    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.wrapper}>
                <TouchableOpacity
                    style={[styles.box, { justifyContent: "center", alignItems: "center", gap: 8, backgroundColor: "#fff" }]}
                    onPress={() => router.push("/result")}
                >
                    <Image source={require("../../../assets/plus-dark.png")} style={styles.add} />
                    <Text style={ui.text}>Añadir nueva foto</Text>
                </TouchableOpacity>
                {
                    records && records.length > 0 ?
                        records.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={index} onPress={() => router.navigate({ pathname: "/result", params: { id: item.id } })}>
                                    <View style={styles.box}>
                                        <Compare initial={((deviceWidth / 2) - 16 - 16) / 2} draggerWidth={50} height={125} width={((deviceWidth - 48) / 2) - 16}>
                                            <Before>
                                                <Image style={styles.image} source={require("../../../assets/example-before.jpeg")} />
                                            </Before>
                                            <After>
                                                <Image style={styles.image} source={require("../../../assets/example-after.png")} />
                                            </After>
                                            <DefaultDragger />
                                        </Compare>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                        :
                        [1, 2, 3, 4, 5].map((_, index) => {
                            return (
                                <View key={index} style={[styles.box, { height: 150 }]}></View>
                            )
                        })
                }

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        padding: CONTAINER_PADDING,
        alignItems: "center",
    },
    box: {
        padding: BOX_PADDING,
        backgroundColor: colors.secondary,
        borderRadius: 8,
        width: BOX_WIDTH,
    },
    wrapper: {
        flexDirection: "row",
        gap: WRAPPER_GAP,
        flexWrap: "wrap",
    },
    image: {
        width: IMAGE_WIDTH,
        height: deviceWidth / 2
    },
    add: {
        width: 48,
        height: 48,
    }
})