import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

const data = [
  { sr_no: '1', number: '1234567890' },
  { sr_no: '2', number: '1234567890' },
  { sr_no: '3', number: '1234567890' },
  { sr_no: '4', number: '1234567890' },
  { sr_no: '5', number: '1234567890' },
  { sr_no: '6', number: '1234567890' },
];

export default function HistoryScreen() {
    const screenWidth = Dimensions.get('window').width;
  return (
    <ScrollView horizontal>
        <View style={{ width: screenWidth }}>
      <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.row, styles.headerRow]}>
            <Text style={styles.headerCell}>No.</Text>
            <Text style={styles.headerCell}>Mobile Number</Text>
          </View>

          {/* Table Rows */}
          {data.map((item, index) => (
            <View style={styles.row} key={index}>
              <Text style={styles.cell}>{item.no}</Text>
              <Text style={styles.cell}>{item.mobile}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: '#ccc',
    margin: 10,
  },
  headerRow: {
    backgroundColor: '#f2f2f2',
  },
  row: {
    flexDirection: 'row',
  },
  headerCell: {
    flex: 1,
    padding: 12,
    fontWeight: 'bold',
    borderRightWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    padding: 12,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
  },
});