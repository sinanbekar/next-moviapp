import React from "react";
import { Waypoint } from "react-waypoint";

type Props = {
  loadMore: () => void;
  threshold?: string;
  hasMore: boolean;
  loader: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

const InfiniteScroll = ({
  loadMore,
  threshold,
  hasMore,
  loader,
  children,
  className,
}: Props) => (
  <>
    <div className={className}>{children}</div>
    {hasMore && (
      <Waypoint onEnter={loadMore} bottomOffset={threshold}>
        {loader}
      </Waypoint>
    )}
  </>
);

export default React.memo(InfiniteScroll);
