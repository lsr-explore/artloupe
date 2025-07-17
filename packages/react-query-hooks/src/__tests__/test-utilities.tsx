import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook } from "@testing-library/react";
import React, { ReactNode } from "react";

export const createTestQueryClient = () => {
	return new QueryClient({
		defaultOptions: {
			queries: {
				retry: false,
				gcTime: 0,
			},
			mutations: {
				retry: false,
			},
		},
	});
};

export const createWrapper = (queryClient: QueryClient) => {
	const Wrapper = ({ children }: { children: ReactNode }) => (
		<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
	);

	return Wrapper;
};

export const renderHookWithQueryClient = <T,>(
	hook: () => T,
	queryClient?: QueryClient,
) => {
	const client = queryClient || createTestQueryClient();
	return renderHook(hook, {
		wrapper: createWrapper(client),
	});
};
