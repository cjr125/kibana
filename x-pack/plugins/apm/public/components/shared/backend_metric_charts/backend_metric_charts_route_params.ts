/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { TypeOf } from '@kbn/typed-react-router-config';
import { ApmRoutes } from '../../routing/apm_route_config';

export type BackendMetricChartsRouteParams = Pick<
  { spanName?: string } & TypeOf<
    ApmRoutes,
    '/backends/operation' | '/backends/overview'
  >['query'],
  | 'backendName'
  | 'comparisonEnabled'
  | 'spanName'
  | 'rangeFrom'
  | 'rangeTo'
  | 'kuery'
  | 'environment'
  | 'comparisonEnabled'
  | 'offset'
>;
