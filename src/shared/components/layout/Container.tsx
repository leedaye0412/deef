type Props = React.HTMLAttributes<HTMLDivElement>;

export default function Container({ className = "", ...props }: Props) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-screen-2xl",
        "px-layout-x-mobile md:px-layout-x-desktop py-layout-y-mobile md:py-layout-y-desktop",
        className,
      ].join(" ")}
      {...props}
    />
  );
}
