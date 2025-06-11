import pdfplumber, pandas as pd, re, pathlib

PDF  = "docs/raw/EUAIACTconsolidated.pdf"  # your uploaded file
CSV  = "docs/raw/annex_iii.csv"            # output path
PAGES = [127, 128, 129]                    # 1-based page numbers in your PDF

# --- helper to clean bullet headings ---------------------------------------
def clean(text: str) -> str:
    # remove line-breaks and excessive spaces
    return re.sub(r"\s+", " ", text).strip()

rows = []
with pdfplumber.open(PDF) as pdf:
    for pno in PAGES:
        page_text = pdf.pages[pno-1].extract_text()
        # split by numbers "1.", "2." at start of line
        bullets = re.split(r"\n\s*(\d+\.)", page_text)
        # bullets list looks like ["", "1.", " Biometrics ...", "2.", " Critical infrastructure ..." ...]
        for i in range(1, len(bullets), 2):
            num  = bullets[i].strip(".")          # e.g., "1"
            body = clean(bullets[i+1])
            if body:
                rows.append({"id": num, "system_type": body, "tier": "High"})

# Pandas → CSV
df = pd.DataFrame(rows)
df.to_csv(CSV, index=False)
print(f"✅  Saved {CSV} with {len(df)} rows")
