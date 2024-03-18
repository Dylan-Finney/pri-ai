import React from "react";

export function AgentSleepCoachIcon({ scale }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={scale === 2 ? "15" : "30"}
      height={scale === 2 ? "15" : "30"}
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        width="21.667"
        height="21.667"
        x="1.167"
        y="1.167"
        fill="url(#patternSleepCoachIcon)"
        rx="10.833"
      ></rect>
      <rect
        width="21.667"
        height="21.667"
        x="1.167"
        y="1.167"
        stroke="#fff"
        strokeWidth="1.667"
        rx="10.833"
      ></rect>
      <defs>
        <pattern
          id="patternSleepCoachIcon"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <use transform="scale(.00313)" xlinkHref="#image0_473_12572"></use>
        </pattern>
        <image
          id="image0_473_12572"
          width="320"
          height="320"
          xlinkHref="data:image/jpeg;base64,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"
        ></image>
      </defs>
    </svg>
  );
}
