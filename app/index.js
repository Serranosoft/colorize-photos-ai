import { useEffect, useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import Compare, { Before, After, DefaultDragger, Dragger } from 'react-native-before-after-slider-v2';
import { colors, ui } from "../src/utils/styles";
import Grid from "../src/layout/home/grid";



export default function Home() {
    
    useEffect(() => {
    }, [])

    return (
        <>
            <View style={styles.container}>
                <Grid />
                
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        gap: 16,
        backgroundColor: colors.primary,
    }
})