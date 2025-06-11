
import tabula, pandas as pd, pathlib, subprocess, os

PDF = "docs/raw/EUAIACTconsolidated.pdf"   # corrected file path
OUT = "docs/raw/annex_iii.csv"                     # where we'll save

try:
    # Check if PDF exists
    if not os.path.exists(PDF):
        print(f"❌ PDF file not found: {PDF}")
        exit(1)
    
    print(f"📄 Reading PDF: {PDF}")
    
    # 1️⃣ read pages 120-122 into a list of DataFrames
    print("🔍 Extracting tables from pages 120-122...")
    dfs = tabula.read_pdf(
        PDF,
        pages="120-122",       # updated page numbers
        multiple_tables=True,
        lattice=True,          # better at ruled tables
    )
    
    print(f"Found {len(dfs)} raw tables")
    
    # 2️⃣ clean & concatenate (drops empty frames)
    cleaned = [df.dropna(how="all").dropna(axis=1, how="all") for df in dfs]
    non_empty = [df for df in cleaned if not df.empty]
    
    print(f"After cleaning: {len(non_empty)} non-empty tables")
    
    if not non_empty:
        print("❌ No tables found. Trying different page ranges...")
        # Try a broader range
        dfs = tabula.read_pdf(
            PDF,
            pages="115-125",  # broader range
            multiple_tables=True,
            lattice=True,
        )
        cleaned = [df.dropna(how="all").dropna(axis=1, how="all") for df in dfs]
        non_empty = [df for df in cleaned if not df.empty]
        print(f"Broader search found: {len(non_empty)} tables")
    
    if not non_empty:
        print("❌ Still no tables found. The PDF might not have extractable tables on these pages.")
        print("💡 Try checking the PDF manually to confirm table locations.")
        exit(1)
    
    # Show info about each table
    for i, df in enumerate(non_empty):
        print(f"Table {i+1}: {df.shape[0]} rows × {df.shape[1]} columns")
    
    annex = pd.concat(non_empty)
    
    # 3️⃣ save to CSV
    annex.to_csv(OUT, index=False)
    print(f"✅ Saved {OUT} with {annex.shape[0]} rows and {annex.shape[1]} columns")
    
except Exception as e:
    print(f"❌ Error: {str(e)}")
    print("💡 This might be due to:")
    print("   - PDF not having tables on the specified pages")
    print("   - Tables not being machine-readable")
    print("   - Missing Java (OpenJDK) - did you install it via Dependencies > System?")
