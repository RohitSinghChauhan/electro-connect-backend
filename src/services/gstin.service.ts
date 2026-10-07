import { ShopGstDetails } from "../types/shop.types";
import { ApiError } from "../utils/api-error";

const GSTIN_LOOKUP_URL = "https://gstinapi.in/v1/gstin";

interface GstinApiPayload {
  gstin?: string;
  legal_name?: string | null;
  trade_name?: string | null;
  status?: string | null;
  taxpayer_type?: string | null;
  business_constitution?: string | null;
  registration_date?: string | null;
  cancellation_date?: string | null;
  state_code?: string | null;
  state_jurisdiction?: string | null;
  address?: string | null;
  pincode?: string | null;
  nature_of_business?: string[] | null;
  block_status?: string | null;
}

const invalidGstin = () => new ApiError(400, "GSTIN is invalid or inactive");

export const verifyGstin = async (gstin: string): Promise<ShopGstDetails> => {
  const apiKey = process.env.GSTIN_API_KEY;

  if (!apiKey) {
    throw new ApiError(500, "GSTIN verification is not configured");
  }

  let response: Response;

  try {
    response = await fetch(`${GSTIN_LOOKUP_URL}/${encodeURIComponent(gstin)}`, {
      method: "GET",
      headers: {
        "x-api-key": apiKey,
      },
    });
  } catch {
    throw invalidGstin();
  }

  if (!response.ok) {
    throw invalidGstin();
  }

  const payload = (await response.json()) as GstinApiPayload;

  if (payload.status !== "Active" || !payload.legal_name) {
    throw invalidGstin();
  }

  return {
    gstin: payload.gstin ?? gstin,
    legalBusinessName: payload.legal_name,
    tradeName: payload.trade_name ?? null,
    status: payload.status,
    taxpayerType: payload.taxpayer_type ?? null,
    businessConstitution: payload.business_constitution ?? null,
    registrationDate: payload.registration_date ?? null,
    cancellationDate: payload.cancellation_date ?? null,
    stateCode: payload.state_code ?? null,
    stateJurisdiction: payload.state_jurisdiction ?? null,
    address: payload.address ?? null,
    pincode: payload.pincode ?? null,
    natureOfBusiness: Array.isArray(payload.nature_of_business)
      ? payload.nature_of_business
      : [],
    blockStatus: payload.block_status ?? null,
  };
};
