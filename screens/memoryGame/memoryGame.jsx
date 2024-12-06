import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Card from './card';
import ResetButton from './resetButton';
import GoBackButton from '../../components/common/goBackButton';
import PlayButton from '../../components/therapy/playButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { savePointsToUser } from '../../services/pointsService';
import { getUserUUID } from '../../services/storageService';

const MemoryGame = () => {
  const initialCards = [
    { id: 1, value: require('../../assets/panda1.png'), flipped: false, matched: false },
    { id: 2, value: require('../../assets/panda1.png'), flipped: false, matched: false },
    { id: 3, value: require('../../assets/progress.webp'), flipped: false, matched: false },
    { id: 4, value: require('../../assets/progress.webp'), flipped: false, matched: false },
    { id: 5, value: require('../../assets/panda3.png'), flipped: false, matched: false },
    { id: 6, value: require('../../assets/panda3.png'), flipped: false, matched: false },
    { id: 7, value: require('../../assets/profile_col3.png'), flipped: false, matched: false },
    { id: 8, value: require('../../assets/profile_col3.png'), flipped: false, matched: false },
    { id: 9, value: require('../../assets/cat.png'), flipped: false, matched: false },
    { id: 10, value: require('../../assets/cat.png'), flipped: false, matched: false },
    { id: 11, value: require('../../assets/pandaProfil.png'), flipped: false, matched: false },
    { id: 12, value: require('../../assets/pandaProfil.png'), flipped: false, matched: false },
    { id: 13, value: require('../../assets/profile_col5.png'), flipped: false, matched: false },
    { id: 14, value: require('../../assets/profile_col5.png'), flipped: false, matched: false },
    { id: 15, value: require('../../assets/progress_col5.png'), flipped: false, matched: false },
    { id: 16, value: require('../../assets/progress_col5.png'), flipped: false, matched: false },
  ];

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const [cards, setCards] = useState(shuffle([...initialCards]));
  const [selectedCards, setSelectedCards] = useState([]);
  const [matches, setMatches] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [pointsAwarded, setPointsAwarded] = useState(false);
  const [gameState, setGameState] = useState('start'); 

  useEffect(() => {
    if (selectedCards.length === 2) {
      checkMatch();
    }
  }, [selectedCards]);

  useEffect(() => {
    if (matches === 8 && !pointsAwarded) {
      setGameWon(true);
      awardPoints();
    }
  }, [matches]);

  const awardPoints = async () => {
    try {
      const userId = await getUserUUID();
      await savePointsToUser(userId, 50);
      console.log('50 points added to the user');
      setPointsAwarded(true);
    } catch (error) {
      console.error('Error while saving points', error);
    }
  };

  const flipCard = (index) => {
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    setSelectedCards((prev) => [...prev, index]);
  };

  const checkMatch = () => {
    const [firstIndex, secondIndex] = selectedCards;
    if (cards[firstIndex].value === cards[secondIndex].value) {
      const newCards = [...cards];
      newCards[firstIndex].matched = true;
      newCards[secondIndex].matched = true;
      setCards(newCards);
      setMatches(matches + 1);
    } else {
      setTimeout(() => {
        const newCards = [...cards];
        newCards[firstIndex].flipped = false;
        newCards[secondIndex].flipped = false;
        setCards(newCards);
      }, 1000);
    }
    setSelectedCards([]);
  };

  const resetGame = () => {
    setCards(shuffle(initialCards.map((card) => ({ ...card, flipped: false, matched: false }))));
    setMatches(0);
    setSelectedCards([]);
    setGameWon(false);
    setPointsAwarded(false);
    setGameState('start');
  };

  if (gameState === 'start') {
    return (
      <SafeAreaView style={styles.background}>
        <GoBackButton screen={'Overview'} />
        <View style={styles.overlay}>
          <Text style={styles.title}>Memory Game</Text>
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              Flip the cards to find matching pairs. Match all pairs to win the game and earn 50 points!
            </Text>
            <PlayButton onPress={() => setGameState('playing')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.background}>
      <GoBackButton screen={'Overview'} />
      <View style={styles.container}>
        {cards.map((card, index) => (
          <Card key={index} card={card} index={index} onPress={flipCard} />
        ))}
      </View>
      {gameWon && (
        <Text style={styles.wonText}>
          Congratulations! You won and earned 50 points!
        </Text>
      )}
      {gameWon && <ResetButton onPress={resetGame} />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#A0BDC7',
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    margin: 'auto',
    marginTop: 170,
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  instructionBox: {
    padding: 20,
    backgroundColor: '#A0BDC7',
    borderRadius: 10,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop:30,
    marginBottom: -30,
  },
  wonText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
});

export default MemoryGame;
