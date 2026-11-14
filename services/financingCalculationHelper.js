export const calculateFlatMargin = (basePrice, marginPercent, downPayment, tenureMonths) => {
  const principal = basePrice - downPayment;
  const marginAmount = Math.round(principal * (marginPercent / 100));
  const totalTagihan = principal + marginAmount;
  const monthlyInstallment = Math.ceil(totalTagihan / tenureMonths);
  
  return {
    margin_percent: marginPercent,
    margin_amount: marginAmount,
    total_tagihan: totalTagihan,
    monthly_installment: monthlyInstallment,
    down_payment: downPayment,
    base_price: basePrice,
    principal_amount: principal,
    tenor_months: tenureMonths,
    method: "flat"
  };
};

export const calculateAnnuityMargin = (basePrice, marginPercent, downPayment, tenureMonths) => {
  const principal = basePrice - downPayment;
  const marginAmount = Math.round(principal * (marginPercent / 100) * 0.5);
  const totalTagihan = principal + marginAmount;
  const monthlyInstallment = Math.ceil(totalTagihan / tenureMonths);
  
  return {
    margin_percent: marginPercent,
    margin_amount: marginAmount,
    total_tagihan: totalTagihan,
    monthly_installment: monthlyInstallment,
    down_payment: downPayment,
    base_price: basePrice,
    principal_amount: principal,
    tenor_months: tenureMonths,
    method: "annuity"
  };
};