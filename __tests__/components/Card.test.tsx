import React from 'react';
import { render, screen } from '@testing-library/react';
import Card from '@/app/components/Card';

describe('Card', () => {
  it('renders children content', () => {
    render(<Card>Hello Card</Card>);
    expect(screen.getByText('Hello Card')).toBeInTheDocument();
  });

  it('applies default variant and padding classes', () => {
    const { container } = render(<Card>Default</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('bg-surface');
    expect(el.className).toContain('p-6'); // md padding
  });

  it('applies gradient variant classes', () => {
    const { container } = render(<Card variant="gradient">Gradient</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('from-primary/5');
    expect(el.className).toContain('border-primary/30');
  });

  it('applies interactive variant with hover classes', () => {
    const { container } = render(<Card variant="interactive">Click me</Card>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('hover:border-primary/50');
    expect(el.className).toContain('cursor-pointer');
  });

  it('applies correct padding sizes', () => {
    const { container: sm } = render(<Card padding="sm">Sm</Card>);
    expect((sm.firstChild as HTMLElement).className).toContain('p-4');

    const { container: lg } = render(<Card padding="lg">Lg</Card>);
    expect((lg.firstChild as HTMLElement).className).toContain('p-8');

    const { container: none } = render(<Card padding="none">None</Card>);
    expect((none.firstChild as HTMLElement).className).not.toContain('p-4');
    expect((none.firstChild as HTMLElement).className).not.toContain('p-6');
    expect((none.firstChild as HTMLElement).className).not.toContain('p-8');
  });

  it('renders as different HTML elements via "as" prop', () => {
    const { container } = render(<Card as="section">Section</Card>);
    expect(container.querySelector('section')).toBeInTheDocument();
  });

  it('renders as article element', () => {
    const { container } = render(<Card as="article">Article</Card>);
    expect(container.querySelector('article')).toBeInTheDocument();
  });

  it('renders as div by default', () => {
    const { container } = render(<Card>Div</Card>);
    expect(container.firstChild?.nodeName).toBe('DIV');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="my-custom-class">Custom</Card>);
    expect((container.firstChild as HTMLElement).className).toContain('my-custom-class');
  });
});
