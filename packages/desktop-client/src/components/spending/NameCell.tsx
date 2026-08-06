import type { CSSProperties, ReactNode } from 'react';

import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

type NameCellProps = {
  children: ReactNode;
  bold?: boolean;
  sticky?: boolean;
  indent?: boolean;
  onClick?: () => void;
  style?: CSSProperties;
};

export function NameCell({
  children,
  bold,
  sticky,
  indent,
  onClick,
  style,
}: NameCellProps) {
  return (
    <View
      onClick={onClick}
      style={{
        ...styles.smallText,
        fontWeight: bold ? 600 : 400,
        flexDirection: 'row',
        alignItems: 'center',
        padding: '6px 10px',
        paddingLeft: indent ? 24 : 10,
        backgroundColor: theme.tableBackground,
        borderBottom: `1px solid ${theme.tableBorder}`,
        ...(sticky ? { position: 'sticky', left: 0, zIndex: 1 } : undefined),
        ...style,
      }}
    >
      {children}
    </View>
  );
}
