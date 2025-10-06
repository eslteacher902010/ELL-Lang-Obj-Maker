# syntax=docker/dockerfile:1
FROM python:3.12-slim

WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8080

# Start the Flask app using Gunicorn (production server)
CMD ["gunicorn", "-b", "0.0.0.0:8080", "app:app"]
