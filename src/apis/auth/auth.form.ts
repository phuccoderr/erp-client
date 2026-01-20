import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const useFormAuthLogin = () => {
  const schema = z.object({
    email: z.string(),
    password: z.string(),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  });

  return { schema, form };
};

export { useFormAuthLogin };
