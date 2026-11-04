export const ALLOWED_AKAD_TYPES = [
  "Wadiah",
  "Mudharabah",
  "Musyarakah",
  "Murabahah",
  "Qardh",
  "Wakalah",
];

export const CONFIGURABLE_TYPE_CODES = ["SW_POKOK", "SW_WAJIB"];
const MAX_DEFAULT_AMOUNT = 1_000_000_000_000;

export const FEE_TYPES = ["FLAT", "PERCENTAGE", "FLAT_AND_PERCENTAGE"];
const MAX_FLAT_FEE = 99_999_999.99;
const MAX_PERCENTAGE_FEE = 100;

export const isAllowedAkad = (akadType) => ALLOWED_AKAD_TYPES.includes(akadType);

export const parseNonNegativeAmount = (value) => {
  if (typeof value === "number") {
    if (!Number.isFinite(value) || value < 0 || value > MAX_DEFAULT_AMOUNT) return null;
    return value;
  }
  if (typeof value !== "string" || !/^\d+(\.\d{1,2})?$/.test(value.trim())) return null;
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount > MAX_DEFAULT_AMOUNT) return null;
  return amount;
};

export const parseFeeNumber = (value, max) => {
  if (value === undefined || value === null || value === "") return 0;
  const raw = typeof value === "string" ? value.trim() : value;
  if (typeof raw === "string" && !/^\d+(\.\d+)?$/.test(raw)) return null;
  const amount = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(amount) || amount < 0 || amount > max) return null;
  return amount;
};

export const parsePaymentFeeInput = (conf) => {
  if (!conf?.id || !FEE_TYPES.includes(conf.fee_type)) return null;
  const flatFee = parseFeeNumber(conf.flat_fee, MAX_FLAT_FEE);
  const percentageFee = parseFeeNumber(conf.percentage_fee, MAX_PERCENTAGE_FEE);
  if (flatFee === null || percentageFee === null) return null;
  return {
    id: conf.id,
    fee_type: conf.fee_type,
    flat_fee: flatFee,
    percentage_fee: percentageFee,
  };
};
