#!/usr/bin/env python3
"""
ordiQ CLI – run an assessment from the terminal.

Example
-------
export ORDIQ_PREVIEW_URL=https://ordiq-web-git-feat-wizard-step-1-daniels-projects-648b0049.vercel.app
python -m packages.cli \
       --purpose "Automated CV-screening" \
       --notes   "demo run" \
       --pdf     report.pdf
"""
from __future__ import annotations

import argparse, json, os, shutil, subprocess, sys, tempfile, textwrap
from pathlib import Path
from typing import Any

import requests
try:
    from reportlab.lib.pagesizes import A4
    from reportlab.pdfgen import canvas
except ImportError:
    canvas = None  # fallback will skip ReportLab if not installed

# --------------------------------------------------------------------------- #
# 0 ▸ Config
# --------------------------------------------------------------------------- #
PREVIEW_URL = os.getenv("ORDIQ_PREVIEW_URL")

# --------------------------------------------------------------------------- #
# 1 ▸ Helpers
# --------------------------------------------------------------------------- #
def call_api(payload: dict[str, Any]) -> dict[str, Any]:
    if not PREVIEW_URL:
        sys.exit("❌  Set ORDIQ_PREVIEW_URL first (export ORDIQ_PREVIEW_URL=...)")
    url = f"{PREVIEW_URL.rstrip('/')}/api/run?debug=1"
    res = requests.post(url, json=payload, timeout=30)
    res.raise_for_status()
    return res.json()


def locate_wkhtmltopdf() -> str | None:
    """Return an absolute path to wkhtmltopdf, or None if it cannot be found."""
    # on $PATH?
    if (p := shutil.which("wkhtmltopdf")):
        return p

    # inside the pip wheel wkhtmltopdf==0.2 (ships static binary)
    try:
        import importlib.util
        spec = importlib.util.find_spec("wkhtmltopdf")
        if spec and spec.submodule_search_locations:
            wheel_bin = Path(spec.submodule_search_locations[0]) / "wkhtmltopdf"
            if wheel_bin.exists():
                return str(wheel_bin)
    except ModuleNotFoundError:
        pass

    # common system locations (Nix / Ubuntu)
    for cand in ("/usr/bin/wkhtmltopdf",
                 "/run/current-system/sw/bin/wkhtmltopdf"):
        if Path(cand).is_file():
            return cand
    return None


# -- two PDF back-ends ------------------------------------------------------- #
def pdf_via_wkhtml(html: str, outfile: str, wk: str) -> bool:
    with tempfile.NamedTemporaryFile("w+", suffix=".html", delete=False) as tmp:
        tmp.write(html)
        tmp.flush()
        try:
            subprocess.run([wk, "--quiet", tmp.name, outfile], check=True)
            print(f"✅  PDF saved → {outfile}")
            return True
        except subprocess.CalledProcessError as exc:
            print(f"❌  wkhtmltopdf failed (exit {exc.returncode}) – PDF skipped.")
            return False
        finally:
            Path(tmp.name).unlink(missing_ok=True)


def pdf_via_reportlab(data: dict[str, Any], outfile: str) -> bool:
    if canvas is None:
        print("❌  reportlab not available – PDF skipped.")
        return False

    c = canvas.Canvas(outfile, pagesize=A4)
    w, h = A4
    y = h - 50
    c.setFont("Helvetica-Bold", 16)
    c.drawString(40, y, "Compliance Assessment")
    y -= 40

    c.setFont("Helvetica", 11)
    c.drawString(40, y, f"Matched key: {data.get('matched_key', 'N/A')}")
    y -= 20
    c.drawString(40, y, f"Tier: {data.get('tier', 'N/A')}")
    y -= 30

    c.setFont("Helvetica-Bold", 12)
    c.drawString(40, y, "Obligations:")
    y -= 18
    c.setFont("Helvetica", 11)
    for o in data.get("obligations", []):
        c.drawString(60, y, f"• {o}")
        y -= 15
        if y < 60:
            c.showPage()
            y = h - 50
    c.save()
    print(f"✅  PDF saved → {outfile}")
    return True


def write_pdf(data: dict[str, Any], outfile: str) -> None:
    html = textwrap.dedent(f"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>Compliance Assessment</title>
          <style>
            body {{ font-family: Arial, sans-serif; margin: 2rem; }}
            h1  {{ margin-top: 0; }}
            h3  {{ margin-bottom: .2rem; color: #444; }}
            ul  {{ margin-top: .2rem; }}
          </style>
        </head>
        <body>
          <h1>Compliance Assessment</h1>
          <p><b>Matched key:</b> {data.get("matched_key", "N/A")}</p>
          <p><b>Tier:</b> {data.get("tier", "N/A")}</p>

          <h3>Obligations</h3>
          <ul>
            {"".join(f"<li>{o}</li>" for o in data.get("obligations", []))}
          </ul>
        </body>
        </html>
    """).strip()

    if (wk := locate_wkhtmltopdf()) and pdf_via_wkhtml(html, outfile, wk):
        return
    pdf_via_reportlab(data, outfile)


# --------------------------------------------------------------------------- #
# 2 ▸ CLI
# --------------------------------------------------------------------------- #
def main(argv: list[str] | None = None) -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--purpose", required=True)
    ap.add_argument("--notes"  , default="")
    ap.add_argument("--pdf"    , help="Write PDF report here (optional)")
    args = ap.parse_args(argv)

    payload = {"purpose": args.purpose, "notes": args.notes}
    result  = call_api(payload)

    print(json.dumps(result, indent=2, ensure_ascii=False))

    if args.pdf:
        write_pdf(result, args.pdf)


if __name__ == "__main__":
    main()
