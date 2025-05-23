import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiCalendarEventLine,
  RiEyeLine,
  RiFileCopyLine,
  RiPauseLine,
  RiPlayLine,
  RiRepeatLine,
  RiShareLine,
} from "@remixicon/react"

export const Icons = {
  Copy: RiFileCopyLine,
  Check: (props: any) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={16}
      height={17}
      fill="none"
      {...props}
    >
      <path
        fill="currentColor"
        d="m14 5.167-8 8L2.333 9.5l.94-.94L6 11.28l7.06-7.053.94.94Z"
      />
    </svg>
  ),
  Visibility: RiEyeLine,
  Share: RiShareLine,
  PauseOutline: RiPauseLine,
  PlayOutline: RiPlayLine,
  Reply: RiRepeatLine,
  Calendar: RiCalendarEventLine,
  ChevronRight: RiArrowRightSLine,
  ChevronLeft: RiArrowLeftSLine,
}
