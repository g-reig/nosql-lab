
FROM python:3.13

WORKDIR /code

RUN pip install poetry

COPY ./pyproject.toml /code/pyproject.toml

RUN poetry install --no-root

COPY ./src /code/src

CMD ["poetry", "run", "fastapi", "run", "src/main.py"]