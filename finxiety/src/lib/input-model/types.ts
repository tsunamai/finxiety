export interface Track1Inputs {
	household_size: number;
	state: string;
	zip_code: string;
	gross_monthly_income: number;
	current_benefits: string[];
}

export interface Track2Inputs {
	pay_frequency: 'weekly' | 'biweekly' | 'semimonthly' | 'monthly';
	gross_pay_per_period: number;
	designated_savings: number;
	checking_balance: number;
	monthly_essential_expenses: number;
}
