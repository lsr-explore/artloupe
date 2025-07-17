import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@artloupe/logger';
import type { ClientLogPayload } from '@artloupe/logger';

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body: ClientLogPayload = await request.json();
		const { level, message, context, timestamp } = body;

		// Validate the log payload
		if (!level || !message) {
			return NextResponse.json(
				{ 
					success: false, 
					message: 'Missing required fields: level and message' 
				}, 
				{ status: 400 }
			);
		}

		// Create a logger with client context
		const clientLogger = logger.withContext({
			source: 'client',
			userAgent: request.headers.get('user-agent') || 'unknown',
			ip: request.headers.get('x-forwarded-for') || 
				request.headers.get('x-real-ip') || 
				'unknown',
			...context,
		});

		// Log the message with the appropriate level
		clientLogger.logWithContext(level, message, {
			timestamp: timestamp || new Date().toISOString(),
		});

		return NextResponse.json({
			success: true,
			message: 'Log entry created successfully',
			timestamp: new Date().toISOString(),
		});
	} catch (error) {
		logger.error({
			error: error instanceof Error ? error.message : String(error),
			endpoint: '/api/log',
		}, 'Failed to process client log');

		return NextResponse.json(
			{ 
				success: false, 
				message: 'Internal server error' 
			}, 
			{ status: 500 }
		);
	}
}

// Optional: Add GET method to check if logging endpoint is available
export async function GET(): Promise<NextResponse> {
	return NextResponse.json({
		success: true,
		message: 'Logging endpoint is available',
		timestamp: new Date().toISOString(),
	});
} 