import React, { useState, useEffect } from 'react';
import { View, Image, TouchableOpacity, StyleSheet, Text } from 'react-native';

const MemoryGame = () => {
  const initialCards = [
    { id: 1, value: require('../assets/panda1.png'), flipped: false, matched: false },
    { id: 2, value: require('../assets/panda1.png'), flipped: false, matched: false },
    { id: 3, value: require('../assets/panda2.png'), flipped: false, matched: false },
    { id: 4, value: require('../assets/panda2.png'), flipped: false, matched: false },
    { id: 5, value: require('../assets/panda3.png'), flipped: false, matched: false },
    { id: 6, value: require('../assets/panda3.png'), flipped: false, matched: false },
    { id: 7, value: require('../assets/panda4.png'), flipped: false, matched: false },
    { id: 8, value: require('../assets/panda4.png'), flipped: false, matched: false },
  ];

  const shuffle = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  const [cards, setCards] = useState(shuffle([...initialCards])); 
  const [selectedCards, setSelectedCards] = useState([]);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    if (selectedCards.length === 2) {
      checkMatch();
    }
  }, [selectedCards]);

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
    setCards(shuffle(initialCards.map(card => ({ ...card, flipped: false, matched: false }))));
    setMatches(0);
    setSelectedCards([]);
  };

  return (
    <View style={styles.container}>
      {cards.map((card, index) => (
        <TouchableOpacity
          key={index}
          onPress={() => !card.flipped && !card.matched && flipCard(index)}
          style={styles.card}
        >
          {card.flipped || card.matched ? (
            <Image source={card.value} style={styles.cardImage} />
          ) : (
            <Text style={styles.cardText}>?</Text>
          )}
        </TouchableOpacity>
      ))}
      {matches === 4 && (
        <TouchableOpacity onPress={resetGame} style={styles.resetButton}>
          <Text style={styles.resetButtonText}>Spiel neu starten</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 300,
  },
  card: {
    width: 60,
    height: 60,
    margin: 10,
    flexDirection: 'row',
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
  },
  cardText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  resetButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#cbedd2',
    borderRadius: 5,
  },
  resetButtonText: {
    color: '#www',
    fontSize: 16,
  },
});

export default MemoryGame;
