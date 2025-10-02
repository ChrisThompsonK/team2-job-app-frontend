/**
 * Tests for validation utility functions
 */

import { describe, expect, it } from "vitest";
import {
	sanitizeString,
	validateDateString,
	validateJobRoleId,
} from "./validation";

describe("validateJobRoleId", () => {
	it("should return a valid positive integer", () => {
		expect(validateJobRoleId("1")).toBe(1);
		expect(validateJobRoleId("123")).toBe(123);
		expect(validateJobRoleId("999")).toBe(999);
	});

	it("should handle strings with leading/trailing whitespace", () => {
		expect(validateJobRoleId("  1  ")).toBe(1);
		expect(validateJobRoleId("\t123\n")).toBe(123);
		expect(validateJobRoleId(" 456 ")).toBe(456);
	});

	it("should handle large valid integers", () => {
		expect(validateJobRoleId("2147483647")).toBe(2147483647); // Max 32-bit signed int
		expect(validateJobRoleId("1000000")).toBe(1000000);
	});

	it("should return null for undefined input", () => {
		expect(validateJobRoleId(undefined)).toBe(null);
	});

	it("should return null for non-string input", () => {
		// Test with various non-string types by casting to string | undefined
		expect(validateJobRoleId(null as unknown as string | undefined)).toBe(null);
		expect(validateJobRoleId(123 as unknown as string | undefined)).toBe(null);
		expect(validateJobRoleId([] as unknown as string | undefined)).toBe(null);
		expect(validateJobRoleId({} as unknown as string | undefined)).toBe(null);
	});

	it("should return null for empty or whitespace-only strings", () => {
		expect(validateJobRoleId("")).toBe(null);
		expect(validateJobRoleId("   ")).toBe(null);
		expect(validateJobRoleId("\t\n\r")).toBe(null);
	});

	it("should return null for zero and negative numbers", () => {
		expect(validateJobRoleId("0")).toBe(null);
		expect(validateJobRoleId("-1")).toBe(null);
		expect(validateJobRoleId("-123")).toBe(null);
	});

	it("should return null for decimal numbers", () => {
		expect(validateJobRoleId("1.5")).toBe(null);
		expect(validateJobRoleId("123.456")).toBe(null);
		expect(validateJobRoleId("0.1")).toBe(null);
	});

	it("should return null for non-numeric strings", () => {
		expect(validateJobRoleId("abc")).toBe(null);
		expect(validateJobRoleId("1abc")).toBe(null);
		expect(validateJobRoleId("abc123")).toBe(null);
		expect(validateJobRoleId("12.34.56")).toBe(null);
	});

	it("should return null for special numeric formats", () => {
		expect(validateJobRoleId("1e5")).toBe(null); // Scientific notation
		expect(validateJobRoleId("0x10")).toBe(null); // Hexadecimal
		expect(validateJobRoleId("010")).toBe(10); // This should work as it's just leading zeros
		expect(validateJobRoleId("Infinity")).toBe(null);
		expect(validateJobRoleId("NaN")).toBe(null);
	});

	it("should return null for numbers with additional characters", () => {
		expect(validateJobRoleId("123px")).toBe(null);
		expect(validateJobRoleId("$123")).toBe(null);
		expect(validateJobRoleId("123%")).toBe(null);
		expect(validateJobRoleId("1 2 3")).toBe(null);
	});

	it("should handle very large numbers that exceed safe integer limits", () => {
		// Numbers larger than Number.MAX_SAFE_INTEGER
		expect(validateJobRoleId("9007199254740992")).toBe(9007199254740992); // This might pass parseInt but fail isInteger check
	});

	it("should handle leading zeros correctly", () => {
		expect(validateJobRoleId("0001")).toBe(1);
		expect(validateJobRoleId("000123")).toBe(123);
	});
});

describe("validateDateString", () => {
	it("should return true for valid YYYY-MM-DD format dates", () => {
		expect(validateDateString("2025-01-01")).toBe(true);
		expect(validateDateString("2025-12-31")).toBe(true);
		expect(validateDateString("2024-02-29")).toBe(true); // Leap year
	});

	it("should handle edge cases of valid dates", () => {
		expect(validateDateString("1900-01-01")).toBe(true); // Start of 20th century
		expect(validateDateString("2000-02-29")).toBe(true); // Year 2000 leap year
		expect(validateDateString("9999-12-31")).toBe(true); // Far future date
	});

	it("should return false for invalid date formats", () => {
		expect(validateDateString("01-01-2025")).toBe(false);
		expect(validateDateString("2025/01/01")).toBe(false);
		expect(validateDateString("2025-1-1")).toBe(false);
		expect(validateDateString("25-01-01")).toBe(false);
	});

	it("should return false for invalid dates", () => {
		expect(validateDateString("2025-13-01")).toBe(false); // Invalid month
		expect(validateDateString("2025-02-30")).toBe(false); // Invalid day for February
		expect(validateDateString("2023-02-29")).toBe(false); // Invalid leap year
	});

	it("should return false for edge cases of invalid dates", () => {
		expect(validateDateString("2025-00-01")).toBe(false); // Month 0
		expect(validateDateString("2025-01-00")).toBe(false); // Day 0
		expect(validateDateString("2025-04-31")).toBe(false); // April only has 30 days
		expect(validateDateString("2025-06-31")).toBe(false); // June only has 30 days
		expect(validateDateString("2025-09-31")).toBe(false); // September only has 30 days
		expect(validateDateString("2025-11-31")).toBe(false); // November only has 30 days
	});

	it("should return false for empty or malformed strings", () => {
		expect(validateDateString("")).toBe(false);
		expect(validateDateString("not-a-date")).toBe(false);
		expect(validateDateString("2025-")).toBe(false);
		expect(validateDateString("2025-01")).toBe(false);
		expect(validateDateString("2025-01-")).toBe(false);
	});

	it("should return false for dates with extra characters", () => {
		expect(validateDateString("2025-01-01T00:00:00")).toBe(false); // ISO datetime
		expect(validateDateString("2025-01-01 ")).toBe(false); // Trailing space
		expect(validateDateString(" 2025-01-01")).toBe(false); // Leading space
		expect(validateDateString("2025-01-01Z")).toBe(false); // UTC indicator
	});

	it("should return false for non-numeric components", () => {
		expect(validateDateString("abcd-01-01")).toBe(false);
		expect(validateDateString("2025-ab-01")).toBe(false);
		expect(validateDateString("2025-01-ab")).toBe(false);
	});
});

describe("sanitizeString", () => {
	it("should sanitize basic HTML special characters", () => {
		expect(sanitizeString("<script>alert('xss')</script>")).toBe(
			"&lt;script&gt;alert(&#x27;xss&#x27;)&lt;/script&gt;"
		);
		expect(sanitizeString('Hello "World" & <tag>')).toBe(
			"Hello &quot;World&quot; &amp; &lt;tag&gt;"
		);
	});

	it("should handle individual special characters", () => {
		expect(sanitizeString("&")).toBe("&amp;");
		expect(sanitizeString("<")).toBe("&lt;");
		expect(sanitizeString(">")).toBe("&gt;");
		expect(sanitizeString('"')).toBe("&quot;");
		expect(sanitizeString("'")).toBe("&#x27;");
	});

	it("should handle multiple consecutive special characters", () => {
		expect(sanitizeString("<<<")).toBe("&lt;&lt;&lt;");
		expect(sanitizeString("&&&")).toBe("&amp;&amp;&amp;");
		expect(sanitizeString('"""')).toBe("&quot;&quot;&quot;");
	});

	it("should handle mixed special characters", () => {
		expect(sanitizeString("<>&\"'")).toBe("&lt;&gt;&amp;&quot;&#x27;");
		expect(sanitizeString("'\"&><")).toBe("&#x27;&quot;&amp;&gt;&lt;");
	});

	it("should prevent common XSS attack vectors", () => {
		expect(sanitizeString('<img src="x" onerror="alert(1)">')).toBe(
			"&lt;img src=&quot;x&quot; onerror=&quot;alert(1)&quot;&gt;"
		);
		expect(sanitizeString('<svg onload="alert(1)">')).toBe(
			"&lt;svg onload=&quot;alert(1)&quot;&gt;"
		);
		expect(sanitizeString("javascript:alert('xss')")).toBe(
			"javascript:alert(&#x27;xss&#x27;)"
		);
	});

	it("should handle data URIs and other injection attempts", () => {
		expect(sanitizeString("data:text/html,<script>alert(1)</script>")).toBe(
			"data:text/html,&lt;script&gt;alert(1)&lt;/script&gt;"
		);
		expect(sanitizeString('<iframe src="javascript:alert(1)"></iframe>')).toBe(
			"&lt;iframe src=&quot;javascript:alert(1)&quot;&gt;&lt;/iframe&gt;"
		);
	});

	it("should trim leading and trailing whitespace", () => {
		expect(sanitizeString("  hello world  ")).toBe("hello world");
		expect(sanitizeString("\t\n hello \r\n")).toBe("hello");
	});

	it("should preserve internal whitespace", () => {
		expect(sanitizeString("hello    world")).toBe("hello    world");
		expect(sanitizeString("line1\nline2")).toBe("line1\nline2");
	});

	it("should handle empty and whitespace-only strings", () => {
		expect(sanitizeString("")).toBe("");
		expect(sanitizeString("   ")).toBe("");
		expect(sanitizeString("\t\n\r")).toBe("");
	});

	it("should handle strings with no special characters", () => {
		expect(sanitizeString("hello world")).toBe("hello world");
		expect(sanitizeString("123456")).toBe("123456");
		expect(sanitizeString("user@example.com")).toBe("user@example.com");
	});

	it("should handle very long strings", () => {
		const longString = `${"a".repeat(1000)}<script>${"b".repeat(1000)}`;
		const expected = `${"a".repeat(1000)}&lt;script&gt;${"b".repeat(1000)}`;
		expect(sanitizeString(longString)).toBe(expected);
	});

	it("should handle unicode and special characters", () => {
		expect(sanitizeString("café & résumé")).toBe("café &amp; résumé");
		expect(sanitizeString("🔥 <hot> content")).toBe("🔥 &lt;hot&gt; content");
	});

	it("should handle user input that might contain HTML", () => {
		expect(sanitizeString("My favorite tag is <div>")).toBe(
			"My favorite tag is &lt;div&gt;"
		);
		expect(sanitizeString('He said "Hello" & waved')).toBe(
			"He said &quot;Hello&quot; &amp; waved"
		);
	});

	it("should handle form data that might be malicious", () => {
		expect(sanitizeString("<script>document.cookie</script>")).toBe(
			"&lt;script&gt;document.cookie&lt;/script&gt;"
		);
		expect(sanitizeString("onmouseover=\"alert('xss')\"")).toBe(
			"onmouseover=&quot;alert(&#x27;xss&#x27;)&quot;"
		);
	});
});
