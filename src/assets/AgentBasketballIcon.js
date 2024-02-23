export function AgentBasketballCoachIcon({ scale }) {
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
        fill="url(#patternBasketballCoachIcon)"
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
          id="patternBasketballCoachIcon"
          width="1"
          height="1"
          patternContentUnits="objectBoundingBox"
        >
          <use transform="scale(.00313)" xlinkHref="#image0_473_10496"></use>
        </pattern>
        <image
          id="image0_473_10496"
          width="320"
          height="320"
          xlinkHref="data:image/jpeg;base64,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"
        ></image>
      </defs>
    </svg>
  );
}
