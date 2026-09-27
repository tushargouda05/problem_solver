from fastapi import FastAPI
from pydantic import BaseModel
from detoxify import Detoxify

app = FastAPI()
model = Detoxify('original')

class TextInput(BaseModel): text: str

@app.post("/moderate") 
def moderate(input: TextInput):
     scores = model.predict(input.text)
     return {
        key: float(value) 
        for key, value in scores.items()
     }
        