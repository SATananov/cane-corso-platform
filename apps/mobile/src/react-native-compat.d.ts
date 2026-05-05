declare module 'react-native' {
  import type { ComponentType } from 'react';

  export const ActivityIndicator: ComponentType<any>;
  export const Pressable: ComponentType<any>;
  export const RefreshControl: ComponentType<any>;
  export const SafeAreaView: ComponentType<any>;
  export const ScrollView: ComponentType<any>;
  export const Text: ComponentType<any>;
  export const TextInput: ComponentType<any>;
  export const View: ComponentType<any>;
}

declare module 'expo-status-bar' {
  import type { ComponentType } from 'react';

  export const StatusBar: ComponentType<any>;
}
