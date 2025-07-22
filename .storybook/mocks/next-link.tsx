import type React from 'react';

interface LinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

const MockNextLink: React.FC<LinkProps> = ({ href, children, className }) => {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
};

export default MockNextLink;
