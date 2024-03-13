export type OperationOptions<TDocument> = {
  fields: (keyof TDocument)[];
  fieldValue: string | number;
};
