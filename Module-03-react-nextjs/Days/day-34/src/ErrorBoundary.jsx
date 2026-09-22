import { Component } from "react";

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);

        this.state = {
            hasError: false
        };
    }

    static getDerivedStateFromError() {
        return {
            hasError: true
        };
    }

    componentDidCatch(error, info) {
        console.error(
            "Error Boundary caught an error:",
            error,
            info
        );
    }

    handleRetry = () => {
        this.setState({
            hasError: false
        });
    };

    render() {
        if (this.state.hasError) {
            return (
                <section className="error">
                    {this.props.fallback}

                    <button
                        type="button"
                        onClick={this.handleRetry}
                    >
                        Try Again
                    </button>
                </section>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;