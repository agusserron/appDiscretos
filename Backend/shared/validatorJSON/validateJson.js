import Ajv from "ajv"

const ajv = new Ajv();

const validateJson = (jsonData, schema) => {
  const validate = ajv.compile(schema);
  const isValid = validate(jsonData);
  return isValid;
}

export default {
    validateJson
}