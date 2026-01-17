import React from 'react';
import { CloudPlatform, AppType, DevOpsPlatform, Architecture, Environment, TargetResource } from './types';
import { Cloud, Server, Box, Layers, GitBranch, Terminal, Globe, Shield, Zap, Settings, Cpu, HardDrive, Database, Factory, Activity } from 'lucide-react';

export const CLOUD_OPTIONS = [
  { value: CloudPlatform.AWS, label: '☁️ AWS', icon: Cloud, desc: 'Amazon Web Services' },
  { value: CloudPlatform.Azure, label: '🔷 Azure', icon: Globe, desc: 'Microsoft Azure' },
  { value: CloudPlatform.GCP, label: '🌈 GCP', icon: Server, desc: 'Google Cloud Platform' },
];

export const APP_OPTIONS = [
  { value: AppType.Backend, label: '⚙️ Backend Service', icon: Server, desc: 'Node.js, Python, Go, Java, .NET' },
  { value: AppType.Frontend, label: '🖥️ Frontend App', icon: Globe, desc: 'React, Angular, Vue, Svelte' },
  { value: AppType.Container, label: '🐳 Containerized', icon: Box, desc: 'Docker, Podman, OCI Images' },
  { value: AppType.Infrastructure, label: '🏗️ Infrastructure', icon: Settings, desc: 'Terraform, Pulumi, Bicep' },
  { value: AppType.DataETL, label: '📊 Data / ETL', icon: Database, desc: 'ADF, Synapse, Databricks, DBT' },
];

interface ResourceOption {
  value: TargetResource;
  label: string;
  icon: React.ElementType;
  desc: string;
  platforms: CloudPlatform[];
  // If defined, only these AppTypes are valid for this resource. If undefined, all are valid.
  validAppTypes?: AppType[]; 
}

export const TARGET_RESOURCE_OPTIONS: ResourceOption[] = [
  // Generic / Common
  { 
    value: TargetResource.WebApp, 
    label: '🌍 Web App', 
    icon: Globe, 
    desc: 'App Service, Elastic Beanstalk, Cloud Run', 
    platforms: [CloudPlatform.AWS, CloudPlatform.Azure, CloudPlatform.GCP],
    validAppTypes: [AppType.Backend, AppType.Frontend, AppType.Container, AppType.Infrastructure]
  },
  { 
    value: TargetResource.FunctionApp, 
    label: '⚡ Serverless Function', 
    icon: Zap, 
    desc: 'Azure Functions, Lambda, Google Functions', 
    platforms: [CloudPlatform.AWS, CloudPlatform.Azure, CloudPlatform.GCP],
    validAppTypes: [AppType.Backend, AppType.Container, AppType.Infrastructure] 
  },
  { 
    value: TargetResource.AKS, 
    label: '☸️ Kubernetes Cluster', 
    icon: Box, 
    desc: 'AKS, EKS, GKE', 
    platforms: [CloudPlatform.AWS, CloudPlatform.Azure, CloudPlatform.GCP],
    validAppTypes: [AppType.Backend, AppType.Frontend, AppType.Container, AppType.Infrastructure]
  },
  { 
    value: TargetResource.ContainerRegistry, 
    label: '📦 Container Instance', 
    icon: Layers, 
    desc: 'ACR+ACI, ECR+ECS, GCR', 
    platforms: [CloudPlatform.AWS, CloudPlatform.Azure, CloudPlatform.GCP],
    validAppTypes: [AppType.Container, AppType.Backend, AppType.Frontend, AppType.Infrastructure] // Usually implies containerized
  },
  { 
    value: TargetResource.VM, 
    label: '💻 Virtual Machine', 
    icon: Cpu, 
    desc: 'EC2, Azure VM, Compute Engine', 
    platforms: [CloudPlatform.AWS, CloudPlatform.Azure, CloudPlatform.GCP]
    // VMs are generic, can host anything, including Data tools manually installed.
  },
  { 
    value: TargetResource.Storage, 
    label: '💾 Storage / Static', 
    icon: HardDrive, 
    desc: 'S3, Blob Storage, Cloud Storage', 
    platforms: [CloudPlatform.AWS, CloudPlatform.Azure, CloudPlatform.GCP],
    validAppTypes: [AppType.Frontend, AppType.DataETL, AppType.Infrastructure, AppType.Backend]
  },
  
  // Data & ETL (Mostly Azure/Cloud Specific)
  { 
    value: TargetResource.DataFactory, 
    label: '🏭 Data Factory', 
    icon: Factory, 
    desc: 'ETL Pipelines (ADF)', 
    platforms: [CloudPlatform.Azure],
    validAppTypes: [AppType.DataETL, AppType.Infrastructure]
  },
  { 
    value: TargetResource.Synapse, 
    label: '🧠 Synapse Analytics', 
    icon: Activity, 
    desc: 'Big Data Analytics', 
    platforms: [CloudPlatform.Azure],
    validAppTypes: [AppType.DataETL, AppType.Infrastructure]
  },
  { 
    value: TargetResource.Databricks, 
    label: '🧱 Databricks', 
    icon: Layers, 
    desc: 'Unified Data Analytics', 
    platforms: [CloudPlatform.Azure, CloudPlatform.AWS, CloudPlatform.GCP],
    validAppTypes: [AppType.DataETL, AppType.Infrastructure]
  },
  { 
    value: TargetResource.SQLDatabase, 
    label: '🗄️ SQL Database', 
    icon: Database, 
    desc: 'Managed SQL Instances', 
    platforms: [CloudPlatform.AWS, CloudPlatform.Azure, CloudPlatform.GCP],
    validAppTypes: [AppType.DataETL, AppType.Backend, AppType.Infrastructure]
  },
];

export const DEVOPS_OPTIONS = [
  { value: DevOpsPlatform.GitHubActions, label: '🐙 GitHub Actions', icon: GitBranch },
  { value: DevOpsPlatform.AzureDevOps, label: '🚀 Azure DevOps', icon: Shield },
  { value: DevOpsPlatform.GitLabCI, label: '🦊 GitLab CI', icon: Layers },
  { value: DevOpsPlatform.BitbucketPipelines, label: '🪣 Bitbucket', icon: Terminal },
];

export const ARCH_OPTIONS = [
  { value: Architecture.Single, label: '📄 Single Pipeline', desc: 'Build and Deploy in one file' },
  { value: Architecture.Nested, label: '📑 Nested Pipelines', desc: 'Orchestrator calling nested/reusable workflows' },
];

export const DEFAULT_ENVS: Environment[] = [
  { id: 'dev', name: 'Development' },
  { id: 'qa', name: 'QA' },
  { id: 'staging', name: 'Staging' },
  { id: 'prod', name: 'Production' },
];