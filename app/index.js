import { useCallback, useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Compare, { Before, After, DefaultDragger, Dragger } from 'react-native-before-after-slider-v2';
import { colors, ui } from "../src/utils/styles";
import Grid from "../src/layout/home/grid";
import Example from "../src/layout/home/example";
import Header from "../src/layout/header";
import { useFocusEffect } from "expo-router";
import { getAllRecords } from "../src/utils/sqlite";



export default function Home() {

    const [records, setRecords] = useState([]);
    useFocusEffect(
        useCallback(() => {
            fetchDb();
        }, [])
    );
    async function fetchDb() {
        const result = await getAllRecords();
        setRecords(result);
    }

    return (
        <>
            <Header />
            <View style={styles.container}>
                <Grid {...{ records }} />
                { records.length < 1 &&
                    <Example />
                }
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 8,
        backgroundColor: colors.primary,
        paddingVertical: 16
    }
})