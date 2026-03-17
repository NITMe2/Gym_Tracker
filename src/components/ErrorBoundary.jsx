import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <span className="font-heading text-4xl text-accent mb-4">IronLog</span>
          <p className="text-white text-lg mb-2">Something went wrong.</p>
          <p className="text-muted text-sm mb-6">Your data is safe — try restarting the app.</p>
          <button
            onClick={() => {
              this.setState({ hasError: false })
              window.location.replace('#/')
              window.location.reload()
            }}
            className="px-6 py-3 bg-accent text-bg font-heading text-lg rounded-lg"
          >
            Restart App
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
