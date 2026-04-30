import type { MouseEvent } from 'react';

export function handleEmailClick(e: MouseEvent | Event, email: string) {
  e.preventDefault();
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  if (isMobile) {
    window.location.href = `mailto:${email}`;
  } else {
    window.open(
      `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`,
      '_blank'
    );
  }
}
