import { router, useLocalSearchParams } from "expo-router";
import { Alert, Dimensions, Image, Platform, ScrollView, Share, StyleSheet, Text, TextInput, ToastAndroid, TouchableOpacity, View } from "react-native";
import { colors, ui } from "../src/utils/styles";
import { useCallback, useEffect, useRef, useState } from "react";
import Header from "../src/layout/header";
// import { getRecordFromId, insertRecord, updateRecord } from "../src/utils/sqlite";
// import { convertDateToString } from "../src/utils/date";
// import ImagePreviewResult from "../src/layout/image-preview-result";
// import * as Clipboard from 'expo-clipboard';
import LottieView from 'lottie-react-native';
// import BottomSheet, {
// BottomSheetScrollView,
// } from '@gorhom/bottom-sheet';
// import { languages } from "../src/utils/languages";
// import { openai } from "../src/components/openai";
// import { GET_LANGUAGE_PROMPT } from "../src/utils/options";
// import { canAnalyze, subtractCredit } from "../src/utils/credits";
import CreditsModal from "../src/layout/credits-modal";
// import { useExportPdf } from "../src/hooks/useExportPdf";
import Compare, { Before, After, DefaultDragger, Dragger } from 'react-native-before-after-slider-v2';
import { insertRecord } from "../src/utils/sqlite";

const deviceWidth = Dimensions.get("window").width;
const deviceHeight = Dimensions.get("window").height;
const CONTAINER_PADDING = 16;
const CONTAINER_GAP = 16;
const ACTIONS_VERTICAL_PADDING = 12;
const BUTTON_PADDING = 8;
const ICON_SIZE = 25;

const CONTAINER_TOTAL_PADDING = CONTAINER_PADDING * 2;
const IMAGE_WIDTH = (deviceWidth - CONTAINER_TOTAL_PADDING);
console.log(deviceHeight);
export default function Result() {
    
    const params = useLocalSearchParams();
    
    const [record, setRecord] = useState({ id: null, old_image: null, new_image: null });
    const [isSaved, setIsSaved] = useState(false);
    const [textHeight, setTextHeight] = useState(null);

    const [imageHeight, setImageHeight] = useState(null);
    useEffect(() => {
        if (textHeight) {
            const IMAGE_HEIGHT = deviceHeight - CONTAINER_TOTAL_PADDING - CONTAINER_GAP - (40 + 32 + 2) - (ACTIONS_VERTICAL_PADDING * 2) - (BUTTON_PADDING * 2) - ICON_SIZE - textHeight;
            setImageHeight(IMAGE_HEIGHT);
        }
    }, [textHeight])

    // Gestión de modales
    const [activeModal, setActiveModal] = useState(null);
    const openModal = (name) => setActiveModal(name);
    const closeModal = () => setActiveModal(null);

    useEffect(() => {
        if (record.result && !isSaved) {
            saveResult();
        }
    }, [record])

    useEffect(() => {
        init();
        /* setRecord({
            id: 1,
            old_image: "https://replicate.delivery/pbxt/KDMlP32TacO7kGUrnR1DCM0nVfXDrkbe8gnRqSmgYMLHQVqh/Einstein%2C%20Rejection%2C%20and%20Crafting%20a%20Future.jpeg",
            new_image: "https://replicate.delivery/pbxt/78o8s7hxKPayH9CJsQ9O9HkvBP5TD7QaF2X07kfDfGrZAzLSA/out.png"
        }) */

    }, [])

    async function init() {
        if (!params.id) {
            const photo = JSON.parse(params.image);
            analyze(photo);
        } else {
            fetchRecord(params.id);
        }
    }

    // Guardar resultado
    async function saveResult() {
        setIsSaved(true); // Registrar flag
        const id = await insertRecord(record.old_image, record.new_image, convertDateToString(new Date())); // Recuperar id del item guardado
        setRecord(prev => ({ ...prev, id: id }));
    }

    // Recuperar registro dado un id
    async function fetchRecord(id) {
        setIsSaved(true); // Flag para no persistir

        // Recuperar registro y settear valores
        const result = await getRecordFromId(id);
        setRecord({ id: id, old_image: result.old_image, new_image: result.new_image });
    }

    async function analyze(photo) {
        const formData = new FormData();
        formData.append('image', {
            uri: photo.path,
            type: photo.mime,
            name: photo.filename,
        });
        try {
            const response = await fetch('https://replicate-proxy-seven.vercel.app/api/colorize', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });
            const responseText = await response.text();

            if (!response.ok) {
                console.error("Server returned error:", response.status, responseText);
                return;
            }
            const data = JSON.parse(responseText);
            console.log(data);
            setRecord(prev => ({ ...prev, old_image: photo.path, new_image: data.output }));
        } catch (error) {
            console.log(error);
            openModal("credits");
            // setRecord(prev => ({ ...prev, result: "Ha ocurrido un error durante la transcripción" }));
        } finally {
            subtractCredit();
        }
    }

    async function share() {
        /* try {
            await Share.share({ message: record.result });
        } catch (error) {
            console.error('Error al compartir:', error);
            if (Platform.OS === "android") {
                ToastAndroid.showWithGravityAndOffset(`Ha ocurrido un error`, ToastAndroid.SHORT, ToastAndroid.BOTTOM, 25, 50);
            } else {
                Alert.alert(`Ha ocurrido un error`);
            }
        } */
    }

    function changeImage() {
        router.back();
    }

    return (
        <>
            <Header
                title="Resultado"
                back={true}
            />
            <View style={styles.container}>


                <View style={styles.wrapper}>
                    {
                        imageHeight && record.new_image !== null ?
                            <View>
                                <Compare initial={(deviceWidth - 32) / 2} draggerWidth={50} height={imageHeight} width={(deviceWidth - 32)}>
                                    <Before>
                                        <Image style={[styles.image, { height: imageHeight }]} source={{ uri: record.old_image }} />
                                    </Before>
                                    <After>
                                        <Image style={[styles.image, { height: imageHeight }]} source={{ uri: record.new_image }} />
                                    </After>
                                    <DefaultDragger />
                                </Compare>
                            </View>
                            :
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                                <LottieView source={require("../assets/lottie/drawing.json")} style={styles.lottie} loop={true} autoPlay={true} />
                            </View>
                    }

                </View>
                {
                    record.old_image && record.new_image !== null &&
                    <View style={styles.actions}>
                        <View style={styles.action}>
                            <TouchableOpacity onPress={share} style={styles.button}>
                                <Image style={styles.icon} source={require("../assets/share-dark.png")} />
                            </TouchableOpacity>
                            <Text style={ui.h5} onLayout={(e) => setTextHeight(e.nativeEvent.layout.height)}>Compartir</Text>
                        </View>
                        <View style={styles.action}>
                            <TouchableOpacity onPress={() => changeImage()} style={styles.button}>
                                <Image style={styles.icon} source={require("../assets/picture-dark.png")} />
                            </TouchableOpacity>
                            <Text style={ui.h5}>Cambiar</Text>
                        </View>
                    </View>
                }

            </View>
            {activeModal === "credits" && <CreditsModal isOpen={activeModal === "credits"} closeModal={closeModal} />}

        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: colors.primary,
        padding: CONTAINER_PADDING,
    },
    wrapper: {
        flex: 1,
        position: "relative",
    },
    image: {
        width: IMAGE_WIDTH,
    },
    
    actions: {

        
        paddingVertical: ACTIONS_VERTICAL_PADDING,
        paddingHorizontal: 16,
        flexDirection: "row",
        justifyContent: "center",
        gap: 20,
        borderTopWidth: 2,
        borderColor: colors.accent,
        // height: (ACTIONS_VERTICAL_PADDING * 2) + (BUTTON_PADDING * 2) + ICON_SIZE,
    },

    action: {
        alignItems: "center",
        gap: 4,
    },

    button: {
        padding: BUTTON_PADDING,
        borderRadius: 100,
        backgroundColor: colors.accent,
    },
    icon: {
        width: ICON_SIZE,
        height: ICON_SIZE,
    },
    lottie: {
        width: "80%",
        height: "80%",
    },

})