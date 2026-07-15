import { getUserAvatar } from "@utils/avatar";
import { Like } from "@shared/types";

interface ReactionHeadsProps {
  likes: Like[];
  likesCount: number;
  likers?: string;
}

/**
 * Renders up to 5 real user avatar "heads" (most recent likers),
 * followed by a count badge that is always visible (even when count is 0).
 *
 * Class pattern matches reference HTML exactly:
 *   img[0] → _react_img1
 *   img[1] → _react_img
 *   img[2+] → _react_img _rect_img_mbl_none
 *   <p>   → _feed_inner_timeline_total_reacts_para  (always rendered)
 */
export function ReactionHeads({ likes, likesCount, likers }: ReactionHeadsProps) {
  const MAX_HEADS = 5;

  const likeUsers = (likes ?? [])
    .filter((l) => l.user)
    .map((l) => l.user!);

  const visible = likeUsers.slice(0, MAX_HEADS);
  const badgeLabel = likesCount > MAX_HEADS ? `${likesCount}+` : String(likesCount);

  const imgClass = (i: number) => {
    if (i === 0) return "_react_img1";
    if (i === 1) return "_react_img";
    return "_react_img _rect_img_mbl_none";
  };

  return (
    <div className="_feed_inner_timeline_total_reacts_image">
      {visible.map((u, i) => (
        <img
          key={u.id}
          src={getUserAvatar(u)}
          alt={`${u.firstName} ${u.lastName}`}
          title={`${u.firstName} ${u.lastName}`}
          className={imgClass(i)}
        />
      ))}
      <p
        className="_feed_inner_timeline_total_reacts_para"
        title={likers || undefined}
      >
        {badgeLabel}
      </p>
    </div>
  );
}
