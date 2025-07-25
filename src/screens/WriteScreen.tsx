import { RouteProp, useNavigation, useRoute } from '@react-navigation/core';
import React, { useCallback, useEffect, useState, useMemo } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { RootStackNavigationProp, RootStackParamList } from './types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { modifyArticle, writeArticle } from '../../api/articles';
import { Article } from '../../api/types';

type WriteScreenRouteProp = RouteProp<RootStackParamList, 'Write'>;

function WriteScreen() {
  const { params } = useRoute<WriteScreenRouteProp>();
  const { top } = useSafeAreaInsets();
  const navigation = useNavigation<RootStackNavigationProp>();
  const queryClient = useQueryClient();
  const cachedArticle = useMemo(() => {
    if (!params.articleId) return null;
    return queryClient.getQueryData<Article>(['article', params.articleId]);
  }, [queryClient, params.articleId]);

  const [title, setTitle] = useState(cachedArticle?.title ?? '');
  const [body, setBody] = useState(cachedArticle?.body ?? '');
  const { mutate: write } = useMutation({
    mutationFn: writeArticle,
    onSuccess: article => {
      queryClient.setQueryData<InfiniteData<Article[]>>(['articles'], data => {
        if (!data) {
          return {
            pageParams: [undefined],
            pages: [[article]],
          };
        }

        const [firstPage, ...restPages] = data.pages;

        return {
          ...data,
          pages: [[article, ...firstPage], ...restPages],
        };
      });

      navigation.goBack();
    },
  });

  const { mutate: modify } = useMutation({
    mutationFn: modifyArticle,
    onSuccess: article => {
      queryClient.setQueryData<InfiniteData<Article[]>>(['articles'], data => {
        if (!data) {
          return {
            pageParams: [],
            pages: [[]],
          };
        }

        return {
          pageParams: data!.pageParams,
          pages: data!.pages.map(page =>
            page.find(a => a.id === params.articleId)
              ? page.map(a => (a.id === params.articleId ? article : a))
              : page,
          ),
        };
      });
      queryClient.setQueryData(['article', params.articleId], article);
      navigation.goBack();
    },
  });

  const onSubmit = useCallback(() => {
    if (params.articleId) {
      modify({ id: params.articleId, title, body });
    } else {
      write({ title, body });
    }
  }, [write, modify, title, body, params.articleId]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          hitSlop={8}
          onPress={onSubmit}
          style={({ pressed }) => pressed && styles.headerRightPressed}
        >
          <MaterialIcons name="send" color="#2196f3" size={24} />
        </Pressable>
      ),
    });
  }, [navigation, onSubmit]);
  return (
    <SafeAreaView style={styles.block} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoiding}
        behavior={Platform.select({ ios: 'padding' })}
        keyboardVerticalOffset={Platform.select({ ios: top + 60 })}
      >
        <TextInput
          placeholder="제목"
          style={styles.Input}
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="내용"
          style={[styles.Input, styles.body]}
          multiline
          textAlignVertical="top"
          value={body}
          onChangeText={setBody}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
    flexDirection: 'column',
  },
  keyboardAvoiding: {
    flex: 1,
  },
  Input: {
    backgroundColor: 'white',
    fontSize: 14,
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 4,
  },
  body: {
    flex: 1,
    marginTop: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  headerRightContainer: {
    marginRight: 16,
  },
  headerRightPressed: {
    opacity: 0.75,
  },
});

export default WriteScreen;
