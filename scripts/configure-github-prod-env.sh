#!/usr/bin/env bash
set -euo pipefail

GITHUB_OWNER="${GITHUB_OWNER:-1b-tokens}"
GITHUB_REPO="${GITHUB_REPO:-1b-tokens}"
GITHUB_ENVIRONMENT="${GITHUB_ENVIRONMENT:-Prod}"
PROJECT_ID="${PROJECT_ID:-one-billion-tokens}"
PROJECT_NUMBER="${PROJECT_NUMBER:-498443176020}"
REGION="${REGION:-europe-west1}"
ARTIFACT_REPOSITORY="${ARTIFACT_REPOSITORY:-one-billion-tokens}"
CLOUD_RUN_SERVICE="${CLOUD_RUN_SERVICE:-one-billion-tokens}"
WORKLOAD_IDENTITY_POOL="${WORKLOAD_IDENTITY_POOL:-github-actions}"
WORKLOAD_IDENTITY_PROVIDER="${WORKLOAD_IDENTITY_PROVIDER:-github}"
DEPLOY_SERVICE_ACCOUNT="${DEPLOY_SERVICE_ACCOUNT:-github-actions-deployer}"
RUNTIME_SERVICE_ACCOUNT="${RUNTIME_SERVICE_ACCOUNT:-one-billion-tokens-runner}"
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://1btokens.club}"

REPO="${GITHUB_OWNER}/${GITHUB_REPO}"
WIF_PROVIDER="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WORKLOAD_IDENTITY_POOL}/providers/${WORKLOAD_IDENTITY_PROVIDER}"
DEPLOY_SA_EMAIL="${DEPLOY_SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com"
RUNTIME_SA_EMAIL="${RUNTIME_SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com"

echo "Ensuring GitHub environment ${GITHUB_ENVIRONMENT} exists in ${REPO}"
gh api \
  --method PUT \
  "repos/${REPO}/environments/${GITHUB_ENVIRONMENT}" >/dev/null

set_variable() {
  local name="$1"
  local value="$2"
  echo "Setting ${name}"
  gh variable set "${name}" \
    --repo "${REPO}" \
    --env "${GITHUB_ENVIRONMENT}" \
    --body "${value}" >/dev/null
}

set_variable "GCP_PROJECT_ID" "${PROJECT_ID}"
set_variable "GCP_PROJECT_NUMBER" "${PROJECT_NUMBER}"
set_variable "GCP_REGION" "${REGION}"
set_variable "GAR_LOCATION" "${REGION}"
set_variable "GAR_REPOSITORY" "${ARTIFACT_REPOSITORY}"
set_variable "CLOUD_RUN_SERVICE" "${CLOUD_RUN_SERVICE}"
set_variable "CLOUD_RUN_REGION" "${REGION}"
set_variable "WIF_PROVIDER" "${WIF_PROVIDER}"
set_variable "DEPLOY_SERVICE_ACCOUNT" "${DEPLOY_SA_EMAIL}"
set_variable "RUNTIME_SERVICE_ACCOUNT" "${RUNTIME_SA_EMAIL}"
set_variable "NEXT_PUBLIC_SITE_URL" "${NEXT_PUBLIC_SITE_URL}"

echo "GitHub ${GITHUB_ENVIRONMENT} environment variables configured for ${REPO}."
