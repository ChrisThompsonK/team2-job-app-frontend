/**
 * Tests for UserController authentication improvements
 */

import type { Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";
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
			body: {},
			// biome-ignore lint/suspicious/noExplicitAny: Mock object for testing
			session: mockSession as any,
		};

		mockResponse = {
			render: vi.fn(),
			redirect: vi.fn(),
			clearCookie: vi.fn(),
		};
	});

	describe("postLogin", () => {
		it("should reject empty username", async () => {
			mockRequest.body = { username: "" };

			await controller.postLogin(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockResponse.render).toHaveBeenCalledWith("login.njk", {
				error: "Please provide a valid username.",
				formData: { username: "" },
			});
		});

		it("should reject non-string username", async () => {
			mockRequest.body = { username: 123 };

			await controller.postLogin(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockResponse.render).toHaveBeenCalledWith("login.njk", {
				error: "Please provide a valid username.",
				formData: { username: "" },
			});
		});

		it("should reject whitespace-only username", async () => {
			mockRequest.body = { username: "   " };

			await controller.postLogin(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockResponse.render).toHaveBeenCalledWith("login.njk", {
				error: "Please provide a valid username.",
				formData: { username: "" },
			});
		});

		it("should accept valid username and create session", async () => {
			mockRequest.body = { username: "testuser" };

			await controller.postLogin(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockSession["user"]).toEqual({
				username: "testuser",
				user_type: "Admin",
				email: "testuser@kainos.com",
			});
			expect(mockSession["isAuthenticated"]).toBe(true);
			expect(mockSession["loginTime"]).toBeInstanceOf(Date);
			expect(mockResponse.redirect).toHaveBeenCalledWith("/");
		});

		it("should trim whitespace from username", async () => {
			mockRequest.body = { username: "  testuser  " };

			await controller.postLogin(
				mockRequest as Request,
				mockResponse as Response
			);

			expect(mockSession["user"]).toEqual({
				username: "testuser",
				user_type: "Admin",
				email: "testuser@kainos.com",
			});
		});
	});

	describe("getLoginPage", () => {
		it("should redirect authenticated users to home", () => {
			mockSession["isAuthenticated"] = true;

			controller.getLoginPage(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.redirect).toHaveBeenCalledWith("/");
		});

		it("should render login page for unauthenticated users", () => {
			mockSession["isAuthenticated"] = false;

			controller.getLoginPage(mockRequest as Request, mockResponse as Response);

			expect(mockResponse.render).toHaveBeenCalledWith("login.njk");
		});
	});
});
