import type { Dog } from './dog.types';
import type { ExecuteDogProfileActionResult, UpsertDogProfileInput } from './dog-action.types';

export interface DogsCollectionDocument {
  dogs: Dog[];
}

export interface DogProfileDocument {
  dogId: string;
  profile: UpsertDogProfileInput;
}

export interface DogMutationDocument {
  result: ExecuteDogProfileActionResult;
}
