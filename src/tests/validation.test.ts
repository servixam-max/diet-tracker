import { describe, it, expect } from 'vitest';
import { validateField, validators } from '@/lib/validation';

describe('validateField', () => {
  describe('required validation', () => {
    it('should pass when required field has value', () => {
      const result = validateField('test', { required: true });
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should fail when required field is empty', () => {
      const result = validateField('', { required: true });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Este campo es requerido');
    });

    it('should fail when required field is null', () => {
      const result = validateField(null, { required: true });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Este campo es requerido');
    });

    it('should fail when required field is undefined', () => {
      const result = validateField(undefined, { required: true });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Este campo es requerido');
    });
  });

  describe('number range validation', () => {
    it('should pass when number is within range', () => {
      const result = validateField(50, { min: 0, max: 100 });
      expect(result.isValid).toBe(true);
    });

    it('should fail when number is below min', () => {
      const result = validateField(-10, { min: 0 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El valor mínimo es 0');
    });

    it('should fail when number is above max', () => {
      const result = validateField(150, { max: 100 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El valor máximo es 100');
    });
  });

  describe('string length validation', () => {
    it('should pass when string meets minLength', () => {
      const result = validateField('test', { minLength: 3 });
      expect(result.isValid).toBe(true);
    });

    it('should fail when string is shorter than minLength', () => {
      const result = validateField('ab', { minLength: 3 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Mínimo 3 caracteres');
    });

    it('should pass when string meets maxLength', () => {
      const result = validateField('test', { maxLength: 10 });
      expect(result.isValid).toBe(true);
    });

    it('should fail when string exceeds maxLength', () => {
      const result = validateField('this is too long', { maxLength: 10 });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Máximo 10 caracteres');
    });
  });

  describe('pattern validation', () => {
    it('should pass when string matches pattern', () => {
      const result = validateField('test@example.com', { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ });
      expect(result.isValid).toBe(true);
    });

    it('should fail when string does not match pattern', () => {
      const result = validateField('invalid', { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Formato inválido');
    });
  });

  describe('custom validation', () => {
    it('should pass when custom validation returns null', () => {
      const result = validateField('valid', { 
        custom: (value: string) => value === 'valid' ? null : 'Invalid value' 
      });
      expect(result.isValid).toBe(true);
    });

    it('should fail when custom validation returns error', () => {
      const result = validateField('invalid', { 
        custom: (value: string) => value === 'valid' ? null : 'Invalid value' 
      });
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid value');
    });
  });
});

describe('validators', () => {
  describe('email validator', () => {
    it('should validate correct email', () => {
      const result = validateField('test@example.com', validators.email);
      expect(result.isValid).toBe(true);
    });

    it('should reject email without @', () => {
      const result = validateField('testexample.com', validators.email);
      expect(result.isValid).toBe(false);
    });

    it('should reject empty email', () => {
      const result = validateField('', validators.email);
      expect(result.isValid).toBe(false);
    });
  });

  describe('password validator', () => {
    it('should validate strong password', () => {
      const result = validateField('Password123', validators.password);
      expect(result.isValid).toBe(true);
    });

    it('should reject password too short', () => {
      const result = validateField('Pass1', validators.password);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Mínimo 6 caracteres');
    });

    it('should reject password without numbers', () => {
      const result = validateField('Password', validators.password);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Debe incluir letras y números');
    });

    it('should reject password without letters', () => {
      const result = validateField('123456', validators.password);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Debe incluir letras y números');
    });
  });

  describe('age validator', () => {
    it('should validate age within range', () => {
      const result = validateField(30, validators.age);
      expect(result.isValid).toBe(true);
    });

    it('should reject age below 16', () => {
      const result = validateField(15, validators.age);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El valor mínimo es 16');
    });

    it('should reject age above 100', () => {
      const result = validateField(101, validators.age);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El valor máximo es 100');
    });
  });

  describe('weight validator', () => {
    it('should validate weight within range', () => {
      const result = validateField(75, validators.weight);
      expect(result.isValid).toBe(true);
    });

    it('should reject weight below 30', () => {
      const result = validateField(29, validators.weight);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El valor mínimo es 30');
    });

    it('should reject weight above 300', () => {
      const result = validateField(301, validators.weight);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El valor máximo es 300');
    });
  });

  describe('height validator', () => {
    it('should validate height within range', () => {
      const result = validateField(175, validators.height);
      expect(result.isValid).toBe(true);
    });

    it('should reject height below 100', () => {
      const result = validateField(99, validators.height);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El valor mínimo es 100');
    });

    it('should reject height above 250', () => {
      const result = validateField(251, validators.height);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('El valor máximo es 250');
    });
  });
});
