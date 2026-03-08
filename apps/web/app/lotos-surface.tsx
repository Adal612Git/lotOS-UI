import type { CSSProperties, HTMLAttributes, ReactNode } from 'react';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline';
type BadgeSize = 'sm' | 'md' | 'lg';
type CardPadding = 'none' | 'sm' | 'md' | 'lg';
type CardShadow = 'none' | 'sm' | 'md' | 'lg';
type CardBorder = 'none' | 'default' | 'strong';
type StatTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

export function Badge({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...rest
}: HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
}) {
  return (
    <span
      className={cn('lotos-badge', `lotos-badge--${variant}`, `lotos-badge--${size}`, className)}
      {...rest}
    >
      {children}
    </span>
  );
}

export function Card({
  children,
  className,
  padding = 'md',
  shadow = 'sm',
  border = 'default',
  style,
  ...rest
}: HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  padding?: CardPadding;
  shadow?: CardShadow;
  border?: CardBorder;
  style?: CSSProperties;
}) {
  return (
    <div
      className={cn(
        'lotos-card',
        `lotos-card--padding-${padding}`,
        `lotos-card--shadow-${shadow}`,
        `lotos-card--border-${border}`,
        className
      )}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}

export function Stat({
  label,
  value,
  change,
  helperText,
  tone = 'neutral',
  className,
  ...rest
}: HTMLAttributes<HTMLElement> & {
  label: ReactNode;
  value: ReactNode;
  change?: ReactNode;
  helperText?: ReactNode;
  tone?: StatTone;
}) {
  return (
    <section className={cn('lotos-stat', `lotos-stat--${tone}`, className)} {...rest}>
      <div className="lotos-stat__head">
        <div>
          <div className="lotos-stat__label">{label}</div>
          <div className="lotos-stat__value">{value}</div>
        </div>
        {change ? <span className="lotos-stat__change">{change}</span> : null}
      </div>
      {helperText ? <p className="lotos-stat__helper">{helperText}</p> : null}
    </section>
  );
}
