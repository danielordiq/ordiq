# scripts/parse_embed_act.py  (chunked)
import pdfplumber, os, re, time, openai, supabase, textwrap

PDF_PATH    = "docs/raw/EUAIACTconsolidated.pdf"
EMBED_MODEL = "text-embedding-3-small"
CHUNK_SIZE  = 1000              # characters per chunk
BATCH_SIZE  = 50

client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
sb     = supabase.create_client(os.environ["SUPABASE_URL"],
                                os.environ["SUPABASE_ANON_KEY"])

# 1) Extract raw text
with pdfplumber.open(PDF_PATH) as pdf:
    raw = "\n".join(p.extract_text() or "" for p in pdf.pages)

# 2) Clean whitespace & chunk
raw = re.sub(r"\s+", " ", raw).strip()
chunks = textwrap.wrap(raw, CHUNK_SIZE)

print("📄 chunks:", len(chunks))

# 3) Embed & store
batch = []
for i, text in enumerate(chunks, 1):
    emb = client.embeddings.create(model=EMBED_MODEL, input=text).data[0].embedding
    batch.append({"text": text, "embedding": emb})

    if i % BATCH_SIZE == 0 or i == len(chunks):
        sb.table("eu_act_chunks").insert(batch).execute()
        print(f"📥  inserted {i}/{len(chunks)}")
        batch = []
        time.sleep(0.8)

print("✅ finished")
