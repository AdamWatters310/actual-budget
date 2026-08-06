import { describe, expect, it } from 'vitest';

import {
  clampRange,
  getAllTimeRange,
  getDefaultRange,
  getPreviousTwelveMonthsRange,
  getPreviousYearRange,
  getYearToDateRange,
} from './spendingRange';

describe('getDefaultRange', () => {
  it('shows Jan through last month for a mid-year month', () => {
    expect(getDefaultRange('2026-08')).toEqual(['2026-01', '2026-07']);
  });

  it('shows the entire previous year when the current month is January', () => {
    expect(getDefaultRange('2026-01')).toEqual(['2025-01', '2025-12']);
  });
});

describe('getAllTimeRange', () => {
  it('spans from the earliest transaction month through last month', () => {
    expect(getAllTimeRange('2020-03', '2026-08')).toEqual([
      '2020-03',
      '2026-07',
    ]);
  });

  it('does not start after the end month when there is no history yet', () => {
    expect(getAllTimeRange('2026-08', '2026-08')).toEqual([
      '2026-07',
      '2026-07',
    ]);
  });
});

describe('getPreviousYearRange', () => {
  it('returns Jan-Dec of the prior calendar year', () => {
    expect(getPreviousYearRange('2026-08')).toEqual(['2025-01', '2025-12']);
  });

  it('handles January correctly', () => {
    expect(getPreviousYearRange('2026-01')).toEqual(['2025-01', '2025-12']);
  });
});

describe('getPreviousTwelveMonthsRange', () => {
  it('returns 12 complete months ending last month', () => {
    expect(getPreviousTwelveMonthsRange('2026-08')).toEqual([
      '2025-08',
      '2026-07',
    ]);
  });
});

describe('getYearToDateRange', () => {
  it('returns Jan through last month for a mid-year month', () => {
    expect(getYearToDateRange('2026-08')).toEqual(['2026-01', '2026-07']);
  });

  it('collapses to the current month in January instead of an inverted range', () => {
    expect(getYearToDateRange('2026-01')).toEqual(['2026-01', '2026-01']);
  });
});

describe('clampRange', () => {
  it('leaves an already-ordered range untouched', () => {
    expect(clampRange('2026-01', '2026-06')).toEqual(['2026-01', '2026-06']);
  });

  it('swaps start and end when the user inverted the range', () => {
    expect(clampRange('2026-06', '2026-01')).toEqual(['2026-01', '2026-06']);
  });
});
