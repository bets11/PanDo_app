import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, Dimensions, SafeAreaView } from 'react-native';
import Element from '../components/catcherGame/element';
import Catcher from '../components/catcherGame/catcher';
import OverlayScreen from '../components/catcherGame/overlayScreen';
import ScoreDisplay from '../components/catcherGame/scoreDisplay';
import GoBackButton from '../components/common/goBackButton';
import { savePointsToUser } from '../services/pointsService';
import { getUserUUID } from '../services/storageService';

const { width, height } = Dimensions.get('window');
const catcherSize = 150;
const elementSize = 100;

const CatcherGame = () => {
  const [catcherPosition, setCatcherPosition] = useState(new Animated.Value((width - catcherSize) / 2));
  const [elements, setElements] = useState([]);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState(0);
  const [gameState, setGameState] = useState('start');

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

  const handleMove = (newPosition) => {
    catcherPosition.setValue(newPosition);
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

  const resetGame = async () => {
    const userId = await getUserUUID();
    await savePointsToUser(userId, score); 
    setScore(0);
    setErrors(0);
    setElements([]);
    setGameState('start');
  };

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

  useEffect(() => {
    if (gameState === 'playing') {
      const collisionInterval = setInterval(checkCollision, 50);
      return () => clearInterval(collisionInterval);
    }
  }, [elements, catcherPosition, gameState]);

  return (
    <SafeAreaView style={styles.container}>
      <GoBackButton screen={'Overview'} />
      <OverlayScreen
        gameState={gameState}
        onStart={() => setGameState('playing')}
        onReset={resetGame}
      />
      {gameState === 'playing' && (
        <>
          <ScoreDisplay score={score} errors={errors} />
          {elements.map((element) => (
            <Element key={element.id} {...element} />
          ))}
          <Catcher position={{ value: catcherPosition, maxWidth: width - catcherSize }} onMove={handleMove} />
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CBD4B3', 
  },
});

export default CatcherGame;
