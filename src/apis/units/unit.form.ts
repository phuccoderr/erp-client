import { LANG_KEY_CONST } from "@constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const baseUnitSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, LANG_KEY_CONST.FORM_ERR_NOT_EMPTY)
    .max(50, LANG_KEY_CONST.FORM_ERR_MAX_LENGTH),
  code: z
    .string()
    .trim()
    .min(1, LANG_KEY_CONST.FORM_ERR_NOT_EMPTY)
    .max(20, LANG_KEY_CONST.FORM_ERR_MAX_LENGTH),
  description: z
    .string()
    .trim()
    .pipe(z.union([z.literal(""), z.string().min(1).max(255)])),
});

const useFormUnit = () => {
  const schema = baseUnitSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      code: "",
      description: "",
    },
  });

  return { schema, form };
};

export { useFormUnit };
