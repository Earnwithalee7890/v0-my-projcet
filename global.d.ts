import type React from "react"
// TypeScript declarations for AppKit web components
import "react"

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "appkit-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      "appkit-network-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
      "appkit-account-button": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>
    }
  }
}
