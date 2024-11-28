import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import Animation from '../components/animation/animation';
import GoBackButton from '../components/common/goBackButton';
import { getPointsFromUser, updateUserPoints } from '../services/pointsService';

export default function Progress() {
  const [showAnimation, setShowAnimation] = useState(true);
  const [currentPandaColor, setCurrentPandaColor] = useState(require('../assets/progress_col2.png')); 
  const [points, setPoints] = useState(0); 

  const colorCosts = {
    blue: 150,
    green: 120,
    yellow: 200,
    red: 100,
  };

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const userPoints = await getPointsFromUser(); 
        if (userPoints !== null) {
          setPoints(userPoints);
        } else {
          console.error("Could not fetch user points");
        }
      } catch (error) {
        console.error("Error fetching user points:", error.message);
      }
    };

    fetchPoints(); // Fetch points when the component mounts
  }, []);

  const handleAnimationEnd = () => {
    setShowAnimation(false);
  };

  const handleColorChange = async (color) => {
    const cost = colorCosts[color];
    if (points >= cost) {
      Alert.alert(
        "Confirm Purchase",
        `This color costs ${cost} points. Do you want to purchase it?`,
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: async () => {
              try {
                const newPoints = points - cost;
                await updateUserPoints(newPoints); // Update points in the database
                setPoints(newPoints); // Update points locally

                // Change the panda color
                let newColor;
                switch (color) {
                  case 'blue':
                    newColor = require('../assets/progress_col2.png');
                    break;
                  case 'green':
                    newColor = require('../assets/progress_col3.png');
                    break;
                  case 'yellow':
                    newColor = require('../assets/progress_col4.png');
                    break;
                  case 'red':
                    newColor = require('../assets/progress_col5.png');
                    break;
                  default:
                    return;
                }
                setCurrentPandaColor(newColor);
                Alert.alert("Purchase Successful", `You have successfully purchased the ${color} color!`);
              } catch (error) {
                console.error("Error updating points:", error.message);
                Alert.alert("Error", "Failed to update points. Please try again.");
              }
            },
          },
        ]
      );
    } else {
      Alert.alert("Insufficient Points", "You do not have enough points to buy this color.");
    }
  };


  const getShadowColor = () => {
    if (currentPandaColor === require('../assets/progress_col2.png')) {
      return 'blue';
    } else if (currentPandaColor === require('../assets/progress_col3.png')) {
      return 'green';
    } else if (currentPandaColor === require('../assets/progress_col4.png')) {
      return 'yellow';
    } else if (currentPandaColor === require('../assets/progress_col5.png')) {
      return 'red';
    }
    return '#000'; 
  };

  return (
    <View style={[styles.container, !showAnimation && styles.orangeBackground]}>
    <SafeAreaView style={styles.safeArea}>
      <GoBackButton screen={'Overview'} />
      <View style={styles.pointsContainer}>
        <Image source={require('../assets/star.png')} style={styles.starIcon} />
        <Text style={styles.pointsText}>{points}</Text>
      </View>
    </SafeAreaView>
    {showAnimation ? (
  <View style={{justifyContent: 'center', alignItems: 'center', width: '100%' }}>
    <Animation
      message="Great Job!"
      imageSource={require('../assets/panda.png')}
      animationDuration={4000}
      onAnimationEnd={handleAnimationEnd}
    />
  </View>
      ) : (
        <>
          <Text style={styles.progressText}>PanDo</Text>
          <View
            style={[
              styles.progressPandaContainer,
              { shadowColor: getShadowColor() },
            ]}
          >
            <Image source={currentPandaColor} style={styles.progressPanda} />
          </View>
          <View style={styles.colorCirclesContainer}>
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: 'blue' }]}
              onPress={() => handleColorChange('blue')}
            />
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: 'green' }]}
              onPress={() => handleColorChange('green')}
            />
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: 'yellow' }]}
              onPress={() => handleColorChange('yellow')}
            />
            <TouchableOpacity
              style={[styles.colorCircle, { backgroundColor: 'red' }]}
              onPress={() => handleColorChange('red')}
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dffcbc',
  },
  orangeBackground: {
    backgroundColor: '#f9cf9c',
  },
  safeArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    padding: 10,
  },
  pointsContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  starIcon: {
    width: 24,
    height: 24,
    marginRight: 5,
  },
  pointsText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  progressText: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: 30,
  },
  progressPandaContainer: {
    width: 400,
    height: 450,
    backgroundColor: '#fff', 
    borderWidth: 5, 
    borderColor: '#000', 
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 5, 
    marginVertical: 20,
  },
  progressPanda: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
  colorCirclesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
    marginTop: 20,
  },
  colorCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#000',
  },
});