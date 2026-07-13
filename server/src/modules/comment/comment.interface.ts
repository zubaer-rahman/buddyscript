interface ICreateCommentPayload {
  text: string;
  postId: string;
  imageUrl?: string;
}

export default ICreateCommentPayload;
