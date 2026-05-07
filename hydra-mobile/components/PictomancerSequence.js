// hydra-mobile/components/PictomancerSequence.js

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Image, View, StyleSheet } from "react-native";

export function PictomancerSequence({
  frames = [],
  duration = 1200,
  loop = false,
  onFinish,
  matrixState,
  style
}) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  const normalizedFrames = useMemo(() => {
    return frames.filter(Boolean);
  }, [frames]);

  useEffect(() => {
    if (normalizedFrames.length === 0) return undefined;

    const interval = Math.max(1, duration / normalizedFrames.length);

    timerRef.current = setInterval(() => {
      setIndex(prev => {
        const next = prev + 1;
        const done = next >= normalizedFrames.length;

        if (done) {
          if (loop) {
            return 0;
          }

          clearInterval(timerRef.current);
          timerRef.current = null;

          if (typeof onFinish === "function") {
            onFinish({ matrixState, finalFrame: normalizedFrames[prev] });
          }

          return prev;
        }

        return next;
      });
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [normalizedFrames, duration, loop, matrixState, onFinish]);

  const source = normalizedFrames[index]
    ? { uri: normalizedFrames[index] }
    : null;

  return (
    <View style={[styles.container, style]}>
      {source ? <Image source={source} style={styles.image} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden"
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover"
  }
});
