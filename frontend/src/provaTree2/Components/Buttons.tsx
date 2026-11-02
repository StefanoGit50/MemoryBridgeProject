import React, { ButtonHTMLAttributes } from 'react';
import styles from './Buttons.module.css';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
    size?: 'normal' | 'small';
    children: React.ReactNode;
    className?: string;
}

export function Button({ children, variant = 'secondary', size = 'normal', className = '', ...props }: ButtonProps) {
    return (
        <button
            className={`${styles.button} ${styles[variant]} ${styles[size]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}