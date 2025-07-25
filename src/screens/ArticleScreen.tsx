import CommentModal from '../components/CommentModal';
import { RouteProp, useRoute } from '@react-navigation/core';
import React, { useState } from 'react';
import { StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { getArticle } from '../../api/articles';
import { deleteComment, getComments, modifyComment } from '../../api/comments';
import { RootStackParamList } from './types';
import ArticleView from '../components/ArticleView';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import CommentItem from '../components/CommentItem';
import { useUserState } from '../../contexts/UserContext';
import CommentInput from '../components/CommentInput';
import AskDialog from '../components/AskDialog';
import { Comment } from '../../api/types';

type ArticleScreenRouteProp = RouteProp<RootStackParamList, 'Article'>;
type DeleteCommentParams = { articleId: number; id: number };
type ModifyCommentParams = { articleId: number; id: number; message: string };

function ArticleScreen() {
  const { params } = useRoute<ArticleScreenRouteProp>();
  const { id } = params;
  const [currentUser] = useUserState();
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(
    null,
  );
  const [askRemoveComment, setAskRemoveComment] = useState(false);
  const [modifying, setModifying] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: remove } = useMutation<null, Error, DeleteCommentParams>({
    mutationFn: deleteComment,
    onSuccess: () => {
      queryClient.setQueryData<Comment[]>(['comments', id], comments =>
        comments
          ? comments.filter((c: Comment) => c.id !== selectedCommentId)
          : [],
      );
    },
  });

  const onRemove = (commentId: number) => {
    setSelectedCommentId(commentId);
    setAskRemoveComment(true);
  };

  const { mutate: modify } = useMutation<Comment, Error, ModifyCommentParams>({
    mutationFn: modifyComment,
    onSuccess: (comment: Comment) => {
      queryClient.setQueryData<Comment[]>(['comments', id], comments =>
        comments
          ? comments.map((c: Comment) =>
              c.id === selectedCommentId ? comment : c,
            )
          : [],
      );
    },
  });

  const onModify = (commentId: number) => {
    setSelectedCommentId(commentId);
    setModifying(true);
  };
  const onCancelModify = () => {
    setModifying(false);
  };
  const onSubmitModify = (message: string) => {
    setModifying(false);
    modify({
      id: selectedCommentId!,
      articleId: id,
      message,
    });
  };

  const onConfirmRemove = () => {
    setAskRemoveComment(false);
    if (selectedCommentId == null) {
      return;
    }
    remove({
      id: selectedCommentId,
      articleId: id,
    });
  };
  const onCancelRemove = () => {
    setAskRemoveComment(false);
  };

  const articleQuery = useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticle(id),
  });

  const commentsQuery = useQuery({
    queryKey: ['comments', id],
    queryFn: () => getComments(id),
  });

  const selectedComment = commentsQuery.data?.find(
    comment => comment.id === selectedCommentId,
  );

  const { bottom } = useSafeAreaInsets();

  if (!articleQuery.data || !commentsQuery.data) {
    return (
      <ActivityIndicator size="large" style={styles.spinner} color="black" />
    );
  }

  const { title, body, user, published_at } = articleQuery.data;

  const isMyArticle = currentUser?.id === user.id;

  return (
    <>
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
            onRemove={onRemove}
            onModify={onModify}
            isMyComment={item.user.id === currentUser?.id}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListHeaderComponent={
          <>
            <ArticleView
              title={title}
              body={body}
              publishedAt={published_at}
              username={user.username}
              id={id}
              isMyArticle={isMyArticle}
            />
            <CommentInput articleId={id} />
          </>
        }
      />
      <AskDialog
        visible={askRemoveComment}
        title="댓글 삭제"
        message="댓글을 삭제하시겠습니까?"
        isDestructive
        confirmText="삭제"
        onConfirm={onConfirmRemove}
        onClose={onCancelRemove}
      />
      <CommentModal
        visible={modifying}
        initialMessage={selectedComment?.message}
        onClose={onCancelModify}
        onSubmit={onSubmitModify}
      />
    </>
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
