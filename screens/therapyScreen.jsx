import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GameBox from '../components/therapy/gameBox';
import CatcherGame from './catcherGame';

export default function Therapy() {
    const navigation = useNavigation();

    const handlePress = (gameName) => {
        if (gameName === 'Memory') {
            navigation.navigate('MemoryGame');
        } else if (gameName === 'Catcher') {
            navigation.navigate('CatcherGame'); 
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose your Game</Text>
            <GameBox title="Memory" onPress={() => handlePress('Memory')} />
            <GameBox title="Catcher" onPress={() => handlePress('Catcher')} />
            <GameBox title="Quiz" onPress={() => handlePress('Quiz')} />
            <GameBox title="Shooter" onPress={() => handlePress('Shooter')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#f7d9c4',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
});
