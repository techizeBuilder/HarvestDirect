import { Control, FieldPath, FieldValues } from "react-hook-form";
import { 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FormFieldWrapperProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  type?: "text" | "number" | "email" | "password" | "textarea";
  min?: string | number;
  step?: string;
  className?: string;
  onChange?: (value: any) => void;
}

export function FormFieldWrapper<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  type = "text",
  min,
  step,
  className,
  onChange
}: FormFieldWrapperProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            {type === "textarea" ? (
              <Textarea 
                placeholder={placeholder}
                {...field}
                onChange={(e) => {
                  field.onChange(e.target.value);
                  onChange?.(e.target.value);
                }}
              />
            ) : (
              <Input
                type={type}
                placeholder={placeholder}
                min={min}
                step={step}
                {...field}
                onChange={(e) => {
                  const value = type === "number" 
                    ? (step ? parseFloat(e.target.value) : parseInt(e.target.value))
                    : e.target.value;
                  field.onChange(value);
                  onChange?.(value);
                }}
              />
            )}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}