import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const allQuestions = [
  { question: 'What color is the sky?', options: ['Green', 'Blue', 'Red', 'Yellow'], answer: 1 },
  { question: 'How many legs does a spider have?', options: ['6', '8', '4', '10'], answer: 1 },
  { question: 'Which animal is known as the King of the Jungle?', options: ['Elephant', 'Lion', 'Tiger', 'Bear'], answer: 1 },
  { question: 'What is 2 + 2?', options: ['3', '4', '5', '6'], answer: 1 },
  { question: 'What is the name of the planet we live on?', options: ['Mars', 'Earth', 'Jupiter', 'Saturn'], answer: 1 },
  { question: 'What do bees make?', options: ['Milk', 'Honey', 'Butter', 'Jam'], answer: 1 },
  { question: 'Which fruit is yellow and long?', options: ['Apple', 'Banana', 'Grapes', 'Orange'], answer: 1 },
  { question: 'What do cows drink?', options: ['Water', 'Juice', 'Milk', 'Tea'], answer: 0 },
  { question: 'How many days are in a week?', options: ['5', '6', '7', '8'], answer: 2 },
  { question: 'What shape is a ball?', options: ['Square', 'Round', 'Triangle', 'Rectangle'], answer: 1 },
  { question: 'Which animal barks?', options: ['Cat', 'Dog', 'Cow', 'Bird'], answer: 1 },
  { question: 'What is the opposite of hot?', options: ['Cold', 'Warm', 'Hotter', 'Cool'], answer: 0 },
  { question: 'Which of these is a primary color?', options: ['Green', 'Blue', 'Pink', 'Purple'], answer: 1 },
  { question: 'What do you use to write?', options: ['Spoon', 'Pencil', 'Brush', 'Fork'], answer: 1 },
  { question: 'How many months are in a year?', options: ['10', '11', '12', '13'], answer: 2 }
];

const getRandomQuestions = () => {
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 10);
};

const QuizGame = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const randomQuestions = getRandomQuestions();
    setQuestions(randomQuestions);
  }, []);

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

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
      }
    }, 400);
  };

  const handleRestart = () => {
    setScore(0);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowScore(false);
    setQuestions(getRandomQuestions());
  };

  return (
    <View style={styles.container}>
      {showScore ? (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Your Score: {score} / {questions.length}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRestart}>
            <Text style={styles.buttonText}>Restart Quiz</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <Text style={styles.progressText}>Question {currentQuestion + 1} / {questions.length}</Text>
          <Text style={styles.questionText}>{questions[currentQuestion].question}</Text>
          <View style={styles.optionsContainer}>
            {questions[currentQuestion].options.map((option, index) => {
              const isSelected = index === selectedOption;
              const backgroundColor = isSelected
                ? isCorrect
                  ? '#a5d6a7' 
                  : '#ef9a9a' 
                : '#f7e79e'; 

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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 24,
    color: '#000',
  },
  progressText: {
    fontSize: 18,
    color: '#4c6351',
    marginBottom: 10,
    textAlign: 'center',
  },
  questionText: {
    fontSize: 24,
    color: '#4c6351',
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
  },
  scoreText: {
    fontSize: 24,
    color: '#4c6351',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#f7e79e',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#4c6351',
  },
});

export default QuizGame;