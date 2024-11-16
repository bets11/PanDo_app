import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text, Image, PanResponder } from 'react-native';

const { width, height } = Dimensions.get('window');
const catcherSize = 100;
const elementSize = 80;

const CatcherGame = () => {
  const [catcherPosition, setCatcherPosition] = useState(new Animated.Value((width - catcherSize) / 2));
  const [elements, setElements] = useState([]);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const newPosition = Math.min(width - catcherSize, Math.max(0, gestureState.moveX - catcherSize / 2));
        catcherPosition.setValue(newPosition);
      },
    })
  ).current;

  useEffect(() => {
    if (gameOver) {
      const resetTimeout = setTimeout(resetGame, 3000);
      return () => clearTimeout(resetTimeout);
    }

    const interval = setInterval(() => spawnElement(), 1000);
    return () => clearInterval(interval);
  }, [gameOver]);

  const resetGame = () => {
    setScore(0);
    setErrors(0);
    setElements([]);
    setGameOver(false);
  };

  const spawnElement = () => {
    const xPosition = Math.random() * (width - elementSize);
    const type = Math.random() < 0.6 ? 'fallingPanda' : 'katze';
    const newElement = {
      id: Date.now(),
      xPosition,
      type,
      animation: new Animated.Value(0),
    };

    setElements((prevElements) => [...prevElements, newElement]);

    Animated.timing(newElement.animation, {
      toValue: height,
      duration: 4000,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        if (newElement.type === 'fallingPanda') {
          setErrors((prevErrors) => {
            const newErrors = prevErrors + 1;
            if (newErrors >= 3) {
              setGameOver(true);
            }
            return newErrors;
          });
        }
        setElements((prevElements) => prevElements.filter((item) => item.id !== newElement.id));
      }
    });
  };

  const checkCollision = () => {
    const catcherX = catcherPosition.__getValue();
    const catcherY = height - catcherSize;

    elements.forEach((element) => {
      const elementX = element.xPosition;
      const elementY = element.animation.__getValue();

      if (
        elementY + elementSize >= catcherY &&
        elementY <= catcherY + catcherSize &&
        elementX + elementSize >= catcherX &&
        elementX <= catcherX + catcherSize
      ) {
        if (element.type === 'fallingPanda') {
          setScore((prevScore) => prevScore + 1);
        } else if (element.type === 'katze') {
          setScore((prevScore) => prevScore - 1);
          setErrors((prevErrors) => {
            const newErrors = prevErrors + 1;
            if (newErrors >= 3) {
              setGameOver(true);
            }
            return newErrors;
          });
        }
        setElements((prevElements) => prevElements.filter((item) => item.id !== element.id));
      }
    });
  };

  useEffect(() => {
    if (!gameOver) {
      const collisionInterval = setInterval(checkCollision, 50);
      return () => clearInterval(collisionInterval);
    }
  }, [elements, catcherPosition, gameOver]);

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      {gameOver ? (
        <Text style={styles.gameOverText}>Game Over</Text>
      ) : (
        <>
          <Text style={styles.score}>Punkte: {score}</Text>
          <Text style={styles.errors}>Fehler: {errors}</Text>

          {elements.map((element) => (
            <Animated.View
              key={element.id}
              style={[
                styles.fallingElement,
                {
                  transform: [
                    { translateY: element.animation },
                    { translateX: element.xPosition },
                  ],
                },
              ]}
            >
              <Image
                source={element.type === 'fallingPanda' ? require('../assets/fallingPanda.png') : require('../assets/katze.png')}
                style={styles.elementImage}
              />
            </Animated.View>
          ))}

          <Animated.Image 
            source={require('../assets/baum.png')} 
            style={[styles.catcherImage, { transform: [{ translateX: catcherPosition }] }]} 
          />
        </>
      )}
    </View>
  );
};

export default CatcherGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#DFFFD6', 
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 50,
    left: 20,
  },
  errors: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 90,
    left: 20,
    color: 'red',
  },
  gameOverText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'red',
    alignSelf: 'center',
    marginTop: height / 2 - 50,
  },
  fallingElement: {
    position: 'absolute',
    width: elementSize,
    height: elementSize,
  },
  elementImage: {
    width: elementSize,
    height: elementSize,
    resizeMode: 'contain',
  },
  catcherImage: {
    position: 'absolute',
    bottom: 0,
    width: catcherSize,
    height: catcherSize,
    resizeMode: 'contain',
  },
});
