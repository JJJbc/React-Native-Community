import { RouteProp, useRoute } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { getArticle } from '../../api/articles';
import { getComments } from '../../api/comments';
import { RootStackParamList } from './types';
import ArticleView from '../components/ArticleView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommentItem from '../components/CommentItem';

type ArticleScreenRouteProp = RouteProp<RootStackParamList, 'Article'>;

function ArticleScreen() {
  const { params } = useRoute<ArticleScreenRouteProp>();
  const { id } = params;

  const articleQuery = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticle(id),
  });

  const commentsQuery = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments(id),
  });

  const { bottom } = useSafeAreaInsets();

  if (!articleQuery.data || !commentsQuery.data) {
    return (
      <ActivityIndicator size="large" style={styles.spinner} color="black" />
    );
  }

  const {
    title,
    body,
    user: { username },
    published_at,
  } = articleQuery.data;

  return (
    <FlatList
      style={styles.flatList}
      contentContainerStyle={[
        styles.flatListContent,
        { paddingBottom: bottom },
      ]}
      data={commentsQuery.data}
      renderItem={({ item }) => (
        <CommentItem
          id={item.id}
          message={item.message}
          publishedAt={item.published_at}
          username={item.user.username}
        />
      )}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={
        <ArticleView
          title={title}
          body={body}
          publishedAt={published_at}
          username={username}
        />
      }
    />
  );
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
  },
  flatList: {
    backgroundColor: 'white',
    flex: 1,
  },
  flatListContent: {
    paddingHorizontal: 12,
  },
});

export default ArticleScreen;
