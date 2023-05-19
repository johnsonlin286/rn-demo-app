import { ReactNode, useCallback, useMemo, useRef } from "react";
import { StyleSheet } from "react-native";
import BottomSheet, { BottomSheetBackdrop, BottomSheetFooter } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from "react-native-gesture-handler";

type Props = {
  children: ReactNode,
  showFooter?: boolean,
  footer?: any,
  onDismiss?: () => void
}

const Sheet: React.FC<Props> = ({ children, showFooter, footer, onDismiss }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['75%'], []);

  const backdropElm = useCallback((props: any) => (
    <BottomSheetBackdrop {...props} disappearsOnIndex={-1} appearsOnIndex={1} pressBehavior="none" />
  ), []);

  const footerElm = (props: any) => (
    <BottomSheetFooter {...props} style={styles.footerContainer}>
      {footer}
    </BottomSheetFooter>
  );

  const onDismissHandler = (index: number) => {
    if (index === -1 && onDismiss) {
      onDismiss();
    }
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={backdropElm} footerComponent={showFooter ? footerElm : undefined}
        onChange={onDismissHandler.bind(this)}
        style={styles.contentContainer}
      >
        {children}
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

export default Sheet;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  contentContainer: {
    flex: 1,
  },
  footerContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingVertical: 8,
    paddingHorizontal: 16,
  }
})