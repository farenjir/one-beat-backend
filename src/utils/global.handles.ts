// remove falsy values from object
export const compactObject = (arrayObject: object) => {
  const data = Array.isArray(arrayObject) ? arrayObject.filter(Boolean) : arrayObject;
  // return
  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      const newValue = typeof value === "object" ? compactObject(value) : value;
      return Boolean(newValue) ? {...acc, [key]: newValue} : acc;
    },
    Array.isArray(arrayObject) ? [] : {} // default
  );
};