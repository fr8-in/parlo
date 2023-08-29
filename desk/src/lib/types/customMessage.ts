import { ReactNode } from "react"

export interface ViewFileProps {
    filePath: String, folder: string, fileType: string, extension: string, title: string, visibleModal: boolean
}

export interface CustomMessageContainerProps {
    visible: boolean, title: string, onHide: any, children: ReactNode | string, onOpen: any, button: ReactNode, className?: string, key: number, footer?: ReactNode
}