import { WhenProps } from './When.d';

export function When({ condition, children }: WhenProps) {
  return condition ? <>{children}</> : null;
}
