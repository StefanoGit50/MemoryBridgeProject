import React from 'react';
import styles from './avatar.module.css';
import { UserIcon } from './Icons';

interface AvatarProps {
    src?: string;
    alt?: string;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
    return (
        <div className={`${styles.avatar} ${styles[size]} ${className}`}>
            {src ? (
                <img src={src} alt={alt || 'Avatar'} className={styles.image} />
            ) : (
                <UserIcon className={styles.icon} />
            )}
        </div>
    );
}