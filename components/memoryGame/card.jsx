import React from 'react';
import { TouchableOpacity, Image, Text, StyleSheet } from 'react-native';

const Card = ({ card, index, onPress }) => {
  return (
    <TouchableOpacity
      onPress={() => !card.flipped && !card.matched && onPress(index)}
      style={styles.card}
    >
      {card.flipped || card.matched ? (
        <Image source={card.value} style={styles.cardImage} />
      ) : (
        <Text style={styles.cardText}>?</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 60,
    height: 60,
    margin: 5, 
    backgroundColor: '#bdccd1',
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
});

export default Card;
