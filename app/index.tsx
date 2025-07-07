import { Text, View } from "react-native";
import "./global.css";
 
export default function Index() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-5xl text-center text-blue-500 font-quicksand-bold">
        Welcome to my react native app!
      </Text>
    </View>
  );
}