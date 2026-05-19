import { useLoading } from "@/contexts/LoadingContext";
import { FlashList, FlashListProps } from "@shopify/flash-list";
import { useMemoizedFn } from "ahooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { RefreshControl, Text } from "react-native";
interface ScrollViewProps<T> extends Omit<FlashListProps<T>, "data"> {
  onRefresh?: () => Promise<any>;
  onEndReached?: () => Promise<any>;
  enableRefresh?: boolean;
  showLoading?: boolean;
  enableLoadMore?: boolean;
  onLoadingChanged?: (loading: boolean) => void;
  loadDataFn?: (_page: number) => Promise<any>;
  renderData?: T[];
  onLoadData?: (list: T[], total: number, onRefreshHandler: () => void) => void;
  renderItemPro?: (
    item: { item: T },
    options: { removeItem: (item: T) => void }
  ) => void;
}

export default function ScrollView<T extends { _id: string }>({
  renderData,
  renderItem,
  onRefresh, // 保留但不使用
  onEndReached,
  onLoadingChanged,
  loadDataFn,
  renderItemPro,
  keyExtractor,
  showLoading,
  onLoadData,
  enableRefresh: _enableRefresh,
  enableLoadMore: _enableLoadMore,
}: ScrollViewProps<T>) {
  const [_data, setData] = useState([] as T[]);
  const currentPage = useRef(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const enableRefresh = onRefresh !== undefined || _enableRefresh;
  const enableLoadMore = onEndReached !== undefined || _enableLoadMore;
  const { showLoading: _showLoading, hideLoading } = useLoading();
  const refreshHandler = useMemoizedFn(async () => {
    onRefresh ? await onRefresh?.() : await handleLoadData(true);
  });
  const onRefreshHandler = useMemoizedFn(async () => {
    setRefreshing(true);
    await refreshHandler();
    setRefreshing(false);
  });
  const onEndReachedHandler = useMemoizedFn(async () => {
    if (loadingMore || !enableLoadMore || !hasMore) return;
    setLoadingMore(true);
    onEndReached ? await onEndReached?.() : await handleLoadData();
    setLoadingMore(false);
  });
  useEffect(() => {
    if (loadDataFn) {
      setData([]);
      handleLoadData(true);
    } else {
      //@ts-ignore
      setData(renderData || ([] as T[]));
    }
  }, [renderData, loadDataFn]);

  const handleLoadData = async (isNew = false) => {
    onLoadingChanged?.(true);
    if (isNew) {
      currentPage.current = 0;
    }
    try {
      //@ts-ignore
      showLoading && _showLoading();
      const { results, totalDocs } = await loadDataFn?.(
        (currentPage.current += 1)
      );
      onLoadData?.(results, totalDocs, refreshHandler);

      if (results?.length) {
        setData(isNew ? results : [..._data, ...results]);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.log("error", error);
    } finally {
      onLoadingChanged?.(false);
      hideLoading();
    }
  };

  const removeItem = useMemoizedFn((item) => {
    const index = _data.findIndex((it) => it._id === item._id);
    console.log("removeItem", item, index);
    if (index !== -1) {
      _data.splice(index, 1);
      setData([..._data]);
    }
  });

  const _renderItem = useMemo(() => {
    if (renderItemPro) {
      //@ts-ignore
      return ({ item }) => renderItemPro({ item }, { removeItem });
    } else {
      return renderItem;
    }
  }, [renderItemPro, renderItem]);
  return (
    <FlashList
      data={_data}
      keyExtractor={keyExtractor}
      //@ts-ignore
      renderItem={_renderItem}
      estimatedItemSize={50}
      overScrollMode={enableRefresh || enableLoadMore ? "auto" : "never"} // 仅在下拉刷新禁用时关闭弹动
      bounces={enableRefresh || enableLoadMore} // iOS专用，仅在下拉刷新启用时允许弹动
      refreshControl={
        enableRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefreshHandler}
          />
        ) : (
          void 0
        )
      }
      onEndReached={onEndReachedHandler}
      onEndReachedThreshold={0.1}
      ListFooterComponent={
        loadingMore ? (
          <Text className="py-4 text-center">loading...</Text>
        ) : null
      }
    />
  );
}
