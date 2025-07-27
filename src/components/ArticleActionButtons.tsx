import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/core';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import { RootStackNavigationProp } from '../screens/types';
import AskDialog from './AskDialog';
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { deleteArticle } from '../../api/articles';
import { Article } from '../../api/types';

export interface ArticleActionButtonsProps {
  articleId: number;
}

function ArticleActionButtons({ articleId }: ArticleActionButtonsProps) {
  const [askRemove, setAskRemove] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp>();
  const queryClient = useQueryClient();

  const { mutate } = useMutation<null, Error, number>({
    mutationFn: deleteArticle,
    onSuccess: () => {
      navigation.goBack();
      queryClient.setQueryData<InfiniteData<Article[]>>(['articles'], data => {
        if (!data) {
          return { pageParams: [], pages: [] };
        }
        return {
          pageParams: data.pageParams,
          pages: data.pages.map(page =>
            page.find(a => a.id === articleId)
              ? page.filter(a => a.id !== articleId)
              : page,
          ),
        };
      });
    },
  });

  const onPressModify = () => {
    console.log('수정 버튼 클릭됨', articleId);
    navigation.navigate('Write', { articleId });
  };
  const onPressRemove = () => {
    setAskRemove(true);
  };
  const onCancelRemove = () => {
    setAskRemove(false);
  };
  const onConfirmRemove = () => {
    setAskRemove(false);
    mutate(articleId);
  };

  return (
    <>
      <View style={styles.block}>
        <Pressable
          style={({ pressed }) => pressed && styles.pressed}
          onPress={onPressModify}
        >
          <Text style={styles.buttonText}>수정</Text>
        </Pressable>
        <View style={styles.separator} />
        <Pressable
          onPress={onPressRemove}
          style={({ pressed }) => pressed && styles.pressed}
        >
          <Text style={styles.buttonText}>삭제</Text>
        </Pressable>
      </View>
      <AskDialog
        visible={askRemove}
        title="게시글 삭제"
        message="게시글을 삭제하시겠습니까?"
        isDestructive
        confirmText="삭제"
        onConfirm={onConfirmRemove}
        onClose={onCancelRemove}
      />
    </>
  );
}

const styles = StyleSheet.create({
  block: {
    marginTop: -16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  separator: {
    width: 8,
  },
  buttonText: {
    color: '#2196f3',
    fontSize: 14,
  },
  pressed: {
    opacity: 0.75,
  },
});

export default ArticleActionButtons;
