import { Coffee, LoaderCircle, PanelLeftOpen, Sun, Moon } from "lucide-react";

type IconProps = React.HTMLAttributes<SVGElement>;

export const Icons = {
  logo: (props: IconProps) => <Coffee {...props} />,
  spinner: (props: IconProps) => <LoaderCircle {...props} />,
  toggleMenu: (props: IconProps) => <PanelLeftOpen {...props} />,
  sun: (props: IconProps) => <Sun {...props} />,
  moon: (props: IconProps) => <Moon {...props} />,
};
