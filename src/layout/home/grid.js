import { useState } from "react";
import { Dimensions, Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Compare, { Before, After, DefaultDragger, Dragger } from 'react-native-before-after-slider-v2';
import { colors, ui } from "../../utils/styles";
import { TouchableWithoutFeedback } from "@gorhom/bottom-sheet";

const deviceWidth = Dimensions.get("window").width;

const CONTAINER_PADDING = 16;
const WRAPPER_GAP = 12;
const BOX_PADDING = 8;

const CONTAINER_TOTAL_PADDING = CONTAINER_PADDING * 2;
const BOX_WIDTH = (deviceWidth - CONTAINER_TOTAL_PADDING - WRAPPER_GAP) / 2;
const IMAGE_WIDTH = (deviceWidth - CONTAINER_TOTAL_PADDING - WRAPPER_GAP - BOX_PADDING) / 2;


export default function Grid({ items }) {

    const [state, setState] = useState({ scrollEnabled: true })

    const onMoveStart = () => {
        setState({ scrollEnabled: false });
    }
    const onMoveEnd = () => {
        setState({ scrollEnabled: true });
    }

    return (
        <View style={styles.container}>

            <View style={styles.wrapper}>
                <TouchableOpacity style={[styles.box, { justifyContent: "center", alignItems: "center", gap: 8, backgroundColor: "#fff"}]}>
                    <Image source={require("../../../assets/plus-dark.png")} style={styles.add} />
                    <Text style={ui.text}>Añadir nueva foto</Text>
                </TouchableOpacity>
                {
                    items && items.length > 0 ?
                        items.map((item, index) => {
                            return (
                                <TouchableWithoutFeedback key={index} onPress={() => console.log("a")}>
                                    <View style={styles.box}>
                                        <Compare initial={((deviceWidth / 2) - 16 - 16) / 2} draggerWidth={50} height={125} width={((deviceWidth - 48) /2) - 16} onMoveStart={onMoveStart} onMoveEnd={onMoveEnd}>
                                            <Before>
                                                <Image style={styles.image} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/milanlaser-fcb24.appspot.com/o/omaha_bw.jpg?alt=media&token=9864378d-74d9-4579-830d-a56e50dc017d' }}  />
                                            </Before>
                                            <After>
                                                <Image style={styles.image} source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/milanlaser-fcb24.appspot.com/o/omaha_color.jpg?alt=media&token=7b3c5be6-ee90-40ec-9f1c-4b52ce655322' }} />
                                            </After>
                                            <DefaultDragger />
                                        </Compare>
                                    </View>
                                </TouchableWithoutFeedback>
                            )
                        })
                        :
                        [1,2,3,4, 5].map((_, index) => {
                            return (
                                <View key={index} style={[styles.box, { height: 150 }]}></View>
                            )
                        })
                }
                
            </View>

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