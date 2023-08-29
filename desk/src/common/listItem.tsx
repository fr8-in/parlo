import React, { ReactNode } from "react";

interface Props {
    /** onClick Callback function */
    handleClick?: React.MouseEventHandler<HTMLDivElement>;
    /** ReactNode Icon element  */
    icon?: ReactNode;
    /** Title as string or ReactNode */
    title?: ReactNode | string;
    /** Description text as string or ReactNode */
    secondary?: ReactNode | string;
    /** List extra content as ReactNode */
    extra?: ReactNode;
    /** Custom ReactNode, if any addtional elements needs to handle */
    rn_node?: ReactNode;
    /** Style if required pass as css classes */
    classes?: string;
}

/**
 * Custom List items component
 * @param props refer interface
 * @returns ReactJSX -> ListItem componenet
 */

export const ListItem = (props: Props) => {
    const {
        handleClick,
        icon,
        title,
        secondary,
        extra,
        rn_node,
        classes = "",
    } = props;
    return (
        <div
            className={`flex justify-between items-center px-4 py-[3px] border-b border-b-slate-100  hover:bg-blue-50 cursor-pointer ${classes || 'bg-white'}`}
            onClick={handleClick}
        >
            <div className="flex justify-center items-center space-x-2">
                {icon ? icon : null}
                <div>
                    {title ? (
                        typeof title === "string" ? (
                            <p className="text-slate-700">{title}</p>
                        ) : (
                            title
                        )
                    ) : null}
                    {secondary ? (
                        typeof secondary === "string" ? (
                            <p className="text-slate-500 text-xs">{secondary}</p>
                        ) : (
                            secondary
                        )
                    ) : null}
                    {rn_node || null}
                </div>
            </div>
            {extra}
        </div>
    );
};
