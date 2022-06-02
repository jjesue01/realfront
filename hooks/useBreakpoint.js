import {useEffect, useState} from 'react'

export default function useBreakpoint(breakpoint) {
    const [inBreakpoint, setInBreakpoint] = useState(false)

    function checkBreakpoints() {
        const currentBreakpoint = window.innerWidth <= breakpoint
        if (window.matchMedia(`(max-width: ${breakpoint}px)`).matches) {
             currentBreakpoint !== inBreakpoint  && setInBreakpoint(true)
        } else {
            !currentBreakpoint !== inBreakpoint && setInBreakpoint(false)
        }
    }

    useEffect(function initMobile() {
        checkBreakpoints();
        window.addEventListener('resize', checkBreakpoints)
        return () => {
            window.removeEventListener('resize', checkBreakpoints)
        }
    }, [])

    return inBreakpoint
}