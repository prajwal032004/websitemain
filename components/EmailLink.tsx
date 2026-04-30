'use client';

import type { ReactNode } from 'react';
import { handleEmailClick } from '@/utils/email';

interface EmailLinkProps {
  email: string;
  className?: string;
  children?: ReactNode;
}

export default function EmailLink({ email, className, children }: EmailLinkProps) {
  return (
    <a
      href={`mailto:${email}`}
      onClick={(e) => handleEmailClick(e, email)}
      className={className}
    >
      {children || email}
    </a>
  );
}
