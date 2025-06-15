#!/usr/bin/env python3
"""
ordiQ CLI – run an assessment from the terminal.

Example:
    export ORDIQ_PREVIEW_URL=https://ordiq-web-git-feat-wizard-step-1-<hash>.vercel.app
    python -m packages.cli --purpose "Automated CV-screening" --notes "demo" --pdf report.pdf
"""
import argparse, json, os, sys, subprocess, tempfile, textwrap
import requests

PREVIEW_URL = os.getenv("ORDIQ_PREVIEW_URL")


def call_api(payload: dict):
  if not PREVIEW_URL:
    sys.exit("❌  Set ORDIQ_PREVIEW_URL first.")
  url = f"{PREVIEW_URL}/api/run?debug=1"
  res = requests.post(url, json=payload, timeout=30)
  res.raise_for_status()
  return res.json()


def write_pdf(data: dict, outfile: str):
  html = textwrap.dedent(f"""
    <h1>Compliance Assessment</h1>
    <p><b>Matched key:</b> {data['matched_key']}</p>
    <p><b>Tier:</b> {data['tier']}</p>
    <h3>Obligations</h3>
    <ul>{"".join(f"<li>{o}</li>" for o in data['obligations'])}</ul>
    """)
  with tempfile.NamedTemporaryFile("w+", suffix=".html", delete=False) as tmp:
    tmp.write(html)
    tmp.flush()
    subprocess.run(["wkhtmltopdf", tmp.name, outfile], check=True)


def main(argv=None):
  ap = argparse.ArgumentParser()
  ap.add_argument("--purpose", required=True)
  ap.add_argument("--notes", default="")
  ap.add_argument("--pdf", help="Save a one-page PDF here (optional)")
  args = ap.parse_args(argv)

  payload = {"purpose": args.purpose, "notes": args.notes}
  result = call_api(payload)
  print(json.dumps(result, indent=2))

  if args.pdf:
    write_pdf(result, args.pdf)
    print(f"✅  PDF saved → {args.pdf}")


if __name__ == "__main__":
  main()
