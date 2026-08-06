import { useTranslation } from 'react-i18next';

import { View } from '@actual-app/components/view';

import { LoadComponent } from '#components/util/LoadComponent';

export function Spending() {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1 }} data-testid="spending-page">
      <LoadComponent
        name="SpendingTable"
        message={t('Loading spending...')}
        importer={() =>
          import(/* webpackChunkName: 'spending' */ './SpendingTable')
        }
      />
    </View>
  );
}
