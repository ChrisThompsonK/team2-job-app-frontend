/**
 * Lucide Icon Helper for Nunjucks Templates
 * Provides utility functions to generate Lucide SVG icons in templates
 */

import { Briefcase, Calendar, Info, MapPin, Tag, XCircle } from "lucide";

/**
 * Configuration for icon rendering
 */
interface IconConfig {
	size?: number;
	strokeWidth?: number;
	className?: string;
	color?: string;
}

/**
 * Default icon configuration
 */
const DEFAULT_CONFIG: IconConfig = {
	size: 24,
	strokeWidth: 2,
	className: "",
	color: "currentColor",
};

/**
 * Type for Lucide icon data (array of SVG elements)
 */
type LucideIconNode = [string, Record<string, string | number>][];

/**
 * Available Lucide icons mapped to their data
 */
const ICON_MAP: Record<string, LucideIconNode> = {
	info: Info,
	"map-pin": MapPin,
	location: MapPin,
	tag: Tag,
	briefcase: Briefcase,
	band: Briefcase,
	calendar: Calendar,
	"x-circle": XCircle,
	error: XCircle,
};

/**
 * Convert Lucide icon attributes to SVG attribute string
 */
function attributesToString(attrs: Record<string, string | number>): string {
	return Object.entries(attrs)
		.map(([key, value]) => `${key}="${value}"`)
		.join(" ");
}

/**
 * Convert Lucide icon node to SVG element string
 */
function nodeToSvg(node: [string, Record<string, string | number>]): string {
	const [tag, attrs] = node;
	const attrsString = attributesToString(attrs);

	// Self-closing tags
	if (
		[
			"circle",
			"path",
			"line",
			"rect",
			"ellipse",
			"polygon",
			"polyline",
		].includes(tag)
	) {
		return `<${tag} ${attrsString}/>`;
	}

	// Container tags (though most Lucide icons use self-closing tags)
	return `<${tag} ${attrsString}></${tag}>`;
}

/**
 * Generate SVG markup for a Lucide icon
 * @param iconName - Name of the icon to render
 * @param config - Configuration options for the icon
 * @returns SVG markup string
 */
export function renderLucideIcon(
	iconName: string,
	config: IconConfig = {}
): string {
	const iconData = ICON_MAP[iconName];

	if (!iconData) {
		console.warn(
			`Icon "${iconName}" not found in ICON_MAP. Available icons:`,
			Object.keys(ICON_MAP)
		);
		return `<!-- Icon "${iconName}" not found -->`;
	}

	const finalConfig = { ...DEFAULT_CONFIG, ...config };

	// Build SVG content from icon nodes
	const svgContent = iconData.map(nodeToSvg).join("");

	// Construct the complete SVG element
	const svgAttributes = [
		`width="${finalConfig.size}"`,
		`height="${finalConfig.size}"`,
		`viewBox="0 0 24 24"`,
		`fill="none"`,
		`stroke="${finalConfig.color}"`,
		`stroke-width="${finalConfig.strokeWidth}"`,
		`stroke-linecap="round"`,
		`stroke-linejoin="round"`,
		finalConfig.className ? `class="${finalConfig.className}"` : "",
	]
		.filter(Boolean)
		.join(" ");

	return `<svg ${svgAttributes}>${svgContent}</svg>`;
}

/**
 * Nunjucks filter function to generate Lucide icons
 * Usage in templates: {{ 'info' | lucideIcon }}
 * Usage with options: {{ 'info' | lucideIcon({ size: 20, className: 'text-blue-500' }) }}
 */
export function lucideIconFilter(
	iconName: string,
	options: IconConfig = {}
): string {
	return renderLucideIcon(iconName, options);
}

/**
 * Helper function to get available icon names
 */
export function getAvailableIcons(): string[] {
	return Object.keys(ICON_MAP);
}
