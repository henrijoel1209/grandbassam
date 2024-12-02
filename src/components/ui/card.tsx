import React from 'react';
import { cn } from "@/lib/utils";
import { Transition } from '@headlessui/react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  footer?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, title, description, footer, actions, className = '', noPadding = false }, ref) => {
    return (
      <Transition
        show={true}
        enter="transition-all duration-300"
        enterFrom="opacity-0 translate-y-4"
        enterTo="opacity-100 translate-y-0"
        leave="transition-all duration-300"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-4"
      >
        <div 
          ref={ref}
          className={cn(
            "bg-card rounded-lg shadow-sm border border-border",
            className
          )}
        >
          {(title || description || actions) && (
            <div className="px-6 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  {title && (
                    <h3 className="text-lg font-medium leading-6 text-card-foreground">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                  )}
                </div>
                {actions && <div className="flex items-center space-x-3">{actions}</div>}
              </div>
            </div>
          )}
          <div className={cn(noPadding ? '' : 'p-6')}>{children}</div>
          {footer && (
            <div className="px-6 py-4 bg-muted rounded-b-lg border-t border-border">
              {footer}
            </div>
          )}
        </div>
      </Transition>
    );
  }
);

Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }