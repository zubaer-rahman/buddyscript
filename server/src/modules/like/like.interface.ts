interface IToggleLikePayload {
  entityType: "post" | "comment" | "reply";
  entityId: string;
}

export default IToggleLikePayload;