import { jsonError, jsonOk } from '@/lib/api-response';
import {
  DogMeasurementValidationError,
  createCurrentMemberDogMeasurement,
  deleteCurrentMemberDogMeasurement,
  getCurrentMemberDogMeasurementsDocument,
} from '@/lib/dog-measurements.server';
import { SessionUnavailableError } from '@/lib/session.server';

export const dynamic = 'force-dynamic';

interface DogMeasurementsRouteContext {
  params: Promise<{
    dogId: string;
  }>;
}

function mapError(error: unknown) {
  if (error instanceof SessionUnavailableError) {
    return jsonError('SESSION_NOT_AVAILABLE', error.message, { status: 401 });
  }

  if (error instanceof DogMeasurementValidationError) {
    return jsonError(error.code, error.message, { status: 422 });
  }

  if (error instanceof Error) {
    if (error.message === 'DOG_NOT_FOUND') {
      return jsonError('DOG_NOT_FOUND', 'Dog profile was not found for the current member.', { status: 404 });
    }

    if (error.message === 'MEASUREMENT_REQUIRED') {
      return jsonError('MEASUREMENT_REQUIRED', 'Add at least one measurement before saving the record.', { status: 422 });
    }

    if (error.message === 'MEASURED_AT_IN_FUTURE') {
      return jsonError('MEASURED_AT_IN_FUTURE', 'Measurement date cannot be in the future.', { status: 422 });
    }

    if (error.message === 'INVALID_MEASUREMENT_VALUE') {
      return jsonError('INVALID_MEASUREMENT_VALUE', 'Measurement values must be positive numbers within a realistic range.', { status: 422 });
    }

    if (error.message === 'MEASUREMENT_RECORD_NOT_FOUND') {
      return jsonError('MEASUREMENT_RECORD_NOT_FOUND', 'Measurement record was not found for this dog.', { status: 404 });
    }
  }

  return jsonError('DOG_MEASUREMENTS_FAILED', error instanceof Error ? error.message : 'Unable to process dog measurements.', { status: 500 });
}

export async function GET(_request: Request, context: DogMeasurementsRouteContext) {
  try {
    const { dogId } = await context.params;
    const document = await getCurrentMemberDogMeasurementsDocument(dogId, { allowDevFallback: false });
    return jsonOk(document);
  } catch (error) {
    return mapError(error);
  }
}

export async function POST(request: Request, context: DogMeasurementsRouteContext) {
  try {
    const { dogId } = await context.params;
    const body = await request.json();
    const document = await createCurrentMemberDogMeasurement(dogId, body, { allowDevFallback: false });
    return jsonOk(document, { status: 201 });
  } catch (error) {
    return mapError(error);
  }
}

export async function DELETE(request: Request, context: DogMeasurementsRouteContext) {
  try {
    const { dogId } = await context.params;
    const body = await request.json();
    const document = await deleteCurrentMemberDogMeasurement(dogId, body, { allowDevFallback: false });
    return jsonOk(document);
  } catch (error) {
    return mapError(error);
  }
}
