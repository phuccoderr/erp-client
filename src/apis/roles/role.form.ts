import { LANG_KEY_CONST } from "@constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const baseRoleSchema = z.object({
  name: z.string().trim().min(1, LANG_KEY_CONST.FORM_ERR_NOT_EMPTY),
  description: z.string().trim().min(1, LANG_KEY_CONST.FORM_ERR_NOT_EMPTY),
  permission_ids: z.array(z.number()),
});

const useFormRole = () => {
  const schema = baseRoleSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      permission_ids: [],
    },
  });

  return { schema, form };
};

export { useFormRole };
