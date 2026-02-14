import { clsx } from "clsx"

function Skeleton({
    className,
    ...props
}) {
    return (
        <div
            className={clsx("animate-pulse rounded-md bg-white/10", className)}
            {...props}
        />
    )
}

export { Skeleton }
