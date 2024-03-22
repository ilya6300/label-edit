import React, { useEffect, useRef } from 'react'

export const PreviewLabel = (previewObj) => {
    const refPreview = useRef(null)
    useEffect(() => {
        console.log(previewObj)
        // refPreview.current.append(previewObj)
        refPreview.current.innerHTML = previewObj

    }, [])
  return (
    <div ref={refPreview} className='preview_label_container'></div>
  )
}
