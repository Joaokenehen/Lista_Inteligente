import { TextInput, View, Text, TextInputProps } from "react-native";

interface Props extends TextInputProps {
  label: string;
}

export function InputCard({ label, ...rest }: Props) {
  return (
    <View className="mb-4 w-full">
      <Text className="text-slate-700 font-medium mb-2 ml-1">{label}</Text>
      <TextInput 
        className="bg-white border border-slate-200 p-4 rounded-2xl text-slate-900 shadow-sm"
        placeholderTextColor="#94a3b8"
        {...rest}
      />
    </View>
  );
}