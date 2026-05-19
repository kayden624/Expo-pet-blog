import React, { createContext, ReactNode, useContext, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface TabItemProps {
  label: string;
  afterLabel?: string;
  children: ReactNode;
}

interface TabContextType {
  activeTab: string;
  setActiveTab: (label: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

const TabItem: React.FC<TabItemProps> = ({ label, children }) => {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error("TabItem 必须在 Tab 组件内使用");
  }

  return (
    <View style={{ display: context.activeTab === label ? "flex" : "none" }}>
      {children}
    </View>
  );
};

interface TabProps {
  children: ReactNode;
  defaultTab?: string;
  tabclassName?: string;
  tabContentclassName?: string;
  onTabChange?: (item: any, index: number) => void;
}

const Tab: React.FC<TabProps> & { Item: typeof TabItem } = ({
  children,
  defaultTab,
  tabclassName,
  tabContentclassName,
  onTabChange,
}) => {
  // 获取所有的 TabItem 组件
  const tabItems = React.Children.toArray(children).filter(
    (child) => React.isValidElement(child) && child.type === TabItem
  ) as React.ReactElement<TabItemProps>[];

  // 设置默认选中的标签页
  const [activeTab, setActiveTab] = useState(
    defaultTab || tabItems[0]?.props.label || ""
  );

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      <View style={styles.container} className={tabclassName}>
        <View style={styles.tabBar}>
          {tabItems.map((item, index) => (
            <TouchableOpacity
              key={item.props.label}
              style={[
                styles.tabButton,
                activeTab === item.props.label && styles.activeTabButton,
              ]}
              onPress={() => {
                setActiveTab(item.props.label);
                onTabChange?.(item, index);
              }}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  activeTab === item.props.label && styles.activeTabButtonText,
                ]}
              >
                {item.props.label}
                {item.props.afterLabel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent} className={tabContentclassName}>
          {children}
        </View>
      </View>
    </TabContext.Provider>
  );
};

Tab.Item = TabItem;

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  tabBar: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    height: 40,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  activeTabButton: {
    borderBottomWidth: 2,
    borderBottomColor: "#2f95dc",
  },
  tabButtonText: {
    color: "#666",
  },
  activeTabButtonText: {
    color: "#2f95dc",
    fontWeight: "bold",
  },
  tabContent: {
    padding: 10,
    flex: 1,
  },
});

export default Tab;
