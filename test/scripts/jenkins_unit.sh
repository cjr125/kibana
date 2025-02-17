#!/usr/bin/env bash

source test/scripts/jenkins_test_setup.sh

if [[ -z "$CODE_COVERAGE" ]] ; then
  # Lint
  ./test/scripts/lint/eslint.sh
  ./test/scripts/lint/stylelint.sh

  # Test
  ./test/scripts/test/jest_integration.sh
  ./test/scripts/test/jest_unit.sh
  ./test/scripts/test/api_integration.sh

  # Check
  ./test/scripts/checks/telemetry.sh
  ./test/scripts/checks/ts_projects.sh
  ./test/scripts/checks/jest_configs.sh
  ./test/scripts/checks/type_check.sh
  ./test/scripts/checks/bundle_limits.sh
  ./test/scripts/checks/i18n.sh
  ./test/scripts/checks/file_casing.sh
  ./test/scripts/checks/licenses.sh
  ./test/scripts/checks/plugins_with_circular_deps.sh
  ./test/scripts/checks/verify_notice.sh
  ./test/scripts/checks/test_projects.sh
  ./test/scripts/checks/test_hardening.sh
else
  echo " -> Running jest tests with coverage"
  node scripts/jest --ci --maxWorkers=8 --coverage || true;

  echo " -> Running jest integration tests with coverage"
  node scripts/jest_integration --ci --coverage || true;

  echo " -> Combine code coverage in a single report"
  yarn nyc report --nycrc-path src/dev/code_coverage/nyc_config/nyc.jest.config.js
fi
