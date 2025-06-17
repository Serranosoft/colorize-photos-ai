import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Compare, { Before, After, DefaultDragger, Dragger } from 'react-native-before-after-slider-v2';
import { colors, ui } from "../src/utils/styles";
import Grid from "../src/layout/home/grid";
import Example from "../src/layout/home/example";
import Header from "../src/layout/header";



export default function Home() {
    
    useEffect(() => {
    }, [])

    return (
        <>
            <Header />
            <View style={styles.container}>
                <Grid />
                <Example />
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