import c from "classnames";
import { View } from "../Themed";

export function Show({
  when,
  fallback = null,
  children,
  vitrual,
  full,
}: {
  when: boolean | undefined | null;
  fallback?: React.ReactNode;
  children: React.ReactNode;
  vitrual?: boolean;
  full?: boolean;
}) {
  return vitrual ? (
    <>
      <View
        className={c(
          full ? "h-full w-full" : `w-fit h-fit`,
          !when
            ? full
              ? "opacity-0 z-[-100] absolute left-[-10000px]"
              : "hidden"
            : "show"
        )}
      >
        {children}
      </View>
      {fallback && (
        <View
          style={{ display: when ? "none" : "flex" }}
          className="w-fit h-fit"
        >
          {fallback}
        </View>
      )}
    </>
  ) : when ? (
    children
  ) : (
    fallback
  );
}
