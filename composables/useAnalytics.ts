import posthog from "posthog-js";

export default function useAnalytics() {
    function captureEvent (event, data) {
        posthog.capture(event, data)
    }
    return {
        captureEvent
    }
}