import React from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import Animated, {
  SensorType,
  useAnimatedSensor,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

function clampWorklet(num: number, min: number, max: number) {
  'worklet';

  return Math.min(Math.max(num, min), max);
}

const OFFSET_X = 100; //in px
const OFFSET_Y = 100; //in px

export default function AnimatedSensorAccelerometerExample() {
  const animatedSensor = useAnimatedSensor(SensorType.ACCELEROMETER);

  const xOffset = useSharedValue(-OFFSET_X);
  const yOffset = useSharedValue(0);
  const zOffset = useSharedValue(0);

  const animatedStyles = useAnimatedStyle(() => {
    const { x, y, z } = animatedSensor.sensor.value;
    // The x vs y here seems wrong but is the way to make it feel right to the user
    xOffset.value = clampWorklet(
      xOffset.value - x,
      -OFFSET_X * 2,
      OFFSET_X / 4
    );
    yOffset.value = clampWorklet(yOffset.value - y, -OFFSET_Y, OFFSET_Y);
    zOffset.value = clampWorklet(zOffset.value + z * 0.1, 0.5, 2);
    return {
      transform: [
        { translateX: withSpring(-OFFSET_X - xOffset.value) },
        { translateY: withSpring(yOffset.value) },
        { scaleX: withSpring(zOffset.value) },
        { scaleY: withSpring(zOffset.value) },
      ],
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <Pressable
        style={styles.button}
        onPress={() => {
          xOffset.value = -OFFSET_X;
          yOffset.value = 0;
          zOffset.value = 0;
        }}>
        <Text>Reset</Text>
      </Pressable>
      <View style={styles.wrapper}>
        <Animated.View style={[styles.box, animatedStyles]} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: 'navy',
    height: 100,
    width: 100,
  },
  button: {
    flex: 1,
    maxHeight: 40,
    marginTop: 16,
    backgroundColor: 'red',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
});
