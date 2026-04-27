#!/usr/bin/env bash
set -euo pipefail

PROJECT_ID="${PROJECT_ID:-one-billion-tokens}"
PROJECT_NUMBER="${PROJECT_NUMBER:-498443176020}"
GITHUB_OWNER="${GITHUB_OWNER:-1b-tokens}"
GITHUB_REPO="${GITHUB_REPO:-1b-tokens}"
REGION="${REGION:-europe-west1}"
ARTIFACT_REPOSITORY="${ARTIFACT_REPOSITORY:-one-billion-tokens}"
CLOUD_RUN_SERVICE="${CLOUD_RUN_SERVICE:-one-billion-tokens}"
WORKLOAD_IDENTITY_POOL="${WORKLOAD_IDENTITY_POOL:-github-actions}"
WORKLOAD_IDENTITY_PROVIDER="${WORKLOAD_IDENTITY_PROVIDER:-github}"
DEPLOY_SERVICE_ACCOUNT="${DEPLOY_SERVICE_ACCOUNT:-github-actions-deployer}"
RUNTIME_SERVICE_ACCOUNT="${RUNTIME_SERVICE_ACCOUNT:-one-billion-tokens-runner}"
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-https://1btokens.club}"

DEPLOY_SA_EMAIL="${DEPLOY_SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com"
RUNTIME_SA_EMAIL="${RUNTIME_SERVICE_ACCOUNT}@${PROJECT_ID}.iam.gserviceaccount.com"
PROVIDER_RESOURCE="projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WORKLOAD_IDENTITY_POOL}/providers/${WORKLOAD_IDENTITY_PROVIDER}"
REPO_PRINCIPAL="principalSet://iam.googleapis.com/projects/${PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WORKLOAD_IDENTITY_POOL}/attribute.repository/${GITHUB_OWNER}/${GITHUB_REPO}"

echo "Configuring project ${PROJECT_ID} for ${GITHUB_OWNER}/${GITHUB_REPO}"
gcloud config set project "${PROJECT_ID}" >/dev/null

echo "Enabling required APIs"
gcloud services enable \
  artifactregistry.googleapis.com \
  iamcredentials.googleapis.com \
  run.googleapis.com \
  sts.googleapis.com

echo "Creating Artifact Registry repository if needed"
if ! gcloud artifacts repositories describe "${ARTIFACT_REPOSITORY}" \
  --location="${REGION}" >/dev/null 2>&1; then
  gcloud artifacts repositories create "${ARTIFACT_REPOSITORY}" \
    --repository-format=docker \
    --location="${REGION}" \
    --description="Docker images for One Billion Tokens"
fi

echo "Creating service accounts if needed"
if ! gcloud iam service-accounts describe "${DEPLOY_SA_EMAIL}" >/dev/null 2>&1; then
  gcloud iam service-accounts create "${DEPLOY_SERVICE_ACCOUNT}" \
    --display-name="GitHub Actions Cloud Run deployer"
fi

if ! gcloud iam service-accounts describe "${RUNTIME_SA_EMAIL}" >/dev/null 2>&1; then
  gcloud iam service-accounts create "${RUNTIME_SERVICE_ACCOUNT}" \
    --display-name="One Billion Tokens Cloud Run runtime"
fi

echo "Granting deploy permissions"
gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${DEPLOY_SA_EMAIL}" \
  --role="roles/artifactregistry.writer" \
  --condition=None >/dev/null

gcloud projects add-iam-policy-binding "${PROJECT_ID}" \
  --member="serviceAccount:${DEPLOY_SA_EMAIL}" \
  --role="roles/run.admin" \
  --condition=None >/dev/null

gcloud iam service-accounts add-iam-policy-binding "${RUNTIME_SA_EMAIL}" \
  --member="serviceAccount:${DEPLOY_SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser" >/dev/null

echo "Creating Workload Identity pool/provider if needed"
if ! gcloud iam workload-identity-pools describe "${WORKLOAD_IDENTITY_POOL}" \
  --location=global >/dev/null 2>&1; then
  gcloud iam workload-identity-pools create "${WORKLOAD_IDENTITY_POOL}" \
    --location=global \
    --display-name="GitHub Actions"
fi

if ! gcloud iam workload-identity-pools providers describe "${WORKLOAD_IDENTITY_PROVIDER}" \
  --location=global \
  --workload-identity-pool="${WORKLOAD_IDENTITY_POOL}" >/dev/null 2>&1; then
  gcloud iam workload-identity-pools providers create-oidc "${WORKLOAD_IDENTITY_PROVIDER}" \
    --location=global \
    --workload-identity-pool="${WORKLOAD_IDENTITY_POOL}" \
    --display-name="GitHub ${GITHUB_OWNER}/${GITHUB_REPO}" \
    --issuer-uri="https://token.actions.githubusercontent.com" \
    --attribute-mapping="google.subject=assertion.sub,attribute.actor=assertion.actor,attribute.repository=assertion.repository,attribute.ref=assertion.ref" \
    --attribute-condition="assertion.repository == '${GITHUB_OWNER}/${GITHUB_REPO}'"
fi

echo "Granting GitHub repository access to impersonate deploy service account"
gcloud iam service-accounts add-iam-policy-binding "${DEPLOY_SA_EMAIL}" \
  --member="${REPO_PRINCIPAL}" \
  --role="roles/iam.workloadIdentityUser" >/dev/null

cat <<EOF

GCP setup complete.

Use these GitHub environment variables:
GCP_PROJECT_ID=${PROJECT_ID}
GCP_PROJECT_NUMBER=${PROJECT_NUMBER}
GCP_REGION=${REGION}
GAR_LOCATION=${REGION}
GAR_REPOSITORY=${ARTIFACT_REPOSITORY}
CLOUD_RUN_SERVICE=${CLOUD_RUN_SERVICE}
CLOUD_RUN_REGION=${REGION}
WIF_PROVIDER=${PROVIDER_RESOURCE}
DEPLOY_SERVICE_ACCOUNT=${DEPLOY_SA_EMAIL}
RUNTIME_SERVICE_ACCOUNT=${RUNTIME_SA_EMAIL}
NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}
EOF
