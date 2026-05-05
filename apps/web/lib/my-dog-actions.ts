import type {
  ExecuteDogProfileActionInput,
  ExecuteDogProfileActionResult,
} from '@cane-corso-platform/contracts';
import { persistDogProfileAction } from './my-dog-persistence';

export async function executeDogProfileAction(
  input: ExecuteDogProfileActionInput,
): Promise<ExecuteDogProfileActionResult> {
  await new Promise((resolve) => {
    window.setTimeout(resolve, 180);
  });

  return persistDogProfileAction(input);
}
