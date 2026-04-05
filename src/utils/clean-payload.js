export const cleanPayload = (obj) =>
  Object.fromEntries(
    Object.entries(obj).filter(
      // eslint-disable-next-line no-unused-vars
      ([_, value]) => value !== "" && value !== null && value !== undefined
    )
  );
