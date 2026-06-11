import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { decrypt } from "@/lib/encryption";
import dns from "dns";
import https from "https";
import http from "http";

// Prefer IPv4 resolution over IPv6 to prevent network timeouts/hangs on node fetch
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (e) {
  console.warn("Could not set DNS resolution order:", e);
}

export const maxDuration = 300; // Allow up to 5 minutes (300s) execution lifetime

const SEVERITY_COSTS: Record<string, number> = {
  critical: 1.5,
  high: 1.0,
  medium: 0.75,
  low: 0.5,
  info: 0.0,
};

// --- Custom drop-in fetch wrapper to prevent UND_ERR_HEADERS_TIMEOUT ---
const fetchNoTimeout = (
  url: string,
  options: { method?: string; headers?: Record<string, string>; body?: string } = {}
): Promise<{ ok: boolean; status: number; text: () => Promise<string>; json: () => Promise<any> }> => {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === "https:";
    const client = isHttps ? https : http;

    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (isHttps ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || "GET",
      headers: options.headers || {},
      timeout: 600000, // 10 minutes socket timeout (increased from 5m)
    };

    const req = client.request(requestOptions, (res) => {
      let rawData = "";
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        resolve({
          ok: (res.statusCode || 0) >= 200 && (res.statusCode || 0) < 300,
          status: res.statusCode || 0,
          text: async () => rawData,
          json: async () => JSON.parse(rawData),
        });
      });
    });

    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Request timed out (10 minutes limit reached)"));
    });

    req.on("error", (err) => {
      reject(err);
    });

    if (options.body) {
      req.write(options.body);
    }
    req.end();
  });
};

type AIProvider = {
  name: string;
  key: string | undefined;
  call: (systemPrompt: string, userPrompt: string, apiKey: string) => Promise<string>;
};

const isKeyValid = (key: string | undefined): key is string =>
  !!key && key.trim().length > 10 && !key.includes("your-");

const providers: AIProvider[] = [
  {
    name: "Anthropic (Claude)",
    key: process.env.ANTHROPIC_API_KEY,
    call: async (system, user, apiKey) => {
      const res = await fetchNoTimeout("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-opus-4-6",
          max_tokens: 4000,
          system,
          messages: [{ role: "user", content: user }],
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Anthropic API failed (${res.status}): ${errText}`);
      }
      const data = await res.json();
      return data.content[0].text;
    },
  },
  {
    name: "OpenAI (Codex)",
    key: process.env.OPENAI_API_KEY,
    call: async (system, user, apiKey) => {
      const res = await fetchNoTimeout("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "codex",
          max_tokens: 4000,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
        }),
      });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`OpenAI API failed (${res.status}): ${errText}`);
      }
      const data = await res.json();
      return data.choices[0].message.content;
    },
  },
  {
    name: "Google Gemini",
    key: process.env.GEMINI_API_KEY,
    call: async (system, user, apiKey) => {
      const res = await fetchNoTimeout(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: system }] },
            contents: [{ parts: [{ text: user }] }],
            generationConfig: { maxOutputTokens: 4000 },
          }),
        }
      );
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Gemini API failed (${res.status}): ${errText}`);
      }
      const data = await res.json();
      return data.candidates[0].content.parts[0].text;
    },
  },
];

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { issue, websiteId } = body;

    if (!issue || !issue.title || !websiteId) {
      return Response.json({ error: "Invalid request payload. Missing issue or websiteId." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const website = await prisma.website.findFirst({
      where: { id: websiteId, userId: session.user.id },
    });

    if (!website) {
      return Response.json({ error: "Website not found" }, { status: 404 });
    }

    if (!website.githubPat || !website.githubRepo) {
      return Response.json(
        { error: "GitHub integration not configured for this website. Please link your repository in settings." },
        { status: 400 }
      );
    }

    const cost = SEVERITY_COSTS[issue.severity] ?? 0.5;
    if (user.coins < cost) {
      return Response.json(
        { error: `Insufficient coins. Fixing this issue costs ${cost} coins. Balance: ${user.coins} coins.` },
        { status: 400 }
      );
    }

    let siteHost = website.url;
    try {
      siteHost = new URL(website.url).hostname;
    } catch (e) { fontStyle: "italic" }

    // 1. Immediately deduct coins and create pending fix record in transaction
    const [updatedUser, pendingFix] = await prisma.$transaction([
      prisma.user.update({
        where: { id: session.user.id },
        data: {
          coins: {
            decrement: cost,
          },
        },
      }),
      prisma.aiFix.create({
        data: {
          userId: session.user.id,
          websiteId: website.id,
          issueId: issue.id,
          issueTitle: issue.title,
          filePath: "Analyzing repository...",
          status: "pending",
        },
      }),
      prisma.coinTransaction.create({
        data: {
          userId: session.user.id,
          amount: -cost,
          description: `AI Fix: ${issue.title} (In Progress) on ${siteHost}`,
        },
      }),
    ]);

    // 2. Trigger the fix logic in the background without awaiting it
    runFixInBackground(pendingFix.id, website, issue, session.user.id, cost).catch((err) => {
      console.error("[AI Fix Background Trigger] Unhandled background failure:", err);
    });

    // 3. Immediately return the pending fix back to client
    return Response.json({
      success: true,
      fix: pendingFix,
      cost,
    });
  } catch (error) {
    console.error("Error initiating issue fix:", error);
    return Response.json(
      { error: error instanceof Error ? error.message : "Fix execution failed to start" },
      { status: 500 }
    );
  }
}

async function runFixInBackground(
  fixId: string,
  website: any,
  issue: any,
  userId: string,
  cost: number
) {
  let bestFilePath = "Analyzing repository...";
  try {
    const decryptedPat = website.githubPat ? decrypt(website.githubPat) : "";
    const githubHeaders = {
      Authorization: `token ${decryptedPat}`,
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "SEOBoostr-Bot",
    };

    const repoUrl = `https://api.github.com/repos/${website.githubRepo}`;

    // 1. Get repository info to find default branch name
    const repoRes = await fetch(repoUrl, { headers: githubHeaders });
    if (!repoRes.ok) {
      const errText = await repoRes.text();
      throw new Error(`GitHub API connection failed: ${errText}`);
    }
    const repoInfo = await repoRes.json();
    const defaultBranch = repoInfo.default_branch || "main";

    // 2. Fetch the recursive git tree of the repository to discover paths
    const treeRes = await fetch(
      `${repoUrl}/git/trees/${defaultBranch}?recursive=1`,
      { headers: githubHeaders }
    );
    if (!treeRes.ok) {
      throw new Error("Failed to fetch repository file tree.");
    }
    const treeInfo = await treeRes.json();
    const tree = treeInfo.tree || [];

    // Filter file paths to find code candidates
    const codeFiles = tree.filter((item: any) => {
      if (item.type !== "blob") return false;
      const path = item.path.toLowerCase();
      if (
        path.includes("node_modules/") ||
        path.includes(".next/") ||
        path.includes(".git/") ||
        path.includes("/api/") ||
        path.startsWith("api/") ||
        path.includes("route.ts") ||
        path.includes("route.js") ||
        path.includes("middleware.ts") ||
        path.includes("middleware.js") ||
        path.includes("actions.ts") ||
        path.includes("actions.js") ||
        path.includes("proxy.ts") ||
        path.includes("proxy.js") ||
        path.endsWith("config.js") ||
        path.endsWith("config.ts") ||
        path.endsWith("config.mjs") ||
        path.endsWith("tsconfig.json") ||
        path.endsWith("package.json") ||
        path.endsWith("package-lock.json") ||
        path.endsWith("yarn.lock") ||
        path.endsWith("pnpm-lock.yaml")
      ) {
        return false;
      }
      return /\.(tsx|ts|jsx|js|html|css|txt|xml)$/i.test(item.path);
    });

    // 3. Find the most probable file by fetching file contents and matching context
    let bestFileContent = "";
    let bestFileSha = "";

    const sortedFiles = codeFiles.sort((a: any, b: any) => {
      const aPath = a.path.toLowerCase();
      const bPath = b.path.toLowerCase();
      const aVal = aPath.includes("page") || aPath.includes("index") ? 2 : 0;
      const bVal = bPath.includes("page") || bPath.includes("index") ? 2 : 0;
      return bVal - aVal;
    });

    const candidateFiles = sortedFiles.slice(0, 8);

    for (const f of candidateFiles) {
      const fileRes = await fetch(`${repoUrl}/contents/${f.path}`, {
        headers: githubHeaders,
      });
      if (fileRes.ok) {
        const fileInfo = await fileRes.json();
        const content = Buffer.from(fileInfo.content, "base64").toString("utf-8");

        const hasElementMatch = issue.element && content.includes(issue.element);
        const hasValueMatch = issue.value && content.includes(issue.value);

        if (hasElementMatch || hasValueMatch) {
          bestFilePath = f.path;
          bestFileContent = content;
          bestFileSha = fileInfo.sha;
          break;
        }

        if (!bestFilePath && (f.path.includes("page.tsx") || f.path.includes("index.html"))) {
          bestFilePath = f.path;
          bestFileContent = content;
          bestFileSha = fileInfo.sha;
        }
      }
    }

    if (!bestFilePath && candidateFiles.length > 0) {
      const first = candidateFiles[0];
      const fileRes = await fetch(`${repoUrl}/contents/${first.path}`, {
        headers: githubHeaders,
      });
      if (fileRes.ok) {
        const fileInfo = await fileRes.json();
        bestFilePath = first.path;
        bestFileContent = Buffer.from(fileInfo.content, "base64").toString("utf-8");
        bestFileSha = fileInfo.sha;
      }
    }

    if (!bestFilePath) {
      throw new Error("Could not find any suitable code file to modify.");
    }

    // Update filePath in database to let user know which file was matched
    await prisma.aiFix.update({
      where: { id: fixId },
      data: {
        filePath: bestFilePath,
      },
    });

    // 4. Query AI to generate the fix
    const aiSystemPrompt = `You are a world-class Senior SEO Specialist and Frontend Engineer. Your task is to analyze the source code of a web page and implement precise code changes to resolve a specific SEO issue.

CRITICAL IMPLEMENTATION GUIDELINES:
1. **Maintain File Integrity**: Preserve all existing logic, imports, comments, state variables, styling, and unrelated code. Only change what is strictly necessary to resolve the SEO issue.
2. **Framework Best Practices**: If working on a React/Next.js TypeScript file (.tsx), follow clean React patterns:
   - Ensure tags are closed and properly structured.
   - Respect React-specific attributes (e.g., use 'className' instead of 'class', 'htmlFor' instead of 'for').
   - Keep TypeScript types intact.
   - For images, verify semantic HTML attributes or Next.js Image component parameters (like alt tags, width, height, loading priorities).
3. **SEO Corrections**:
   - Provide highly optimized tags (e.g. meta descriptions, headings, title tag formatting).
   - Resolve accessibility and indexation guidelines correctly as specified in recommendations.
4. **Output Format**:
   You MUST respond with a single, valid JSON object containing exactly four keys:
   {
     "filePath": "string (the relative file path that was modified, matching the input path)",
     "fixedContent": "string (the entire new contents of the file, containing all changes applied cleanly)",
     "commitMessage": "string (a concise, descriptive git commit message, e.g. 'seo: add missing alt attribute to main logo')",
     "explanation": "string (a clear, brief explanation of the changes made and the SEO reasoning behind them)"
   }
   
   Ensure the JSON object is formatted correctly and returned within a single markdown code block labeled with \`json\`.
   Do NOT add any leading or trailing conversational text, explanations, or notes outside of the JSON block.`;

    const aiUserPrompt = `We need to resolve the following SEO issue in our project repository.

SEO Issue Context:
- **Issue Title**: ${issue.title}
- **Issue Description**: ${issue.description}
- **Target Recommendation**: ${issue.recommendation}
- **Affected HTML Element / Context**: ${issue.element || "N/A"}
- **Detected Value / Problematic Value**: ${issue.value || "N/A"}

File Selected for Fix: "${bestFilePath}"
Current File Content:
\`\`\`
${bestFileContent}
\`\`\``;

    let responseText = "";
    let usedProvider = "";
    const errors: string[] = [];

    for (const provider of providers) {
      if (!isKeyValid(provider.key)) {
        errors.push(`${provider.name}: API key not configured`);
        continue;
      }
      try {
        console.log(`[AI Fix Background] Attempting ${provider.name}...`);
        responseText = await provider.call(aiSystemPrompt, aiUserPrompt, provider.key);
        usedProvider = provider.name;
        console.log(`[AI Fix Background] Success with ${provider.name}`);
        break;
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${provider.name}: ${msg}`);
        console.error(`[AI Fix Background] ${provider.name} failed:`, err);
      }
    }

    if (!responseText) {
      throw new Error(`All AI providers failed. Details:\n${errors.join("\n")}`);
    }

    const jsonMatch = responseText.match(/```json\s*([\s\S]*?)\s*```/) || responseText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error(`AI response format was invalid (${usedProvider}).`);
    }

    const parsedFix = JSON.parse(jsonMatch[1] || jsonMatch[0]);
    const { filePath, fixedContent, commitMessage, explanation } = parsedFix;

    // Apply the fix on GitHub
    const branchRefRes = await fetch(
      `${repoUrl}/git/ref/heads/${defaultBranch}`,
      { headers: githubHeaders }
    );
    if (!branchRefRes.ok) {
      throw new Error("Failed to locate repository branch refs.");
    }
    const branchRef = await branchRefRes.json();
    const latestSha = branchRef.object.sha;

    const newBranchName = `seoboostr-fix-${issue.id}-${Date.now()}`;
    const createBranchRes = await fetch(`${repoUrl}/git/refs`, {
      method: "POST",
      headers: githubHeaders,
      body: JSON.stringify({
        ref: `refs/heads/${newBranchName}`,
        sha: latestSha,
      }),
    });
    if (!createBranchRes.ok) {
      throw new Error("Failed to create a branch on GitHub.");
    }

    let targetSha = bestFileSha;
    if (filePath !== bestFilePath) {
      const targetFileRes = await fetch(
        `${repoUrl}/contents/${filePath}?ref=${newBranchName}`,
        { headers: githubHeaders }
      );
      if (targetFileRes.ok) {
        const targetFileInfo = await targetFileRes.json();
        targetSha = targetFileInfo.sha;
      } else {
        targetSha = "";
      }
      bestFilePath = filePath;
    }

    const commitRes = await fetch(`${repoUrl}/contents/${bestFilePath}`, {
      method: "PUT",
      headers: githubHeaders,
      body: JSON.stringify({
        message: commitMessage || `Fix SEO issue: ${issue.title}`,
        content: Buffer.from(fixedContent).toString("base64"),
        sha: targetSha || undefined,
        branch: newBranchName,
      }),
    });
    if (!commitRes.ok) {
      throw new Error("Failed to commit changes to branch on GitHub.");
    }

    const prRes = await fetch(`${repoUrl}/pulls`, {
      method: "POST",
      headers: githubHeaders,
      body: JSON.stringify({
        title: `SEO Fix: ${issue.title}`,
        head: newBranchName,
        base: defaultBranch,
        body: `### 🚀 SEOBoostr Automated AI Fix

This pull request addresses the following SEO issue:
- **Title**: ${issue.title}
- **Description**: ${issue.description}
- **Recommendation**: ${issue.recommendation}

#### 🛠️ AI Explanation
${explanation || "No explanation provided."}

---
*Created automatically by SEOBoostr*`,
      }),
    });
    if (!prRes.ok) {
      throw new Error("Failed to create Pull Request on GitHub.");
    }
    const prInfo = await prRes.json();

    // 5. Update database record to completed
    await prisma.aiFix.update({
      where: { id: fixId },
      data: {
        status: "completed",
        prUrl: prInfo.html_url,
        prNumber: prInfo.number,
        commitMessage: commitMessage || `Fix SEO issue: ${issue.title}`,
        explanation: explanation || "Successfully created PR",
        filePath: bestFilePath,
      },
    });

    console.log(`[AI Fix Background] Successfully completed fix: ${fixId}`);
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error);
    console.error(`[AI Fix Background] Fix process failed for ${fixId}:`, error);

    // Refund coins and update status to failed
    try {
      let siteHost = website.url;
      try {
        siteHost = new URL(website.url).hostname;
      } catch (e) {}

      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: {
            coins: {
              increment: cost,
            },
          },
        }),
        prisma.aiFix.update({
          where: { id: fixId },
          data: {
            status: "failed",
            explanation: `Failed: ${errMsg}`,
            filePath: bestFilePath,
          },
        }),
        prisma.coinTransaction.create({
          data: {
            userId: userId,
            amount: cost,
            description: `Refund: AI Fix failed for ${issue.title} on ${siteHost}`,
          },
        }),
      ]);
      console.log(`[AI Fix Background] Successfully processed refund for failed fix: ${fixId}`);
    } catch (dbErr) {
      console.error("[AI Fix Background] Critical error saving failure status / refund transaction:", dbErr);
    }
  }
}
