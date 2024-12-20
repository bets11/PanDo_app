import React, { useState, useEffect } from 'react';
import { getUserUUID } from '../services/storageService';
import { savePointsToUser } from '../services/pointsService';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import GoBackButton from '../components/common/goBackButton';
import PlayButton from '../components/therapy/playButton';
import allQuestions from '../components/quizQuestions';

const getRandomQuestions = () => {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
};

const shuffleOptions = (question) => {
  const options = [...question.options];
  const shuffled = options.map((option, index) => ({ option, index })).sort(() => Math.random() - 0.5);
  return {
    ...question,
    options: shuffled.map((item) => item.option),
    answer: shuffled.findIndex((item) => item.index === question.answer),
  };
};

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('start'); 

  useEffect(() => {
    const randomQuestions = getRandomQuestions().map(shuffleOptions);
    setQuestions(randomQuestions);
  }, []);

  const saveFinalScore = async () => {
    try {
      const userUUID = await getUserUUID(); 
      if (userUUID) {
        await savePointsToUser(userUUID, score); 
      } else {
        console.error("User UUID not found");
      }
    } catch (error) {
      console.error("Failed to save points:", error);
    }
  };

  const handleAnswerPress = (index) => {
    setSelectedOption(index);
    const correct = index === questions[currentQuestion].answer;
    setIsCorrect(correct);

    if (correct) {
      setScore(score + 1);
    }

    setTimeout(() => {
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < questions.length) {
        setCurrentQuestion(nextQuestion);
        setSelectedOption(null);
        setIsCorrect(null);
      } else {
        setShowScore(true);
        setGameState('gameOver');
        saveFinalScore(); 
      }
    }, 400);
  };

  const handleRestart = () => {
    const newQuestions = getRandomQuestions().map(shuffleOptions);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowScore(false);
    setGameState('start');
    setQuestions(newQuestions);
  };

  if (gameState === 'start') {
    return (
      <SafeAreaView style={styles.container}>
        <GoBackButton />
        <View style={styles.overlay}>
          <Text style={styles.title}>Quiz Game</Text>
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              Answer the questions correctly to score points! You have 10 questions in total.
            </Text>
            <Image source={require('../assets/quiz.jpg')} style={styles.instructionImage} />
            <PlayButton onPress={() => setGameState('playing')} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (showScore) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <GoBackButton />
        </View>
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Your Score: {score} / {questions.length}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRestart}>
            <Text style={styles.buttonText}>RESTART QUIZ</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <GoBackButton />
      </View>
      <View style={styles.questionContainer}>
        <Image source={require('../assets/quiz.jpg')} style={styles.image} />
        <Text style={styles.progressText}>Question {currentQuestion + 1} / {questions.length}</Text>
        <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
        <View style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => {
            const isSelected = index === selectedOption;
            const backgroundColor = isSelected
              ? isCorrect
                ? '#a5d6a7'
                : '#ef9a9a'
              : '#7A9E70';

            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, { backgroundColor }]}
                onPress={() => handleAnswerPress(index)}
                disabled={selectedOption !== null}
              >
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#A8AF71',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 50, 
    left: 5, 
    zIndex: 10, 
  }, 
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
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
    backgroundColor: '#A8AF71',
    borderRadius: 10,
    elevation: 5,
    width: '90%',
    alignItems: 'center',
  },
  instructionText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  instructionImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: -10,
    marginTop: 20,
  },
  questionContainer: {
    alignItems: 'center',
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 18,
    color: '#000',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 22,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
  optionButton: {
    width: '45%',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: '#000',
  },
  scoreContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1, 
  },
  scoreText: {
    fontSize: 24,
    color: '#000',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#215F42',
    fontWeight:'bold',
    
  },
}); 

export default QuizGame;
