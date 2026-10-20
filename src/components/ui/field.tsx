import { cn } from "@/lib/utils";

export function FieldError({ errors }: { errors?: string[] }) {
  if (!errors?.length) return null;
  return <p className="field-error">{errors[0]}</p>;
}

export function Field({
  label,
  name,
  errors,
  hint,
  className,
  children,
}: {
  label: string;
  name: string;
  errors?: string[];
  hint?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("min-w-0", className)}>
      <label htmlFor={name} className="label">
        {label}
      </label>
      {children}
      {hint && !errors?.length && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <FieldError errors={errors} />
    </div>
  );
}
