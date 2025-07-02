import { useState, useCallback } from 'react';

export function useForm<T extends Record<string, any>>(initial: T) {
  const [values, setValues] = useState<T>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues(v => ({ ...v, [name]: value }));
  }, []);

  const setFieldError = useCallback((field: string, error: string) => {
    setErrors(errs => ({ ...errs, [field]: error }));
  }, []);

  const resetForm = useCallback(() => {
    setValues(initial);
    setErrors({});
  }, [initial]);

  return { values, setValues, errors, setErrors, handleChange, setFieldError, resetForm };
}
