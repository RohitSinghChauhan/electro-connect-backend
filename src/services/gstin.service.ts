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

interface GstinApiResponse {
  success?: boolean;
  gstin?: string;
  data?: GstinApiPayload | null;
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

  const body = (await response.json()) as GstinApiResponse;
  const details = body.data;

  if (!details || details.status !== "Active" || !details.legal_name) {
    throw invalidGstin();
  }

  return {
    gstin: details.gstin ?? body.gstin ?? gstin,
    legalBusinessName: details.legal_name,
    tradeName: details.trade_name ?? null,
    status: details.status,
    taxpayerType: details.taxpayer_type ?? null,
    businessConstitution: details.business_constitution ?? null,
    registrationDate: details.registration_date ?? null,
    cancellationDate: details.cancellation_date ?? null,
    stateCode: details.state_code ?? null,
    stateJurisdiction: details.state_jurisdiction ?? null,
    address: details.address ?? null,
    pincode: details.pincode ?? null,
    natureOfBusiness: Array.isArray(details.nature_of_business)
      ? details.nature_of_business
      : [],
    blockStatus: details.block_status ?? null,
  };
};
