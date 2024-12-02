import React from 'react';

interface PageProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}

export const Page: React.FC<PageProps> = ({
  title,
  description,
  actions,
  children,
}) => {
  return (
    <div className="py-6">
      <div className="px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{title}</h1>
            {description && (
              <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="ml-4 flex-shrink-0">{actions}</div>}
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
};