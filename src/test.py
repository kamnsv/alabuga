from app import create_app, db
from app.models import *

app = create_app()
app.app_context().push()

