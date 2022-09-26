import React, { ReactNode } from "react";

type ConditionalWrapperProps = {
  condition: boolean;
  wrapper: (child: ReactNode) => ReactNode;
  children: ReactNode;
};

const ConditionalWrapper = ({
  condition,
  wrapper,
  children,
}: ConditionalWrapperProps) => <>{condition ? wrapper(children) : children}</>;

export default ConditionalWrapper;