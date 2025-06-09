#!/usr/bin/env bash
set -e

# 0. install pnpm
npm i -g pnpm@latest

# 1. create workspace folders
mkdir -p apps packages/cli docs/raw config/rules
echo -e 'packages:\n  - apps/*\n  - packages/*' > pnpm-workspace.yaml

# 2. Scaffold a Next.js 14 + Tailwind app
cd apps
pnpm create next-app web --ts --tailwind --eslint --app --src-dir --no-experimental-app -y
cd ..

# 3. Tiny Python CLI placeholder
mkdir -p packages/cli
echo 'print("Guardrail CLI stub")' > packages/cli/__main__.py

# 4. Download the EU AI Act PDF & Annex III CSV
curl -L 'https://eur-lex.europa.eu/resource.html?uri=cellar:e95a5317-f1fb-11ee-a9cb-01aa75ed71a1.0001.02/DOC_1&format=PDF' -o docs/raw/eu_ai_act.pdf
curl -L 'https://raw.githubusercontent.com/artificialintelligenceact/AI-Act-Datasets/main/annex_iii_risk_table.csv' -o docs/raw/annex_iii.csv

# 5. Add a starter rule-sheet
cat > config/rules/ai_act_v1.json <<'JSON'
{
  "Recruitment_CVs": {
    "purpose": "Automated CV screening",
    "tier": "High",
    "article_refs": ["Art6", "AnnexIII-2(a)"],
    "obligations": ["DataGovernance", "HumanOversight", "PostMarketMonitor", "CE_Mark"]
  }
}
JSON

# 6. First commit
git add .
git commit -m "🚀 bootstrap guardrail mvp"

echo -e "\n✅  Script finished! Run ➜ git push ◀︎ to upload to GitHub."

