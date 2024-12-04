import React, { useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Dimensions, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GoBackButton from '../components/common/goBackButton';
import PlayButton from '../components/therapy/playButton';

const { width } = Dimensions.get('window');

export default function Therapy() {
    const navigation = useNavigation();
    const scrollX = useRef(new Animated.Value(0)).current;

    const games = [
        { id: '1', name: 'Memory', screen: 'MemoryGame', color: '#A0BDC7', image: require('../assets/memoryImageTherapy.png') },
        { id: '2', name: 'Catcher', screen: 'CatcherGame', color: '#CBDFBD', image: require('../assets/pandaImageTherapy.png') },
        { id: '3', name: 'Quiz', screen: 'QuizGame', color: '#A8AF71', image: require('../assets/quizImageTherapy.png') },
        { id: '4', name: 'Shooter', screen: 'ShooterGame', color: '#eff0d0', image: require('../assets/shooterImageTherapy.png') },
    ];

    const handlePress = (screen) => {
        navigation.navigate(screen);
    };

    const renderGameBlock = ({ item, index }) => {
        const inputRange = [(index - 1) * (width * 0.7 + 20), index * (width * 0.7 + 20), (index + 1) * (width * 0.7 + 20)];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1.1, 0.9],
            extrapolate: 'clamp',
        });

        return (
            <Animated.View
                style={[styles.blockContainer, { transform: [{ scale }] }]}
            >
                <View style={[styles.block, { backgroundColor: item.color }]}>
                    <Text style={styles.blockText}>{item.name}</Text>
                    <Image source={item.image} style={styles.image} />
                    <PlayButton onPress={() => handlePress(item.screen)} />
                </View>
            </Animated.View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <GoBackButton />
            <View style={styles.container}>
                <Text style={styles.title}>Choose your Game</Text>
                <Animated.FlatList
                    data={games}
                    renderItem={renderGameBlock}
                    keyExtractor={(item) => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={width * 0.7 + 20}
                    decelerationRate="fast"
                    contentContainerStyle={styles.flatListContainer}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                />
                <View style={styles.indicatorContainer}>
                    {games.map((_, i) => {
                        const inputRange = [
                            (i - 1) * (width * 0.7 + 20),
                            i * (width * 0.7 + 20),
                            (i + 1) * (width * 0.7 + 20),
                        ];

                        const dotScale = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.8, 1.4, 0.8],
                            extrapolate: 'clamp',
                        });

                        const dotOpacity = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.4, 1, 0.4],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.dot,
                                    { transform: [{ scale: dotScale }], opacity: dotOpacity },
                                ]}
                            />
                        );
                    })}
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#f7d9c4',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 10, 
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: -30,
    },
    flatListContainer: {
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    blockContainer: {
        width: width * 0.7, 
        marginHorizontal: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    block: {
        width: '100%',
        height: 550, 
        borderRadius: 20,
        alignItems: 'center', 
        justifyContent: 'flex-start', 
        paddingTop: 20,
        paddingHorizontal: 15, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    blockText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000000',
        marginTop: 40,
    },
    image: {
        width: 420,
        height: 220,
        resizeMode: 'contain',
        marginTop: 50,
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 35, 
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%', 
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#61615E', 
        marginHorizontal: 5,
    },
});
