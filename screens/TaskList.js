import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Keyboard,
    FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TaskList = () => {
    const [task, setTask] = useState('');
    const [taskItems, setTaskItems] = useState([]);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const storedTasks = await AsyncStorage.getItem('@tasks');
            if (storedTasks !== null) {
                setTaskItems(JSON.parse(storedTasks));
            }
        } catch (error) {
            console.log(error);
        }
    };

    const saveTasks = async (tasks) => {
        try {
            await AsyncStorage.setItem('@tasks', JSON.stringify(tasks));
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddTask = () => {
        Keyboard.dismiss();
        if (task.trim() !== '') {
            const updatedTasks = [...taskItems];
            const editedTaskIndex = updatedTasks.findIndex((item) => item.isEditing);
            if (editedTaskIndex !== -1) {
                updatedTasks[editedTaskIndex].text = task;
                updatedTasks[editedTaskIndex].isEditing = false;
            } else {
                updatedTasks.push({ text: task, completed: false, isEditing: false });
            }
            setTaskItems(updatedTasks);
            saveTasks(updatedTasks);
            setTask('');
        }
    };

    const handleEditTask = (index) => {
        const editedTasks = [...taskItems];
        editedTasks.forEach((task, i) => {
            task.isEditing = i === index;
        });
        setTaskItems(editedTasks);
        saveTasks(editedTasks);
    };

    const completeTask = (index) => {
        const updatedTasks = [...taskItems];
        updatedTasks[index].completed = !updatedTasks[index].completed;
        setTaskItems(updatedTasks);
        saveTasks(updatedTasks);
    };

    const deleteTask = (index) => {
        const updatedTasks = [...taskItems];
        updatedTasks.splice(index, 1);
        setTaskItems(updatedTasks);
        saveTasks(updatedTasks);
    };

    const clearTasks = () => {
        const completedTasks = taskItems.filter((item)=>!item.completed)
        setTaskItems(completedTasks)
        saveTasks(completedTasks);

    }

    const renderTask = ({ item, index }) => (
        <TouchableOpacity
            style={styles.task}
            onPress={() => completeTask(index)}
        >
            {item.isEditing ? (
                <TextInput
                    style={styles.taskText}
                    onChangeText={(text) => setTask(text)}
                    value={task}
                    autoFocus
                />
            ) : (
                <Text style={[styles.taskText, { textDecorationLine: item.completed ? 'line-through' : 'none' },]}>{item.text}</Text>
            )}
            <View style={styles.buttonContainer}>
                {item.isEditing ? (
                    <TouchableOpacity onPress={handleAddTask}>
                        <Text style={styles.buttonText}>Save</Text>
                    </TouchableOpacity>
                ) : (
                    <>
                        <TouchableOpacity onPress={() => handleEditTask(index)}>
                            <Text style={styles.buttonText}>Edit</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 5 }} onPress={() => deleteTask(index)}>
                            <Text style={styles.buttonText}>Delete</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={styles.sectionTitle}>To-Do List</Text>
                <Text style={styles.sectionTitle}>{taskItems.length}</Text>
            </View>
            <View style={styles.items}>
                <FlatList
                    data={taskItems}
                    renderItem={renderTask}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 }}>
                <TextInput
                    style={styles.input}
                    placeholder={'Write a task'}
                    value={task}
                    onChangeText={(text) => setTask(text)}
                />
                <TouchableOpacity onPress={handleAddTask}>
                    <View style={styles.addWrapper}>
                        <Text style={styles.addText}>+</Text>
                    </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={clearTasks} style={{backgroundColor:'red',paddingHorizontal:10,paddingVertical:10,borderRadius:20,alignSelf: 'flex-start',marginTop:10}}>
                <Text style={{color:'white'}}>
                    Clear Completed Tasks
                </Text>
            </TouchableOpacity>
        </View>
    );
}

export default TaskList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8EAED',
        paddingTop: 80,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    items: {
        marginTop: 30,
    },
    task: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingVertical: 15,
        borderRadius: 20,
        marginBottom: 5,
        borderBottomWidth: 1,
        borderColor: '#D0D0D0',
        backgroundColor: 'white'
    },
    taskText: {
        maxWidth: '80%',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#808080',
    },
    writeTaskWrapper: {
        position: 'absolute',
        bottom: 60,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    input: {
        paddingVertical: 15,
        paddingHorizontal: 15,
        backgroundColor: '#FFF',
        borderRadius: 60,
        borderColor: '#C0C0C0',
        borderWidth: 1,
        width: 250,
    },
    addWrapper: {
        width: 50,
        height: 50,
        backgroundColor: '#FFF',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#C0C0C0',
        borderWidth: 1,
    },
    addText: {},
});