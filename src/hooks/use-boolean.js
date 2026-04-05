import { useCallback, useState } from "react";

// ------------------------------------------------------------

export default function useBoolean(initialValues) {
  const [value, setValue] = useState(!!initialValues);

  const onTrue = useCallback(() => {
    setValue(true);
  }, []);

  const onFalse = useCallback(() => {
    setValue(false);
  }, []);

  const onToggle = useCallback(() => {
    setValue((prev) => !prev);
  }, []);

  return { value, onTrue, onFalse, onToggle };
}
