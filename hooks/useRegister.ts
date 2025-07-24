import { useMutation } from '@tanstack/react-query';
import { register } from '../api/auth';
import { AuthError } from '../api/types';
import { useNavigation } from '@react-navigation/native';
import { useUserState } from '../contexts/UserContext';
import { RootStackNavigationProp } from '../src/screens/types';
import { applyToken } from '../api/client';
import authStorage from '../storages/authStorage';
import useInform from './useInform';

export default function useRegister() {
  const [, setUser] = useUserState();
  const navigation = useNavigation<RootStackNavigationProp>();
  const inform = useInform();

  return useMutation({
    mutationFn: register,
    onSuccess: data => {
      setUser(data.user);
      navigation.pop();
      applyToken(data.jwt);
      authStorage.set(data);
    },
    onError: (error: AuthError) => {
      const message =
        error.response?.data?.data?.[0]?.message[0].message ?? '회원가입 실패';
      inform({
        title: '오류',
        message,
      });
    },
  });
}
