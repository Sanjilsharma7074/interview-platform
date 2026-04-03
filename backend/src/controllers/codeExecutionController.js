import { ENV } from "../lib/env.js";

const DEFAULT_PISTON_API = "https://emkc.org/api/v2/piston";
const PISTON_API = ENV.PISTON_API_URL || DEFAULT_PISTON_API;

const LANGUAGE_VERSIONS = {
  javascript: { language: "javascript", version: "18.15.0" },
  python: { language: "python", version: "3.12.0" },
  java: { language: "java", version: "15.0.2" },
};

function getFileExtension(language) {
  const extensions = {
    javascript: "js",
    python: "py",
    java: "java",
  };

  return extensions[language] || "txt";
}

function getProviderErrorMessage(status, responseText) {
  const normalizedText = responseText.toLowerCase();

  if (normalizedText.includes("whitelist")) {
    return {
      error: "Code execution is currently unavailable.",
      details:
        "The public Piston API now requires allowlist access. Configure PISTON_API_URL to point to your own Piston server or another compatible execution service.",
    };
  }

  return {
    error: `Execution provider error: ${status}`,
    details: responseText || "The code execution provider returned an unexpected error.",
  };
}

export async function executeCode(req, res) {
  try {
    const { language, code } = req.body;
    const languageConfig = LANGUAGE_VERSIONS[language];

    if (!languageConfig) {
      return res.status(400).json({
        success: false,
        error: `Unsupported language: ${language}`,
      });
    }

    const response = await fetch(`${PISTON_API}/execute`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        language: languageConfig.language,
        version: languageConfig.version,
        files: [
          {
            name: `main.${getFileExtension(language)}`,
            content: code,
          },
        ],
      }),
    });

    if (!response.ok) {
      const responseText = await response.text();
      const providerError = getProviderErrorMessage(response.status, responseText);

      return res.status(response.status).json({
        success: false,
        ...providerError,
      });
    }

    const data = await response.json();
    const output = data.run.output || "";
    const stderr = data.run.stderr || "";

    if (stderr) {
      return res.status(200).json({
        success: false,
        output,
        error: stderr,
      });
    }

    return res.status(200).json({
      success: true,
      output: output || "No output",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Failed to execute code: ${error.message}`,
    });
  }
}
