import { useCallback, useContext, useEffect, useRef } from "react";

import { BUTTON_COLOR } from "../constants";
import DatepickerContext from "../contexts/DatepickerContext";
import { ButtonProps } from "../types";

const RoundedButton = (props: ButtonProps) => {
    const {
        children,
        onClick,
        onScrollUp,
        onScrollDown,
        disabled,
        roundedFull = false,
        padding = "py-[0.55rem]",
        active = false
    } = props;

    // Contexts
    const { primaryColor } = useContext(DatepickerContext);

    // Functions
    const getClassName = useCallback(() => {
        const darkClass = "dark:text-white/70 dark:hover:bg-white/10 dark:focus:bg-white/10";
        const activeClass = active ? "font-semibold bg-gray-50 dark:bg-white/5" : "";
        const defaultClass = !roundedFull
            ? `w-full tracking-wide ${darkClass} ${activeClass} transition-all duration-300 px-3 ${padding} uppercase hover:bg-gray-100 rounded-md focus:ring-1`
            : `${darkClass} ${activeClass} transition-all duration-300 hover:bg-gray-100 rounded-full p-[0.45rem] focus:ring-1`;
        const buttonFocusColor =
            BUTTON_COLOR.focus[primaryColor as keyof typeof BUTTON_COLOR.focus];
        const disabledClass = disabled ? "line-through" : "";

        return `${defaultClass} ${buttonFocusColor} ${disabledClass}`;
    }, [disabled, padding, primaryColor, roundedFull, active]);

    const btn = useRef<HTMLButtonElement>(null);
    useEffect(() => {
        if (!btn.current || (!onScrollUp && !onScrollDown)) {
            return;
        }
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (e.deltaY > 0) {
                onScrollDown?.();
            } else {
                onScrollUp?.();
            }
        };

        btn.current.addEventListener("wheel", handleWheel, { passive: false });

        return () => {
            btn.current?.removeEventListener("wheel", handleWheel);
        };
    }, [btn, onScrollUp, onScrollDown]);

    return (
        <button
            type="button"
            className={getClassName()}
            onClick={onClick}
            ref={btn}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default RoundedButton;
