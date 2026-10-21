import type { EditableVariant, variant } from '../../store/slices/product/productSlice';

export const createVariantClientId = () => `client-${crypto.randomUUID()}`;

// Persisted rows get stable UI keys without replacing their backend IDs.
export const toEditableVariants = (variants: variant[] | null | undefined): EditableVariant[] =>
  (variants ?? []).map((item) => ({
    ...item,
    clientId: `server-${item.id}`,
  }));

// Only the server contract crosses the API boundary.
export const toProductVariantPayload = ({
  id,
  title,
  product_variant_image,
  code,
  fake_price,
  price,
  available_quantity,
  on_hand_quantity,
  status,
}: EditableVariant): Partial<variant> => ({
  id,
  title,
  product_variant_image,
  code,
  fake_price,
  price,
  available_quantity,
  on_hand_quantity,
  status,
});
