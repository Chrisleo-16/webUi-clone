// import { v4 as uuidv4 } from 'uuid';
import React, { PropsWithChildren, ReactNode } from "react";

interface ITimelineProps {
  verticalSpacing?: number;
  timelineItems: Array<ReactNode>;
}

const Timeline = ({ timelineItems, verticalSpacing = 8 }: ITimelineProps) => {
  return (
    <div className="flex flex-col">
      {timelineItems.map((element, index) => {
        return (
          <WrapperNode
            key={index}
            index={index}
            maxChild={timelineItems.length - 1}
          >
            <div style={{ paddingTop: 4, paddingBottom: verticalSpacing }}>
              {element}
            </div>
          </WrapperNode>
        );
      })}
    </div>
  );
};

const WrapperNode = ({
  index,
  maxChild,
  children,
}: PropsWithChildren<{ index: number; maxChild: number }>) => {
  return (
    <div className="flex flex-row">
      <div className="flex flex-col items-center w-8">
        <div className="rounded-full w-8 h-8 flex items-center justify-center text-center text-[22px] bg-[#FFD300] text-white">
          {index + 1}
        </div>
        {index !== maxChild && (
          <div className="flex-1 w-0.5 bg-[#FFD300]"></div>
        )}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Timeline;
