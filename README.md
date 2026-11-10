pip install -r requirements.txt

Create and seed database 
python -m api.db.init_db

Run server
fastapi dev

Info: After database changes run this
python -m api.db.init_db

Codemirror bundle guide https://codemirror.net/examples/bundle/