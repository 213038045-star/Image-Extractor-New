"""
Image to Office - Flask website.

Run locally :  python app.py          ->  http://127.0.0.1:5000
Production  :  gunicorn app:app       (see Procfile / Dockerfile)
"""
import os
from datetime import datetime

from flask import Flask, jsonify, render_template, request

from routes.image_office import image_office_bp, MAX_BYTES

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = MAX_BYTES + 1024 * 1024   # image limit + form overhead

app.register_blueprint(image_office_bp)


@app.context_processor
def inject_globals():
    return {"year": datetime.now().year}


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/privacy")
def privacy():
    return render_template("privacy.html")


@app.route("/healthz")
def healthz():
    return "ok", 200


@app.errorhandler(404)
def not_found(_e):
    return render_template("404.html"), 404


@app.errorhandler(413)
def too_large(_e):
    return jsonify(error="File too large (max 10 MB)."), 413


@app.after_request
def security_headers(resp):
    resp.headers.setdefault("X-Content-Type-Options", "nosniff")
    resp.headers.setdefault("X-Frame-Options", "SAMEORIGIN")
    resp.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    return resp


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
