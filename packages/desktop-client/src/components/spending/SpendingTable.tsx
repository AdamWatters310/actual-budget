import { Trans, useTranslation } from 'react-i18next';

import { Text } from '@actual-app/components/text';
import { View } from '@actual-app/components/view';
import * as monthUtils from '@actual-app/core/shared/months';

import { Page, PageHeader } from '#components/Page';
import { LoadingIndicator } from '#components/reports/LoadingIndicator';
import { useLocalPref } from '#hooks/useLocalPref';

import { getDefaultRange } from './spendingRange';
import { SpendingRangeControls } from './SpendingRangeControls';
import { SpendingTableGrid } from './SpendingTableGrid';
import { useSpendingData } from './useSpendingData';

export function SpendingTable() {
  const { t } = useTranslation();

  const [startMonthPref, setStartMonthPref] = useLocalPref(
    'spending.rangeStart',
  );
  const [endMonthPref, setEndMonthPref] = useLocalPref('spending.rangeEnd');
  const [showHiddenPref, setShowHiddenPref] = useLocalPref(
    'spending.showHiddenCategories',
  );

  const [defaultStart, defaultEnd] = getDefaultRange(monthUtils.currentMonth());
  const startMonth = startMonthPref || defaultStart;
  const endMonth = endMonthPref || defaultEnd;
  const showHiddenCategories = showHiddenPref ?? false;

  function onChangeRange(newStartMonth: string, newEndMonth: string) {
    setStartMonthPref(newStartMonth);
    setEndMonthPref(newEndMonth);
  }

  const { months, groups, columnTotals, grandTotal, isLoading } =
    useSpendingData(startMonth, endMonth, showHiddenCategories);

  return (
    <Page header={<PageHeader title={t('Income/Expense')} />}>
      <SpendingRangeControls
        startMonth={startMonth}
        endMonth={endMonth}
        onChangeRange={onChangeRange}
        showHiddenCategories={showHiddenCategories}
        onToggleShowHiddenCategories={() =>
          setShowHiddenPref(!showHiddenCategories)
        }
      />
      {isLoading ? (
        <LoadingIndicator message={t('Loading spending data...')} />
      ) : groups.length === 0 ? (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>
            <Trans>No spending categories to show for this range.</Trans>
          </Text>
        </View>
      ) : (
        <SpendingTableGrid
          months={months}
          groups={groups}
          columnTotals={columnTotals}
          grandTotal={grandTotal}
        />
      )}
    </Page>
  );
}
