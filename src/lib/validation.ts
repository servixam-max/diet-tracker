// Validación de formularios reutilizable
// Basado en mejores prácticas de UX y accesibilidad

import { useState, useCallback } from "react";

interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => string | null;
}

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateField(value: unknown, rules: ValidationRule): ValidationResult {
  if (rules.required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: 'Este campo es requerido' };
  }

  if (typeof value === 'number' && rules.min !== undefined && value < rules.min) {
    return { isValid: false, error: `El valor mínimo es ${rules.min}` };
  }
  if (typeof value === 'number' && rules.max !== undefined && value > rules.max) {
    return { isValid: false, error: `El valor máximo es ${rules.max}` };
  }

  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return { isValid: false, error: `Mínimo ${rules.minLength} caracteres` };
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return { isValid: false, error: `Máximo ${rules.maxLength} caracteres` };
    }
  }

  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return { isValid: false, error: 'Formato inválido' };
  }

  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true, error: null };
}

export const validators = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: unknown) => {
      if (typeof value !== 'string' || !value.includes('@')) return 'Email inválido';
      return null;
    },
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: unknown) => {
      if (typeof value !== 'string') return 'Valor inválido';
      if (value.length < 6) return 'Mínimo 6 caracteres';
      if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
        return 'Debe incluir letras y números';
      }
      return null;
    },
  },
  age: {
    required: true,
    min: 16,
    max: 100,
  },
  weight: {
    required: true,
    min: 30,
    max: 300,
  },
  height: {
    required: true,
    min: 100,
    max: 250,
  },
  calories: {
    required: true,
    min: 800,
    max: 5000,
  },
};

type FormValues = Record<string, unknown>;

export function useFormValidation(
  initialValues: FormValues,
  validationRules: Record<string, ValidationRule>
) {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateForm = (vals: FormValues) => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validationRules).forEach((field) => {
      const result = validateField(vals[field], validationRules[field]);
      if (!result.isValid) {
        newErrors[field] = result.error || '';
        isValid = false;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  };

  const handleChange = useCallback((field: string) => {
    return (value: unknown) => {
      setValues((prev: FormValues) => ({ ...prev, [field]: value }));
      if (touched[field]) {
        const result = validateField(value, validationRules[field]);
        setErrors((prev: Record<string, string>) => ({ 
          ...prev, 
          [field]: result.isValid ? '' : (result.error || '')
        }));
      }
    };
  }, [touched, validationRules]);

  const handleBlur = useCallback((field: string) => {
    return () => {
      setTouched((prev: Record<string, boolean>) => ({ ...prev, [field]: true }));
      const result = validateField(values[field], validationRules[field]);
      setErrors((prev: Record<string, string>) => ({ 
        ...prev, 
        [field]: result.isValid ? '' : (result.error || '')
      }));
    };
  }, [values, validationRules]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const validateFieldOnly = useCallback((field: string) => {
    const result = validateField(values[field], validationRules[field]);
    setErrors((prev: Record<string, string>) => ({ 
      ...prev, 
      [field]: result.isValid ? '' : (result.error || '')
    }));
    return result.isValid;
  }, [values, validationRules]);

  return { 
    values, 
    errors, 
    touched,
    handleChange,
    handleBlur,
    validateForm,
    validateFieldOnly,
    reset,
    setValues,
    setErrors,
  };
}
