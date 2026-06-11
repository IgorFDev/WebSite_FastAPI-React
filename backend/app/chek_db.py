import asyncio
from sqlalchemy import text
from db.session import engine

async def check_db():
    async with engine.connect() as connection:
        print("Подключение успешно!\n")

        result = await connection.execute(text("""
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE table_type = 'BASE TABLE'
            ORDER BY table_schema, table_name;
        """))

        print("Таблицы в БД:\n")

        for row in result:
            print(row)

if __name__ == "__main__":
    asyncio.run(check_db())