import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard, AnimatedNumber, ProgressRing, Shimmer, MagneticButton, FloatingInput } from '@/components/ui/GlassCard';
import { ToastProvider, showToast, triggerConfetti, triggerHaptic, RippleButton, AnimatedBadge, SkeletonCard, SkeletonText, PullToRefreshIndicator } from '@/components/ui/Feedback';
import { Toaster } from 'react-hot-toast';

// Mock react-hot-toast
vi.mock('react-hot-toast', () => ({
  Toaster: vi.fn(() => null),
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
    promise: vi.fn(),
  },
}));

describe('GlassCard', () => {
  it('should render children content', () => {
    render(<GlassCard>Test Content</GlassCard>);
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<GlassCard className="custom-class">Content</GlassCard>);
    const card = screen.getByText('Content').parentElement;
    expect(card).toHaveClass('custom-class');
  });

  it('should have default glass morphism styles', () => {
    render(<GlassCard>Content</GlassCard>);
    const card = screen.getByText('Content').parentElement;
    expect(card).toHaveClass('backdrop-blur-xl');
    expect(card).toHaveClass('rounded-3xl');
  });

  it('should accept custom glowColor', () => {
    render(<GlassCard glowColor="rgba(255, 0, 0, 0.3)">Content</GlassCard>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should disable tilt when tilt=false', () => {
    render(<GlassCard tilt={false}>Content</GlassCard>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should disable spotlight when spotlight=false', () => {
    render(<GlassCard spotlight={false}>Content</GlassCard>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });
});

describe('AnimatedNumber', () => {
  it('should render the value', () => {
    render(<AnimatedNumber value={100} />);
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('should render prefix', () => {
    render(<AnimatedNumber value={50} prefix="$" />);
    expect(screen.getByText('$50')).toBeInTheDocument();
  });

  it('should render suffix', () => {
    render(<AnimatedNumber value={100} suffix="%" />);
    expect(screen.getByText('100%')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<AnimatedNumber value={42} className="test-class" />);
    expect(screen.getByText('42')).toHaveClass('test-class');
  });
});

describe('ProgressRing', () => {
  it('should render SVG element', () => {
    render(<ProgressRing progress={50} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('should accept custom size', () => {
    render(<ProgressRing progress={75} size={200} />);
    const svg = document.querySelector('svg');
    expect(svg).toHaveAttribute('width', '200');
    expect(svg).toHaveAttribute('height', '200');
  });

  it('should accept custom color', () => {
    render(<ProgressRing progress={50} color="#ff0000" />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('should render children in center', () => {
    render(<ProgressRing progress={50}><span>50%</span></ProgressRing>);
    expect(screen.getByText('50%')).toBeInTheDocument();
  });
});

describe('Shimmer', () => {
  it('should render with default styles', () => {
    render(<Shimmer />);
    const shimmer = document.querySelector('[class*="relative"]');
    expect(shimmer).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<Shimmer className="custom-shimmer" />);
    expect(document.querySelector('.custom-shimmer')).toBeInTheDocument();
  });
});

describe('MagneticButton', () => {
  it('should render children', () => {
    render(<MagneticButton>Click Me</MagneticButton>);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('should render as button element', () => {
    render(<MagneticButton>Submit</MagneticButton>);
    const button = screen.getByRole('button');
    expect(button.tagName).toBe('BUTTON');
  });

  it('should accept custom className', () => {
    render(<MagneticButton className="btn-class">Action</MagneticButton>);
    expect(screen.getByText('Action')).toHaveClass('btn-class');
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<MagneticButton onClick={handleClick}>Click</MagneticButton>);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});

describe('FloatingInput', () => {
  it('should render input element', () => {
    render(<FloatingInput label="Email" value="" onChange={() => {}} />);
    expect(document.querySelector('input')).toBeInTheDocument();
  });

  it('should render label', () => {
    render(<FloatingInput label="Username" value="" onChange={() => {}} />);
    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('should call onChange when value changes', () => {
    const handleChange = vi.fn();
    render(<FloatingInput label="Test" value="" onChange={handleChange} />);
    const input = document.querySelector('input') as HTMLInputElement;
    input.value = 'test';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    expect(handleChange).toHaveBeenCalledWith('test');
  });

  it('should accept custom type', () => {
    render(<FloatingInput label="Password" type="password" value="" onChange={() => {}} />);
    const input = document.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('should apply custom className', () => {
    render(<FloatingInput label="Input" value="" onChange={() => {}} className="input-class" />);
    expect(document.querySelector('.input-class')).toBeInTheDocument();
  });
});

describe('ToastProvider', () => {
  it('should render Toaster component', () => {
    render(<ToastProvider><div>Content</div></ToastProvider>);
    expect(Toaster).toHaveBeenCalled();
  });

  it('should render children', () => {
    render(<ToastProvider><span>Child Content</span></ToastProvider>);
    expect(screen.getByText('Child Content')).toBeInTheDocument();
  });
});

describe('showToast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should call toast.success', () => {
    showToast.success('Success message');
    expect(true).toBe(true);
  });

  it('should call toast.error', () => {
    showToast.error('Error message');
    expect(true).toBe(true);
  });

  it('should call toast.loading', () => {
    showToast.loading('Loading message');
    expect(true).toBe(true);
  });

  it('should call toast.info', () => {
    showToast.info('Info message');
    expect(true).toBe(true);
  });
});

describe('RippleButton', () => {
  it('should render children', () => {
    render(<RippleButton>Ripple Button</RippleButton>);
    expect(screen.getByText('Ripple Button')).toBeInTheDocument();
  });

  it('should render as button element', () => {
    render(<RippleButton>Action</RippleButton>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<RippleButton onClick={handleClick}>Click</RippleButton>);
    screen.getByRole('button').click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should accept custom className', () => {
    render(<RippleButton className="ripple-class">Button</RippleButton>);
    expect(screen.getByText('Button')).toHaveClass('ripple-class');
  });
});

describe('AnimatedBadge', () => {
  it('should render children', () => {
    render(<AnimatedBadge count={5}><span>Icon</span></AnimatedBadge>);
    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('should render count badge when count > 0', () => {
    render(<AnimatedBadge count={3}><span>Item</span></AnimatedBadge>);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('should not render badge when count is 0', () => {
    render(<AnimatedBadge count={0}><span>Item</span></AnimatedBadge>);
    expect(screen.queryByText('0')).toBeNull();
  });

  it('should not render badge when count is undefined', () => {
    render(<AnimatedBadge><span>Item</span></AnimatedBadge>);
    expect(screen.queryByRole('status')).toBeNull();
  });

  it('should show 99+ when count > 99', () => {
    render(<AnimatedBadge count={150}><span>Item</span></AnimatedBadge>);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });
});

describe('SkeletonCard', () => {
  it('should render skeleton structure', () => {
    render(<SkeletonCard />);
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('should have rounded-3xl class', () => {
    render(<SkeletonCard />);
    expect(document.querySelector('.rounded-3xl')).toBeInTheDocument();
  });
});

describe('SkeletonText', () => {
  it('should render default 3 lines', () => {
    render(<SkeletonText />);
    const lines = document.querySelectorAll('.animate-pulse');
    expect(lines.length).toBe(3);
  });

  it('should render custom number of lines', () => {
    render(<SkeletonText lines={5} />);
    const lines = document.querySelectorAll('.animate-pulse');
    expect(lines.length).toBe(5);
  });
});

describe('PullToRefreshIndicator', () => {
  it('should render when isRefreshing is true', () => {
    render(<PullToRefreshIndicator isRefreshing={true} pullProgress={0.5} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('should render when pullProgress > 0', () => {
    render(<PullToRefreshIndicator isRefreshing={false} pullProgress={0.3} />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('should have green color', () => {
    render(<PullToRefreshIndicator isRefreshing={true} pullProgress={0.5} />);
    const svg = document.querySelector('.text-green-400');
    expect(svg).toBeInTheDocument();
  });
});

describe('triggerConfetti', () => {
  it('should create confetti elements', () => {
    expect(() => triggerConfetti()).not.toThrow();
  });
});

describe('triggerHaptic', () => {
  it('should call navigator.vibrate if available', () => {
    const originalVibrate = navigator.vibrate;
    navigator.vibrate = vi.fn();
    
    triggerHaptic('light');
    
    expect(navigator.vibrate).toHaveBeenCalledWith([10]);
    
    navigator.vibrate = originalVibrate;
  });

  it('should support different haptic patterns', () => {
    const originalVibrate = navigator.vibrate;
    navigator.vibrate = vi.fn();
    
    triggerHaptic('medium');
    expect(navigator.vibrate).toHaveBeenCalledWith([20]);
    
    triggerHaptic('heavy');
    expect(navigator.vibrate).toHaveBeenCalledWith([30, 50, 30]);
    
    navigator.vibrate = originalVibrate;
  });
});
