import { useNavigation } from '@react-navigation/core';
import React from 'react';
import { StyleSheet, Pressable, Text, View, Platform } from 'react-native';
import { MainTabNavigationProp } from '../screens/types';

export interface ArticleItemProps {
  id: number;
  title: string;
  publishedAt: string;
  username: string;
}

function ArticleItem({ id, title, publishedAt, username }: ArticleItemProps) {
  const navigation = useNavigation<MainTabNavigationProp>();
  const onPress = () => {
    navigation.navigate('Article', {
      id,
    });
  };

  const formattedDate = new Date(publishedAt).toLocaleDateString();

  return (
    <Pressable
      style={({ pressed }) => [
        styles.block,
        Platform.OS === 'android' && pressed && styles.pressed,
      ]}
      onPress={onPress}
      android_ripple={{ color: '#eeeeee' }}
    >
      <Text style={styles.title}>{title}</Text>
      <View style={styles.footer}>
        <Text style={styles.smallText}>{username}</Text>
        <Text style={styles.smallText}>{formattedDate}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  block: {
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#ffffff',
  },
  pressed: {
    backgroundColor: '#eeeeee',
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 16,
  },
  smallText: {
    fontSize: 10,
    color: '#546e7a',
  },
});

export default ArticleItem;
