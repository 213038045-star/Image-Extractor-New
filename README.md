# Image to Office

A Flask website that converts a photo or scan of a document into an editable **Word (.docx)** or **Excel (.xlsx)** file.
Tables become real tables, text stays editable, and signatures, stamps and logos are placed back where they were.

## Project structure

```
image-to-office-website/
├── app.py                  # Flask app (pages, error handlers, headers)
├── image_to_office.py      # OCR + table detection + Word/Excel builder
├── routes/
│   └── image_office.py     # Home page and POST /convert API
├── templates/              # base.html, index.html, about.html, privacy.html, 404.html
├── static/
│   ├── css/site.css        # Site theme
│   └── js/converter.js     # Upload, convert, download
├── requirements.txt
├── Dockerfile              # Recommended for hosting (includes fonts)
├── Procfile                # For hosts that use gunicorn directly
└── runtime.txt             # Python version
```

## Run on your computer (Windows)

```
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Open http://127.0.0.1:5000

Use **Python 3.10 – 3.12**. The OCR package (`rapidocr-onnxruntime`) may not install on newer versions.
On the first conversion the OCR model loads, so it can take a little longer.

## Put it on GitHub

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<new-repo-name>.git
git push -u origin main
```

## Publish online (Render, using Docker)

1. On https://render.com choose **New > Web Service** and connect your GitHub repo.
2. Set **Language / Runtime** to **Docker**. Render finds the `Dockerfile` itself.
3. Set the health check path to `/healthz`.
4. Click **Deploy**. You get a public `https://...onrender.com` link.

Notes:
- OCR needs memory. Choose a plan with at least **1 GB RAM** (free 512 MB plans may run out).
- Keep **1 worker**. The converter handles one image at a time on purpose (see `routes/image_office.py`).
- Free plans sleep when idle, so the first visit after a pause is slow.

Other hosts: Railway and similar services can use the `Dockerfile` too. PythonAnywhere free accounts are usually too small for OCR.

## Things to edit before publishing

- Brand name and logo mark: `templates/base.html` (navbar and footer).
- Your contact details: `templates/about.html`.
- Colors: the `:root` variables at the top of `static/css/site.css`.
- Limits: `MAX_BYTES` in `routes/image_office.py` (default 10 MB).

## Privacy

Uploaded images are written to a temporary folder and deleted as soon as the conversion finishes.
Results are streamed to the browser and not stored.
