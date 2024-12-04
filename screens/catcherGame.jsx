import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Dimensions, Text, Image, PanResponder, Button, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { savePointsToUser } from '../services/pointsService';
import { getUserUUID } from '../services/storageService';
import PlayButton from '../components/therapy/playButton';
import GoBackButton from '../components/common/goBackButton';

const { width, height } = Dimensions.get('window');
const catcherSize = 150;
const elementSize = 100;

const CatcherGame = () => {
  const [catcherPosition, setCatcherPosition] = useState(new Animated.Value((width - catcherSize) / 2));
  const [elements, setElements] = useState([]);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'gameOver'
  const [isStartButtonPressed, setIsStartButtonPressed] = useState(false);

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
    if (gameState === 'gameOver') {
      const resetTimeout = setTimeout(resetGame, 3000);
      return () => clearTimeout(resetTimeout);
    }

    if (gameState === 'playing') {
      const interval = setInterval(() => spawnElement(), 1000);
      return () => clearInterval(interval);
    }
  }, [gameState]);

  const resetGame = async () => {
    const userId = await getUserUUID();
    savePointsToUser(userId, score);
    setScore(0);
    setErrors(0);
    setElements([]);
    setGameState('start');
    setIsStartButtonPressed(false);
  };

  const spawnElement = () => {
    const xPosition = Math.random() * (width - elementSize);
    const type = Math.random() < 0.6 ? 'fallingPanda' : 'cat';
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
              setGameState('gameOver');
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
        } else if (element.type === 'cat') {
          setScore((prevScore) => prevScore - 1);
          setErrors((prevErrors) => {
            const newErrors = prevErrors + 1;
            if (newErrors >= 3) {
              setGameState('gameOver');
            }
            return newErrors;
          });
        }
        setElements((prevElements) => prevElements.filter((item) => item.id !== element.id));
      }
    });
  };

  useEffect(() => {
    if (gameState === 'playing') {
      const collisionInterval = setInterval(checkCollision, 50);
      return () => clearInterval(collisionInterval);
    }
  }, [elements, catcherPosition, gameState]);

  return (
    <SafeAreaView style={styles.container} {...panResponder.panHandlers}>
      <GoBackButton />
      {gameState === 'start' && !isStartButtonPressed && (
      <View style={[styles.overlay]} pointerEvents="box-none">
        <View style={styles.centeredView}>
        <Text style={styles.title}>Catcher Game</Text>
        <Text style={styles.text}>
          Catch all the pandas, do not touch any cats! 
          If you lose 3 pandas or catch 3 cats, you will lose
        </Text>
      </View>
      <View style={styles.instructionBox}>
        <Image source={require('../assets/progress_col1.png')} style={styles.instructionImage} />
        <Text style={styles.instructionText}>points</Text>
        <Image source={require('../assets/cat.png')} style={styles.instructionImage} />
        <Text style={styles.instructionText}>penalty points</Text>
        <Image source={require('../assets/baum.png')} style={styles.instructionImage} />
        <Text style={styles.instructionText}>catcher for all objects</Text>
        <PlayButton onPress={() => setIsStartButtonPressed(true)} />
      </View>
      </View>
    )}

    {gameState === 'start' && isStartButtonPressed && (
      <TouchableWithoutFeedback onPress={() => setGameState('playing')}>
        <View style={[styles.overlay]} pointerEvents="box-none">
          <Text style={styles.subtitle}>Tap here to start</Text>
        </View>
      </TouchableWithoutFeedback>
    )}

      {gameState === 'gameOver' && (
        <View style={styles.overlay}>
          <Text style={styles.title}>Game Over</Text>
        </View>
      )}
      {gameState === 'playing' && (
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
                source={
                  element.type === 'fallingPanda'
                    ? require('../assets/progress_col1.png')
                    : require('../assets/cat.png')
                }
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
    </SafeAreaView>
  );
};

export default CatcherGame;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFFFD6', 
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20, 
  },
  title: {
    marginTop: 90,
    fontSize: 34, 
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10, 
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 22, 
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 80,
    right: 20,
    color: '#4CAF50', 
  },
  errors: {
    fontSize: 24,
    fontWeight: 'bold',
    position: 'absolute',
    top: 120,
    right: 20,
    color: '#F44336', 
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
  instructionImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  instructionText: {
    marginBottom: 15,
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center', 
  },
  text: {
    fontSize: 18, 
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20, 
    marginTop: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructionBox: {
    marginBottom: 130,
    padding: 20,
    backgroundColor: '#E3F6CE', 
    borderRadius: 10,
    elevation: 5, 
    width: '90%',
    alignItems: 'center',
  },
});
