from api.db.session import engine
from api.models import Base
from api.db.seed import seed_database
from sqlalchemy import inspect


Base.metadata.create_all(engine)
seed_database()

print("Database created.")
print(inspect(engine).get_table_names())

