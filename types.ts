export enum CloudPlatform {
  AWS = 'AWS',
  Azure = 'Azure',
  GCP = 'GCP',
}

export enum AppType {
  Backend = 'Backend (Node/Python/Go/etc)',
  Frontend = 'Frontend (React/Vue/Angular)',
  Container = 'Containerized Application',
  Infrastructure = 'Infrastructure Only (Terraform/Bicep)',
  DataETL = 'Data Pipeline / ETL'
}

export enum DevOpsPlatform {
  GitHubActions = 'GitHub Actions',
  AzureDevOps = 'Azure DevOps',
  GitLabCI = 'GitLab CI',
  BitbucketPipelines = 'Bitbucket Pipelines'
}

export enum TargetResource {
  WebApp = 'Web App / App Service',
  FunctionApp = 'Function App / Lambda',
  AKS = 'Kubernetes Cluster (AKS/EKS/GKE)',
  ContainerRegistry = 'Container Registry + Instance',
  VM = 'Virtual Machine',
  Storage = 'Static Storage (Blob/S3)',
  Serverless = 'Serverless (Generic)',
  // Data / ETL Specific
  Synapse = 'Azure Synapse Analytics',
  DataFactory = 'Azure Data Factory',
  Databricks = 'Databricks',
  SQLDatabase = 'SQL Database'
}

export enum Architecture {
  Single = 'Single Pipeline',
  Nested = 'Nested Pipelines'
}

export interface Environment {
  id: string;
  name: string;
}

export interface AdvancedOptions {
  dockerSupport: boolean;
  generateDockerfile: boolean; // New option
  iac: boolean;
  manualApproval: boolean;
  deploymentStrategy: 'Rolling' | 'BlueGreen' | 'Canary' | 'Standard';
  artifactPromotion: boolean;
}

export interface WizardState {
  cloud: CloudPlatform | null;
  appType: AppType | null;
  targetResource: TargetResource | null;
  devOps: DevOpsPlatform | null;
  architecture: Architecture | null;
  environments: Environment[];
  advanced: AdvancedOptions;
}

export interface GeneratedFile {
  filename: string;
  content: string;
  description: string;
}

export type StepId = 'cloud' | 'app' | 'platform' | 'arch' | 'env' | 'advanced' | 'review';