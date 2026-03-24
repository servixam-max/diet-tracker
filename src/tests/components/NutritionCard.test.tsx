import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { NutritionCard } from '@/components/dashboard/NutritionCard';

describe('NutritionCard', () => {
  const defaultProps = {
    calories: 1500,
    protein: 120,
    carbs: 180,
    fat: 50,
    targetCalories: 2000,
    progress: 75,
    onAddFood: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render nutrition data correctly', () => {
    render(<NutritionCard {...defaultProps} />);
    
    expect(screen.getByText('1500')).toBeInTheDocument();
    expect(screen.getByText('2000')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('120g')).toBeInTheDocument();
    expect(screen.getByText('180g')).toBeInTheDocument();
    expect(screen.getByText('50g')).toBeInTheDocument();
  });

  it('should render macros labels', () => {
    render(<NutritionCard {...defaultProps} />);
    
    expect(screen.getByText('Proteínas')).toBeInTheDocument();
    expect(screen.getByText('Carbos')).toBeInTheDocument();
    expect(screen.getByText('Grasas')).toBeInTheDocument();
  });

  it('should call onAddFood when button is clicked', () => {
    render(<NutritionCard {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: 'Añadir nueva comida' });
    fireEvent.click(button);
    
    expect(defaultProps.onAddFood).toHaveBeenCalledTimes(1);
  });

  it('should render loading skeleton when isLoading is true', () => {
    render(<NutritionCard {...defaultProps} isLoading={true} />);
    
    expect(screen.getByTestId('nutrition-card-skeleton')).toBeInTheDocument();
  });

  it('should display red color when progress is over 100%', () => {
    const overTargetProps = {
      ...defaultProps,
      progress: 120,
    };
    
    render(<NutritionCard {...overTargetProps} />);
    
    const circle = screen.getByTestId('progress-ring');
    expect(circle).toHaveAttribute('stroke', '#ef4444');
  });

  it('should display green color when progress is under 100%', () => {
    render(<NutritionCard {...defaultProps} />);
    
    const circle = screen.getByTestId('progress-ring');
    expect(circle).toHaveAttribute('stroke', '#22c55e');
  });

  it('should have proper ARIA labels', () => {
    render(<NutritionCard {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: 'Añadir nueva comida' });
    expect(button).toHaveAttribute('aria-label', 'Añadir nueva comida');
  });
});
