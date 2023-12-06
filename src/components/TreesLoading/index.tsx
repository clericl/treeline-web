import classnames from 'classnames'
import { CircularProgress } from "@mui/material"
import { createPortal } from "react-dom"

type TreesLoadingProps = {
  open: boolean
}

type TreesLoadingModalProps = {
  open: boolean
}

function TreesLoadingModal({ open }: TreesLoadingModalProps) {
  return (
    <div className={
      classnames(
        'absolute top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center transition-opacity duration-700 ease-in-out z-50',
        {
          'opacity-1': open,
          'opacity-0': !open,
          'pointer-events-none': !open,
        }
      )
    }>
      <div className="flex flex-col items-center space-y-2">
        <CircularProgress sx={{ color: 'white' }} />
      </div>
    </div>
  )
}

export default function TreesLoading({ open }: TreesLoadingProps) {
  const bodyElement = typeof window !== 'undefined' ? window.document.body : null

  return (bodyElement && createPortal(
    <TreesLoadingModal open={open} />,
    bodyElement
  ))
}
