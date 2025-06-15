
#!/usr/bin/env python3
"""Test script to verify PDF extraction works"""

import os
from scripts.extract_annex_iii_text import *

def test_extraction():
    print("🧪 Testing PDF extraction...")
    
    # Check if PDF exists
    if not os.path.exists(PDF):
        print(f"❌ PDF not found at {PDF}")
        return False
    
    print(f"✅ PDF found at {PDF}")
    
    try:
        # Run the extraction
        exec(open("scripts/extract_annex_iii_text.py").read())
        print("✅ Extraction completed successfully")
        return True
    except Exception as e:
        print(f"❌ Extraction failed: {e}")
        return False

if __name__ == "__main__":
    test_extraction()
