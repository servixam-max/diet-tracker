// Validación de formularios reutilizable
// Basado en mejores prácticas de UX y accesibilidad

interface ValidationRule {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

interface ValidationResult {
  isValid: boolean;
  error: string | null;
}

export function validateField(value: any, rules: ValidationRule): ValidationResult {
  // Required check
  if (rules.required && (value === null || value === undefined || value === '')) {
    return { isValid: false, error: 'Este campo es requerido' };
  }

  // Number range validation
  if (typeof value === 'number' && rules.min !== undefined && value < rules.min) {
    return { isValid: false, error: `El valor mínimo es ${rules.min}` };
  }
  if (typeof value === 'number' && rules.max !== undefined && value > rules.max) {
    return { isValid: false, error: `El valor máximo es ${rules.max}` };
  }

  // String length validation
  if (typeof value === 'string') {
    if (rules.minLength && value.length < rules.minLength) {
      return { isValid: false, error: `Mínimo ${rules.minLength} caracteres` };
    }
    if (rules.maxLength && value.length > rules.maxLength) {
      return { isValid: false, error: `Máximo ${rules.maxLength} caracteres` };
    }
  }

  // Pattern validation
  if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
    return { isValid: false, error: 'Formato inválido' };
  }

  // Custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return { isValid: false, error: customError };
    }
  }

  return { isValid: true, error: null };
}

// Validaciones predefinidas comunes
export const validators = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (!value.includes('@')) return 'Email inválido';
      return null;
    },
  },
  password: {
    required: true,
    minLength: 6,
    custom: (value: string) => {
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

// Hook para validación de formularios
export function useFormValidation(initialValues: Record<string, any>, validators: Record<string, ValidationRule>) {
  const validateForm = (values: Record<string, any>) => {
    const errors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validators).forEach((field) => {
      const result = validateField(values[field], validators[field]);
      if (!result.isValid) {
        errors[field] = result.error || '';
        isValid = false;
      }
    });

    return { isValid, errors };
  };

  return { validateForm };
}
