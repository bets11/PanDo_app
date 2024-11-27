import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import GoBackButton from '../components/common/goBackButton';

const allQuestions = [
  { question: 'What happens in cystic fibrosis in the lungs?', options: ['lungs become larger', 'mucus gets stuck in the lungs', 'lungs turn blue', 'new lungs grow'], answer: 1 },
  { question: 'What does mucus look like in the lungs?', options: ['dry', 'liquid like water', 'thick and sticky', 'like dust'], answer: 2 },
  { question: 'What makes it difficult to breathe with cystic fibrosis?', options: ['too much mucus', 'too much air', 'lungs do not move', 'nose is blocked'], answer: 0 },
  { question: 'Who helps with cystic fibrosis?', options: ['a painter', 'a firefighter', 'a doctor', 'an astronaut'], answer: 2 },
  { question: 'What can you do to breathe better?', options: ['take medication', 'eat lots of sweets', 'sleep more', 'dont speak'], answer: 0 },
  { question: 'Which lung is healthy in the picture?', options: ['the right lung', 'neither', 'both', 'the left one'], answer: 3 },
  { question: 'What does the word “genetic” mean?', options: ['something you buy', 'something you inherit', 'something learned in school', 'something that disappears in the body'], answer: 1 },
  { question: 'Why is it important to clear mucus in the lungs?', options: ['to make lungs bigger', 'to not feel like eating sweets', 'to breathe better', 'to keep skin clean'], answer: 2 },
  { question: 'What does the picture show about the lungs?', options: ['explains how lungs stay healthy', 'difference between healthy and diseased lung', 'explains how mucus is produced', 'shows why lungs are blue'], answer: 1 },
  { question: 'Why is it important to know about diseases like cystic fibrosis?', options: ['so we can dance better', 'so we can eat more sweets', 'so we dont have to buy shoes', 'so we can help ourselves and others'], answer: 3 },
  { question: 'What is the role of physiotherapy in cystic fibrosis?', options: ['to build muscles', 'to help remove mucus', 'to make lungs larger', 'to clean the skin'], answer: 1 },
  { question: 'What is one challenge people with cystic fibrosis face?', options: ['finding new shoes', 'trouble breathing', 'having too many lungs', 'eating only sweets'], answer: 1 },
  { question: 'Why is regular exercise important in cystic fibrosis?', options: ['to strengthen lungs', 'to increase mucus', 'to stop coughing', 'to turn lungs blue'], answer: 0 },
  { question: 'What does a special diet do for people with cystic fibrosis?', options: ['makes lungs bigger', 'helps maintain energy', 'makes mucus disappear forever', 'changes lung color'], answer: 1 },
  { question: 'What does medication do for people with cystic fibrosis?', options: ['removes all mucus instantly', 'helps breathe better and reduce infections', 'makes you run faster', 'turns lungs red'], answer: 1 }
];

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

  useEffect(() => {
    const randomQuestions = getRandomQuestions().map(shuffleOptions);
    setQuestions(randomQuestions);
  }, []);

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
    const newQuestions = getRandomQuestions().map(shuffleOptions);
    setScore(0);
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowScore(false);
    setQuestions(newQuestions);
  };

  if (questions.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <GoBackButton />
      </View>

      {showScore ? (
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>Your Score: {score} / {questions.length}</Text>
          <TouchableOpacity style={styles.button} onPress={handleRestart}>
            <Text style={styles.buttonText}>RESTART QUIZ</Text>
          </TouchableOpacity>
        </View>
      ) : (
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
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C7C2A2',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  questionContainer: {
    alignItems: 'center',
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    marginBottom: 20,
    alignSelf: 'center', 
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
    optionButton: {
    flex: 1, 
    minWidth: '40%',
    maxWidth: '45%', 
    justifyContent: 'center',
    },
    
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
    color: '#000',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#215F42',
  },
});

export default QuizGame;
