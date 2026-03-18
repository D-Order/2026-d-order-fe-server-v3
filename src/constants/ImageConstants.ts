// 이미지/아이콘 추가 시 import 후 여기에 등록
import ExitBtn from "@assets/icons/logout.svg";
import StaffCall_activated from "@assets/icons/StaffCall_activated.svg";
import StaffCall_unactivated from "@assets/icons/StaffCall_unactivated.svg";
import StaffServe_activated from "@assets/icons/StaffServe_activated.svg";
import StaffServe_unactivated from "@assets/icons/StaffServe_unactivated.svg";
import TimerActivated from "@assets/icons/timer_activated.svg";
import TimerUnactivated from "@assets/icons/timer_unactivated.svg";
import ResetBtn from "@assets/icons/reset.svg";

import FilterIcon from "@assets/icons/filter_icon.svg";

import sadKokkiri from "@assets/images/sadKokkiri.png";
import nomalKokkiri from "@assets/images/nomalKokkiri.png";
import deleteKey from "@assets/icons/deleteKeyIcon.svg";
import exclamationIcon from "@assets/icons/exclamationIcon.svg";
import checkIcon from "@assets/icons/checkIcon.svg";
export const IMAGE_CONSTANTS = {
  ExitBtn: ExitBtn,
  TabSection: {
    StaffCall_activated: StaffCall_activated,
    StaffCall_unactivated: StaffCall_unactivated,
    StaffServe_activated: StaffServe_activated,
    StaffServe_unactivated: StaffServe_unactivated,
  },
  Timer: {
    Activated: TimerActivated,
    Unactivated: TimerUnactivated,
  },
  ResetBtn: ResetBtn,

  FilterIcon: FilterIcon,

  sadKokkiri: sadKokkiri,
  nomalKokkiri: nomalKokkiri,
  deleteKey: deleteKey,
  exclamationIcon: exclamationIcon,
  checkIcon: checkIcon,
} as const;
