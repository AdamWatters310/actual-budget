import type { CSSProperties, ReactNode } from 'react';

import { styles } from '@actual-app/components/styles';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';

import { FinancialText } from '#components/FinancialText';
import { ConditionalPrivacyFilter } from '#components/PrivacyFilter';

type AmountCellProps = {
  children: ReactNode;
  amount: number;
  bold?: boolean;
  style?: CSSProperties;
};

export function AmountCell({ children, amount, bold, style }: AmountCellProps) {
  return (
    <View
      style={{
        padding: '6px 10px',
        backgroundColor: theme.tableBackground,
        borderBottom: `1px solid ${theme.tableBorder}`,
        justifyContent: 'center',
        alignItems: 'flex-end',
        ...style,
      }}
    >
      <ConditionalPrivacyFilter privacyFilter={amount !== 0}>
        <FinancialText
          style={{
            ...styles.smallText,
            fontWeight: bold ? 600 : 400,
            color: amount < 0 ? theme.reportsNumberNegative : theme.tableText,
          }}
        >
          {children}
        </FinancialText>
      </ConditionalPrivacyFilter>
    </View>
  );
}
