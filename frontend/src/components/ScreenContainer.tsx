import React, { ReactNode, useEffect, useRef } from "react";
import { StyleSheet, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = {
    children: ReactNode;
    centerContent?: boolean;
};

export const ScreenContainer: React.FC<Props> = ({ children, centerContent }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
        }).start();
    }, [opacity]);

    return (
        <LinearGradient
            colors={["#020617", "#020617", "#111827"]}
            style={styles.gradient}
        >
            <Animated.View
                style={[
                    styles.content,
                    centerContent && styles.centerContent,
                    { opacity },
                ]}
            >
                {children}
            </Animated.View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    gradient: {
        flex: 1,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 32,
    },
    centerContent: {
        justifyContent: "center",
    },
});
