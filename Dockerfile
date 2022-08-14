FROM python:3.8.10-slim

WORKDIR /app

COPY . /app

RUN apt-get update \
    && apt-get -y install libpq-dev gcc
	
RUN pip install -r /app/requirements.txt

ENV FLASK_APP=/app/src/alabuga.py
ENV DATABASE_URL=sqlite:////app/file.db

RUN flask db init
RUN flask db migrate
RUN flask db upgrade
RUN flask seed run

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]