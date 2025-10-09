/**
 * Validation constants for job role creation and validation
 */

export const VALID_LOCATIONS = [
	"Belfast, Northern Ireland",
	"Birmingham, England",
	"Derry~Londonderry, Northern Ireland",
	"Dublin, Ireland",
	"London, England",
	"Gdansk, Poland",
	"Helsinki, Finland",
	"Paris, France",
	"Antwerp, Belgium",
	"Buenos Aires, Argentina",
	"Indianapolis, United States",
	"Nova Scotia, Canada",
	"Toronto, Canada",
	"Remote",
] as const;

export const VALID_CAPABILITIES = [
	"Engineering",
	"Analytics",
	"Product",
	"Design",
	"Quality Assurance",
	"Documentation",
	"Testing",
] as const;

export const VALID_BANDS = ["Junior", "Mid", "Senior"] as const;

export const VALID_STATUSES = ["Open", "Closed", "On Hold"] as const;
