
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
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Compliance Assessment</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 20px; }}
            h1 {{ color: #333; }}
            h3 {{ color: #666; }}
            ul {{ padding-left: 20px; }}
            li {{ margin: 5px 0; }}
        </style>
    </head>
    <body>
        <h1>Compliance Assessment</h1>
        <p><b>Matched key:</b> {data.get('matched_key', 'N/A')}</p>
        <p><b>Tier:</b> {data.get('tier', 'N/A')}</p>
        <h3>Obligations</h3>
        <ul>{"".join(f"<li>{o}</li>" for o in data.get('obligations', []))}</ul>
    </body>
    </html>
    """)
    
    with tempfile.NamedTemporaryFile("w+", suffix=".html", delete=False) as tmp:
        tmp.write(html)
        tmp.flush()
        try:
            subprocess.run(["wkhtmltopdf", tmp.name, outfile], check=True)
        except FileNotFoundError:
            print("❌  wkhtmltopdf not found. Install it or skip PDF generation.")
            return False
        except subprocess.CalledProcessError as e:
            print(f"❌  PDF generation failed: {e}")
            return False
        finally:
            os.unlink(tmp.name)
    return True


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
        if write_pdf(result, args.pdf):
            print(f"✅  PDF saved → {args.pdf}")


if __name__ == "__main__":
    main()
