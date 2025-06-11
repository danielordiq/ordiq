
import tabula, pandas as pd, pathlib, subprocess, os

PDF = "docs/raw/scripts/EUAIACTconsolidated.pdf"   # corrected file path
OUT = "docs/raw/annex_iii.csv"                     # where we'll save

# 1️⃣ read pages 120-122 into a list of DataFrames
dfs = tabula.read_pdf(
    PDF,
    pages="120-122",       # updated page numbers
    multiple_tables=True,
    lattice=True,          # better at ruled tables
)

# 2️⃣ clean & concatenate (drops empty frames)
cleaned = [df.dropna(how="all").dropna(axis=1, how="all") for df in dfs]
annex = pd.concat([df for df in cleaned if not df.empty])

# 3️⃣ save to CSV
annex.to_csv(OUT, index=False)
print(f"✅  Saved {OUT} with", annex.shape[0], "rows and", annex.shape[1], "columns")
