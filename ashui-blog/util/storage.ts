import AsyncStorage from "@react-native-async-storage/async-storage";

export const setItem = async (key: string, value: any) => {
  console.log("setItem", key, value);
  try {
    const jsonValue = JSON.stringify(value);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getItem = async (key: string) => {
  let jsonValue = null;
  try {
    jsonValue = await AsyncStorage.getItem(key);
    const res = jsonValue != null ? JSON.parse(jsonValue) : null;
    return res;
  } catch (e) {
    return jsonValue;
  }
};
export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    // remove error
  }
};
