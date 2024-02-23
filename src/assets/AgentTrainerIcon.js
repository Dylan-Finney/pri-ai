import React from "react";

export function AgentTrainerIcon({ scale }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={scale === 2 ? "30" : "24"}
      height={scale === 2 ? "30" : "24"}
      fill="none"
      viewBox="0 0 24 24"
    >
      <rect
        width="21.667"
        height="21.667"
        x="1.167"
        y="1.167"
        fill="url(#pattern1)"
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
          id="pattern1"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <use transform="scale(.00313)" xlinkHref="#image0_473_10504"></use>
        </pattern>
        <image
          id="image0_473_10504"
          width="320"
          height="320"
          xlinkHref="data:image/jpeg;base64,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"
        ></image>
      </defs>
    </svg>
  );
}
