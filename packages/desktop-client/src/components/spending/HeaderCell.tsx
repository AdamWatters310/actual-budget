import type { CSSProperties, ReactNode } from 'react';

import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

type HeaderCellProps = {
  children: ReactNode;
  align?: 'left' | 'right';
  style?: CSSProperties;
};

export function HeaderCell({
  children,
  align = 'left',
  style,
}: HeaderCellProps) {
  return (
    <View
      style={{
        ...styles.smallText,
        fontWeight: 600,
        padding: '8px 10px',
        backgroundColor: theme.tableBackground,
        borderBottom: `1px solid ${theme.tableBorder}`,
        textAlign: align,
        justifyContent: align === 'right' ? 'flex-end' : 'flex-start',
        flexDirection: 'row',
        ...style,
      }}
    >
      {children}
    </View>
  );
}
