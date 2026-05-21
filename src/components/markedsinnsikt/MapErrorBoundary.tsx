"use client"

import { Component, type ReactNode } from "react"

// Component-level error boundary for the in-page (tab-05) map. A render error
// degrades only the map cell — the rest of /markedsinnsikt stays intact. The
// /kart route uses Next's built-in error.tsx instead (whole-page scope).
//
// Note: React error boundaries catch render-phase errors only. Tile and WMS
// failures are async and do not throw here — the map components handle those
// with Leaflet `tileerror` + local state.

interface Props {
  children: ReactNode
  message?: string
}

interface State {
  hasError: boolean
}

export class MapErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: unknown) {
    console.error("Markedskart feilet:", error)
  }

  reset = () => this.setState({ hasError: false })

  render() {
    if (this.state.hasError) {
      return (
        <div className="mi-map-fallback">
          <p>
            {this.props.message ??
              "Kartet kunne ikke lastes akkurat nå. Nøkkeltallene finner du i panelet ved siden av."}
          </p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={this.reset}
          >
            Prøv igjen
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
