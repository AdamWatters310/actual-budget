import { useState } from 'react';
import { Trans } from 'react-i18next';

import {
  SvgCheveronDown,
  SvgCheveronRight,
} from '@actual-app/components/icons/v1';
import { Text } from '@actual-app/components/text';
import { theme } from '@actual-app/components/theme';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import { useFormat } from '#hooks/useFormat';
import { useLocale } from '#hooks/useLocale';

import { AmountCell } from './AmountCell';
import { HeaderCell } from './HeaderCell';
import { NameCell } from './NameCell';
import type { SpendingGroupRow } from './useSpendingData';

const NAME_COLUMN_WIDTH = 220;
const AMOUNT_COLUMN_WIDTH = 100;

type SpendingTableGridProps = {
  months: string[];
  groups: SpendingGroupRow[];
  columnTotals: number[];
  grandTotal: number;
};

export function SpendingTableGrid({
  months,
  groups,
  columnTotals,
  grandTotal,
}: SpendingTableGridProps) {
  const locale = useLocale();
  const format = useFormat();
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(
    new Set(),
  );

  function toggleGroup(groupId: string) {
    setCollapsedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  }

  function formatAmount(amount: number) {
    return amount === 0 ? '-' : format(amount, 'financial');
  }

  const gridTemplateColumns = `${NAME_COLUMN_WIDTH}px repeat(${months.length}, minmax(${AMOUNT_COLUMN_WIDTH}px, 1fr)) minmax(${AMOUNT_COLUMN_WIDTH}px, 1fr)`;

  return (
    <View style={{ flex: 1, overflow: 'auto' }}>
      <View
        style={{
          display: 'grid',
          gridTemplateColumns,
          minWidth: 'fit-content',
        }}
      >
        <HeaderCell
          style={{
            position: 'sticky',
            left: 0,
            top: 0,
            zIndex: 4,
          }}
        >
          <Trans>Category</Trans>
        </HeaderCell>
        {months.map(month => (
          <HeaderCell
            key={month}
            align="right"
            style={{ position: 'sticky', top: 0, zIndex: 3 }}
          >
            {monthUtils.format(month, 'MMM yyyy', locale)}
          </HeaderCell>
        ))}
        <HeaderCell
          align="right"
          style={{ position: 'sticky', top: 0, zIndex: 3 }}
        >
          <Trans>Total</Trans>
        </HeaderCell>

        {groups.map(group => {
          const isCollapsed = collapsedGroups.has(group.id);
          return (
            <View key={group.id} style={{ display: 'contents' }}>
              <NameCell
                bold
                sticky
                onClick={() => toggleGroup(group.id)}
                style={{ cursor: 'pointer' }}
              >
                {isCollapsed ? (
                  <SvgCheveronRight width={10} height={10} />
                ) : (
                  <SvgCheveronDown width={10} height={10} />
                )}
                <Text style={{ marginLeft: 4 }}>{group.name}</Text>
              </NameCell>
              {group.amounts.map((amount, index) => (
                <AmountCell key={months[index]} bold amount={amount}>
                  {formatAmount(amount)}
                </AmountCell>
              ))}
              <AmountCell bold amount={group.total}>
                {formatAmount(group.total)}
              </AmountCell>

              {!isCollapsed &&
                group.categories.map(category => (
                  <View key={category.id} style={{ display: 'contents' }}>
                    <NameCell sticky indent>
                      {category.name}
                    </NameCell>
                    {category.amounts.map((amount, index) => (
                      <AmountCell key={months[index]} amount={amount}>
                        {formatAmount(amount)}
                      </AmountCell>
                    ))}
                    <AmountCell amount={category.total}>
                      {formatAmount(category.total)}
                    </AmountCell>
                  </View>
                ))}
            </View>
          );
        })}

        <NameCell
          bold
          sticky
          style={{ borderTop: `2px solid ${theme.tableBorder}` }}
        >
          <Trans>Total</Trans>
        </NameCell>
        {columnTotals.map((amount, index) => (
          <AmountCell
            key={months[index]}
            bold
            amount={amount}
            style={{ borderTop: `2px solid ${theme.tableBorder}` }}
          >
            {formatAmount(amount)}
          </AmountCell>
        ))}
        <AmountCell
          bold
          amount={grandTotal}
          style={{ borderTop: `2px solid ${theme.tableBorder}` }}
        >
          {formatAmount(grandTotal)}
        </AmountCell>
      </View>
    </View>
  );
}
