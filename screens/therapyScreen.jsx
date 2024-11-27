import React from 'react';
import { StyleSheet, Text, View, SafeAreaView} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GameBox from '../components/therapy/gameBox';
import GoBackButton from '../components/common/goBackButton';
import CatcherGame from './catcherGame';


export default function Therapy() {
    const navigation = useNavigation();

    const handlePress = (gameName) => {
        if (gameName === 'Memory') {
            navigation.navigate('MemoryGame');
        } else if (gameName === 'Catcher') {
            navigation.navigate('CatcherGame'); 
        } else if (gameName === 'Quiz') {
            navigation.navigate('QuizGame'); 
        } else if (gameName === 'Shooter') {
            navigation.navigate('ShooterGame'); 
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <GoBackButton screen={'Overview'}/>
            <View style={styles.container}>
                <Text style={styles.title}>Choose your Game</Text>
                <GameBox title="Memory" onPress={() => handlePress('Memory')} />
                <GameBox title="Catcher" onPress={() => handlePress('Catcher')} />
                <GameBox title="Quiz" onPress={() => handlePress('Quiz')} />
                <GameBox title="Shooter" onPress={() => handlePress('Shooter')} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7d9c4',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#f7d9c4',
    },
});
