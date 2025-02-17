/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0 and the Server Side Public License, v 1; you may not use this file except
 * in compliance with, at your election, the Elastic License 2.0 or the Server
 * Side Public License, v 1.
 */

import React, { FC, useContext } from 'react';
import {
  KibanaNoDataPageServices,
  KibanaNoDataPageKibanaDependencies,
  KibanaNoDataPageKibanaProvider,
  KibanaNoDataPageProvider,
} from '@kbn/shared-ux-page-kibana-no-data';

/**
 * A list of services that are consumed by this component.
 */
interface Services {
  kibanaGuideDocLink: string;
}

const Context = React.createContext<Services | null>(null);

/**
 * Services that are consumed by this component and its dependencies.
 */
export type AnalyticsNoDataPageServices = Services & KibanaNoDataPageServices;

/**
 * A Context Provider that provides services to the component and its dependencies.
 */
export const AnalyticsNoDataPageProvider: FC<AnalyticsNoDataPageServices> = ({
  children,
  ...services
}) => {
  const { kibanaGuideDocLink } = services;

  return (
    <Context.Provider value={{ kibanaGuideDocLink }}>
      <KibanaNoDataPageProvider {...services}>{children}</KibanaNoDataPageProvider>
    </Context.Provider>
  );
};

interface KibanaDependencies {
  coreStart: {
    docLinks: {
      links: {
        kibana: {
          guide: string;
        };
      };
    };
  };
}
/**
 * An interface containing a collection of Kibana plugins and services required to
 * render this component as well as its dependencies.
 */
export type AnalyticsNoDataPageKibanaDependencies = KibanaDependencies &
  KibanaNoDataPageKibanaDependencies;

/**
 * Kibana-specific Provider that maps dependencies to services.
 */
export const AnalyticsNoDataPageKibanaProvider: FC<AnalyticsNoDataPageKibanaDependencies> = ({
  children,
  ...dependencies
}) => {
  const value: Services = {
    kibanaGuideDocLink: dependencies.coreStart.docLinks.links.kibana.guide,
  };

  return (
    <Context.Provider {...{ value }}>
      <KibanaNoDataPageKibanaProvider {...dependencies}>{children}</KibanaNoDataPageKibanaProvider>
    </Context.Provider>
  );
};

/**
 * React hook for accessing pre-wired services.
 */
export function useServices() {
  const context = useContext(Context);

  if (!context) {
    throw new Error(
      'AnalyticsNoDataPage Context is missing.  Ensure your component or React root is wrapped with AnalyticsNoDataPageContext.'
    );
  }

  return context;
}
