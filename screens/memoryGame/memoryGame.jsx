import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Card from './card';
import ResetButton from './resetButton';
import GoBackButton from '../../components/common/goBackButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import progressImage from '../../assets/progress_col5.png';
import { savePointsToUser } from '../../services/pointsService';
import { getUserUUID } from '../../services/storageService';


const MemoryGame = () => {
    const initialCards = [
      { id: 1, value: require('../../assets/panda1.png'), flipped: false, matched: false },
      { id: 2, value: require('../../assets/panda1.png'), flipped: false, matched: false },
      { id: 3, value: require('../../assets/panda2.png'), flipped: false, matched: false },
      { id: 4, value: require('../../assets/panda2.png'), flipped: false, matched: false },
      { id: 5, value: require('../../assets/panda3.png'), flipped: false, matched: false },
      { id: 6, value: require('../../assets/panda3.png'), flipped: false, matched: false },
      { id: 7, value: require('../../assets/panda4.png'), flipped: false, matched: false },
      { id: 8, value: require('../../assets/panda4.png'), flipped: false, matched: false },
      { id: 9, value: require('../../assets/katze.png'), flipped: false, matched: false },
      { id: 10, value: require('../../assets/katze.png'), flipped: false, matched: false },
      { id: 11, value: require('../../assets/pandaProfil.png'), flipped: false, matched: false },
      { id: 12, value: require('../../assets/pandaProfil.png'), flipped: false, matched: false },
      { id: 13, value: require('../../assets/pandaSetting.png'), flipped: false, matched: false },
      { id: 14, value: require('../../assets/pandaSetting.png'), flipped: false, matched: false },
      { id: 15, value: require('../../assets/progress_col5.png'), flipped: false, matched: false },
      { id: 16, value: require('../../assets/progress_col5.png'), flipped: false, matched: false },
    ];
  
    const shuffle = (array) => array.sort(() => Math.random() - 0.5);
  
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
  
    const resetGame = async () => {
      const userId = await getUserUUID();
      savePointsToUser(userId, 50);
      setCards(shuffle(initialCards.map(card => ({ ...card, flipped: false, matched: false }))));
      setMatches(0);
      setSelectedCards([]);
    };
  
    return (
        <SafeAreaView style={styles.background}>
          <GoBackButton screen={"Overview"}/>
          <View style={styles.container}>
            {cards.map((card, index) => (
              <Card key={index} card={card} index={index} onPress={flipCard} />
            ))}
          </View>
          {matches === 8 && <ResetButton onPress={resetGame} />}
        </SafeAreaView>
      );
  };
  
  const styles = StyleSheet.create({
    background: {
        flex: 1,
        backgroundColor: '#a3afc0',
      },
    container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'center',
      alignItems: 'center',
      width: 300,
      margin: 'auto',
      marginTop: 200, 
    },
  });

export default MemoryGame;
