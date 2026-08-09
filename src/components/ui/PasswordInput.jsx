import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";

/**
 * Thin wrapper around Input — same label/error/helperText contract,
 * just adds the eye-toggle button. Nothing here duplicates Input's
 * styling logic, it only overlays a button on top of it.
 */
const PasswordInput = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        ref={ref}
        type={visible ? "text" : "password"}
        className="pr-11"
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute right-3 top-[38px] text-ink-faint hover:text-ink-muted transition-colors"
      >
        {visible ? <EyeOff size={17} strokeWidth={1.75} /> : <Eye size={17} strokeWidth={1.75} />}
      </button>
    </div>
  );
});

PasswordInput.displayName = "PasswordInput";
export default PasswordInput;
