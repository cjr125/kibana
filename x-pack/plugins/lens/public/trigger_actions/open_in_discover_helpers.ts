/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import type { DiscoverSetup } from '@kbn/discover-plugin/public';
import { Filter } from '@kbn/es-query';
import { IEmbeddable } from '@kbn/embeddable-plugin/public';
import { DataViewsService } from '@kbn/data-views-plugin/public';
import type { Embeddable } from '../embeddable';
import { DOC_TYPE } from '../../common';

interface Context {
  embeddable: IEmbeddable;
  filters?: Filter[];
  openInSameTab?: boolean;
  hasDiscoverAccess: boolean;
  dataViews: Pick<DataViewsService, 'get'>;
  discover: Pick<DiscoverSetup, 'locator'>;
  timeFieldName?: string;
}

export function isLensEmbeddable(embeddable: IEmbeddable): embeddable is Embeddable {
  return embeddable.type === DOC_TYPE;
}

export async function isCompatible({ hasDiscoverAccess, embeddable }: Context) {
  if (!hasDiscoverAccess) return false;
  return isLensEmbeddable(embeddable) && (await embeddable.canViewUnderlyingData());
}

export async function execute({
  embeddable,
  discover,
  filters,
  openInSameTab,
  dataViews,
  timeFieldName,
}: Context) {
  if (!isLensEmbeddable(embeddable)) {
    // shouldn't be executed because of the isCompatible check
    throw new Error('Can only be executed in the context of Lens visualization');
  }
  const args = embeddable.getViewUnderlyingDataArgs();
  if (!args) {
    // shouldn't be executed because of the isCompatible check
    throw new Error('Underlying data is not ready');
  }
  const dataView = await dataViews.get(args.indexPatternId);
  let filtersToApply = [...(filters || []), ...args.filters];
  let timeRangeToApply = args.timeRange;
  // if the target data view is time based, attempt to split out a time range from the provided filters
  if (dataView.isTimeBased() && dataView.timeFieldName === timeFieldName) {
    const { extractTimeRange } = await import('@kbn/es-query');
    const { restOfFilters, timeRange } = extractTimeRange(filters || [], timeFieldName);
    filtersToApply = restOfFilters;
    if (timeRange) {
      timeRangeToApply = timeRange;
    }
  }
  const discoverUrl = discover.locator?.getRedirectUrl({
    ...args,
    timeRange: timeRangeToApply,
    filters: filtersToApply,
  });
  window.open(discoverUrl, !openInSameTab ? '_blank' : '_self');
}
