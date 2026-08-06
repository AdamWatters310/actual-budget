import { Trans } from 'react-i18next';

import { Button } from '@actual-app/components/button';
import { Select } from '@actual-app/components/select';
import type { SelectOption } from '@actual-app/components/select';
import { View } from '@actual-app/components/view';
import { send } from '@actual-app/core/platform/client/connection';
import * as monthUtils from '@actual-app/core/shared/months';
import { useQuery } from '@tanstack/react-query';

import { LabeledCheckbox } from '#components/forms/LabeledCheckbox';
import { useLocale } from '#hooks/useLocale';

import {
  clampRange,
  getAllTimeRange,
  getPreviousTwelveMonthsRange,
  getPreviousYearRange,
  getYearToDateRange,
} from './spendingRange';

type SpendingRangeControlsProps = {
  startMonth: string;
  endMonth: string;
  onChangeRange: (startMonth: string, endMonth: string) => void;
  showHiddenCategories: boolean;
  onToggleShowHiddenCategories: () => void;
};

export function SpendingRangeControls({
  startMonth,
  endMonth,
  onChangeRange,
  showHiddenCategories,
  onToggleShowHiddenCategories,
}: SpendingRangeControlsProps) {
  const locale = useLocale();
  const currentMonth = monthUtils.currentMonth();
  const lastCompletedMonth = monthUtils.subMonths(currentMonth, 1);

  const { data: earliestMonth = lastCompletedMonth } = useQuery({
    queryKey: ['spending-earliest-transaction'],
    queryFn: async () => {
      const earliestTransaction = await send('get-earliest-transaction');
      return earliestTransaction
        ? monthUtils.monthFromDate(earliestTransaction.date)
        : lastCompletedMonth;
    },
  });

  const monthOptions: SelectOption[] = monthUtils
    .rangeInclusive(earliestMonth, lastCompletedMonth)
    .reverse()
    .map(month => [month, monthUtils.format(month, 'MMM yyyy', locale)]);

  function selectRange(startMonth: string, endMonth: string) {
    onChangeRange(...clampRange(startMonth, endMonth));
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 8,
        paddingBottom: 12,
      }}
    >
      <Button
        onPress={() =>
          selectRange(...getAllTimeRange(earliestMonth, currentMonth))
        }
      >
        <Trans>All time</Trans>
      </Button>
      <Button
        onPress={() => selectRange(...getPreviousYearRange(currentMonth))}
      >
        <Trans>Previous year</Trans>
      </Button>
      <Button
        onPress={() =>
          selectRange(...getPreviousTwelveMonthsRange(currentMonth))
        }
      >
        <Trans>Previous 12 months</Trans>
      </Button>
      <Button onPress={() => selectRange(...getYearToDateRange(currentMonth))}>
        <Trans>Year to date</Trans>
      </Button>

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
        <Select
          value={startMonth}
          options={monthOptions}
          onChange={value => selectRange(value, endMonth)}
        />
        <View>
          <Trans>to</Trans>
        </View>
        <Select
          value={endMonth}
          options={monthOptions}
          onChange={value => selectRange(startMonth, value)}
        />
      </View>

      <LabeledCheckbox
        id="spending-show-hidden-categories"
        checked={showHiddenCategories}
        onChange={onToggleShowHiddenCategories}
      >
        <Trans>Show hidden categories</Trans>
      </LabeledCheckbox>
    </View>
  );
}
