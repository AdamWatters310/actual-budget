import * as monthUtils from '@actual-app/core/shared/months';

export type MonthRange = [start: string, end: string];

function isJanuary(month: string): boolean {
  return monthUtils.getMonthIndex(month) === 0;
}

/**
 * Default range on first load: the current calendar year up to (but not
 * including) the current month. In January there are no completed months
 * yet this year, so fall back to the entire previous calendar year.
 */
export function getDefaultRange(currentMonth: string): MonthRange {
  if (isJanuary(currentMonth)) {
    const previousYear = monthUtils.prevYear(currentMonth);
    return [
      monthUtils.getYearStart(previousYear),
      monthUtils.getYearEnd(previousYear),
    ];
  }

  return [
    monthUtils.getYearStart(currentMonth),
    monthUtils.subMonths(currentMonth, 1),
  ];
}

/** All months with data, up to (but not including) the current month. */
export function getAllTimeRange(
  earliestMonth: string,
  currentMonth: string,
): MonthRange {
  const end = monthUtils.subMonths(currentMonth, 1);
  const start = earliestMonth < end ? earliestMonth : end;
  return [start, end];
}

/** Full previous calendar year (Jan-Dec). */
export function getPreviousYearRange(currentMonth: string): MonthRange {
  const previousYear = monthUtils.prevYear(currentMonth);
  return [
    monthUtils.getYearStart(previousYear),
    monthUtils.getYearEnd(previousYear),
  ];
}

/** The 12 complete months ending last month. */
export function getPreviousTwelveMonthsRange(currentMonth: string): MonthRange {
  return [
    monthUtils.subMonths(currentMonth, 12),
    monthUtils.subMonths(currentMonth, 1),
  ];
}

/**
 * Current year up to last month. In January there's no completed month yet
 * this year, so the range collapses to the current (in-progress) month
 * rather than being empty or inverted.
 */
export function getYearToDateRange(currentMonth: string): MonthRange {
  const start = monthUtils.getYearStart(currentMonth);
  const lastCompletedMonth = monthUtils.subMonths(currentMonth, 1);
  const end = lastCompletedMonth < start ? start : lastCompletedMonth;
  return [start, end];
}

/** Ensures start <= end, swapping if the user inverted the range. */
export function clampRange(start: string, end: string): MonthRange {
  return start <= end ? [start, end] : [end, start];
}
