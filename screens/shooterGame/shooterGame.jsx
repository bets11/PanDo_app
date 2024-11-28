import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, PanResponder, Text, Button, TouchableWithoutFeedback  } from 'react-native';
import Paddle from './paddle';
import Ball from './ball';
import Brick from './brick';
import { savePointsToUser } from '../../services/pointsService';
import { getUserUUID } from '../../services/storageService';

const { width, height } = Dimensions.get('window');

const BRICK_WIDTH = 60;
const BRICK_HEIGHT = 20;
const BRICK_ROWS = 20;
const BRICK_COLUMNS = Math.floor(width / BRICK_WIDTH);

const ShooterGame = () => {
  const [paddlePosition, setPaddlePosition] = useState({ x: width / 2 - 50 });
  const [ballPosition, setBallPosition] = useState({ x: width / 2 - 10, y: height / 2 - 10 });
  const [ballVelocity, setBallVelocity] = useState({ x: 0, y: 0 });
  const [gameState, setGameState] = useState('start');
  const [bricks, setBricks] = useState(initializeBricks());
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [IsStartButtonPressed, setIsStartButtonPressed] = useState(false);

  function initializeBricks() {
    return Array.from({ length: BRICK_ROWS * BRICK_COLUMNS }, (_, index) => ({
      id: index,
      position: {
        x: (index % BRICK_COLUMNS) * BRICK_WIDTH,
        y: Math.floor(index / BRICK_COLUMNS) * BRICK_HEIGHT + 100,
      },
      width: BRICK_WIDTH,
      height: BRICK_HEIGHT,
      destroyed: false,
    }));
  }

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gestureState) => {
      if (gameState === 'start' || gameState === 'playing') {
        let newPosX = gestureState.moveX - 50;
        if (newPosX < 0) newPosX = 0;
        if (newPosX > width - 100) newPosX = width - 100;
        setPaddlePosition({ x: newPosX });

        if (gameState === 'start') {
          setBallPosition({ x: newPosX + 50 - 10, y: height - 70 });
        }
      }
    },
  });

  useEffect(() => {
    if (gameState !== 'playing') return;

    const interval = setInterval(() => {
      setBallPosition((prevPosition) => {
        let newX = prevPosition.x + ballVelocity.x;
        let newY = prevPosition.y + ballVelocity.y;

        if (newX <= 0 || newX >= width - 20) {
          setBallVelocity((prevVelocity) => ({ ...prevVelocity, x: -prevVelocity.x }));
        }
        if (newY <= 0) {
          setBallVelocity((prevVelocity) => ({ ...prevVelocity, y: -prevVelocity.y }));
        }
        if (
          newY + 20 >= height - 40 &&
          newX + 20 >= paddlePosition.x &&
          newX <= paddlePosition.x + 100
        ) {
          setBallVelocity((prevVelocity) => ({ ...prevVelocity, y: -prevVelocity.y }));
          newY = height - 60;
        }
        if (newY >= height - 20) {
            setLives((prevLives) => {
              const updatedLives = prevLives - 1;
              if (updatedLives <= 0) {
                setGameState('gameOver');
              }
              return updatedLives;
            });
            return { x: paddlePosition.x + 50 - 10, y: height - 70 }; 
          }

          const updatedBricks = bricks.map((brick) => {
            if (
              !brick.destroyed &&
              newX + 20 >= brick.position.x &&
              newX <= brick.position.x + brick.width &&
              newY + 20 >= brick.position.y &&
              newY <= brick.position.y + brick.height
            ) {
              setBallVelocity((prevVelocity) => ({ ...prevVelocity, y: -prevVelocity.y }));
              setScore((prevScore) => prevScore + 10); 
              return { ...brick, destroyed: true };
            }
            return brick;
          });

        setBricks(updatedBricks);

        const allBricksDestroyed = updatedBricks.every((brick) => brick.destroyed);
        if (allBricksDestroyed) {
          setGameState('won');
        }

        return { x: newX, y: newY };
      });
    }, 16);

    return () => clearInterval(interval);
  }, [ballVelocity, bricks, paddlePosition, gameState]);

  const startGame = () => {
    setBallVelocity({ x: 6, y: -6 }); 
    setGameState('playing');
  };

  const resetGame = async () => {
    const userId = await getUserUUID();
    savePointsToUser(userId, score);
    setGameState('start');
    setScore(0);
    setLives(3);
    setBricks(initializeBricks());
    setBallPosition({ x: paddlePosition.x + 50 - 10, y: height - 70 }); 
    setBallVelocity({ x: 0, y: 0 });
    setIsStartButtonPressed(false);
  };


  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <View style={styles.status}>
        <Text style={styles.statusText}>Score: {score}</Text>
        <Text style={styles.statusText}>Lives: {lives}</Text>
      </View>
      {gameState === 'start' && !IsStartButtonPressed && (
        <View style={styles.overlay}>
          <Text style={styles.title}>Breakout Game</Text>
          <Button title="Start Game" onPress={() => setIsStartButtonPressed(true)} />
        </View>
      )}
      {gameState === 'start' && IsStartButtonPressed && (
        <TouchableWithoutFeedback onPress={() => startGame()}>
          <View style={styles.overlay}>
            <Text style={styles.subtitle}>Tap anywhere to start</Text>
          </View>
        </TouchableWithoutFeedback>
      )}
      {gameState === 'gameOver' && (
        <View style={styles.overlay}>
          <Text style={styles.title}>Game Over</Text>
          <Button title="Play Again" onPress={resetGame} />
        </View>
      )}
      {gameState === 'won' && (
        <View style={styles.overlay}>
          <Text style={styles.title}>You Won!</Text>
          <Button title="Play Again" onPress={resetGame} />
        </View>
      )}
      {gameState === 'playing' && (
        <>
          <Paddle position={paddlePosition} />
          <Ball position={ballPosition} />
          {bricks.map(
            (brick) =>
              !brick.destroyed && (
                <Brick
                  key={brick.id}
                  position={brick.position}
                  width={brick.width}
                  height={brick.height}
                />
              )
          )}
        </>
      )}
    </View>
  );
}
  

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DFFFD6',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    color: '#fff',
    marginBottom: 20,
  },
  status: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    marginTop: 40,
  },
  statusText: {
    fontSize: 18,
    color: '#333',
  },
});

export default ShooterGame;