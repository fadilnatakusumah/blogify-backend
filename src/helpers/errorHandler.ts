import mongoErrorHandler from "mongo-error-handler";

export const customMongoErrorHandler = (err: any) => {
  try {
    const error = (mongoErrorHandler as any)(err);
    const errors = error[0].split(" ");
    let field = errors.splice(0, 1);
    const message = errors.join(" ");
    field = field[0].substring(1, field[0].length - 1);
    field = field.split(":");
    field = field[field.length - 1].replace(/-/g, " ");
    field = field.replace(/-/g, " ");
    return field ? `${field} ${message}` : message;
  } catch (error) {
    console.log(error);
    return "";
  }
}