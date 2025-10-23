/**
 * Unit tests for AuthController
 */

/// <reference types="vitest/globals" />

import type { Request, Response } from "express";
import { AuthController } from "./auth-controller.js";

describe("AuthController", () => {
	let controller: AuthController;
	let mockRequest: Partial<Request>;
	let mockResponse: Partial<Response>;

	beforeEach(() => {
		controller = new AuthController();

		mockRequest = {
			// biome-ignore lint/suspicious/noExplicitAny: Mock session object requires any type for testing
			session: {} as any,
		};

		mockResponse = {
			render: vi.fn(),
			redirect: vi.fn(),
			status: vi.fn().mockReturnThis(),
		};
	});

	describe("getLogin", () => {
		it("should render login page when user is not authenticated", () => {
			// biome-ignore lint/suspicious/noExplicitAny: Mock session object requires any type for testing
			mockRequest.session = {} as any;

			controller.getLogin(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.render).toHaveBeenCalledWith("login.njk", {
				title: "Login",
			});
			expect(mockResponse.redirect).not.toHaveBeenCalled();
		});

		it("should redirect to home if user is already authenticated via isAuthenticated flag", () => {
			// biome-ignore lint/suspicious/noExplicitAny: Mock session object requires any type for testing
			mockRequest.session = { isAuthenticated: true } as any;

			controller.getLogin(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.redirect).toHaveBeenCalledWith("/");
			expect(mockResponse.render).not.toHaveBeenCalled();
		});

		it("should redirect to home if user session exists", () => {
			mockRequest.session = {
				user: {
					userId: "123",
					email: "test@example.com",
					forename: "John",
					surname: "Doe",
					role: "user",
				},
				// biome-ignore lint/suspicious/noExplicitAny: Mock session object requires any type for testing
			} as any;

			controller.getLogin(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.redirect).toHaveBeenCalledWith("/");
			expect(mockResponse.render).not.toHaveBeenCalled();
		});

		it("should render error page on exception", () => {
			const renderError = new Error("Render error");
			let callCount = 0;
			mockResponse.render = vi.fn().mockImplementation(() => {
				callCount++;
				if (callCount === 1) {
					throw renderError;
				}
			});

			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			controller.getLogin(mockRequest as Request, mockResponse as Response);

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Error in AuthController.getLogin:",
				renderError
			);
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.render).toHaveBeenCalledWith("error.njk", {
				message: "Could not load login page. Please try again later.",
			});

			consoleErrorSpy.mockRestore();
		});
	});

	describe("getRegister", () => {
		it("should render register page when user is not authenticated", () => {
			// biome-ignore lint/suspicious/noExplicitAny: Mock session object requires any type for testing
			mockRequest.session = {} as any;

			controller.getRegister(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.render).toHaveBeenCalledWith("register.njk", {
				title: "Register",
			});
			expect(mockResponse.redirect).not.toHaveBeenCalled();
		});

		it("should redirect to home if user is already authenticated via isAuthenticated flag", () => {
			// biome-ignore lint/suspicious/noExplicitAny: Mock session object requires any type for testing
			mockRequest.session = { isAuthenticated: true } as any;

			controller.getRegister(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.redirect).toHaveBeenCalledWith("/");
			expect(mockResponse.render).not.toHaveBeenCalled();
		});

		it("should redirect to home if user session exists", () => {
			mockRequest.session = {
				user: {
					userId: "123",
					email: "test@example.com",
					forename: "John",
					surname: "Doe",
					role: "user",
				},
				// biome-ignore lint/suspicious/noExplicitAny: Mock session object requires any type for testing
			} as any;

			controller.getRegister(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.redirect).toHaveBeenCalledWith("/");
			expect(mockResponse.render).not.toHaveBeenCalled();
		});

		it("should render error page on exception", () => {
			const renderError = new Error("Render error");
			let callCount = 0;
			mockResponse.render = vi.fn().mockImplementation(() => {
				callCount++;
				if (callCount === 1) {
					throw renderError;
				}
			});

			const consoleErrorSpy = vi
				.spyOn(console, "error")
				.mockImplementation(() => {});

			controller.getRegister(mockRequest as Request, mockResponse as Response);

			expect(consoleErrorSpy).toHaveBeenCalledWith(
				"Error in AuthController.getRegister:",
				renderError
			);
			expect(mockResponse.status).toHaveBeenCalledWith(500);
			expect(mockResponse.render).toHaveBeenCalledWith("error.njk", {
				message: "Could not load registration page. Please try again later.",
			});

			consoleErrorSpy.mockRestore();
		});
	});
});
