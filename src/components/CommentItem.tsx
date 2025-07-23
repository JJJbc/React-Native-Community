import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

export interface CommentItemProps {
  id: number;
  message: string;
  username: string;
  publishedAt: string;
}

function CommentItem({ message, username, publishedAt }: CommentItemProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString();

  return (
    <View style={styles.block}>
      <View style={styles.header}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.date}>{formattedDate}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    padding: 8,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  username: {
    fontWeight: 'bold',
  },
  date: {
    color: '#546e7a',
    fontSize: 14,
    marginTop: 4,
  },
  message: {
    marginTop: 4,
  },
});

export default CommentItem;
