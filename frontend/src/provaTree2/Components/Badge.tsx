import React from 'react';
import styles from './Badge.module.css';

export interface BadgeProps {
    children: React.ReactNode;
    className?: string;
}

export function Badge({ children, className = '' }: BadgeProps) {
    return (
        <span className={`${styles.badge} ${className}`}>
      {children}
    </span>
    );
}