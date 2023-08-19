import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase({ name: 'mydb.db', location: 'default' });

const App = () => {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    db.transaction(txn => {
      txn.executeSql(
        'CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, note TEXT)',
        [],
        (_, res) => {
          console.log('Table created successfully...');
        }
      );
    });
    fetchNotes();
  }, []);

  const addNote = () => {
    if (!note) {
      return;
    }

    db.transaction(txn => {
      txn.executeSql(
        'INSERT INTO notes (note) VALUES (?)',
        [note],
        (_, res) => {
          console.log('Note added successfully...');
          setNote('');
          fetchNotes();
        }
      );
    });
  };

  const fetchNotes = () => {
    db.transaction(txn => {
      txn.executeSql('SELECT * FROM notes', [], (_, res) => {
        const len = res.rows.length;
        const notes = [];

        for (let i = 0; i < len; i++) {
          notes.push(res.rows.item(i));
        }

        setNotes(notes);
      });
    });
  };

  const renderNote = ({ item }) => (
    <View style={styles.noteContainer}>
      <Text>{item.note}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a note"
        value={note}
        onChangeText={text => setNote(text)}
      />
      <TouchableOpacity style={styles.button} onPress={addNote}>
        <Text>Add Note</Text>
      </TouchableOpacity>
      <FlatList
        data={notes}
        renderItem={renderNote}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginBottom: 8,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 8,
  },
  noteContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 8,
  },
});

export default App;
