import React, { SVGProps } from 'react';

export function UserIcon({ className = "", ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="12" cy="8" r="3.6"/>
            <path d="M4.5 20c0-3.9 3.4-6.5 7.5-6.5s7.5 2.6 7.5 6.5"/>
        </svg>
    );
}

export function ChevronIcon({ className = "", ...props }: SVGProps<SVGSVGElement>) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M6 9l6 6 6-6"/>
        </svg>
    );
}