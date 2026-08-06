import { useMemo } from 'react';

import * as monthUtils from '@actual-app/core/shared/months';
import { q } from '@actual-app/core/shared/query';
import { useQuery } from '@tanstack/react-query';

import { useCategories } from '#hooks/useCategories';
import { aqlQuery } from '#queries/aqlQuery';

export type SpendingCategoryRow = {
  id: string;
  name: string;
  hidden: boolean;
  amounts: number[];
  total: number;
};

export type SpendingGroupRow = {
  id: string;
  name: string;
  hidden: boolean;
  categories: SpendingCategoryRow[];
  amounts: number[];
  total: number;
};

export type SpendingMatrix = {
  months: string[];
  groups: SpendingGroupRow[];
  columnTotals: number[];
  grandTotal: number;
};

type SpendingQueryRow = {
  month: string;
  categoryId: string | null;
  amount: number;
};

function makeSpendingQuery(startMonth: string, endMonth: string) {
  return q('transactions')
    .filter({
      $and: [
        { date: { $transform: '$month', $gte: startMonth } },
        { date: { $transform: '$month', $lte: endMonth } },
      ],
      'account.offbudget': false,
      'payee.transfer_acct': null,
    })
    .groupBy([{ $month: '$date' }, { $id: '$category' }])
    .select([
      { month: { $month: '$date' } },
      { categoryId: { $id: '$category.id' } },
      { amount: { $sum: '$amount' } },
    ]);
}

export function useSpendingData(
  startMonth: string,
  endMonth: string,
  showHiddenCategories: boolean,
) {
  const { data: categoriesData, isLoading: isCategoriesLoading } =
    useCategories();

  const {
    data: rows,
    isLoading: isRowsLoading,
    isError,
  } = useQuery({
    queryKey: ['spending-table', startMonth, endMonth],
    queryFn: async () => {
      const { data } = await aqlQuery(makeSpendingQuery(startMonth, endMonth));
      return data as SpendingQueryRow[];
    },
  });

  const matrix = useMemo<SpendingMatrix>(() => {
    const grouped = categoriesData?.grouped ?? [];
    const months = monthUtils.rangeInclusive(startMonth, endMonth);

    const amountsByKey = new Map<string, number>();
    for (const row of rows ?? []) {
      if (!row.categoryId) continue;
      // Transactions are stored as negative amounts when spending. Net out
      // refunds (positive amounts) and flip the sign so spending displays
      // as a positive number.
      amountsByKey.set(`${row.categoryId}:${row.month}`, -row.amount);
    }

    const columnTotals = months.map(() => 0);
    let grandTotal = 0;

    const groups: SpendingGroupRow[] = grouped
      .filter(group => !group.is_income)
      .filter(group => showHiddenCategories || !group.hidden)
      .map(group => {
        const categories: SpendingCategoryRow[] = (group.categories ?? [])
          .filter(category => !category.is_income)
          .filter(category => showHiddenCategories || !category.hidden)
          .map(category => {
            const amounts = months.map(
              month => amountsByKey.get(`${category.id}:${month}`) ?? 0,
            );
            return {
              id: category.id,
              name: category.name,
              hidden: !!category.hidden,
              amounts,
              total: amounts.reduce((sum, amount) => sum + amount, 0),
            };
          });

        const amounts = months.map((_, monthIndex) =>
          categories.reduce(
            (sum, category) => sum + category.amounts[monthIndex],
            0,
          ),
        );
        const total = amounts.reduce((sum, amount) => sum + amount, 0);

        amounts.forEach((amount, monthIndex) => {
          columnTotals[monthIndex] += amount;
        });
        grandTotal += total;

        return {
          id: group.id,
          name: group.name,
          hidden: !!group.hidden,
          categories,
          amounts,
          total,
        };
      })
      .filter(group => group.categories.length > 0);

    return { months, groups, columnTotals, grandTotal };
  }, [rows, categoriesData, startMonth, endMonth, showHiddenCategories]);

  return {
    ...matrix,
    isLoading: isCategoriesLoading || isRowsLoading,
    isError,
  };
}
