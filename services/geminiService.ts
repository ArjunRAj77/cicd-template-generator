import { GoogleGenAI, Type } from "@google/genai";
import { WizardState, GeneratedFile } from "../types";

// Helper to ensure API key exists and provide helpful error if missing
const getApiKey = (): string => {
  // In Vite + Vercel, this is replaced by the actual string value at build time
  // or passed through if configured correctly in vite.config.ts
  const key = process.env.API_KEY;
  
  if (!key || key === 'undefined') {
    throw new Error(
      "API Key is missing. If you are deploying to Vercel, ensure you have added 'API_KEY' to your Project Settings > Environment Variables."
    );
  }
  return key;
};

export const generateTemplates = async (state: WizardState): Promise<GeneratedFile[]> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    You are a Senior DevOps Engineer. Generate a production-ready CI/CD configuration based on the following requirements:
    
    Cloud Provider: ${state.cloud}
    Target Resource: ${state.targetResource} (e.g. if Azure is selected, specifically target this resource type)
    Application Type: ${state.appType}
    DevOps Platform: ${state.devOps}
    Architecture: ${state.architecture}
    Environments: ${state.environments.map(e => e.name).join(' -> ')}
    
    Advanced Options:
    - Docker Support (Pipelines): ${state.advanced.dockerSupport}
    - Generate Dockerfile: ${state.advanced.generateDockerfile} (If true, create a best-practice Dockerfile for the AppType)
    - Infrastructure as Code (IaC): ${state.advanced.iac}
    - Manual Approval for Production: ${state.advanced.manualApproval}
    - Deployment Strategy: ${state.advanced.deploymentStrategy}
    - Artifact Promotion: ${state.advanced.artifactPromotion}

    REQUIREMENTS:
    1. Generate VALID YAML files for the specific DevOps platform.
    2. Follow industry best practices (security, efficiency, readability).
    3. Use secure secret references (e.g., secrets.AWS_KEY), never hardcoded.
    4. **CRITICAL:** Add concise, short comments explaining the logic. **YOU MUST USE EMOJIS in comments**. Example: "# 🚀 Build Step", "# 📦 Upload Artifact", "# 🧪 Run Tests".
    5. If 'Nested Pipelines' architecture is chosen, create separate files for build and deploy, controlled by a main orchestrator file or workflow call.
    6. Include a README.md that explains the pipeline flow, required secrets, and setup instructions. **Use EMOJIS in the README headers and sections (e.g., # 📋 Prerequisites, ## 🚀 Deployment Flow).**
    7. For 'Backend', assume a generic build (e.g., npm install/build or pip install).
    8. For 'Infrastructure', assume Terraform or native cloud CLI (like Azure Bicep or ARM if Azure is selected).
    9. If 'Generate Dockerfile' is true, create a 'Dockerfile' in the root. **Include emoji comments in the Dockerfile too.**
    10. Support specialized resources like Azure Data Factory, Synapse, or Databricks if selected, using specific tasks/CLI commands for those services (e.g., publishing ADF ARM templates).
    11. The output MUST be a JSON array of files.

    Return ONLY the raw JSON data adhering to the schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              filename: { type: Type.STRING, description: "The relative path and name of the file (e.g., .github/workflows/main.yml)" },
              content: { type: Type.STRING, description: "The full text content of the file" },
              description: { type: Type.STRING, description: "A short one-sentence description of what this file does" },
            },
            required: ["filename", "content", "description"],
          },
        },
      },
    });

    if (!response.text) {
      throw new Error("No response generated from Gemini.");
    }

    const files = JSON.parse(response.text) as GeneratedFile[];
    return files;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};

export const explainPipeline = async (files: GeneratedFile[]): Promise<string> => {
  const apiKey = getApiKey();
  const ai = new GoogleGenAI({ apiKey });

  const fileContext = files.map(f => `--- ${f.filename} ---\n${f.content}`).join('\n\n');

  const prompt = `
    Analyze the following CI/CD configuration files and provide a beginner-friendly summary.
    Explain the flow of the pipeline, what triggers it, and what safety checks are in place.
    Keep it concise (max 2 paragraphs).
    Use EMOJIS to make the explanation engaging and fun.

    Files:
    ${fileContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "Could not generate explanation.";
  } catch (error) {
    console.error("Gemini Explanation Error:", error);
    return "Error generating explanation.";
  }
};