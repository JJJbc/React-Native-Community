import { useNavigation } from '@react-navigation/core';
import React, { useCallback, useEffect, useState } from 'react';
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
import { RootStackNavigationProp } from './types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { writeArticle } from '../../api/articles';
import { Article } from '../../api/types';

function WriteScreen() {
  const { top } = useSafeAreaInsets();
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const navigation = useNavigation<RootStackNavigationProp>();
  const queryClient = useQueryClient();
  const { mutate: write } = useMutation({
    mutationFn: writeArticle,
    onSuccess: article => {
      queryClient.setQueryData<Article[]>(['articles'], articles =>
        (articles ?? []).concat(article),
      );
      navigation.goBack();
    },
  });

  const onSubmit = useCallback(() => {
    write({ title, body });
  }, [write, title, body]);

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
