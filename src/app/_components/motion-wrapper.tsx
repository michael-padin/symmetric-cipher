"use client"
import {HTMLMotionProps, motion} from "motion/react"

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode
}

export function MotionDiv({children,  ...props}: MotionWrapperProps) {
    return (<motion.div {...props}>{children}</motion.div>)


}