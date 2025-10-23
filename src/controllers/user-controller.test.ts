/**
 * Tests for UserController session operations
 */

/// <reference types="vitest/globals" />

import type { Request, Response } from "express";
import { UserController } from "./user-controller.js";

describe("UserController", () => {
	let controller: UserController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;
	let mockSession: Record<string, unknown>;

	beforeEach(() => {
		controller = new UserController();
		mockSession = {};

		mockRequest = {
			session: {
				...mockSession,
				destroy: vi.fn((callback: (error?: Error) => void) => {
					callback();
				}),
				// biome-ignore lint/suspicious/noExplicitAny: Mock session object requires any type for testing
			} as any,
		};

		mockResponse = {
			render: vi.fn(),
			redirect: vi.fn(),
			clearCookie: vi.fn(),
			status: vi.fn().mockReturnThis(),
		};
	});

	describe("postLogout", () => {
		it("should successfully destroy session and redirect to home", () => {
			controller.postLogout(mockRequest as Request, mockResponse as Response);

			expect(mockRequest.session?.destroy).toHaveBeenCalled();
			expect(mockResponse.clearCookie).toHaveBeenCalledWith("connect.sid");
			expect(mockResponse.redirect).toHaveBeenCalledWith("/");
		});

		it("should handle session destruction errors", () => {
			const mockError = new Error("Session destruction failed");
			mockRequest.session = {
				destroy: vi.fn((callback: (error?: Error) => void) => {
					callback(mockError);
				}),
				// biome-ignore lint/suspicious/noExplicitAny: Mock session object requires any type for testing
			} as any;

			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			controller.postLogout(mockRequest as Request, mockResponse as Response);

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Error destroying session:",
				mockError
			);
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.render).toHaveBeenCalledWith("error.njk", {
				message: "Error logging out. Please try again.",
			});

			consoleErrorSpy.mockRestore();
		});

		it("should handle exceptions during logout", () => {
			mockRequest.session = {
				destroy: vi.fn(() => {
					throw new Error("Unexpected error");
				}),
				// biome-ignore lint/suspicious/noExplicitAny: Mock session object requires any type for testing
			} as any;

			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			controller.postLogout(mockRequest as Request, mockResponse as Response);

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Error in UserController.postLogout:",
				expect.any(Error)
			);
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.render).toHaveBeenCalledWith("error.njk", {
				message: "Error logging out. Please try again.",
			});

			consoleErrorSpy.mockRestore();
		});
	});
});
