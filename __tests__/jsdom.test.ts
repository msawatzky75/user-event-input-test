import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import { render, waitFor } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import BaseApp from "../src/app.vue";
import { setupServer } from "msw/node";
import { rest } from "msw";
import fetch from "node-fetch";

/**
 * @vitest-environment jsdom
 */

const server = setupServer();

beforeAll(() => server.listen());
afterAll(() => server.close());

(global as any).fetch = fetch;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

describe("app", () => {
	it("fetches when clicking on button", async () => {
		const test = vi.fn();

		server.use(
			rest.get("http://localhost/test", (req, res, ctx) => {
				test();
				return res(ctx.json({ "test-key": "test-value2" }));
			})
		);

		const root = document.createElement("div");
		const { queryByText, getByTestId, debug } = render(BaseApp, {
			container: root,
			attachTo: document.body,
		});
		const user = userEvent.setup();

		await user.click(getByTestId("button"));
		await waitFor(() => expect(test).toHaveBeenCalled());
		await waitFor(() => expect(queryByText("test-value2", { exact: false })).toBeTruthy());
	});

	it("fetches when clicking on checkbox", async () => {
		const test = vi.fn();

		server.use(
			rest.get("http://localhost/test", (req, res, ctx) => {
				test();
				return res(ctx.json({ "test-key": "test-value" }));
			})
		);

		const root = document.createElement("div");
		const { queryByText, getByTestId } = render(BaseApp, {
			container: root,
			attachTo: document.body,
		});
		const user = userEvent.setup();

		await user.click(getByTestId("checkbox"));
		await waitFor(() => expect(test).toHaveBeenCalled());
		await waitFor(() => expect(queryByText("test-value", { exact: false })).toBeTruthy());
	});

	it("fetches when typing in input", async () => {
		const test = vi.fn();

		server.use(
			rest.get("http://localhost/test", (req, res, ctx) => {
				test();
				return res(ctx.json({ "test-key": "test-value4" }));
			})
		);

		const root = document.createElement("div");
		const { queryByText, getByTestId } = render(BaseApp, {
			container: root,
			attachTo: document.body,
		});
		const user = userEvent.setup();

		await user.type(getByTestId("text-input"), "t");
		await waitFor(() => expect(test).toHaveBeenCalled());
		await waitFor(() => expect(queryByText("test-value4", { exact: false })).toBeTruthy());
	});

	it("fetches when clicking on div", async () => {
		const test = vi.fn();

		server.use(
			rest.get("http://localhost/test", (req, res, ctx) => {
				test();
				return res(ctx.json({ "test-key": "test-value3" }));
			})
		);

		const root = document.createElement("div");
		const { queryByText, getByTestId } = render(BaseApp, {
			container: root,
			attachTo: document.body,
		});
		const user = userEvent.setup();

		await wait(1000);
		await user.click(getByTestId("div-button"));
		await waitFor(() => expect(test).toHaveBeenCalled());
		await waitFor(() => expect(queryByText("test-value3", { exact: false })).toBeTruthy());
	});
});
