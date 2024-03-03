import * as React from "react";
const UploadIcon = ({ active = false, sidebar = true }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={16} fill="none">
    <path
      fill={sidebar ? (active ? "#cecece" : "#546074") : "#00847a"}
      d="M16.42 4.22A7 7 0 0 0 3.06 6.11 4 4 0 0 0 4 14a1 1 0 0 0 0-2 2 2 0 1 1 0-4 1 1 0 0 0 1-1 5 5 0 0 1 9.73-1.61 1 1 0 0 0 .78.67 3 3 0 0 1 .24 5.84 1.002 1.002 0 0 0 .5 1.94 5 5 0 0 0 .17-9.62Zm-5.71 2.07a1 1 0 0 0-.33-.21 1 1 0 0 0-.76 0 1 1 0 0 0-.33.21l-3 3a1.004 1.004 0 1 0 1.42 1.42L9 9.41V15a1 1 0 1 0 2 0V9.41l1.29 1.3a1.002 1.002 0 0 0 1.64-.326 1 1 0 0 0-.22-1.094l-3-3Z"
    />
  </svg>
);
export default UploadIcon;
