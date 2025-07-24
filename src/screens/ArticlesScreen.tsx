import React, { useMemo } from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import {
  useInfiniteQuery,
  QueryFunctionContext,
  InfiniteData,
} from '@tanstack/react-query';
import { getArticles } from '../../api/articles';
import Articles from '../components/Articles';
import { useUserState } from '../../contexts/UserContext';
import { Article } from '../../api/types';

type ArticlesQueryKey = ['articles'];

function ArticlesScreen() {
  const [user] = useUserState();

  const fetchArticles = async ({
    pageParam = undefined,
  }: QueryFunctionContext<ArticlesQueryKey, number | undefined>) => {
    return await getArticles({ cursor: pageParam });
  };

  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery<
    Article[],
    Error,
    InfiniteData<Article[]>,
    ArticlesQueryKey,
    number | undefined
  >({
    queryKey: ['articles'],
    queryFn: fetchArticles,
    initialPageParam: undefined,
    getNextPageParam: lastPage =>
      lastPage.length === 10 ? lastPage[lastPage.length - 1].id : undefined,
  });

  const items = useMemo(() => {
    if (!data) return [];

    return ([] as Article[]).concat(...data.pages);
  }, [data]);

  if (items.length === 0) {
    return (
      <ActivityIndicator size="large" style={styles.spinner} color="black" />
    );
  }

  return (
    <Articles
      articles={items}
      showWriteButton={!!user}
      fetchNextPage={fetchNextPage}
      isFetchingNextPage={isFetchingNextPage}
    />
  );
}

const styles = StyleSheet.create({
  spinner: {
    flex: 1,
  },
});

export default ArticlesScreen;
