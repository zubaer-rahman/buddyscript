export interface ICreatePostPayload {
  text: string;
  isPrivate?: boolean;
  imageUrl?: string;
}

export interface IUpdatePostPayload extends Partial<ICreatePostPayload> {}
