FROM python:3.11-slim

# Fonts (used when rebuilding text) + libs needed by OpenCV / ONNX runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
        fonts-liberation fonts-dejavu-core libglib2.0-0 libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

ENV PORT=8000 PYTHONUNBUFFERED=1
EXPOSE 8000

# One worker: the converter allows one OCR job at a time (see routes/image_office.py)
CMD gunicorn app:app --workers 1 --threads 4 --timeout 180 --bind 0.0.0.0:${PORT}
