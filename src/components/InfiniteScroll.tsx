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
  <div className={className}>
    {children}
    {hasMore && (
      <Waypoint onEnter={loadMore} bottomOffset={threshold}>
        {loader}
      </Waypoint>
    )}
  </div>
);

export default React.memo(InfiniteScroll);
