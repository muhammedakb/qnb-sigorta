import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

export type InputShellProps = {
  icon: LucideIcon;
  children: ReactNode;
};

export function InputShell({ icon: Icon, children }: InputShellProps) {
  return (
    <div className='relative'>
      <Icon className='pointer-events-none absolute left-3.5 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground' />
      {children}
    </div>
  );
}
