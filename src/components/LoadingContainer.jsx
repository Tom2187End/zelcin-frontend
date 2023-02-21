import { Spinner } from "react-bootstrap";
import "./LoadingContainer.css";

const LoadingContainer = () => {
    
    return (
        <div className="loading-container">
          <Spinner animation="border" size="xl" variant="light" style={{width: 60, height: 60}}/>
        </div>
    )
}

export default LoadingContainer;