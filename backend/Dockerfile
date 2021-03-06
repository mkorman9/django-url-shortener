FROM python:3.6-alpine

ARG BUILD_KEY

ENV APP_USER "app"
ENV APP_PATH "/app"

EXPOSE 8080

# setup app directory
RUN mkdir -p $APP_PATH
WORKDIR $APP_PATH

ADD sdk $APP_PATH/sdk
ADD backend $APP_PATH/backend

# create python environment, create user and change directory ownership
RUN python -m venv .venv && \
    .venv/bin/pip install ./sdk && \
    .venv/bin/pip install ./backend && \
    apk add --update build-base linux-headers pcre-dev && \
    .venv/bin/pip install uwsgi==2.0.15 && \
    apk del build-base linux-headers && rm -rf /var/cache/apk/* && \
    addgroup -S $APP_USER && adduser -S -G $APP_USER $APP_USER && \
    chown -R $APP_USER:$APP_USER $APP_PATH

# switch to user mode, configure Django and spawn uwsgi master process
USER $APP_USER

RUN sed -i -e  "s|DEBUG.*=.*True|DEBUG = False|g" backend/backend/settings.py && \
    sed -i -e  "s|SECRET_KEY.*=.*|SECRET_KEY = \"$BUILD_KEY\"|g" backend/backend/settings.py

CMD exec .venv/bin/uwsgi \
    --http 0.0.0.0:8080 \
    --master \
    --processes 4 \
    --threads 2 \
    --chdir ./backend \
    --wsgi-file backend/wsgi.py
