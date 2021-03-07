import React, {
  FunctionComponent,
  useCallback,
} from 'react';
import Scrollbars from 'react-custom-scrollbars';

export interface CustomScrollbarsProps {
  onScroll: any;
  forwardedRef: any;
  style: any;
}

export const CustomScrollbars: FunctionComponent<CustomScrollbarsProps> = ({onScroll, forwardedRef, style, children}) => {
  const refSetter = useCallback(scrollbarsRef => {
    if (scrollbarsRef) {
      forwardedRef(scrollbarsRef.view);
    } else {
      forwardedRef(null);
    }
  }, []);

  return (
    <Scrollbars
      ref={refSetter}
      style={{...style, overflow: 'hidden'}}
      onScroll={onScroll}
    >
      {children}
    </Scrollbars>
  );
};

export const CustomScrollbarsVirtualList = React.forwardRef<unknown, CustomScrollbarsProps>((props, ref) => (
  <CustomScrollbars {...props} forwardedRef={ref}/>
));
