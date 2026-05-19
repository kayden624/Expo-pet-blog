import CommentModal from "@/components/comment/Modal";
import usePickImage from "@/hooks/usePickImage";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import { useMemoizedFn } from "ahooks";
import c from "classnames";
import React, {
  DetailedHTMLProps,
  forwardRef,
  HTMLAttributes,
  useImperativeHandle,
  useState,
} from "react";
import { Alert, Pressable, Text, View } from "react-native";
export interface EditProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  isEdit: boolean;
  classNames?: string;
  isImage?: boolean | string;
  onSubmit?: (data: any) => void;
  onDelete?: () => void;
  onAfter?: () => void;
  text?: string;
}

function Edit(
  {
    children,
    isEdit,
    isImage = "",
    text = "",
    classNames,
    onSubmit,
    onDelete,
    onAfter,
  }: EditProps,
  ref: any
) {
  const [newText, setNewText] = useState(text);
  const [modalVisible, setModalVisible] = useState(false);
  const { handleImageSelect } = usePickImage();
  useImperativeHandle(ref, () => {
    return {
      press,
    };
  });
  const press = useMemoizedFn(() => {
    if (!isEdit) return;
    if (isImage) {
      let aspect: [number, number] = [1, 1];
      if (typeof isImage === "string" && isImage.includes("/")) {
        aspect = isImage.split("/").map(Number) as unknown as [number, number];
      }
      handleImageSelect(onSubmit, aspect);
    } else {
      setModalVisible(true);
    }
  });
  const submitText = useMemoizedFn(() => {
    onSubmit?.(newText);
    setModalVisible(false);
  });
  const clickDel = useMemoizedFn(() => {
    Alert.alert(
      "Confirm deletion",
      "Are you sure you want to delete this content?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => onDelete?.(),
          style: "destructive",
        },
      ]
    );
  });

  return (
    <>
      <CommentModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmit={submitText}
        text={newText}
        onChangeText={setNewText}
        title="Edit text"
      />
      <Pressable
        className={c(
          isEdit ? "border-dashed border-red-300 border-2 relative" : "",
          classNames
        )}
        onPress={press}
      >
        {isEdit && (
          <>
            <View
              className="absolute right-0 top-0  z-10 p-4 py-1 flex-row items-center "
              style={{
                backgroundColor: "rgba(252,165,165,0.7)",
              }}
            >
              <Text className="text-white text-xs">Edit</Text>
              {!!onAfter && (
                <Pressable
                  className="bg-red-500 p-1 rounded ml-2"
                  onPress={onAfter}
                >
                  <Feather name="plus-square" size={14} color="white" />
                </Pressable>
              )}
              {!!onDelete && (
                <Pressable
                  className="bg-red-500 p-1 rounded ml-2"
                  onPress={clickDel}
                >
                  <AntDesign name="delete" size={14} color="white" />
                </Pressable>
              )}
            </View>
          </>
        )}

        {children}
      </Pressable>
    </>
  );
}

export default forwardRef(Edit);
