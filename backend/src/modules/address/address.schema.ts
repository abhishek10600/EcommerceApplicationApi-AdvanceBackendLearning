import { z } from "zod";

export const createAddressSchema = z
  .object({
    addressType: z.string(),
    addressLine1: z.string().min(1, "Address line 1 cannot be empty."),
    addressLine2: z.string().optional(),
    city: z.string().min(1, "City cannot be empty."),
    state: z.string().min(1, "State cannot be empty."),
    pinCode: z.string().min(1, "Pin Code cannot be empty."),
    country: z.string().min(1, "Country cannot be empty"),
  })
  .strict();

export const updateAddressSchema = z.object({
  addressType: z.string().optional(),
  addressLine1: z.string().min(1, "Address line 1 cannot be empty").optional(),
  addressLine2: z.string().min(1, "Address line 2 cannot empty").optional(),
  city: z.string().min(1, "City cannot be empty.").optional(),
  state: z.string().min(1, "State cannot be empty").optional(),
  pinCode: z.string().min(1, "Pin Code cannot be empty.").optional(),
  country: z.string().min(1, "Country cannot be empty.").optional(),
});

export type createAddressDTO = z.infer<typeof createAddressSchema>;
export type updateAddressDTO = z.infer<typeof updateAddressSchema>;
