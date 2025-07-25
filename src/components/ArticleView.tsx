import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import ArticleActionButtons from './ArticleActionButtons';

export interface ArticleViewProps {
  title: string;
  body: string;
  publishedAt: string;
  username: string;
  id: number;
  isMyArticle: boolean;
}

function ArticleView({
  title,
  body,
  publishedAt,
  username,
  id,
  isMyArticle,
}: ArticleViewProps) {
  const formattedDate = new Date(publishedAt).toLocaleDateString();

  return (
    <View style={styles.block}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.date}>{formattedDate}</Text>
      <View style={styles.separator} />
      {isMyArticle && <ArticleActionButtons articleId={id} />}
      <Text>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingTop: 24,
    paddingBottom: 64,
    borderBottomColor: '#eeeeee',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  username: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 16,
  },
  date: {
    fontSize: 12,
    color: '#546e7a',
    marginTop: 4,
  },
  separator: {
    marginTop: 24,
    marginBottom: 24,
    borderBottomColor: '#eeeeee',
    height: 1,
  },
});

export default ArticleView;
