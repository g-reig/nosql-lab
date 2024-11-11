from bson import ObjectId

class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, field=None):
        if not ObjectId.is_valid(v):
            raise ValueError('Invalid ObjectId')
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, schema, model_field) -> dict:
        """
        Generates a custom json schema for ObjectId,
        telling Pydantic that the type is string with UUID format.
        """
        return {"type": "string", "format": "uuid"}